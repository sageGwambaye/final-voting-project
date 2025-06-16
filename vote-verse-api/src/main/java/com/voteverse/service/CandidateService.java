package com.voteverse.service;

import com.voteverse.model.primary.Candidate;
import com.voteverse.model.secondary.Voter;
import com.voteverse.repository.primary.CandidateRepository;
import com.voteverse.repository.secondary.VoterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CandidateService {
    
    @Autowired
    private CandidateRepository candidateRepository;
    
    @Autowired
    private VoterRepository voterRepository;
    
    @Transactional
    public Candidate registerCandidate(Candidate candidate) throws Exception {
        // Verify voter exists
        Optional<Voter> voter = voterRepository.findById(candidate.getVoter().getRegNo());
        if (voter.isEmpty()) {
            throw new Exception("Voter not found in the system");
        }
        
        // Check if voter is already a candidate for this position
        if (candidateRepository.existsByVoterRegNoAndPositionId(
                candidate.getVoter().getRegNo(), 
                candidate.getPosition().getId())) {
            throw new Exception("Voter is already a candidate for this position");
        }
        
        return candidateRepository.save(candidate);
    }
    
    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }
    
    public List<Candidate> getApprovedCandidates() {
        return candidateRepository.findByIsApprovedTrue();
    }
    
    public List<Candidate> getActiveCandidates() {
        return candidateRepository.findByIsActiveTrue();
    }
    
    public List<Candidate> getCandidatesByPosition(Long positionId) {
        return candidateRepository.findByPositionId(positionId);
    }
    
    public Optional<Candidate> getCandidateById(Long id) {
        return candidateRepository.findById(id);
    }
    
    @Transactional
    public Candidate approveCandidate(Long id) throws Exception {
        Optional<Candidate> candidate = candidateRepository.findById(id);
        if (candidate.isEmpty()) {
            throw new Exception("Candidate not found");
        }
        
        Candidate actualCandidate = candidate.get();
        actualCandidate.setApproved(true);
        return candidateRepository.save(actualCandidate);
    }
    
    @Transactional
    public Candidate updateCandidateStatus(Long id, boolean isActive) throws Exception {
        Optional<Candidate> candidate = candidateRepository.findById(id);
        if (candidate.isEmpty()) {
            throw new Exception("Candidate not found");
        }
        
        Candidate actualCandidate = candidate.get();
        actualCandidate.setActive(isActive);
        return candidateRepository.save(actualCandidate);
    }
} 