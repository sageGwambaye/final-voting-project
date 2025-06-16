package com.voteverse.repository.primary;

import com.voteverse.model.primary.VoterRef;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VoterRefRepository extends JpaRepository<VoterRef, String> {
} 