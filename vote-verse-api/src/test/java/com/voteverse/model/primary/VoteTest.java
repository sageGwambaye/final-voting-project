package com.voteverse.model.primary;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

class VoteTest {
    
    @Test
    void testVoteCreation() {
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
        
        Candidate candidate = new Candidate();
        candidate.setId(1L);
        candidate.setVoter(voter);
        candidate.setPosition(position);
        candidate.setManifesto("My manifesto");
        
        // Create and test vote
        Vote vote = new Vote();
        vote.setId(1L);
        vote.setVoter(voter);
        vote.setPosition(position);
        vote.setCandidate(candidate);
        
        // Test getters
        assertEquals(1L, vote.getId());
        assertEquals("123456", vote.getVoter().getRegNo());
        assertEquals(1L, vote.getPosition().getId());
        assertEquals(1L, vote.getCandidate().getId());
        assertNotNull(vote.getTimestamp());
        
        // Test timestamp is set
        LocalDateTime now = LocalDateTime.now();
        assertTrue(vote.getTimestamp().isBefore(now.plusSeconds(1)));
        assertTrue(vote.getTimestamp().isAfter(now.minusSeconds(1)));
    }
} 