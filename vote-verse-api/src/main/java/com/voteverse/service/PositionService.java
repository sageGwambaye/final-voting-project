package com.voteverse.service;

import com.voteverse.model.primary.Position;
import com.voteverse.repository.primary.PositionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PositionService {
    
    @Autowired
    private PositionRepository positionRepository;
    
    public Position createPosition(Position position) {
        return positionRepository.save(position);
    }
    
    public List<Position> getAllPositions() {
        return positionRepository.findAll();
    }
    
    public Optional<Position> getPositionById(Long id) {
        return positionRepository.findById(id);
    }
    
    public Position getPositionByName(String name) {
        return positionRepository.findByName(name);
    }
    
    public List<Position> getPositionsByLevel(Position.PositionLevel level) {
        return positionRepository.findByLevel(level);
    }
    
    public Position updatePosition(Long id, Position positionDetails) throws Exception {
        Optional<Position> position = positionRepository.findById(id);
        if (position.isEmpty()) {
            throw new Exception("Position not found");
        }
        
        Position existingPosition = position.get();
        existingPosition.setName(positionDetails.getName());
        existingPosition.setDescription(positionDetails.getDescription());
        existingPosition.setLevel(positionDetails.getLevel());
        
        return positionRepository.save(existingPosition);
    }
    
    public void deletePosition(Long id) throws Exception {
        if (!positionRepository.existsById(id)) {
            throw new Exception("Position not found");
        }
        positionRepository.deleteById(id);
    }
} 