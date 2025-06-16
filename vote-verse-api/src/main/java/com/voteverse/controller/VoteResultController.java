package com.voteverse.controller;

import com.voteverse.model.primary.Candidate;
import com.voteverse.repository.primary.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
public class VoteResultController {

    @Autowired
    private CandidateRepository candidateRepository;

    @GetMapping("/position/{positionId}")
    public ResponseEntity<List<Candidate>> getResultsByPosition(@PathVariable Long positionId) {
        List<Candidate> results = candidateRepository.findByPositionIdAndIsApprovedTrueAndIsActiveTrueOrderByVoteCountDesc(positionId);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/position/{positionId}/all")
    public ResponseEntity<List<Candidate>> getAllResultsByPosition(@PathVariable Long positionId) {
        List<Candidate> results = candidateRepository.findByPositionIdOrderByVoteCountDesc(positionId);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<Candidate> getCandidateResults(@PathVariable Long candidateId) {
        return candidateRepository.findById(candidateId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
} 