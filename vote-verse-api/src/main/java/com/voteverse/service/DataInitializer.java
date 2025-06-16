package com.voteverse.service;

import com.voteverse.model.secondary.Voter;
import com.voteverse.repository.secondary.VoterRepository;
import com.voteverse.repository.primary.VoterRefRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final VoterRepository secondaryVoterRepository;    // from udom_database (secondary datasource)
    private final VoterRefRepository primaryVoterRefRepository; // from geeves_db (primary datasource)
    private final VoterSyncService voterSyncService; // service to sync from secondary to primary

    @Override
    @Transactional
    public void run(String... args) {
        try {
            log.info("Starting voter data synchronization...");

            // Fetch all voters from the secondary DB (udom_database)
            List<Voter> secondaryVoters = secondaryVoterRepository.findAll();

            if (secondaryVoters.isEmpty()) {
                log.warn("No voters found in secondary database.");
                return;
            }

            // Sync each voter into primary DB (geeves_db)
            for (Voter voter : secondaryVoters) {
                try {
                    voterSyncService.syncVoter(voter);
                } catch (Exception e) {
                    log.error("Error syncing voter {}: {}", voter.getRegNo(), e.getMessage());
                }
            }

            log.info("Completed synchronization of {} voters.", secondaryVoters.size());

        } catch (Exception e) {
            log.error("Error during voter synchronization: {}", e.getMessage(), e);
        }
    }
}
