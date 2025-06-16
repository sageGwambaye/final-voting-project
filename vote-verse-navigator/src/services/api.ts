import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, getHeaders } from '../config/apiConfig';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: getHeaders(),
});

// Types
export interface Voter {
    regNo: string;
    name: string;
    college: string;
    programme: string;
    yearOfStudy: number;
    dormBlock: string;
    imageUrl?: string;
    email?: string;
    phoneNumber?: string;
}

export interface Position {
    id: number;
    name: string;
    level: 'UNIVERSITY' | 'COLLEGE' | 'BLOCK';
    description: string;
    isActive: boolean;
}

export interface Candidate {
    id: number;
    voter: Voter;
    position: Position;
    manifesto: string;
    campaignVideoUrl?: string;
    isApproved: boolean;
    isActive: boolean;
    registrationDate: string;
    approvalDate?: string;
    voteCount: number;
}

export interface Vote {
    id: number;
    voter: Voter;
    position: Position;
    candidate: Candidate;
    timestamp: string;
    ipAddress: string;
    deviceInfo: string;
    voteHash: string;
}

export interface Feedback {
    id: number;
    voter?: Voter;
    rating: number;
    comment: string;
    isAnonymous: boolean;
    submissionDate: string;
}

export interface VoteResults {
    totalVotes: number;
    candidates: {
        id: number;
        name: string;
        voteCount: number;
        votePercentage: number;
    }[];
}

// API Functions
export const voterAPI = {
    getAllVoters: () => api.get<Voter[]>(API_ENDPOINTS.VOTERS),
    getVoterByRegNo: (regNo: string) => api.get<Voter>(API_ENDPOINTS.VOTER_BY_REG_NO(regNo)),
    getVotersByCollege: (college: string) => api.get<Voter[]>(API_ENDPOINTS.VOTERS_BY_COLLEGE(college)),
    getVotersByBlock: (block: string) => api.get<Voter[]>(API_ENDPOINTS.VOTERS_BY_BLOCK(block)),
    getVotersByProgramme: (programme: string) => api.get<Voter[]>(API_ENDPOINTS.VOTERS_BY_PROGRAMME(programme)),
    getVotersByYear: (year: number) => api.get<Voter[]>(API_ENDPOINTS.VOTERS_BY_YEAR(year)),
};

export const positionAPI = {
    getAllPositions: () => api.get<Position[]>(API_ENDPOINTS.POSITIONS),
    getPositionById: (id: number) => api.get<Position>(API_ENDPOINTS.POSITION_BY_ID(id)),
    getPositionsByLevel: (level: string) => api.get<Position[]>(API_ENDPOINTS.POSITIONS_BY_LEVEL(level)),
};

export const candidateAPI = {
    getAllCandidates: () => api.get<Candidate[]>(API_ENDPOINTS.CANDIDATES),
    getCandidatesByPosition: (positionId: number) => api.get<Candidate[]>(API_ENDPOINTS.CANDIDATES_BY_POSITION(positionId)),
    getApprovedCandidates: () => api.get<Candidate[]>(API_ENDPOINTS.APPROVED_CANDIDATES),
    getActiveCandidates: () => api.get<Candidate[]>(API_ENDPOINTS.ACTIVE_CANDIDATES),
};

export const voteAPI = {
    castVote: (vote: Omit<Vote, 'id' | 'timestamp' | 'voteHash'>) => api.post<Vote>(API_ENDPOINTS.VOTES, vote),
    getVoteResults: (positionId: number) => api.get<VoteResults>(API_ENDPOINTS.VOTE_RESULTS(positionId)),
    getVoterHistory: (regNo: string) => api.get<Vote[]>(API_ENDPOINTS.VOTER_HISTORY(regNo)),
    verifyVote: (voteHash: string) => api.get<Vote>(API_ENDPOINTS.VERIFY_VOTE(voteHash)),
};

export const feedbackAPI = {
    submitFeedback: (feedback: Omit<Feedback, 'id' | 'submissionDate'>) => api.post<Feedback>(API_ENDPOINTS.FEEDBACK, feedback),
    getAllFeedback: () => api.get<Feedback[]>(API_ENDPOINTS.FEEDBACK),
    getFeedbackByVoter: (regNo: string) => api.get<Feedback[]>(API_ENDPOINTS.FEEDBACK_BY_VOTER(regNo)),
    getFeedbackByRating: (rating: number) => api.get<Feedback[]>(API_ENDPOINTS.FEEDBACK_BY_RATING(rating)),
    getAnonymousFeedback: () => api.get<Feedback[]>(API_ENDPOINTS.ANONYMOUS_FEEDBACK),
    getNonAnonymousFeedback: () => api.get<Feedback[]>(API_ENDPOINTS.NON_ANONYMOUS_FEEDBACK),
};

export const resultsAPI = {
    getResultsByPosition: (positionId: number) => api.get<Candidate[]>(API_ENDPOINTS.RESULTS_BY_POSITION(positionId)),
    getAllResultsByPosition: (positionId: number) => api.get<Candidate[]>(API_ENDPOINTS.ALL_RESULTS_BY_POSITION(positionId)),
    getCandidateResults: (candidateId: number) => api.get<Candidate>(API_ENDPOINTS.CANDIDATE_RESULTS(candidateId)),
}; 