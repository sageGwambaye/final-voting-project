package com.voteverse.model.primary;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "positions")
public class Position {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(nullable = false)
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PositionLevel level;
    
    // For college-specific positions
    private String college;
    
    // For block-specific positions
    private String dormBlock;
    
    public enum PositionLevel {
        UNIVERSITY,    // For president
        COLLEGE,       // For governor
        BLOCK         // For block representative
    }
} 