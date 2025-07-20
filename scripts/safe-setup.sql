-- Safe setup script for Personal Growth Dashboard
-- This version handles existing tables and triggers properly

-- =====================================================
-- HELPER FUNCTION TO DROP TRIGGER IF EXISTS
-- =====================================================
CREATE OR REPLACE FUNCTION drop_trigger_if_exists(trigger_name text, table_name text)
RETURNS void AS $$
BEGIN
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', trigger_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CREATE MISSING TABLES ONLY
-- =====================================================

-- Create update function first
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create user_settings table (this is the new one we need)
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Goal Timer Settings
  goal_timer_settings JSONB DEFAULT '{}'::jsonb,
  
  -- Email Settings
  email_settings JSONB DEFAULT '{}'::jsonb,
  
  -- Custom Achievements
  custom_achievements JSONB DEFAULT '[]'::jsonb,
  
  -- Personal Information
  personal_info JSONB DEFAULT '{}'::jsonb,
  
  -- Motivational Features Settings
  motivational_features JSONB DEFAULT '{}'::jsonb,
  
  -- Notification Settings
  notification_settings JSONB DEFAULT '{}'::jsonb,
  
  UNIQUE(user_id)
);

-- Create goals table if it doesn't exist
CREATE TABLE IF NOT EXISTS goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('personal', 'career', 'health', 'learning', 'financial', 'relationships')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  
  -- Target metrics
  target_value INTEGER,
  current_value INTEGER DEFAULT 0,
  target_date DATE,
  
  -- Progress tracking
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN target_value IS NULL OR target_value = 0 THEN 
        CASE WHEN status = 'completed' THEN 100 ELSE 0 END
      ELSE 
        LEAST(ROUND((current_value::NUMERIC / target_value::NUMERIC) * 100), 100)
    END
  ) STORED,
  
  -- Tracking settings
  track_daily BOOLEAN DEFAULT false,
  track_weekly BOOLEAN DEFAULT false,
  track_monthly BOOLEAN DEFAULT false,
  
  -- Milestones
  milestones JSONB DEFAULT '[]'::jsonb
);

-- Create achievements table if it doesn't exist
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('streak', 'sessions', 'consistency', 'milestones', 'mood', 'special')),
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  requirement_value INTEGER NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- SETUP TRIGGERS SAFELY
-- =====================================================

-- Drop and recreate triggers to avoid conflicts
SELECT drop_trigger_if_exists('update_user_settings_updated_at', 'user_settings');
SELECT drop_trigger_if_exists('update_goals_updated_at', 'goals');

-- Create triggers
CREATE TRIGGER update_user_settings_updated_at 
    BEFORE UPDATE ON user_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at 
    BEFORE UPDATE ON goals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SETUP SECURITY POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can only access their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can only access their own goals" ON goals;

-- Create policies
CREATE POLICY "Users can only access their own settings" ON user_settings
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own goals" ON goals
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- INSERT DEFAULT ACHIEVEMENTS
-- =====================================================

INSERT INTO achievements (id, title, description, category, rarity, requirement_value, icon, color) VALUES
('first-day', 'First Step', 'Complete your first day', 'streak', 'common', 1, 'Target', 'text-blue-600'),
('week-warrior', 'Week Warrior', '7 days in a row', 'streak', 'common', 7, 'Calendar', 'text-green-600'),
('month-master', 'Month Master', '30 days in a row', 'streak', 'rare', 30, 'Flame', 'text-orange-600'),
('century-club', 'Century Club', '100 days in a row', 'streak', 'epic', 100, 'Trophy', 'text-purple-600'),
('year-champion', 'Year Champion', '365 days in a row', 'streak', 'legendary', 365, 'Crown', 'text-yellow-600'),
('session-starter', 'Session Starter', 'Complete 10 sessions', 'sessions', 'common', 10, 'Zap', 'text-blue-600'),
('session-pro', 'Session Pro', 'Complete 100 sessions', 'sessions', 'rare', 100, 'Star', 'text-green-600'),
('session-master', 'Session Master', 'Complete 500 sessions', 'sessions', 'epic', 500, 'Award', 'text-purple-600'),
('perfectionist', 'Perfectionist', '10 perfect days (100% completion)', 'consistency', 'rare', 10, 'Star', 'text-yellow-600'),
('dedicated', 'Dedicated', '50 days completed', 'consistency', 'rare', 50, 'Heart', 'text-red-600'),
('positive-vibes', 'Positive Vibes', 'Maintain 7+ average mood', 'mood', 'rare', 7, 'Heart', 'text-pink-600'),
('energy-master', 'Energy Master', 'Maintain 8+ average energy', 'mood', 'rare', 8, 'Zap', 'text-orange-600'),
('zen-master', 'Zen Master', 'Maintain 9+ average mood and energy', 'mood', 'epic', 9, 'Brain', 'text-indigo-600')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT ALL ON user_settings TO authenticated;
GRANT ALL ON goals TO authenticated;
GRANT SELECT ON achievements TO authenticated;

-- =====================================================
-- CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_category ON goals(category);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);

-- =====================================================
-- CLEANUP
-- =====================================================

DROP FUNCTION drop_trigger_if_exists(text, text);

-- Success message
SELECT 'Safe setup complete! All missing tables have been created.' as message;