package com.voteverse.service;

import com.voteverse.model.secondary.Voter;
import com.voteverse.repository.secondary.VoterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VoterService {
    
    @Autowired
    private VoterRepository voterRepository;
    
    public List<Voter> getAllVoters() {
        return voterRepository.findAll();
    }
    
    public Optional<Voter> getVoterByRegNo(String regNo) {
        return voterRepository.findById(regNo);
    }
    
    public List<Voter> getVotersByCollege(String college) {
        return voterRepository.findByCollege(college);
    }
    
    public List<Voter> getVotersByDormBlock(String dormBlock) {
        return voterRepository.findByDormBlock(dormBlock);
    }
    
    public List<Voter> getVotersByProgramme(String programme) {
        return voterRepository.findByProgramme(programme);
    }
    
    public List<Voter> getVotersByYearOfStudy(Integer yearOfStudy) {
        return voterRepository.findByYearOfStudy(yearOfStudy);
    }
    
    public boolean isEmailRegistered(String email) {
        return voterRepository.existsByEmail(email);
    }
    
    public boolean isPhoneNumberRegistered(String phoneNumber) {
        return voterRepository.existsByPhoneNumber(phoneNumber);
    }
    
    public Voter updateVoterImage(String regNo, String imageUrl) throws Exception {
        Optional<Voter> voter = voterRepository.findById(regNo);
        if (voter.isEmpty()) {
            throw new Exception("Voter not found");
        }
        
        Voter existingVoter = voter.get();
        existingVoter.setImageUrl(imageUrl);
        return voterRepository.save(existingVoter);
    }
    
    public Voter updateVoterContacts(String regNo, String email, String phoneNumber) throws Exception {
        Optional<Voter> voter = voterRepository.findById(regNo);
        if (voter.isEmpty()) {
            throw new Exception("Voter not found");
        }
        
        Voter existingVoter = voter.get();
        if (email != null) {
            existingVoter.setEmail(email);
        }
        if (phoneNumber != null) {
            existingVoter.setPhoneNumber(phoneNumber);
        }
        return voterRepository.save(existingVoter);
    }
} 