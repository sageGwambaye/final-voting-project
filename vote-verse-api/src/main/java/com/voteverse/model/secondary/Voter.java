package com.voteverse.model.secondary;

import com.voteverse.listener.VoterEntityListener;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "voters")
@EntityListeners(VoterEntityListener.class)
public class Voter {
    
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
    private String voiceSampleUrl;

    
    @Column(nullable = false)
    private String dormBlock;

    private String imageUrl;

    @Column(nullable = false)
    private boolean hasVoted = false;
} 