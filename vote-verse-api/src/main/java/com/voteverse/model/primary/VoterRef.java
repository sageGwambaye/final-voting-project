package com.voteverse.model.primary;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "voter_refs")
public class VoterRef {
    
    @Id
    @Column(name = "reg_no")
    private String regNo;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String college;
    
    @Column(nullable = false)
    private String programme;
    
    @Column(nullable = false)
    private Integer yearOfStudy;
    
    private String phoneNumber;
    
    @Column(nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String dormBlock;
    
    private String imageUrl;
    
    @Column(nullable = false)
    private boolean hasVoted = false;
} 