package com.voteverse.model.primary;

import com.voteverse.model.secondary.Voter;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import java.time.LocalDateTime;

class CandidateTest {

    @Test
    void testCandidateCreation() {
        // Create test data
        VoterRef voter = new VoterRef();
        voter.setRegNo("123456");
        voter.setName("John Doe");
        voter.setCollege("Science");
        voter.setProgramme("Computer Science");
        voter.setYearOfStudy(2);
        voter.setEmail("john@example.com");
        voter.setDormBlock("Block A");
        
        Position position = new Position();
        position.setId(1L);
        position.setName("President");
        position.setDescription("University President");
        position.setLevel(Position.PositionLevel.UNIVERSITY);
        
        // Create and test candidate
        Candidate candidate = new Candidate();
        candidate.setId(1L);
        candidate.setVoter(voter);
        candidate.setPosition(position);
        candidate.setManifesto("My manifesto");
        candidate.setCampaignVideoUrl("https://example.com/video");
        
        // Test getters
        assertEquals(1L, candidate.getId());
        assertEquals("123456", candidate.getVoter().getRegNo());
        assertEquals(1L, candidate.getPosition().getId());
        assertEquals("My manifesto", candidate.getManifesto());
        assertEquals("https://example.com/video", candidate.getCampaignVideoUrl());
        assertFalse(candidate.isApproved());
        assertTrue(candidate.isActive());
        assertNotNull(candidate.getRegistrationDate());
        assertNull(candidate.getApprovalDate());
        
        // Test timestamp is set
        LocalDateTime now = LocalDateTime.now();
        assertTrue(candidate.getRegistrationDate().isBefore(now.plusSeconds(1)));
        assertTrue(candidate.getRegistrationDate().isAfter(now.minusSeconds(1)));
    }

    @Test
    void testCandidateStatus() {
        Candidate candidate = new Candidate();
        
        // Test approval status
        candidate.setApproved(false);
        assertFalse(candidate.isApproved());
        candidate.setApproved(true);
        assertTrue(candidate.isApproved());

        // Test active status
        candidate.setActive(false);
        assertFalse(candidate.isActive());
        candidate.setActive(true);
        assertTrue(candidate.isActive());
    }
} 