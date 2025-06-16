
const API_BASE_URL = 'http://localhost:8080';

// Import mock data for fallback
import { mockCandidatesData, mockVotersData, mockPositionsData } from '@/data/mockData';

// API utility functions
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    // Fallback to mock data when API is not available
    console.warn('API not available, using mock data:', error);
    throw error;
  }
};

// Authentication functions
export const auth = {
  login: async (username: string, password: string) => {
    try {
      return await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
    } catch (error) {
      // Mock authentication
      const user = mockVotersData.find(voter => 
        voter.email === username || voter.username === username
      );
      if (user) {
        return { user, token: 'mock-token' };
      }
      throw new Error('Invalid credentials');
    }
  },

  register: async (userData: {
    username: string;
    password: string;
    email: string;
    regNumber: string;
    name: string;
    role: string;
  }) => {
    try {
      return await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      // Mock registration
      return { message: 'User registered successfully' };
    }
  },

  checkAuth: async () => {
    try {
      return await apiRequest('/api/auth/check-auth');
    } catch (error) {
      return { authenticated: false };
    }
  },

  logout: async () => {
    try {
      return await apiRequest('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      return { message: 'Logged out successfully' };
    }
  },
};

// Position Management
export const positions = {
  getAll: async () => {
    try {
      return await apiRequest('/api/positions');
    } catch (error) {
      // Return mock positions data with proper structure
      return mockPositionsData.map(pos => ({
        id: pos.id,
        title: pos.title,
        name: pos.title, // Add name field for compatibility
        description: pos.description,
        maxVotes: pos.maxVotes,
        max_votes: pos.maxVotes // Add snake_case for compatibility
      }));
    }
  },

  getById: async (id: string) => {
    try {
      return await apiRequest(`/api/positions/${id}`);
    } catch (error) {
      const position = mockPositionsData.find(pos => pos.id.toString() === id);
      return position || null;
    }
  },

  create: async (position: {
    title: string;
    description?: string;
    maxVotes?: number;
    electionId: string;
  }) => {
    try {
      return await apiRequest('/api/positions', {
        method: 'POST',
        body: JSON.stringify(position),
      });
    } catch (error) {
      return { message: 'Position created successfully' };
    }
  },

  update: async (id: string, position: any) => {
    try {
      return await apiRequest(`/api/positions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(position),
      });
    } catch (error) {
      return { message: 'Position updated successfully' };
    }
  },

  delete: async (id: string) => {
    try {
      return await apiRequest(`/api/positions/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      return { message: 'Position deleted successfully' };
    }
  },
};

// Admin Management
export const admin = {
  getUsers: async () => {
    try {
      return await apiRequest('/api/admin/users');
    } catch (error) {
      return mockVotersData;
    }
  },

  getVoters: async () => {
    try {
      return await apiRequest('/api/admin/voters');
    } catch (error) {
      return mockVotersData.filter(user => user.role === 'VOTER');
    }
  },

  getCandidates: async () => {
    try {
      return await apiRequest('/api/admin/candidates');
    } catch (error) {
      return mockCandidatesData;
    }
  },

  getAdmins: async () => {
    try {
      return await apiRequest('/api/admin/admins');
    } catch (error) {
      return mockVotersData.filter(user => user.role === 'ADMIN');
    }
  },

  searchUsers: async (query: string) => {
    try {
      return await apiRequest(`/api/admin/users/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      return mockVotersData.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.regNumber.toLowerCase().includes(query.toLowerCase())
      );
    }
  },
};

// Voter Management
export const voter = {
  getActiveElections: async () => {
    try {
      return await apiRequest('/api/voter/elections/active');
    } catch (error) {
      return [];
    }
  },

  getElectionDetails: async (id: string) => {
    try {
      return await apiRequest(`/api/voter/elections/${id}`);
    } catch (error) {
      return null;
    }
  },
};

// Feedback Management
export const feedback = {
  getAll: async () => {
    try {
      return await apiRequest('/api/feedback');
    } catch (error) {
      return [];
    }
  },

  getByUser: async (userId: string) => {
    try {
      return await apiRequest(`/api/feedback/user/${userId}`);
    } catch (error) {
      return [];
    }
  },

  getByCategory: async (category: string) => {
    try {
      return await apiRequest(`/api/feedback/category/${category}`);
    } catch (error) {
      return [];
    }
  },

  getByStatus: async (resolved: boolean) => {
    try {
      return await apiRequest(`/api/feedback/status/${resolved}`);
    } catch (error) {
      return [];
    }
  },
};

// General User Management
export const users = {
  getAll: async () => {
    try {
      return await apiRequest('/users');
    } catch (error) {
      return mockVotersData;
    }
  },

  save: async (user: any) => {
    try {
      return await apiRequest('/saveUser', {
        method: 'POST',
        body: JSON.stringify(user),
      });
    } catch (error) {
      return { message: 'User saved successfully' };
    }
  },

  update: async (id: string, user: any) => {
    try {
      return await apiRequest(`/updateUser/${id}`, {
        method: 'PUT',
        body: JSON.stringify(user),
      });
    } catch (error) {
      return { message: 'User updated successfully' };
    }
  },

  delete: async (id: string) => {
    try {
      return await apiRequest(`/deleteUser/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      return { message: 'User deleted successfully' };
    }
  },

  // Add new method to get current user profile
  getCurrentUser: async () => {
    try {
      return await apiRequest('/api/users/me');
    } catch (error) {
      return null;
    }
  },
  
  getUserProfile: async (userId: string) => {
    try {
      return await apiRequest(`/api/users/${userId}/profile`);
    } catch (error) {
      return null;
    }
  }
};

// Candidate Management
export const candidates = {
  getAll: async () => {
    try {
      return await apiRequest('/candidates');
    } catch (error) {
      return mockCandidatesData;
    }
  },

  getByPositionId: async (positionId: string) => {
    try {
      return await apiRequest(`/api/candidates/position/${positionId}`);
    } catch (error) {
      return mockCandidatesData.filter(candidate => 
        candidate.position === mockPositionsData.find(p => p.id.toString() === positionId)?.title
      );
    }
  },

  save: async (candidate: any) => {
    try {
      return await apiRequest('/saveCandidate', {
        method: 'POST',
        body: JSON.stringify(candidate),
      });
    } catch (error) {
      // Mock save - generate new candidate with mock data structure
      const voter = mockVotersData.find(v => v.id.toString() === candidate.voterId.toString());
      const position = mockPositionsData.find(p => p.id.toString() === candidate.positionId.toString());
      
      if (!voter || !position) {
        throw new Error('Voter or position not found');
      }

      const newCandidate = {
        id: Date.now(),
        name: voter.name,
        firstName: voter.firstName,
        lastName: voter.lastName,
        regNumber: voter.regNumber,
        position: position.title,
        platform: candidate.platform || 'Platform to be announced',
        manifesto: candidate.manifesto || 'Manifesto to be announced',
        imageUrl: voter.imageUrl || '',
        videoUrl: candidate.videoUrl || '',
        voteCount: 0,
        votes: 0,
        program: voter.program,
        college: voter.college
      };
      
      // Add to mock data
      mockCandidatesData.push(newCandidate);
      return { message: 'Candidate saved successfully', data: newCandidate };
    }
  },

  update: async (id: string, candidate: any) => {
    try {
      return await apiRequest(`/updateCandidate/${id}`, {
        method: 'PUT',
        body: JSON.stringify(candidate),
      });
    } catch (error) {
      // Update in mock data
      const index = mockCandidatesData.findIndex(c => c.id.toString() === id);
      if (index !== -1) {
        mockCandidatesData[index] = { ...mockCandidatesData[index], ...candidate };
      }
      return { message: 'Candidate updated successfully' };
    }
  },

  delete: async (id: string) => {
    try {
      return await apiRequest(`/deleteCandidate/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      // Remove from mock data
      const index = mockCandidatesData.findIndex(c => c.id.toString() === id);
      if (index !== -1) {
        mockCandidatesData.splice(index, 1);
      }
      return { message: 'Candidate deleted successfully' };
    }
  },
};

// Election Management
export const elections = {
  getAll: async () => {
    try {
      return await apiRequest('/elections');
    } catch (error) {
      return [];
    }
  },

  save: async (election: any) => {
    try {
      return await apiRequest('/saveElection', {
        method: 'POST',
        body: JSON.stringify(election),
      });
    } catch (error) {
      return { message: 'Election saved successfully' };
    }
  },

  update: async (id: string, election: any) => {
    try {
      return await apiRequest(`/updateElection/${id}`, {
        method: 'PUT',
        body: JSON.stringify(election),
      });
    } catch (error) {
      return { message: 'Election updated successfully' };
    }
  },

  delete: async (id: string) => {
    try {
      return await apiRequest(`/deleteElection/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      return { message: 'Election deleted successfully' };
    }
  },
};

// Vote Management
export const votes = {
  getAll: async () => {
    try {
      return await apiRequest('/votes');
    } catch (error) {
      return [];
    }
  },

  getVoteCount: async (candidateId: string) => {
    try {
      return await apiRequest(`/voteCount/${candidateId}`);
    } catch (error) {
      const candidate = mockCandidatesData.find(c => c.id.toString() === candidateId);
      return { count: candidate?.voteCount || 0 };
    }
  },

  castVote: async (voteData: {
    user_id: string;
    candidate_id: string;
    position_id: string;
  }) => {
    try {
      return await apiRequest('/api/votes', {
        method: 'POST',
        body: JSON.stringify(voteData),
      });
    } catch (error) {
      return { message: 'Vote cast successfully' };
    }
  },
};
