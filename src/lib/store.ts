// filepath: /Volumes/anshu ssd/notion/src/lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';
import { supabase, handleSupabaseError } from './supabase';
import type { 
  DailyEntry, 
  WeeklySummary, 
  ChartDataPoint 
} from '../../types';

// Helper to format date to YYYY-MM-DD
const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

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
  
  // Actions
  fetchTodayEntry: () => Promise<void>;
  updateEntry: (data: Partial<DailyEntry>) => Promise<void>;
  fetchWeeklySummary: () => Promise<void>;
  fetchCurrentStreak: () => Promise<void>;
  setActiveSession: (session: string | null) => void;
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

      // Fetch today's entry from Supabase or create a new one if it doesn't exist
      fetchTodayEntry: async () => {
        try {
          set({ isLoading: true, error: null });
          
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
    }),
    {
      name: 'growth-dashboard-storage',
      partialize: (state) => ({
        // Only persist UI state
        activeSession: state.activeSession,
      }),
    }
  )
);
