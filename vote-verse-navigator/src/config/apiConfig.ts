export const API_BASE_URL = 'http://localhost:8081/voteverse/api';

export const API_ENDPOINTS = {
    // Voter endpoints
    VOTERS: '/voters',
    VOTER_BY_REG_NO: (regNo: string) => `/voters/${regNo}`,
    VOTERS_BY_COLLEGE: (college: string) => `/voters/college/${college}`,
    VOTERS_BY_BLOCK: (block: string) => `/voters/block/${block}`,
    VOTERS_BY_PROGRAMME: (programme: string) => `/voters/programme/${programme}`,
    VOTERS_BY_YEAR: (year: number) => `/voters/year/${year}`,

    // Position endpoints
    POSITIONS: '/positions',
    POSITION_BY_ID: (id: number) => `/positions/${id}`,
    POSITIONS_BY_LEVEL: (level: string) => `/positions/level/${level}`,

    // Candidate endpoints
    CANDIDATES: '/candidates',
    CANDIDATES_BY_POSITION: (positionId: number) => `/candidates/position/${positionId}`,
    APPROVED_CANDIDATES: '/candidates/approved',
    ACTIVE_CANDIDATES: '/candidates/active',

    // Vote endpoints
    VOTES: '/votes',
    VOTE_RESULTS: (positionId: number) => `/votes/position/${positionId}/results`,
    VOTER_HISTORY: (regNo: string) => `/votes/voter/${regNo}`,
    VERIFY_VOTE: (voteHash: string) => `/votes/verify/${voteHash}`,

    // Feedback endpoints
    FEEDBACK: '/feedback',
    FEEDBACK_BY_VOTER: (regNo: string) => `/feedback/voter/${regNo}`,
    FEEDBACK_BY_RATING: (rating: number) => `/feedback/rating/${rating}`,
    ANONYMOUS_FEEDBACK: '/feedback/anonymous',
    NON_ANONYMOUS_FEEDBACK: '/feedback/non-anonymous',

    // Results endpoints
    RESULTS_BY_POSITION: (positionId: number) => `/results/position/${positionId}`,
    ALL_RESULTS_BY_POSITION: (positionId: number) => `/results/position/${positionId}/all`,
    CANDIDATE_RESULTS: (candidateId: number) => `/results/candidate/${candidateId}`,
};

export const getHeaders = () => ({
    'Content-Type': 'application/json',
}); 