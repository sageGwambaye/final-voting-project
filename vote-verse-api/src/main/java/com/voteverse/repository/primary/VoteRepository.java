package com.voteverse.repository.primary;

import com.voteverse.model.primary.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    
    @Query("SELECT v FROM Vote v WHERE v.position.level = 'UNIVERSITY'")
    List<Vote> findPresidentVotes();
    
    @Query("SELECT v FROM Vote v WHERE v.position.level = 'COLLEGE'")
    List<Vote> findGovernorVotes();
    
    @Query("SELECT v FROM Vote v WHERE v.position.level = 'BLOCK'")
    List<Vote> findBlockRepVotes();
    
    boolean existsByVoterRegNoAndPositionId(String regNo, Long positionId);
    
    List<Vote> findByVoterRegNo(String regNo);
    
    List<Vote> findByPositionId(Long positionId);
    
    List<Vote> findByCandidateId(Long candidateId);
    
    long countByPositionId(Long positionId);
    
    long countByCandidateId(Long candidateId);
    
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.position.id = :positionId")
    Long countVotesByPosition(@Param("positionId") Long positionId);
    
    @Query("SELECT v.candidate.id as candidateId, COUNT(v) as voteCount " +
           "FROM Vote v WHERE v.position.id = :positionId " +
           "GROUP BY v.candidate.id")
    List<Map<String, Object>> getVoteCountsByPositionGroupedByCandidate(@Param("positionId") Long positionId);
    
    Optional<Vote> findByVoteHash(String voteHash);
} 