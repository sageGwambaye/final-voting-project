-- Drop the results table
DROP TABLE IF EXISTS election_results;

-- Remove vote counting columns from candidates table
ALTER TABLE candidates
DROP COLUMN IF EXISTS vote_count,
DROP COLUMN IF EXISTS vote_percentage,
DROP COLUMN IF EXISTS last_vote_time; 