package com.voteverse.repository.primary;

import com.voteverse.model.primary.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByVoterRegNo(String regNo);
    List<Feedback> findByRating(Integer rating);
    List<Feedback> findByIsAnonymousTrue();
    List<Feedback> findByIsAnonymousFalse();
} 