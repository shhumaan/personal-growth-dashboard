-- Create daily_entries table
CREATE TABLE daily_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Basic Info
  date DATE NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
  
  -- Session Completion
  session_1_morning BOOLEAN DEFAULT false,
  session_2_midday BOOLEAN DEFAULT false,
  session_3_evening BOOLEAN DEFAULT false,
  session_4_bedtime BOOLEAN DEFAULT false,
  
  -- Time Tracking
  wakeup_time TIME,
  sleep_time TIME,
  
  -- Ratings (1-10)
  focus_rating INTEGER CHECK (focus_rating >= 1 AND focus_rating <= 10),
  energy_rating INTEGER CHECK (energy_rating >= 1 AND energy_rating <= 10),
  health_rating INTEGER CHECK (health_rating >= 1 AND health_rating <= 10),
  emotional_state INTEGER CHECK (emotional_state >= 1 AND emotional_state <= 10),
  
  -- Health & Habits
  burnout_level TEXT CHECK (burnout_level IN ('Low', 'Medium', 'High')),
  anger_frequency TEXT CHECK (anger_frequency IN ('None', '1x', '2x', 'Often')),
  mood_swings TEXT CHECK (mood_swings IN ('None', 'Mild', 'Strong')),
  money_stress_level TEXT CHECK (money_stress_level IN ('None', 'Moderate', 'High')),
  
  -- Progress Tracking
  job_applications INTEGER DEFAULT 0,
  study_hours DECIMAL(4,2) DEFAULT 0,
  gym BOOLEAN DEFAULT false,
  
  -- Notes
  gratitude_entry TEXT,
  notes_morning TEXT,
  notes_midday TEXT,
  notes_evening TEXT,
  notes_bedtime TEXT,
  
  -- Auto-calculated fields
  completion_percentage INTEGER GENERATED ALWAYS AS (
    (CASE WHEN session_1_morning THEN 25 ELSE 0 END +
     CASE WHEN session_2_midday THEN 25 ELSE 0 END +
     CASE WHEN session_3_evening THEN 25 ELSE 0 END +
     CASE WHEN session_4_bedtime THEN 25 ELSE 0 END)
  ) STORED,
  
  daily_status TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN (session_1_morning AND session_2_midday AND session_3_evening AND session_4_bedtime) 
      THEN '🟢 BEAST MODE'
      WHEN (session_1_morning OR session_2_midday OR session_3_evening OR session_4_bedtime) 
      THEN '🟡 IN PROGRESS'
      ELSE '🔴 WEAKNESS ALERT'
    END
  ) STORED
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at column
CREATE TRIGGER update_daily_entries_updated_at 
    BEFORE UPDATE ON daily_entries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only see their own data
CREATE POLICY "Users can only see their own entries" ON daily_entries
    FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_daily_entries_date ON daily_entries(date DESC);
CREATE INDEX idx_daily_entries_user_id ON daily_entries(user_id);
CREATE INDEX idx_daily_entries_completion ON daily_entries(completion_percentage DESC);
CREATE INDEX idx_daily_entries_status ON daily_entries(daily_status);
CREATE INDEX idx_daily_entries_created_at ON daily_entries(created_at DESC);

-- Create a view for analytics
CREATE VIEW daily_stats AS
SELECT 
  date,
  completion_percentage,
  daily_status,
  emotional_state,
  energy_rating,
  health_rating,
  focus_rating,
  job_applications,
  study_hours,
  gym,
  burnout_level,
  anger_frequency,
  mood_swings,
  money_stress_level
FROM daily_entries
WHERE user_id = auth.uid()
ORDER BY date DESC;

-- Create a function to get weekly summary
CREATE OR REPLACE FUNCTION get_weekly_summary(start_date DATE DEFAULT CURRENT_DATE - INTERVAL '7 days')
RETURNS TABLE (
  total_entries BIGINT,
  avg_completion NUMERIC,
  perfect_days BIGINT,
  avg_mood NUMERIC,
  total_job_apps BIGINT,
  total_study_hours NUMERIC,
  gym_sessions BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_entries,
    ROUND(AVG(completion_percentage), 1) as avg_completion,
    COUNT(*) FILTER (WHERE completion_percentage = 100) as perfect_days,
    ROUND(AVG(emotional_state), 1) as avg_mood,
    SUM(job_applications) as total_job_apps,
    SUM(study_hours) as total_study_hours,
    COUNT(*) FILTER (WHERE gym = true) as gym_sessions
  FROM daily_entries 
  WHERE date >= start_date 
    AND user_id = auth.uid();
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create function to get streak count
CREATE OR REPLACE FUNCTION get_current_streak()
RETURNS INTEGER AS $$
DECLARE
  streak_count INTEGER := 0;
  check_date DATE := CURRENT_DATE;
BEGIN
  -- Count consecutive days with 100% completion
  LOOP
    IF EXISTS (
      SELECT 1 FROM daily_entries 
      WHERE date = check_date 
        AND completion_percentage = 100 
        AND user_id = auth.uid()
    ) THEN
      streak_count := streak_count + 1;
      check_date := check_date - INTERVAL '1 day';
    ELSE
      EXIT;
    END IF;
  END LOOP;
  
  RETURN streak_count;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON daily_entries TO authenticated;
GRANT SELECT ON daily_stats TO authenticated;
GRANT EXECUTE ON FUNCTION get_weekly_summary TO authenticated;
GRANT EXECUTE ON FUNCTION get_current_streak TO authenticated; 