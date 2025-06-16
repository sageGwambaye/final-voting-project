package com.voteverse.controller;

import com.voteverse.model.secondary.Voter;
import com.voteverse.service.VoterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/voters")
@CrossOrigin(origins = "*")
public class VoterController {
    
    @Autowired
    private VoterService voterService;
    
    @GetMapping
    public ResponseEntity<List<Voter>> getAllVoters() {
        return ResponseEntity.ok(voterService.getAllVoters());
    }
    
    @GetMapping("/{regNo}")
    public ResponseEntity<?> getVoterByRegNo(@PathVariable String regNo) {
        return voterService.getVoterByRegNo(regNo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/college/{college}")
    public ResponseEntity<List<Voter>> getVotersByCollege(@PathVariable String college) {
        return ResponseEntity.ok(voterService.getVotersByCollege(college));
    }
    
    @GetMapping("/block/{dormBlock}")
    public ResponseEntity<List<Voter>> getVotersByDormBlock(@PathVariable String dormBlock) {
        return ResponseEntity.ok(voterService.getVotersByDormBlock(dormBlock));
    }
    
    @GetMapping("/programme/{programme}")
    public ResponseEntity<List<Voter>> getVotersByProgramme(@PathVariable String programme) {
        return ResponseEntity.ok(voterService.getVotersByProgramme(programme));
    }
    
    @GetMapping("/year/{yearOfStudy}")
    public ResponseEntity<List<Voter>> getVotersByYearOfStudy(@PathVariable Integer yearOfStudy) {
        return ResponseEntity.ok(voterService.getVotersByYearOfStudy(yearOfStudy));
    }
    
    @GetMapping("/check/email/{email}")
    public ResponseEntity<Boolean> isEmailRegistered(@PathVariable String email) {
        return ResponseEntity.ok(voterService.isEmailRegistered(email));
    }
    
    @GetMapping("/check/phone/{phoneNumber}")
    public ResponseEntity<Boolean> isPhoneNumberRegistered(@PathVariable String phoneNumber) {
        return ResponseEntity.ok(voterService.isPhoneNumberRegistered(phoneNumber));
    }
    
    @PutMapping("/{regNo}/image")
    public ResponseEntity<?> updateVoterImage(
            @PathVariable String regNo,
            @RequestParam String imageUrl) {
        try {
            Voter updatedVoter = voterService.updateVoterImage(regNo, imageUrl);
            return ResponseEntity.ok(updatedVoter);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/{regNo}/contacts")
    public ResponseEntity<?> updateVoterContacts(
            @PathVariable String regNo,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String phoneNumber) {
        try {
            Voter updatedVoter = voterService.updateVoterContacts(regNo, email, phoneNumber);
            return ResponseEntity.ok(updatedVoter);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 