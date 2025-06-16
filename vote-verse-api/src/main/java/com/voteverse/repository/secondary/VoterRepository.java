package com.voteverse.repository.secondary;

import com.voteverse.model.secondary.Voter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoterRepository extends JpaRepository<Voter, String> {
    
    List<Voter> findByCollege(String college);
    
    List<Voter> findByDormBlock(String dormBlock);
    
    List<Voter> findByProgramme(String programme);
    
    List<Voter> findByYearOfStudy(Integer yearOfStudy);
    
    boolean existsByEmail(String email);
    
    boolean existsByPhoneNumber(String phoneNumber);
    
    long countByCollege(String college);
    
    long countByDormBlock(String dormBlock);
} 