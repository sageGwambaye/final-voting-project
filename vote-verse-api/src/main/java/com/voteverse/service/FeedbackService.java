package com.voteverse.service;

import com.voteverse.model.primary.Feedback;
import com.voteverse.repository.primary.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    public Feedback submitFeedback(Feedback feedback) {
        feedback.setSubmissionDate(LocalDateTime.now());
        return feedbackRepository.save(feedback);
    }
    
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }
    
    public Optional<Feedback> getFeedbackById(Long id) {
        return feedbackRepository.findById(id);
    }
    
    public List<Feedback> getFeedbackByVoter(String regNo) {
        return feedbackRepository.findByVoterRegNo(regNo);
    }
    
    public List<Feedback> getFeedbackByRating(Integer rating) {
        return feedbackRepository.findByRating(rating);
    }
    
    public List<Feedback> getAnonymousFeedback() {
        return feedbackRepository.findByIsAnonymousTrue();
    }
    
    public List<Feedback> getNonAnonymousFeedback() {
        return feedbackRepository.findByIsAnonymousFalse();
    }
    
    public void deleteFeedback(Long id) throws Exception {
        if (!feedbackRepository.existsById(id)) {
            throw new Exception("Feedback not found");
        }
        feedbackRepository.deleteById(id);
    }
} 