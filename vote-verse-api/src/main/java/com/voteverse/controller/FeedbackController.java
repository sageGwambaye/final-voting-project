package com.voteverse.controller;

import com.voteverse.model.primary.Feedback;
import com.voteverse.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {
    
    @Autowired
    private FeedbackService feedbackService;
    
    @PostMapping
    public ResponseEntity<Feedback> submitFeedback(@RequestBody Feedback feedback) {
        return ResponseEntity.ok(feedbackService.submitFeedback(feedback));
    }
    
    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.getAllFeedback());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getFeedbackById(@PathVariable Long id) {
        return feedbackService.getFeedbackById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/voter/{regNo}")
    public ResponseEntity<List<Feedback>> getFeedbackByVoter(@PathVariable String regNo) {
        return ResponseEntity.ok(feedbackService.getFeedbackByVoter(regNo));
    }
    
    @GetMapping("/rating/{rating}")
    public ResponseEntity<List<Feedback>> getFeedbackByRating(@PathVariable Integer rating) {
        return ResponseEntity.ok(feedbackService.getFeedbackByRating(rating));
    }
    
    @GetMapping("/anonymous")
    public ResponseEntity<List<Feedback>> getAnonymousFeedback() {
        return ResponseEntity.ok(feedbackService.getAnonymousFeedback());
    }
    
    @GetMapping("/non-anonymous")
    public ResponseEntity<List<Feedback>> getNonAnonymousFeedback() {
        return ResponseEntity.ok(feedbackService.getNonAnonymousFeedback());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long id) {
        try {
            feedbackService.deleteFeedback(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 