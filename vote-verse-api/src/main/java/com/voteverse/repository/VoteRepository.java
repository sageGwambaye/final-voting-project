package com.voteverse.repository;

import com.voteverse.model.primary.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    
    List<Vote> findByVoterId(String voterId);
    
    List<Vote> findByCandidateId(String candidateId);
    
    List<Vote> findByPosition(String position);
    
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.candidateId = ?1")
    Long countVotesByCandidateId(String candidateId);
    
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.position = ?1")
    Long countVotesByPosition(String position);
    
    @Query("SELECT v.candidateId, COUNT(v) as voteCount FROM Vote v WHERE v.position = ?1 GROUP BY v.candidateId")
    List<Object[]> getVoteCountsByPositionGroupedByCandidate(String position);
    
    boolean existsByVoterIdAndPosition(String voterId, String position);
    
    @Query("SELECT v FROM Vote v WHERE v.position.level = 'UNIVERSITY'")
    List<Vote> findPresidentVotes();
    
    @Query("SELECT v FROM Vote v WHERE v.position.level = 'COLLEGE'")
    List<Vote> findGovernorVotes();
    
    @Query("SELECT v FROM Vote v WHERE v.position.level = 'BLOCK'")
    List<Vote> findBlockRepVotes();
} 