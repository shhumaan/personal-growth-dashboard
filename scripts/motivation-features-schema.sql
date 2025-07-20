-- Add motivation features to existing schema

-- Create user_motivation_data table for storing achievements and progress
CREATE TABLE user_motivation_data (
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
CREATE TABLE achievements (
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
('zen-master', 'Zen Master', 'Maintain 9+ average mood and energy', 'mood', 'epic', 9, 'Brain', 'text-indigo-600');

-- Make achievements table readable by authenticated users
GRANT SELECT ON achievements TO authenticated;

-- Create function to update motivation data
CREATE OR REPLACE FUNCTION update_motivation_data()
RETURNS TRIGGER AS $$
DECLARE
    user_motivation_record RECORD;
    current_streak_count INTEGER;
    total_sessions_count INTEGER;
    perfect_days_count INTEGER;
    avg_mood NUMERIC;
    avg_energy NUMERIC;
    new_achievements TEXT[] := '{}';
BEGIN
    -- Get current motivation data or create if doesn't exist
    SELECT * INTO user_motivation_record 
    FROM user_motivation_data 
    WHERE user_id = NEW.user_id;
    
    IF user_motivation_record IS NULL THEN
        INSERT INTO user_motivation_data (user_id) VALUES (NEW.user_id);
        SELECT * INTO user_motivation_record 
        FROM user_motivation_data 
        WHERE user_id = NEW.user_id;
    END IF;
    
    -- Calculate current streak
    SELECT get_current_streak() INTO current_streak_count;
    
    -- Calculate total sessions
    SELECT 
        COALESCE(SUM(
            (CASE WHEN session_1_morning THEN 1 ELSE 0 END) +
            (CASE WHEN session_2_midday THEN 1 ELSE 0 END) +
            (CASE WHEN session_3_evening THEN 1 ELSE 0 END) +
            (CASE WHEN session_4_bedtime THEN 1 ELSE 0 END)
        ), 0) INTO total_sessions_count
    FROM daily_entries 
    WHERE user_id = NEW.user_id;
    
    -- Calculate perfect days
    SELECT COUNT(*) INTO perfect_days_count
    FROM daily_entries 
    WHERE user_id = NEW.user_id AND completion_percentage = 100;
    
    -- Calculate averages
    SELECT 
        COALESCE(AVG(emotional_state), 0),
        COALESCE(AVG(energy_rating), 0)
    INTO avg_mood, avg_energy
    FROM daily_entries 
    WHERE user_id = NEW.user_id 
    AND emotional_state IS NOT NULL 
    AND energy_rating IS NOT NULL;
    
    -- Check for new achievements
    new_achievements := user_motivation_record.unlocked_achievements;
    
    -- Streak achievements
    IF current_streak_count >= 1 AND NOT 'first-day' = ANY(new_achievements) THEN
        new_achievements := array_append(new_achievements, 'first-day');
    END IF;
    IF current_streak_count >= 7 AND NOT 'week-warrior' = ANY(new_achievements) THEN
        new_achievements := array_append(new_achievements, 'week-warrior');
    END IF;
    IF current_streak_count >= 30 AND NOT 'month-master' = ANY(new_achievements) THEN
        new_achievements := array_append(new_achievements, 'month-master');
    END IF;
    IF current_streak_count >= 100 AND NOT 'century-club' = ANY(new_achievements) THEN
        new_achievements := array_append(new_achievements, 'century-club');
    END IF;
    IF current_streak_count >= 365 AND NOT 'year-champion' = ANY(new_achievements) THEN
        new_achievements := array_append(new_achievements, 'year-champion');
    END IF;
    
    -- Session achievements
    IF total_sessions_count >= 10 AND NOT 'session-starter' = ANY(new_achievements) THEN
        new_achievements := array_append(new_achievements, 'session-starter');
    END IF;
    IF total_sessions_count >= 100 AND NOT 'session-pro' = ANY(new_achievements) THEN
        new_achievements := array_append(new_achievements, 'session-pro');
    END IF;
    IF total_sessions_count >= 500 AND NOT 'session-master' = ANY(new_achievements) THEN
        new_achievements := array_append(new_achievements, 'session-master');
    END IF;
    
    -- Consistency achievements
    IF perfect_days_count >= 10 AND NOT 'perfectionist' = ANY(new_achievements) THEN
        new_achievements := array_append(new_achievements, 'perfectionist');
    END IF;
    
    -- Mood achievements
    IF avg_mood >= 7 AND NOT 'positive-vibes' = ANY(new_achievements) THEN
        new_achievements := array_append(new_achievements, 'positive-vibes');
    END IF;
    IF avg_energy >= 8 AND NOT 'energy-master' = ANY(new_achievements) THEN
        new_achievements := array_append(new_achievements, 'energy-master');
    END IF;
    IF avg_mood >= 9 AND avg_energy >= 9 AND NOT 'zen-master' = ANY(new_achievements) THEN
        new_achievements := array_append(new_achievements, 'zen-master');
    END IF;
    
    -- Update motivation data
    UPDATE user_motivation_data SET
        longest_streak = GREATEST(longest_streak, current_streak_count),
        total_sessions = total_sessions_count,
        perfect_days = perfect_days_count,
        unlocked_achievements = new_achievements,
        updated_at = timezone('utc'::text, now())
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create trigger to update motivation data when daily entries change
CREATE TRIGGER update_motivation_trigger
    AFTER INSERT OR UPDATE ON daily_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_motivation_data();

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

-- Create function to update reminder settings
CREATE OR REPLACE FUNCTION update_reminder_settings(
    enabled BOOLEAN DEFAULT NULL,
    frequency TEXT DEFAULT NULL,
    quiet_start TIME DEFAULT NULL,
    quiet_end TIME DEFAULT NULL,
    custom_msgs TEXT[] DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO user_motivation_data (user_id) 
    VALUES (auth.uid()) 
    ON CONFLICT (user_id) DO NOTHING;
    
    UPDATE user_motivation_data SET
        reminders_enabled = COALESCE(enabled, reminders_enabled),
        reminder_frequency = COALESCE(frequency, reminder_frequency),
        quiet_hours_start = COALESCE(quiet_start, quiet_hours_start),
        quiet_hours_end = COALESCE(quiet_end, quiet_hours_end),
        custom_messages = COALESCE(custom_msgs, custom_messages),
        updated_at = timezone('utc'::text, now())
    WHERE user_id = auth.uid();
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Grant permissions
GRANT ALL ON user_motivation_data TO authenticated;
GRANT EXECUTE ON FUNCTION get_motivation_summary TO authenticated;
GRANT EXECUTE ON FUNCTION update_reminder_settings TO authenticated;

-- Create indexes for performance
CREATE INDEX idx_user_motivation_data_user_id ON user_motivation_data(user_id);
CREATE INDEX idx_achievements_category ON achievements(category);
CREATE INDEX idx_achievements_rarity ON achievements(rarity);