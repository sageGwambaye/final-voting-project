package com.voteverse.controller;

import com.voteverse.model.primary.Candidate;
import com.voteverse.service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
@CrossOrigin(origins = "*")
public class CandidateController {
    
    @Autowired
    private CandidateService candidateService;
    
    @PostMapping
    public ResponseEntity<?> registerCandidate(@RequestBody Candidate candidate) {
        try {
            Candidate savedCandidate = candidateService.registerCandidate(candidate);
            return ResponseEntity.ok(savedCandidate);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Candidate>> getAllCandidates() {
        return ResponseEntity.ok(candidateService.getAllCandidates());
    }
    
    @GetMapping("/approved")
    public ResponseEntity<List<Candidate>> getApprovedCandidates() {
        return ResponseEntity.ok(candidateService.getApprovedCandidates());
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<Candidate>> getActiveCandidates() {
        return ResponseEntity.ok(candidateService.getActiveCandidates());
    }
    
    @GetMapping("/position/{positionId}")
    public ResponseEntity<List<Candidate>> getCandidatesByPosition(@PathVariable Long positionId) {
        return ResponseEntity.ok(candidateService.getCandidatesByPosition(positionId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getCandidateById(@PathVariable Long id) {
        return candidateService.getCandidateById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveCandidate(@PathVariable Long id) {
        try {
            Candidate approvedCandidate = candidateService.approveCandidate(id);
            return ResponseEntity.ok(approvedCandidate);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateCandidateStatus(
            @PathVariable Long id,
            @RequestParam boolean isActive) {
        try {
            Candidate updatedCandidate = candidateService.updateCandidateStatus(id, isActive);
            return ResponseEntity.ok(updatedCandidate);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 