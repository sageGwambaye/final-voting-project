package com.voteverse.model.primary;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class PositionTest {

    @Test
    void testPositionCreation() {
        Position position = new Position();
        position.setId(1L);
        position.setName("University President");
        position.setDescription("Chief student representative");
        position.setLevel(Position.PositionLevel.UNIVERSITY);

        assertEquals(1L, position.getId());
        assertEquals("University President", position.getName());
        assertEquals("Chief student representative", position.getDescription());
        assertEquals(Position.PositionLevel.UNIVERSITY, position.getLevel());
    }

    @Test
    void testPositionLevels() {
        // Test all position levels
        Position president = new Position();
        president.setLevel(Position.PositionLevel.UNIVERSITY);
        assertEquals(Position.PositionLevel.UNIVERSITY, president.getLevel());

        Position governor = new Position();
        governor.setLevel(Position.PositionLevel.COLLEGE);
        assertEquals(Position.PositionLevel.COLLEGE, governor.getLevel());

        Position blockRep = new Position();
        blockRep.setLevel(Position.PositionLevel.BLOCK);
        assertEquals(Position.PositionLevel.BLOCK, blockRep.getLevel());
    }
} 