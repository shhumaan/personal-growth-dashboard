-- Create user_settings table for storing app settings
CREATE TABLE user_settings (
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

-- Create trigger for updating updated_at
CREATE TRIGGER update_user_settings_updated_at 
    BEFORE UPDATE ON user_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for user data
CREATE POLICY "Users can only access their own settings" ON user_settings
    FOR ALL USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON user_settings TO authenticated;

-- Create indexes for performance
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);