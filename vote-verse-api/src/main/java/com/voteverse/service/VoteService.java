package com.voteverse.service;

import com.voteverse.model.primary.Vote;
import com.voteverse.model.primary.Candidate;
import com.voteverse.model.primary.Position;
import com.voteverse.model.secondary.Voter;
import com.voteverse.repository.primary.VoteRepository;
import com.voteverse.repository.primary.CandidateRepository;
import com.voteverse.repository.secondary.VoterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;
import java.util.HashMap;

@Service
public class VoteService {
    
    @Autowired
    private VoteRepository voteRepository;
    
    @Autowired
    private CandidateRepository candidateRepository;
    
    @Autowired
    private VoterRepository voterRepository;
    
    @Transactional
    public Vote castVote(Vote vote) {
        // Validate if voter exists
        if (!voterRepository.existsById(vote.getVoter().getRegNo())) {
            throw new IllegalArgumentException("Voter not found");
        }
        
        // Check if voter has already voted for this position
        if (hasVotedForPosition(vote.getVoter().getRegNo(), vote.getPosition().getId())) {
            throw new IllegalStateException("Voter has already voted for this position");
        }
        
        // Generate vote hash
        String voteHash = generateVoteHash(vote);
        vote.setVoteHash(voteHash);
        vote.setTimestamp(LocalDateTime.now());
        
        // Save the vote
        return voteRepository.save(vote);
    }
    
    public Map<String, Object> getVoteResults(Long positionId) {
        List<Candidate> candidates = candidateRepository.findByPositionIdAndIsApprovedTrueAndIsActiveTrueOrderByVoteCountDesc(positionId);
        long totalVotes = candidates.stream()
                .mapToLong(Candidate::getVoteCount)
                .sum();
        
        List<Map<String, Object>> candidateResults = candidates.stream()
                .map(candidate -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", candidate.getId());
                    map.put("name", candidate.getVoter().getName());
                    map.put("voteCount", candidate.getVoteCount());
                    map.put("votePercentage", candidate.getVotePercentage(totalVotes));
                    return map;
                })
                .collect(Collectors.toList());
        
        Map<String, Object> result = new HashMap<>();
        result.put("totalVotes", totalVotes);
        result.put("candidates", candidateResults);
        return result;
    }
    
    private boolean hasVotedForPosition(String voterRegNo, Long positionId) {
        return voteRepository.existsByVoterRegNoAndPositionId(voterRegNo, positionId);
    }
    
    public List<Vote> getVoterHistory(String regNo) {
        return voteRepository.findByVoterRegNo(regNo);
    }
    
    public Optional<Vote> findByVoteHash(String voteHash) {
        return voteRepository.findByVoteHash(voteHash);
    }
    
    private String generateVoteHash(Vote vote) {
        try {
            String data = vote.getVoter().getRegNo() + 
                         vote.getPosition().getId() + 
                         vote.getCandidate().getId() + 
                         vote.getIpAddress() + 
                         LocalDateTime.now();
            
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to generate vote hash", e);
        }
    }
    
    private String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
} 