package com.voteverse.model.primary;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "feedback")
public class Feedback {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "voter_reg_no", nullable = false)
    private VoterRef voter;
    
    @Column(nullable = false)
    private String comment;
    
    @Column(nullable = false)
    private Integer rating;
    
    @Column(nullable = false)
    private boolean isAnonymous = false;
    
    @Column(nullable = false)
    private LocalDateTime submissionDate = LocalDateTime.now();
} 