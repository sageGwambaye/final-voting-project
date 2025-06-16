package com.voteverse.listener;

import com.voteverse.model.secondary.Voter;
import com.voteverse.service.VoterSyncService;
import jakarta.persistence.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class VoterEntityListener {

    private static VoterSyncService voterSyncService;

    @Autowired
    public void setVoterSyncService(VoterSyncService voterSyncService) {
        VoterEntityListener.voterSyncService = voterSyncService;
    }

    @PostPersist
    @PostUpdate
    public void onSaveOrUpdate(Voter voter) {
        voterSyncService.syncVoter(voter);
    }

    @PostRemove
    public void onDelete(Voter voter) {
        voterSyncService.removeVoter(voter.getRegNo());
    }
} 