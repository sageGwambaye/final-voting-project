
/**
 * Database Schema for University Voting System
 * 
 * This file defines the database schema for the Supabase integration.
 * Use this as a reference when setting up your database tables.
 */

export interface DbUser {
  id: string;          // UUID from auth.users
  email: string;       // User's email
  firstName: string;   // User's first name
  lastName: string;    // User's last name
  studentId: string;   // Student ID
  college: string;     // College/Faculty
  createdAt: string;   // Registration timestamp
  role: 'voter' | 'admin'; // User role
  voiceVerified: boolean; // Flag for voice verification status
}

export interface DbPosition {
  id: string;          // UUID
  title: string;       // Position title
  description: string; // Position description
  maxVotes: number;    // Maximum votes allowed
  createdAt: string;   // Creation timestamp
}

export interface DbCandidate {
  id: string;          // UUID
  firstName: string;   // Candidate's first name
  lastName: string;    // Candidate's last name
  positionId: string;  // Reference to position
  platform: string;    // Campaign platform
  imageUrl: string;    // Photo URL
  videoUrl: string;    // Campaign video URL
  createdAt: string;   // Creation timestamp
}

export interface DbVote {
  id: string;          // UUID
  userId: string;      // Reference to user
  candidateId: string; // Reference to candidate
  positionId: string;  // Reference to position
  createdAt: string;   // Vote timestamp
}

export interface DbFeedback {
  id: string;          // UUID
  userId: string;      // Reference to user
  feedbackText: string; // Feedback content
  createdAt: string;   // Feedback timestamp
}

export interface DbElection {
  id: string;          // UUID
  title: string;       // Election title
  description: string; // Election description
  startDate: string;   // Start date
  endDate: string;     // End date
  status: 'draft' | 'active' | 'completed'; // Election status
  createdAt: string;   // Creation timestamp
}

/**
 * SQL Statements to create tables in Supabase
 * 
 * Copy and paste these into the Supabase SQL editor
 * to create your database tables.
 */

export const createTablesSql = `
-- Users table (extends auth.users)
create table public.profiles (
  id uuid references auth.users primary key,
  email text not null,
  first_name text not null,
  last_name text not null,
  student_id text unique not null,
  college text not null,
  created_at timestamp with time zone default now(),
  role text not null check (role in ('voter', 'admin')),
  voice_verified boolean default false
);

-- Positions table
create table public.positions (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  max_votes integer not null default 1,
  created_at timestamp with time zone default now()
);

-- Candidates table
create table public.candidates (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  position_id uuid references public.positions not null,
  platform text,
  image_url text,
  video_url text,
  created_at timestamp with time zone default now()
);

-- Votes table
create table public.votes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  candidate_id uuid references public.candidates not null,
  position_id uuid references public.positions not null,
  created_at timestamp with time zone default now(),
  unique(user_id, position_id)  -- Ensures one vote per position per user
);

-- Feedback table
create table public.feedback (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  feedback_text text not null,
  created_at timestamp with time zone default now()
);

-- Elections table
create table public.elections (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  status text not null check (status in ('draft', 'active', 'completed')),
  created_at timestamp with time zone default now()
);

-- Add RLS policies
-- Example: Allow only the user or admin to see their own profile
alter table public.profiles enable row level security;
create policy "Users can view own profile" 
  on profiles for select 
  using ( auth.uid() = id or exists(select 1 from profiles where id = auth.uid() and role = 'admin') );

-- Example: Allow authenticated users to create a vote
alter table public.votes enable row level security;
create policy "Authenticated users can vote"
  on votes for insert
  with check (auth.uid() = user_id);
`;
