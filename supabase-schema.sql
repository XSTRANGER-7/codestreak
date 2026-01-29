-- Create user_stats table to store user data
CREATE TABLE IF NOT EXISTS user_stats (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  max_streak INTEGER DEFAULT 0,
  total_problems INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 0,
  last_active_date TEXT DEFAULT '',
  problems_by_category JSONB DEFAULT '{"algorithms": 0, "dataStructures": 0, "systemDesign": 0, "databases": 0}'::jsonb,
  problems_by_difficulty JSONB DEFAULT '{"easy": 0, "medium": 0, "hard": 0}'::jsonb,
  daily_activities JSONB DEFAULT '[]'::jsonb,
  solved_problems JSONB DEFAULT '[]'::jsonb,
  streak_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);

-- Enable Row Level Security
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for user_stats
-- Users can only read their own data
CREATE POLICY "Users can view their own stats"
  ON user_stats
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "Users can insert their own stats"
  ON user_stats
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "Users can update their own stats"
  ON user_stats
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "Users can delete their own stats"
  ON user_stats
  FOR DELETE
  USING (auth.uid() = user_id);
