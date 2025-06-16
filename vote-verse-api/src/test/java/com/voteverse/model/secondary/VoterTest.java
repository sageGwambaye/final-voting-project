package com.voteverse.model.secondary;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class VoterTest {

    @Test
    void testVoterCreation() {
        Voter voter = new Voter();
        voter.setRegNo("T/UDOM/2021/12345");
        voter.setName("John Doe");
        voter.setCollege("Science");
        voter.setProgramme("Computer Science");
        voter.setYearOfStudy(3);
        voter.setEmail("john.doe@udom.ac.tz");
        voter.setPhoneNumber("+255123456789");
        voter.setDormBlock("Block A");
        voter.setImageUrl("https://example.com/image.jpg");
        
        // Test getters
        assertEquals("T/UDOM/2021/12345", voter.getRegNo());
        assertEquals("John Doe", voter.getName());
        assertEquals("Science", voter.getCollege());
        assertEquals("Computer Science", voter.getProgramme());
        assertEquals(3, voter.getYearOfStudy());
        assertEquals("john.doe@udom.ac.tz", voter.getEmail());
        assertEquals("+255123456789", voter.getPhoneNumber());
        assertEquals("Block A", voter.getDormBlock());
        assertEquals("https://example.com/image.jpg", voter.getImageUrl());
        
        // Test voting status
        assertFalse(voter.isHasVoted());
        voter.setHasVoted(true);
        assertTrue(voter.isHasVoted());
    }
} 