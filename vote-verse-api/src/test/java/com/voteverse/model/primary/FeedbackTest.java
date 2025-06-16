package com.voteverse.model.primary;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

class FeedbackTest {
    
    @Test
    void testFeedbackCreation() {
        // Create test data
        VoterRef voter = new VoterRef();
        voter.setRegNo("123456");
        voter.setName("John Doe");
        voter.setCollege("Science");
        voter.setProgramme("Computer Science");
        voter.setYearOfStudy(2);
        voter.setEmail("john@example.com");
        voter.setDormBlock("Block A");
        
        // Create and test feedback
        Feedback feedback = new Feedback();
        feedback.setId(1L);
        feedback.setVoter(voter);
        feedback.setComment("Great voting experience!");
        feedback.setRating(5);
        feedback.setAnonymous(false);
        
        // Test getters
        assertEquals(1L, feedback.getId());
        assertEquals("123456", feedback.getVoter().getRegNo());
        assertEquals("Great voting experience!", feedback.getComment());
        assertEquals(5, feedback.getRating());
        assertFalse(feedback.isAnonymous());
        assertNotNull(feedback.getSubmissionDate());
        
        // Test timestamp is set
        LocalDateTime now = LocalDateTime.now();
        assertTrue(feedback.getSubmissionDate().isBefore(now.plusSeconds(1)));
        assertTrue(feedback.getSubmissionDate().isAfter(now.minusSeconds(1)));
    }

    @Test
    void testFeedbackRating() {
        Feedback feedback = new Feedback();
        
        // Test valid rating
        feedback.setRating(1);
        assertEquals(1, feedback.getRating());
        
        feedback.setRating(5);
        assertEquals(5, feedback.getRating());
    }

    @Test
    void testAnonymousFeedback() {
        Feedback feedback = new Feedback();
        
        // Test anonymous setting
        feedback.setAnonymous(true);
        assertTrue(feedback.isAnonymous());
        
        feedback.setAnonymous(false);
        assertFalse(feedback.isAnonymous());
    }
} 