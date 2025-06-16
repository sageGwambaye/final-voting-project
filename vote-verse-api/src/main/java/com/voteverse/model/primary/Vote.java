package com.voteverse.model.primary;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "votes")
public class Vote {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "voter_reg_no", nullable = false)
    private VoterRef voter;
    
    @ManyToOne
    @JoinColumn(name = "position_id", nullable = false)
    private Position position;
    
    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;
    
    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
    
    // For audit and verification
    @Column(nullable = false)
    private String ipAddress;
    
    @Column(nullable = false)
    private String deviceInfo;
    
    // For vote integrity and verification
    @Column(nullable = false, unique = true)
    private String voteHash;
} 