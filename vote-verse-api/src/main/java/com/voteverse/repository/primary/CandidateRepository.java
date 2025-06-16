package com.voteverse.repository.primary;

import com.voteverse.model.primary.Candidate;
import com.voteverse.model.primary.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {

    List<Candidate> findByPosition(Position position);

    List<Candidate> findByPositionId(Long positionId);

    @Query("""
        SELECT c FROM Candidate c
        LEFT JOIN c.votes v
        WHERE c.position.id = :positionId
        GROUP BY c
        ORDER BY COUNT(v) DESC
    """)
    List<Candidate> findByPositionIdOrderByVoteCountDesc(@Param("positionId") Long positionId);

    @Query("""
        SELECT c FROM Candidate c
        LEFT JOIN c.votes v
        WHERE c.position = :position
        GROUP BY c
        ORDER BY COUNT(v) DESC
    """)
    List<Candidate> findByPositionOrderByVoteCountDesc(@Param("position") Position position);

    @Query("""
        SELECT c FROM Candidate c
        LEFT JOIN c.votes v
        WHERE c.position = :position AND c.isApproved = true AND c.isActive = true
        GROUP BY c
        ORDER BY COUNT(v) DESC
    """)
    List<Candidate> findByPositionAndIsApprovedTrueAndIsActiveTrueOrderByVoteCountDesc(@Param("position") Position position);

    @Query("""
        SELECT c FROM Candidate c
        LEFT JOIN c.votes v
        WHERE c.position.id = :positionId AND c.isApproved = true AND c.isActive = true
        GROUP BY c
        ORDER BY COUNT(v) DESC
    """)
    List<Candidate> findByPositionIdAndIsApprovedTrueAndIsActiveTrueOrderByVoteCountDesc(@Param("positionId") Long positionId);

    @Query("""
        SELECT c FROM Candidate c
        WHERE c.voter.regNo = :regNo
    """)
    List<Candidate> findByVoterRegNo(@Param("regNo") String regNo);

    List<Candidate> findByIsApprovedTrue();

    List<Candidate> findByIsActiveTrue();

    boolean existsByVoterRegNoAndPositionId(String regNo, Long positionId);

}
