package com.voteverse.controller;

import com.voteverse.model.primary.Position;
import com.voteverse.service.PositionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/positions")
@CrossOrigin(origins = "*")
public class PositionController {
    
    @Autowired
    private PositionService positionService;
    
    @PostMapping
    public ResponseEntity<Position> createPosition(@RequestBody Position position) {
        return ResponseEntity.ok(positionService.createPosition(position));
    }
    
    @GetMapping
    public ResponseEntity<List<Position>> getAllPositions() {
        return ResponseEntity.ok(positionService.getAllPositions());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getPositionById(@PathVariable Long id) {
        return positionService.getPositionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/name/{name}")
    public ResponseEntity<?> getPositionByName(@PathVariable String name) {
        Position position = positionService.getPositionByName(name);
        if (position == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(position);
    }
    
    @GetMapping("/level/{level}")
    public ResponseEntity<List<Position>> getPositionsByLevel(@PathVariable Position.PositionLevel level) {
        return ResponseEntity.ok(positionService.getPositionsByLevel(level));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePosition(
            @PathVariable Long id,
            @RequestBody Position positionDetails) {
        try {
            Position updatedPosition = positionService.updatePosition(id, positionDetails);
            return ResponseEntity.ok(updatedPosition);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePosition(@PathVariable Long id) {
        try {
            positionService.deletePosition(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 