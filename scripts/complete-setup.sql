-- Complete setup script for Personal Growth Dashboard
-- Run this in your Supabase SQL editor to add all missing tables and functions

-- =====================================================
-- MOTIVATION FEATURES
-- =====================================================

-- Create user_motivation_data table for storing achievements and progress
CREATE TABLE IF NOT EXISTS user_motivation_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Achievement tracking
  unlocked_achievements TEXT[] DEFAULT '{}',
  longest_streak INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  perfect_days INTEGER DEFAULT 0,
  
  -- Progress tracking
  weekly_progress NUMERIC(5,2) DEFAULT 0,
  monthly_progress NUMERIC(5,2) DEFAULT 0,
  yearly_progress NUMERIC(5,2) DEFAULT 0,
  
  -- Reminder preferences
  reminders_enabled BOOLEAN DEFAULT true,
  reminder_frequency TEXT DEFAULT 'normal' CHECK (reminder_frequency IN ('gentle', 'normal', 'persistent')),
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '07:00',
  custom_messages TEXT[] DEFAULT '{}',
  
  -- Celebration settings
  celebration_sounds BOOLEAN DEFAULT true,
  celebration_animations BOOLEAN DEFAULT true,
  
  UNIQUE(user_id)
);

-- Create trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_motivation_data_updated_at 
    BEFORE UPDATE ON user_motivation_data 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE user_motivation_data ENABLE ROW LEVEL SECURITY;

-- Create policy for user data
CREATE POLICY "Users can only access their own motivation data" ON user_motivation_data
    FOR ALL USING (auth.uid() = user_id);

-- Create achievements table for available achievements
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

-- Insert default achievements
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

-- Make achievements table readable by authenticated users
GRANT SELECT ON achievements TO authenticated;

-- Create function to get motivation summary
CREATE OR REPLACE FUNCTION get_motivation_summary()
RETURNS TABLE (
    unlocked_achievements TEXT[],
    longest_streak INTEGER,
    total_sessions INTEGER,
    perfect_days INTEGER,
    current_streak INTEGER,
    weekly_progress NUMERIC,
    monthly_progress NUMERIC,
    yearly_progress NUMERIC,
    reminder_settings JSON
) AS $$
DECLARE
    motivation_data RECORD;
    current_streak_val INTEGER;
    weekly_avg NUMERIC;
    monthly_avg NUMERIC;
    yearly_avg NUMERIC;
BEGIN
    -- Get current streak
    SELECT get_current_streak() INTO current_streak_val;
    
    -- Get motivation data
    SELECT * INTO motivation_data 
    FROM user_motivation_data 
    WHERE user_id = auth.uid();
    
    -- Calculate progress averages
    SELECT COALESCE(AVG(completion_percentage), 0) INTO weekly_avg
    FROM daily_entries 
    WHERE user_id = auth.uid() 
    AND date >= CURRENT_DATE - INTERVAL '7 days';
    
    SELECT COALESCE(AVG(completion_percentage), 0) INTO monthly_avg
    FROM daily_entries 
    WHERE user_id = auth.uid() 
    AND date >= CURRENT_DATE - INTERVAL '30 days';
    
    SELECT COALESCE(AVG(completion_percentage), 0) INTO yearly_avg
    FROM daily_entries 
    WHERE user_id = auth.uid() 
    AND date >= CURRENT_DATE - INTERVAL '365 days';
    
    -- Return data
    RETURN QUERY SELECT
        COALESCE(motivation_data.unlocked_achievements, '{}'),
        COALESCE(motivation_data.longest_streak, 0),
        COALESCE(motivation_data.total_sessions, 0),
        COALESCE(motivation_data.perfect_days, 0),
        current_streak_val,
        weekly_avg,
        monthly_avg,
        yearly_avg,
        json_build_object(
            'enabled', COALESCE(motivation_data.reminders_enabled, true),
            'frequency', COALESCE(motivation_data.reminder_frequency, 'normal'),
            'quietHours', json_build_object(
                'start', COALESCE(motivation_data.quiet_hours_start::TEXT, '22:00'),
                'end', COALESCE(motivation_data.quiet_hours_end::TEXT, '07:00')
            ),
            'customMessages', COALESCE(motivation_data.custom_messages, '{}')
        );
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- =====================================================
-- GOALS SYSTEM
-- =====================================================

-- Create goals table
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

-- Create trigger for updating updated_at on goals
CREATE TRIGGER update_goals_updated_at 
    BEFORE UPDATE ON goals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS for goals
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Create policy for goal data
CREATE POLICY "Users can only access their own goals" ON goals
    FOR ALL USING (auth.uid() = user_id);

-- Create goal milestones table
CREATE TABLE IF NOT EXISTS goal_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  title TEXT NOT NULL,
  description TEXT,
  target_value INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0
);

-- Enable RLS for milestones
ALTER TABLE goal_milestones ENABLE ROW LEVEL SECURITY;

-- Create policy for milestone data
CREATE POLICY "Users can only access their own goal milestones" ON goal_milestones
    FOR ALL USING (auth.uid() = user_id);

-- Create function to get goals summary
CREATE OR REPLACE FUNCTION get_goals_summary()
RETURNS TABLE (
    total_goals BIGINT,
    active_goals BIGINT,
    completed_goals BIGINT,
    overdue_goals BIGINT,
    avg_progress NUMERIC,
    goals_by_category JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_goals,
        COUNT(*) FILTER (WHERE status = 'active') as active_goals,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_goals,
        COUNT(*) FILTER (WHERE status = 'active' AND target_date < CURRENT_DATE) as overdue_goals,
        ROUND(AVG(progress_percentage), 1) as avg_progress,
        COALESCE(
            jsonb_object_agg(
                category, 
                jsonb_build_object(
                    'count', category_count,
                    'completed', completed_count,
                    'progress', avg_category_progress
                )
            ) FILTER (WHERE category IS NOT NULL),
            '{}'::jsonb
        ) as goals_by_category
    FROM (
        SELECT 
            category,
            COUNT(*) as category_count,
            COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
            ROUND(AVG(progress_percentage), 1) as avg_category_progress
        FROM goals 
        WHERE user_id = auth.uid()
        GROUP BY category
    ) category_stats;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Grant permissions
GRANT ALL ON user_motivation_data TO authenticated;
GRANT ALL ON goals TO authenticated;
GRANT ALL ON goal_milestones TO authenticated;
GRANT EXECUTE ON FUNCTION get_motivation_summary TO authenticated;
GRANT EXECUTE ON FUNCTION get_goals_summary TO authenticated;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_motivation_data_user_id ON user_motivation_data(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_rarity ON achievements(rarity);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_category ON goals(category);
CREATE INDEX IF NOT EXISTS idx_goals_target_date ON goals(target_date);
CREATE INDEX IF NOT EXISTS idx_goal_milestones_goal_id ON goal_milestones(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_milestones_user_id ON goal_milestones(user_id);

-- Success message
SELECT 'Setup complete! All tables and functions have been created.' as message;