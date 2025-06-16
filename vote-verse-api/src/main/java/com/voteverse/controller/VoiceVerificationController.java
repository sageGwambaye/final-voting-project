package com.voteverse.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import com.voteverse.service.VoterService;
import com.voteverse.model.secondary.Voter;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class VoiceVerificationController {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private VoterService voterService;

    private static final int MAX_ATTEMPTS = 3;
    private static final int ATTEMPT_WINDOW_HOURS = 24;

    @PostMapping(value = "/verify-voice", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> verifyVoice(@RequestParam("audio") MultipartFile audioFile) {
        try {
            // Get current user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = auth.getName();

            // Get voter details
            Optional<Voter> voterOpt = voterService.getVoterByRegNo(userId);
            if (voterOpt.isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Voter not found");
                return ResponseEntity.notFound().build();
            }

            Voter voter = voterOpt.get();
            if (voter.getVoiceSampleUrl() == null || voter.getVoiceSampleUrl().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "No voice sample found for this voter");
                return ResponseEntity.badRequest().body(error);
            }

            // Check rate limiting
            String rateLimitKey = "voice_verify:" + userId;
            ValueOperations<String, String> ops = redisTemplate.opsForValue();
            
            String attempts = ops.get(rateLimitKey);
            int currentAttempts = attempts != null ? Integer.parseInt(attempts) : 0;

            if (currentAttempts >= MAX_ATTEMPTS) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Maximum verification attempts reached. Please try again later.");
                return ResponseEntity.tooManyRequests().body(error);
            }

            // Validate file
            if (audioFile.isEmpty() || audioFile.getSize() > 10 * 1024 * 1024) { // 10MB limit
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Invalid audio file");
                return ResponseEntity.badRequest().body(error);
            }

            // Create a temporary file to store the audio
            String tempDir = System.getProperty("java.io.tmpdir");
            String fileName = UUID.randomUUID().toString() + ".wav";
            Path tempFile = Path.of(tempDir, fileName);
            
            // Save the uploaded file
            Files.copy(audioFile.getInputStream(), tempFile, StandardCopyOption.REPLACE_EXISTING);

            // Verify voice against stored sample
            boolean isVerified = verifyVoiceWithModel(tempFile.toString(), voter.getVoiceSampleUrl());

            // Clean up the temporary file
            Files.deleteIfExists(tempFile);

            // Update attempt count
            if (!isVerified) {
                ops.increment(rateLimitKey);
                if (currentAttempts == 0) {
                    redisTemplate.expire(rateLimitKey, ATTEMPT_WINDOW_HOURS, TimeUnit.HOURS);
                }
            } else {
                redisTemplate.delete(rateLimitKey);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", isVerified);
            response.put("message", isVerified ? "Voice verification successful" : "Voice verification failed");
            response.put("attemptsRemaining", MAX_ATTEMPTS - (currentAttempts + 1));

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error processing voice verification: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    private boolean verifyVoiceWithModel(String audioFilePath, String storedSampleUrl) {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder(
                "python",
                "voice_model/predict.py",
                audioFilePath,
                storedSampleUrl
            );
            
            Process process = processBuilder.start();
            int exitCode = process.waitFor();
            
            return exitCode == 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}