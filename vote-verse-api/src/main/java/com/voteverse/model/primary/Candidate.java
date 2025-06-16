package com.voteverse.model.primary;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "candidates")
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "voter_reg_no", nullable = false)
    private VoterRef voter;

    @ManyToOne
    @JoinColumn(name = "position_id", nullable = false)
    private Position position;

    @Column(nullable = false)
    private String manifesto;

    private String campaignVideoUrl;

    @Column(nullable = false)
    private boolean isApproved = false;

    @Column(nullable = false)
    private boolean isActive = true;

    @Column(nullable = false)
    private LocalDateTime registrationDate = LocalDateTime.now();

    private LocalDateTime approvalDate;

    @OneToMany(mappedBy = "candidate")
    private List<Vote> votes;

    public long getVoteCount() {
        return votes != null ? votes.size() : 0;
    }

    public double getVotePercentage(long totalVotes) {
        if (totalVotes == 0) return 0.0;
        return (getVoteCount() * 100.0) / totalVotes;
    }
}
