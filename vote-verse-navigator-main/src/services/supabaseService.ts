
/**
 * Supabase Service for University Voting System
 * 
 * This service provides functions to interact with the Supabase database.
 */

import { supabase } from '@/integrations/supabase/client';

// Authentication functions
export const auth = {
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  signUp: async (email: string, password: string, userData: {
    firstName: string;
    lastName: string;
    studentId: string;
    college: string;
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          student_id: userData.studentId,
          college: userData.college,
          role: 'voter'
        }
      }
    });

    return { data, error };
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  getCurrentUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  getUserProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return data;
  }
};

// Elections functions
export const elections = {
  getAll: async () => {
    return await supabase
      .from('elections')
      .select('*')
      .order('created_at', { ascending: false });
  },

  getCurrent: async () => {
    return await supabase
      .from('elections')
      .select('*')
      .eq('status', 'active')
      .single();
  },

  create: async (election: {
    title: string;
    description?: string;
    start_date: string;
    end_date: string;
    status?: string;
  }) => {
    return await supabase
      .from('elections')
      .insert(election);
  },

  update: async (id: string, election: Partial<{
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    status: string;
  }>) => {
    return await supabase
      .from('elections')
      .update(election)
      .eq('id', id);
  },

  delete: async (id: string) => {
    return await supabase
      .from('elections')
      .delete()
      .eq('id', id);
  }
};

// Positions functions
export const positions = {
  getAll: async () => {
    return await supabase
      .from('positions')
      .select(`
        *,
        elections (*)
      `)
      .order('created_at', { ascending: false });
  },

  getByElectionId: async (electionId: string) => {
    return await supabase
      .from('positions')
      .select(`
        *,
        elections (*)
      `)
      .eq('election_id', electionId);
  },

  getById: async (id: string) => {
    return await supabase
      .from('positions')
      .select(`
        *,
        elections (*)
      `)
      .eq('id', id)
      .single();
  },

  create: async (position: {
    title: string;
    description?: string;
    max_votes?: number;
    election_id: string;
  }) => {
    return await supabase
      .from('positions')
      .insert(position);
  },

  update: async (id: string, position: Partial<{
    title: string;
    description: string;
    max_votes: number;
    election_id: string;
  }>) => {
    return await supabase
      .from('positions')
      .update(position)
      .eq('id', id);
  },

  delete: async (id: string) => {
    return await supabase
      .from('positions')
      .delete()
      .eq('id', id);
  }
};

// Candidates functions
export const candidates = {
  getAll: async () => {
    return await supabase
      .from('candidates')
      .select(`
        *,
        positions (*, elections (*))
      `)
      .order('created_at', { ascending: false });
  },

  getByPositionId: async (positionId: string) => {
    return await supabase
      .from('candidates')
      .select(`
        *,
        positions (*, elections (*))
      `)
      .eq('position_id', positionId);
  },

  getById: async (id: string) => {
    return await supabase
      .from('candidates')
      .select(`
        *,
        positions (*, elections (*))
      `)
      .eq('id', id)
      .single();
  },

  create: async (candidate: {
    first_name: string;
    last_name: string;
    position_id: string;
    platform?: string;
    image_url?: string;
    video_url?: string;
  }) => {
    return await supabase
      .from('candidates')
      .insert(candidate);
  },

  update: async (id: string, candidate: Partial<{
    first_name: string;
    last_name: string;
    position_id: string;
    platform: string;
    image_url: string;
    video_url: string;
  }>) => {
    return await supabase
      .from('candidates')
      .update(candidate)
      .eq('id', id);
  },

  delete: async (id: string) => {
    return await supabase
      .from('candidates')
      .delete()
      .eq('id', id);
  },

  uploadImage: async (file: File, path: string) => {
    return await supabase.storage
      .from('candidate-images')
      .upload(path, file);
  }
};

// Votes functions
export const votes = {
  getResults: async () => {
    return await supabase.rpc('get_vote_results');
  },

  castVote: async (vote: {
    user_id: string;
    candidate_id: string;
    position_id: string;
  }) => {
    return await supabase
      .from('votes')
      .insert(vote);
  },

  getUserVotes: async (userId: string) => {
    return await supabase
      .from('votes')
      .select(`
        *,
        candidates (*),
        positions (*)
      `)
      .eq('user_id', userId);
  },

  hasUserVotedForPosition: async (userId: string, positionId: string) => {
    const { data, error, count } = await supabase
      .from('votes')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('position_id', positionId);

    return { data, error, hasVoted: count && count > 0 };
  }
};

// Feedback functions
export const feedback = {
  getAll: async () => {
    return await supabase
      .from('feedback')
      .select(`
        *,
        profiles (first_name, last_name)
      `)
      .order('created_at', { ascending: false });
  },

  create: async (feedback: {
    user_id: string;
    feedback_text: string;
  }) => {
    return await supabase
      .from('feedback')
      .insert(feedback);
  },

  delete: async (id: string) => {
    return await supabase
      .from('feedback')
      .delete()
      .eq('id', id);
  }
};
