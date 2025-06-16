package com.voteverse.controller;

import com.voteverse.model.primary.Vote;
import com.voteverse.service.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/votes")
public class VoteController {

    @Autowired
    private VoteService voteService;

    @PostMapping
    public ResponseEntity<Vote> castVote(@RequestBody Vote vote) {
        return ResponseEntity.ok(voteService.castVote(vote));
    }

    @GetMapping("/position/{positionId}/results")
    public ResponseEntity<Map<String, Object>> getVoteResults(@PathVariable Long positionId) {
        return ResponseEntity.ok(voteService.getVoteResults(positionId));
    }

    @GetMapping("/voter/{regNo}")
    public ResponseEntity<List<Vote>> getVoterHistory(@PathVariable String regNo) {
        return ResponseEntity.ok(voteService.getVoterHistory(regNo));
    }

    @GetMapping("/verify/{voteHash}")
    public ResponseEntity<Vote> verifyVote(@PathVariable String voteHash) {
        return voteService.findByVoteHash(voteHash)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
} 