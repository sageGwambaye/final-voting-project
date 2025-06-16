package com.voteverse.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Service
public class VoiceSampleService {

    @Value("${voice.samples.base-path}")
    private String basePath;

    @Value("${voice.samples.format}")
    private String fileFormat;

    @Value("${voice.samples.max-size}")
    private long maxFileSize;

    public String storeVoiceSample(String userId, MultipartFile file) throws IOException {
        // Validate file
        if (file.isEmpty() || file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("Invalid file size");
        }

        if (!file.getContentType().equals("audio/wav")) {
            throw new IllegalArgumentException("Only WAV files are supported");
        }

        // Create user directory if it doesn't exist
        Path userDir = Paths.get(basePath, hashUserId(userId));
        Files.createDirectories(userDir);

        // Generate unique filename
        String filename = UUID.randomUUID().toString() + "." + fileFormat;
        Path filePath = userDir.resolve(filename);

        // Store the file
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filePath.toString();
    }

    public Path getVoiceSamplePath(String userId) {
        Path userDir = Paths.get(basePath, hashUserId(userId));
        if (!Files.exists(userDir)) {
            return null;
        }

        // Get the most recent voice sample
        try {
            return Files.list(userDir)
                    .filter(path -> path.toString().endsWith("." + fileFormat))
                    .max(Path::compareTo)
                    .orElse(null);
        } catch (IOException e) {
            return null;
        }
    }

    public void deleteVoiceSample(String userId) throws IOException {
        Path userDir = Paths.get(basePath, hashUserId(userId));
        if (Files.exists(userDir)) {
            Files.walk(userDir)
                    .sorted(Path::compareTo)
                    .forEach(path -> {
                        try {
                            Files.delete(path);
                        } catch (IOException e) {
                            // Log error but continue
                        }
                    });
        }
    }

    private String hashUserId(String userId) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(userId.getBytes());
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing user ID", e);
        }
    }

    public boolean hasVoiceSample(String userId) {
        Path userDir = Paths.get(basePath, hashUserId(userId));
        return Files.exists(userDir) && !Files.isDirectory(userDir);
    }
} 