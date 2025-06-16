package com.voteverse.repository.primary;

import com.voteverse.model.primary.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PositionRepository extends JpaRepository<Position, Long> {
    List<Position> findByLevel(Position.PositionLevel level);
    Position findByName(String name);
} 