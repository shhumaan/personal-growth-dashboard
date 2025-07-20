-- Create goals table
CREATE TABLE goals (
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

-- Create trigger for updating updated_at
CREATE TRIGGER update_goals_updated_at 
    BEFORE UPDATE ON goals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Create policy for user data
CREATE POLICY "Users can only access their own goals" ON goals
    FOR ALL USING (auth.uid() = user_id);

-- Create goal milestones table for tracking sub-goals
CREATE TABLE goal_milestones (
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

-- Create function to update goal progress
CREATE OR REPLACE FUNCTION update_goal_progress(
    goal_id_param UUID,
    progress_increment INTEGER
)
RETURNS VOID AS $$
BEGIN
    UPDATE goals 
    SET 
        current_value = current_value + progress_increment,
        updated_at = timezone('utc'::text, now()),
        completed_at = CASE 
            WHEN (current_value + progress_increment) >= target_value AND status != 'completed'
            THEN timezone('utc'::text, now())
            ELSE completed_at
        END,
        status = CASE 
            WHEN (current_value + progress_increment) >= target_value AND status != 'completed'
            THEN 'completed'
            ELSE status
        END
    WHERE id = goal_id_param AND user_id = auth.uid();
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Grant permissions
GRANT ALL ON goals TO authenticated;
GRANT ALL ON goal_milestones TO authenticated;
GRANT EXECUTE ON FUNCTION get_goals_summary TO authenticated;
GRANT EXECUTE ON FUNCTION update_goal_progress TO authenticated;

-- Create indexes for performance
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_goals_category ON goals(category);
CREATE INDEX idx_goals_target_date ON goals(target_date);
CREATE INDEX idx_goal_milestones_goal_id ON goal_milestones(goal_id);
CREATE INDEX idx_goal_milestones_user_id ON goal_milestones(user_id);

-- Insert some sample goals for demonstration
INSERT INTO goals (title, description, category, target_value, target_date, track_daily) VALUES
('Complete 30 workout sessions', 'Establish a consistent fitness routine', 'health', 30, CURRENT_DATE + INTERVAL '90 days', true),
('Read 12 books this year', 'Expand knowledge and reading habit', 'learning', 12, CURRENT_DATE + INTERVAL '365 days', false),
('Save $5000 for emergency fund', 'Build financial security', 'financial', 5000, CURRENT_DATE + INTERVAL '180 days', false),
('Learn React and Next.js', 'Improve web development skills', 'career', 1, CURRENT_DATE + INTERVAL '120 days', true),
('Meditate for 100 days', 'Develop mindfulness practice', 'personal', 100, CURRENT_DATE + INTERVAL '100 days', true);