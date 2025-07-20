'use client';

import { supabase } from './supabase';

export interface LocalStorageCustomGoal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category: string;
}

export interface LocalStorageCustomAchievement {
  id: string;
  title: string;
  description: string;
  requirement: number;
  icon: string;
  color: string;
  category: string;
}

export interface GoalTimerSettings {
  goalTitle: string;
  familyGoal: string;
  userName: string;
  sprintStartDate: string;
  sprintDuration: number;
  reminderTimes: {
    morning: string;
    midday: string;
    evening: string;
    bedtime: string;
  };
  weeklyReviewDay: 'sunday' | 'saturday' | 'custom';
  customReviewTime: string;
  motivationLevel: 'gentle' | 'firm' | 'intense' | 'brutal';
}

export const migrateLocalStorageToDatabase = async () => {
  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.log('User not authenticated, skipping migration');
      return false;
    }

    console.log('Starting migration from localStorage to database...');

    // 1. Migrate Custom Goals
    const customGoalsStr = localStorage.getItem('customGoals');
    if (customGoalsStr) {
      try {
        const customGoals: LocalStorageCustomGoal[] = JSON.parse(customGoalsStr);
        
        for (const goal of customGoals) {
          // Check if goal already exists
          const { data: existingGoal } = await supabase
            .from('goals')
            .select('id')
            .eq('title', goal.title)
            .single();

          if (!existingGoal) {
            const { error: goalError } = await supabase
              .from('goals')
              .insert({
                title: goal.title,
                description: goal.description,
                category: goal.category as 'personal' | 'career' | 'health' | 'learning' | 'financial' | 'relationships',
                target_value: goal.targetValue,
                current_value: goal.currentValue,
                status: goal.currentValue >= goal.targetValue ? 'completed' : 'active',
                track_daily: true
              });

            if (goalError) {
              console.error('Error migrating goal:', goalError);
            } else {
              console.log('Migrated goal:', goal.title);
            }
          }
        }
      } catch (error) {
        console.error('Error parsing custom goals:', error);
      }
    }

    // 2. Migrate Custom Achievements to a settings table
    const customAchievementsStr = localStorage.getItem('customAchievements');
    if (customAchievementsStr) {
      try {
        const customAchievements: LocalStorageCustomAchievement[] = JSON.parse(customAchievementsStr);
        
        // Store custom achievements in user settings or create a separate table
        const { error: settingsError } = await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            custom_achievements: customAchievements,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (settingsError) {
          console.error('Error migrating custom achievements:', settingsError);
        } else {
          console.log('Migrated custom achievements');
        }
      } catch (error) {
        console.error('Error parsing custom achievements:', error);
      }
    }

    // 3. Migrate Goal Timer Settings
    const goalTimerSettingsStr = localStorage.getItem('goalTimerSettings');
    if (goalTimerSettingsStr) {
      try {
        const settings: GoalTimerSettings = JSON.parse(goalTimerSettingsStr);
        
        const { error: settingsError } = await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            goal_timer_settings: settings,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (settingsError) {
          console.error('Error migrating goal timer settings:', settingsError);
        } else {
          console.log('Migrated goal timer settings');
        }
      } catch (error) {
        console.error('Error parsing goal timer settings:', error);
      }
    }

    // 4. Migrate Email Settings
    const emailSettingsStr = localStorage.getItem('emailSettings');
    if (emailSettingsStr) {
      try {
        const emailSettings = JSON.parse(emailSettingsStr);
        
        const { error: settingsError } = await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            email_settings: emailSettings,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (settingsError) {
          console.error('Error migrating email settings:', settingsError);
        } else {
          console.log('Migrated email settings');
        }
      } catch (error) {
        console.error('Error parsing email settings:', error);
      }
    }

    console.log('Migration completed successfully!');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
};

export const loadSettingsFromDatabase = async () => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.log('User not authenticated, using localStorage');
      return null;
    }

    // Load user settings from database
    const { data: settings, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error loading settings from database:', error);
      return null;
    }

    // Load goals from database
    const { data: goals, error: goalsError } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id);

    if (goalsError) {
      console.error('Error loading goals from database:', goalsError);
    }

    return {
      settings: settings || {},
      goals: goals || []
    };
  } catch (error) {
    console.error('Error loading from database:', error);
    return null;
  }
};