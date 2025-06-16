package com.voteverse.controller;

import com.voteverse.service.VoiceSampleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/voice-samples")
@CrossOrigin(origins = "*")
public class VoiceSampleController {

    @Autowired
    private VoiceSampleService voiceSampleService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadVoiceSample(@RequestParam("audio") MultipartFile file) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = auth.getName();

            String filePath = voiceSampleService.storeVoiceSample(userId, file);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Voice sample uploaded successfully");
            response.put("path", filePath);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error uploading voice sample: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> checkVoiceSampleStatus() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = auth.getName();

            boolean hasSample = voiceSampleService.hasVoiceSample(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("hasVoiceSample", hasSample);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error checking voice sample status: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteVoiceSample() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = auth.getName();

            voiceSampleService.deleteVoiceSample(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Voice sample deleted successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error deleting voice sample: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 