// filepath: /Volumes/anshu ssd/notion/src/lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';
import { supabase, handleSupabaseError, isDemoMode } from './supabase';
import { createNotificationManager } from './notification-manager';
import type { 
  DailyEntry, 
  WeeklySummary, 
  ChartDataPoint 
} from '../../types';

// Helper to format date to YYYY-MM-DD
const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

// Demo data generator
const generateDemoData = () => {
  const today = new Date();
  const entries: DailyEntry[] = [];
  
  // Generate 30 days of demo data
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate more realistic completion data - today should be mostly incomplete
    const isToday = i === 0;
    const completion = isToday ? 0 : Math.floor(Math.random() * 101);
    const sessionCompleted = isToday ? false : Math.random() > 0.4;
    
    entries.push({
      id: `demo-${i}`,
      date: formatDate(date),
      session_1_morning: sessionCompleted && Math.random() > 0.3,
      session_2_midday: sessionCompleted && Math.random() > 0.4,
      session_3_evening: sessionCompleted && Math.random() > 0.2,
      session_4_bedtime: sessionCompleted && Math.random() > 0.5,
      emotional_state: Math.floor(Math.random() * 10) + 1,
      energy_rating: Math.floor(Math.random() * 10) + 1,
      focus_rating: Math.floor(Math.random() * 10) + 1,
      health_rating: Math.floor(Math.random() * 10) + 1,
      completion_percentage: completion,
      gratitude_entry: i === 0 ? "I'm grateful for this amazing personal growth journey and all the progress I'm making!" : null,
      daily_status: completion > 80 ? 'BEAST_MODE' : completion > 50 ? 'MAKING_PROGRESS' : 'GETTING_STARTED',
      created_at: date.toISOString(),
      updated_at: date.toISOString(),
    } as DailyEntry);
  }
  
  // Calculate realistic current streak
  let currentStreak = 0;
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].completion_percentage >= 75) {
      currentStreak++;
    } else {
      break;
    }
  }

  return {
    entries,
    currentEntry: entries[0],
    weeklySummary: {
      total_entries: 7,
      avg_completion: 75,
      perfect_days: 2,
      avg_mood: 7.5,
      total_job_apps: 14,
      total_study_hours: 25.5,
      gym_sessions: 5
    } as WeeklySummary,
    currentStreak
  };
};

interface NotificationSettings {
  discord: {
    enabled: boolean;
    webhookUrl: string;
    userMention: string;
  };
  telegram: {
    enabled: boolean;
    botToken: string;
    chatId: string;
  };
  whatsapp: {
    enabled: boolean;
    phoneNumber: string;
    businessApiKey?: string;
  };
  push: {
    enabled: boolean;
  };
}

interface MotivationState {
  // Celebration states
  showCelebration: boolean;
  celebrationType: 'streak' | 'session' | 'milestone' | 'perfect_day' | 'week_complete' | 'task' | null;
  celebrationValue: number;
  
  // Achievement data
  unlockedAchievements: string[];
  totalSessions: number;
  perfectDays: number;
  longestStreak: number;
  
  // Progress tracking
  weeklyProgress: number;
  monthlyProgress: number;
  yearlyProgress: number;
  
  // Reminder settings
  reminderSettings: {
    enabled: boolean;
    frequency: 'gentle' | 'normal' | 'persistent';
    quietHours: { start: string; end: string };
    customMessages: string[];
  };
  
  // Notification settings
  notificationSettings: NotificationSettings;
  
  // Family goal
  familyGoal: string;
}

interface StoreState {
  // Data
  currentEntry: DailyEntry | null;
  entries: DailyEntry[];
  isLoading: boolean;
  error: string | null;
  currentStreak: number;
  weeklySummary: WeeklySummary | null;
  chartData: ChartDataPoint[];
  
  // UI State
  activeSession: string | null;
  
  // Motivation State
  motivation: MotivationState;
  
  // Actions
  fetchTodayEntry: () => Promise<void>;
  updateEntry: (data: Partial<DailyEntry>) => Promise<void>;
  fetchWeeklySummary: () => Promise<void>;
  fetchCurrentStreak: () => Promise<void>;
  setActiveSession: (session: string | null) => void;
  
  // Motivation Actions
  triggerCelebration: (type: 'streak' | 'session' | 'milestone' | 'perfect_day' | 'week_complete' | 'task', value?: number) => void;
  hideCelebration: () => void;
  updateAchievements: () => void;
  updateReminderSettings: (settings: Partial<MotivationState['reminderSettings']>) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  calculateProgress: () => void;
  
  // Notification Actions
  sendDailyReminder: () => Promise<void>;
  sendAccountabilityAlert: () => Promise<void>;
  sendCelebrationNotification: (achievement: string) => Promise<void>;
}

export const useAppStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // State
      currentEntry: null,
      entries: [],
      isLoading: false,
      error: null,
      currentStreak: 0,
      weeklySummary: null,
      chartData: [],
      activeSession: null,
      
      // Motivation State
      motivation: {
        showCelebration: false,
        celebrationType: null,
        celebrationValue: 0,
        unlockedAchievements: [],
        totalSessions: 0,
        perfectDays: 0,
        longestStreak: 0,
        weeklyProgress: 0,
        monthlyProgress: 0,
        yearlyProgress: 0,
        reminderSettings: {
          enabled: true,
          frequency: 'normal',
          quietHours: { start: '22:00', end: '07:00' },
          customMessages: []
        },
        notificationSettings: {
          discord: {
            enabled: false,
            webhookUrl: '',
            userMention: ''
          },
          telegram: {
            enabled: false,
            botToken: '',
            chatId: ''
          },
          whatsapp: {
            enabled: false,
            phoneNumber: '',
            businessApiKey: ''
          },
          push: {
            enabled: true
          }
        },
        familyGoal: 'Build a better future for my family'
      },

      // Fetch today's entry from Supabase or create a new one if it doesn't exist
      fetchTodayEntry: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Use demo data if in demo mode
          if (isDemoMode) {
            const demoData = generateDemoData();
            set({ 
              currentEntry: demoData.currentEntry,
              entries: demoData.entries,
              weeklySummary: demoData.weeklySummary,
              currentStreak: demoData.currentStreak,
              chartData: demoData.entries.slice(0, 30).map((entry, index) => ({
                date: format(new Date(entry.date), 'MMM d'),
                completion: entry.completion_percentage,
                mood: entry.emotional_state ? entry.emotional_state * 10 : 0,
                energy: entry.energy_rating ? entry.energy_rating * 10 : 0,
                focus: entry.focus_rating ? entry.focus_rating * 10 : 0,
              })).reverse()
            });
            return;
          }
          
          const today = formatDate(new Date());
          
          // Check if there's an entry for today
          const { data, error } = await supabase
            .from('daily_entries')
            .select('*')
            .eq('date', today)
            .single();
          
          if (error && error.code !== 'PGRST116') { // PGRST116 = not found
            throw error;
          }
          
          if (data) {
            // Entry exists, use it
            set({ currentEntry: data as DailyEntry });
          } else {
            // No entry for today, create one
            const { data: newEntry, error: createError } = await supabase
              .from('daily_entries')
              .insert([{ date: today }])
              .select()
              .single();
            
            if (createError) throw createError;
            
            set({ currentEntry: newEntry as DailyEntry });
          }
          
          // Also fetch recent entries for history
          const { data: recentEntries, error: historyError } = await supabase
            .from('daily_entries')
            .select('*')
            .order('date', { ascending: false })
            .limit(30);
          
          if (historyError) throw historyError;
          
          set({ entries: recentEntries as DailyEntry[] });
          
          // Calculate chart data
          const chartData: ChartDataPoint[] = (recentEntries as DailyEntry[])
            .slice(0, 30)
            .map(entry => ({
              date: format(new Date(entry.date), 'MMM d'),
              completion: entry.completion_percentage,
              mood: entry.emotional_state ? entry.emotional_state * 10 : 0,
              energy: entry.energy_rating ? entry.energy_rating * 10 : 0,
              focus: entry.focus_rating ? entry.focus_rating * 10 : 0,
            }))
            .reverse();
            
          set({ chartData });
        } catch (err: any) {
          console.error('Error fetching today entry:', err);
          set({ error: handleSupabaseError(err).error });
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Update an entry in Supabase
      updateEntry: async (data: Partial<DailyEntry>) => {
        try {
          set({ isLoading: true, error: null });
          
          const currentEntry = get().currentEntry;
          if (!currentEntry || !currentEntry.id) {
            throw new Error('No current entry to update');
          }
          
          // Handle demo mode
          if (isDemoMode) {
            // In demo mode, just update local state
            const updatedEntry = { ...currentEntry, ...data } as DailyEntry;
            
            // Calculate completion percentage for demo mode
            const sessions = [
              updatedEntry.session_1_morning,
              updatedEntry.session_2_midday,
              updatedEntry.session_3_evening,
              updatedEntry.session_4_bedtime
            ];
            const completedSessions = sessions.filter(Boolean).length;
            updatedEntry.completion_percentage = (completedSessions / 4) * 100;
            
            // Update daily status
            if (completedSessions === 4) {
              updatedEntry.daily_status = '🟢 BEAST MODE';
            } else if (completedSessions > 0) {
              updatedEntry.daily_status = '🟡 IN PROGRESS';
            } else {
              updatedEntry.daily_status = '🔴 WEAKNESS ALERT';
            }
            
            set({ 
              currentEntry: updatedEntry,
              entries: get().entries.map(entry => 
                entry.id === currentEntry.id 
                  ? updatedEntry
                  : entry
              )
            });
            
            set({ isLoading: false });
            return;
          }
          
          const { error } = await supabase
            .from('daily_entries')
            .update(data)
            .eq('id', currentEntry.id);
          
          if (error) throw error;
          
          // Update local state
          set({ 
            currentEntry: { ...currentEntry, ...data } as DailyEntry,
            entries: get().entries.map(entry => 
              entry.id === currentEntry.id 
                ? { ...entry, ...data } 
                : entry
            )
          });
          
          // Refresh entry from database to get auto-calculated fields
          await get().fetchTodayEntry();
        } catch (err: any) {
          console.error('Error updating entry:', err);
          set({ error: handleSupabaseError(err).error });
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Fetch weekly summary using the database function
      fetchWeeklySummary: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Skip in demo mode - data already loaded
          if (isDemoMode) {
            return;
          }
          
          const { data, error } = await supabase
            .rpc('get_weekly_summary');
          
          if (error) throw error;
          
          set({ weeklySummary: data[0] as WeeklySummary });
        } catch (err: any) {
          console.error('Error fetching weekly summary:', err);
          set({ error: handleSupabaseError(err).error });
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Fetch current streak using the database function
      fetchCurrentStreak: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Skip in demo mode - data already loaded
          if (isDemoMode) {
            return;
          }
          
          const { data, error } = await supabase
            .rpc('get_current_streak');
          
          if (error) throw error;
          
          set({ currentStreak: data as number });
        } catch (err: any) {
          console.error('Error fetching streak:', err);
          set({ error: handleSupabaseError(err).error });
        } finally {
          set({ isLoading: false });
        }
      },
      
      // UI Actions
      setActiveSession: (session) => set({ activeSession: session }),
      
      // Motivation Actions
      triggerCelebration: (type, value = 0) => {
        set(state => ({
          motivation: {
            ...state.motivation,
            showCelebration: true,
            celebrationType: type,
            celebrationValue: value
          }
        }));
      },
      
      hideCelebration: () => {
        set(state => ({
          motivation: {
            ...state.motivation,
            showCelebration: false,
            celebrationType: null,
            celebrationValue: 0
          }
        }));
      },
      
      updateAchievements: async () => {
        try {
          if (isDemoMode) {
            // Demo mode - use local calculation
            const state = get();
            const { currentStreak, entries, motivation } = state;
            
            const totalSessions = entries.reduce((sum, entry) => {
              return sum + (entry.session_1_morning ? 1 : 0) +
                         (entry.session_2_midday ? 1 : 0) +
                         (entry.session_3_evening ? 1 : 0) +
                         (entry.session_4_bedtime ? 1 : 0);
            }, 0);
            
            const perfectDays = entries.filter(entry => entry.completion_percentage === 100).length;
            const longestStreak = Math.max(motivation.longestStreak, currentStreak);
            
            set(state => ({
              motivation: {
                ...state.motivation,
                totalSessions,
                perfectDays,
                longestStreak
              }
            }));
            return;
          }
          
          // Real Supabase integration
          const { data, error } = await supabase.rpc('get_motivation_summary');
          
          if (error) throw error;
          
          if (data && data.length > 0) {
            const motivationData = data[0];
            set(state => ({
              motivation: {
                ...state.motivation,
                unlockedAchievements: motivationData.unlocked_achievements || [],
                totalSessions: motivationData.total_sessions || 0,
                perfectDays: motivationData.perfect_days || 0,
                longestStreak: motivationData.longest_streak || 0,
                weeklyProgress: motivationData.weekly_progress || 0,
                monthlyProgress: motivationData.monthly_progress || 0,
                yearlyProgress: motivationData.yearly_progress || 0,
                reminderSettings: motivationData.reminder_settings || state.motivation.reminderSettings
              }
            }));
          }
        } catch (err: any) {
          console.error('Error updating achievements:', err);
        }
      },
      
      updateReminderSettings: async (settings) => {
        try {
          set(state => ({
            motivation: {
              ...state.motivation,
              reminderSettings: {
                ...state.motivation.reminderSettings,
                ...settings
              }
            }
          }));
          
          if (!isDemoMode) {
            // Sync with Supabase
            const { error } = await supabase.rpc('update_reminder_settings', {
              enabled: settings.enabled,
              frequency: settings.frequency,
              quiet_start: settings.quietHours?.start,
              quiet_end: settings.quietHours?.end,
              custom_msgs: settings.customMessages
            });
            
            if (error) throw error;
          }
        } catch (err: any) {
          console.error('Error updating reminder settings:', err);
        }
      },

      updateNotificationSettings: (settings) => {
        set(state => ({
          motivation: {
            ...state.motivation,
            notificationSettings: {
              ...state.motivation.notificationSettings,
              ...settings,
              discord: { ...state.motivation.notificationSettings.discord, ...settings.discord },
              telegram: { ...state.motivation.notificationSettings.telegram, ...settings.telegram },
              whatsapp: { ...state.motivation.notificationSettings.whatsapp, ...settings.whatsapp },
              push: { ...state.motivation.notificationSettings.push, ...settings.push },
            }
          }
        }));
      },

      sendDailyReminder: async () => {
        const { motivation, currentEntry, currentStreak } = get();
        const notificationManager = createNotificationManager(motivation.notificationSettings);
        const progress = {
          completedTasks: currentEntry?.completion_percentage ? Math.round(currentEntry.completion_percentage / 25) : 0,
          totalTasks: 4,
          currentStreak: currentStreak,
          goalProgress: motivation.weeklyProgress,
          daysRemaining: 90,
          missedDays: 0,
          familyGoal: motivation.familyGoal,
          userName: 'User',
        };
        await notificationManager.sendDailyReminder(progress);
      },

      sendAccountabilityAlert: async () => {
        const { motivation, currentEntry, currentStreak } = get();
        const notificationManager = createNotificationManager(motivation.notificationSettings);
        const progress = {
          completedTasks: currentEntry?.completion_percentage ? Math.round(currentEntry.completion_percentage / 25) : 0,
          totalTasks: 4,
          currentStreak: currentStreak,
          goalProgress: motivation.weeklyProgress,
          daysRemaining: 90,
          missedDays: 3,
          familyGoal: motivation.familyGoal,
          userName: 'User',
        };
        await notificationManager.sendAccountabilityAlert(progress);
      },

      sendCelebrationNotification: async (achievement: string) => {
        const { motivation, currentStreak } = get();
        const notificationManager = createNotificationManager(motivation.notificationSettings);
        const progress = {
          completedTasks: 4,
          totalTasks: 4,
          currentStreak: currentStreak,
          goalProgress: 100,
          daysRemaining: 0,
          missedDays: 0,
          familyGoal: motivation.familyGoal,
          userName: 'User',
        };
        await notificationManager.sendCelebration(achievement, progress);
      },
      
      calculateProgress: () => {
        const state = get();
        const { entries } = state;
        
        if (entries.length === 0) return;
        
        const now = new Date();
        const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const yearStart = new Date(now.getFullYear(), 0, 1);
        
        const weekEntries = entries.filter(entry => new Date(entry.date) >= weekStart);
        const monthEntries = entries.filter(entry => new Date(entry.date) >= monthStart);
        const yearEntries = entries.filter(entry => new Date(entry.date) >= yearStart);
        
        const weeklyProgress = weekEntries.length > 0 ? 
          weekEntries.reduce((sum, entry) => sum + entry.completion_percentage, 0) / weekEntries.length : 0;
        const monthlyProgress = monthEntries.length > 0 ? 
          monthEntries.reduce((sum, entry) => sum + entry.completion_percentage, 0) / monthEntries.length : 0;
        const yearlyProgress = yearEntries.length > 0 ? 
          yearEntries.reduce((sum, entry) => sum + entry.completion_percentage, 0) / yearEntries.length : 0;
        
        set(state => ({
          motivation: {
            ...state.motivation,
            weeklyProgress,
            monthlyProgress,
            yearlyProgress
          }
        }));
      },
    }),
    {
      name: 'growth-dashboard-storage',
      partialize: (state) => ({
        // Only persist UI state and motivation settings
        activeSession: state.activeSession,
        motivation: {
          unlockedAchievements: state.motivation.unlockedAchievements,
          longestStreak: state.motivation.longestStreak,
          reminderSettings: state.motivation.reminderSettings,
        },
      }),
    }
  )
);
