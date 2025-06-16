package com.voteverse.service;

import com.voteverse.model.primary.VoterRef;
import com.voteverse.model.secondary.Voter;
import com.voteverse.repository.primary.VoterRefRepository;
import com.voteverse.repository.secondary.VoterRepository;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import jakarta.persistence.PostUpdate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class VoterSyncService {

    private final VoterRefRepository voterRefRepository;
    private final VoterRepository voterRepository;

    @Transactional
    public void syncVoter(Voter voter) {
        log.info("Syncing voter with reg number: {}", voter.getRegNo());
        
        VoterRef voterRef = new VoterRef();
        voterRef.setRegNo(voter.getRegNo());
        voterRef.setName(voter.getName());
        voterRef.setCollege(voter.getCollege());
        voterRef.setProgramme(voter.getProgramme());
        voterRef.setYearOfStudy(voter.getYearOfStudy());
        voterRef.setPhoneNumber(voter.getPhoneNumber());
        voterRef.setEmail(voter.getEmail());
        voterRef.setDormBlock(voter.getDormBlock());
        voterRef.setImageUrl(voter.getImageUrl());
        voterRef.setHasVoted(voter.isHasVoted());
        
        voterRefRepository.save(voterRef);
        log.info("Successfully synced voter: {}", voter.getName());
    }

    @Transactional
    public void removeVoter(String regNo) {
        log.info("Removing voter with reg number: {}", regNo);
        voterRefRepository.deleteById(regNo);
        log.info("Successfully removed voter with reg number: {}", regNo);
    }
} 