-- =============================================
-- CODESTREAK DATABASE SCHEMA
-- =============================================

-- Drop existing tables if recreating
DROP TABLE IF EXISTS solved_problems CASCADE;
DROP TABLE IF EXISTS daily_activities CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- =============================================
-- 1. USER PROFILES TABLE
-- =============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  current_streak INTEGER DEFAULT 0,
  max_streak INTEGER DEFAULT 0,
  total_problems INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. SOLVED PROBLEMS TABLE
-- =============================================
CREATE TABLE solved_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  problem_id TEXT NOT NULL,
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  category TEXT NOT NULL,
  time_spent INTEGER DEFAULT 0, -- in minutes
  coins_earned INTEGER DEFAULT 0,
  solved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, problem_id)
);

-- =============================================
-- 3. DAILY ACTIVITIES TABLE
-- =============================================
CREATE TABLE daily_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  activity_date DATE NOT NULL,
  problems_solved INTEGER DEFAULT 0,
  categories TEXT[] DEFAULT ARRAY[]::TEXT[],
  time_spent INTEGER DEFAULT 0, -- total minutes spent that day
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, activity_date)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_solved_problems_user_id ON solved_problems(user_id);
CREATE INDEX idx_solved_problems_solved_at ON solved_problems(solved_at);
CREATE INDEX idx_daily_activities_user_id ON daily_activities(user_id);
CREATE INDEX idx_daily_activities_date ON daily_activities(activity_date);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE solved_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Solved Problems Policies
CREATE POLICY "Users can view own solved problems"
  ON solved_problems FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own solved problems"
  ON solved_problems FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own solved problems"
  ON solved_problems FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own solved problems"
  ON solved_problems FOR DELETE
  USING (auth.uid() = user_id);

-- Daily Activities Policies
CREATE POLICY "Users can view own daily activities"
  ON daily_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily activities"
  ON daily_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily activities"
  ON daily_activities FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily activities"
  ON daily_activities FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_activities_updated_at
  BEFORE UPDATE ON daily_activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
