// Supabase Database Types
export interface Database {
  public: {
    Tables: {
      daily_entries: {
        Row: DailyEntry
        Insert: DailyEntryInsert
        Update: DailyEntryUpdate
      }
    }
    Views: {
      daily_stats: {
        Row: DailyStats
      }
    }
    Functions: {
      get_weekly_summary: {
        Args: { start_date?: string }
        Returns: WeeklySummary[]
      }
      get_current_streak: {
        Args: {}
        Returns: number
      }
    }
  }
}

// Core Types
export interface DailyEntry {
  id: string
  created_at: string
  updated_at: string
  date: string
  user_id: string
  
  // Session Completion
  session_1_morning: boolean
  session_2_midday: boolean
  session_3_evening: boolean
  session_4_bedtime: boolean
  
  // Time Tracking
  wakeup_time: string | null
  sleep_time: string | null
  
  // Ratings (1-10)
  focus_rating: number | null
  energy_rating: number | null
  health_rating: number | null
  emotional_state: number | null
  
  // Health & Habits
  burnout_level: BurnoutLevel | null
  anger_frequency: AngerFrequency | null
  mood_swings: MoodSwings | null
  money_stress_level: MoneyStressLevel | null
  
  // Progress Tracking
  job_applications: number
  study_hours: number
  gym: boolean
  
  // Notes
  gratitude_entry: string | null
  notes_morning: string | null
  notes_midday: string | null
  notes_evening: string | null
  notes_bedtime: string | null
  
  // Auto-calculated
  completion_percentage: number
  daily_status: string
}

export interface DailyEntryInsert {
  date: string
  session_1_morning?: boolean
  session_2_midday?: boolean
  session_3_evening?: boolean
  session_4_bedtime?: boolean
  wakeup_time?: string | null
  sleep_time?: string | null
  focus_rating?: number | null
  energy_rating?: number | null
  health_rating?: number | null
  emotional_state?: number | null
  burnout_level?: BurnoutLevel | null
  anger_frequency?: AngerFrequency | null
  mood_swings?: MoodSwings | null
  money_stress_level?: MoneyStressLevel | null
  job_applications?: number
  study_hours?: number
  gym?: boolean
  gratitude_entry?: string | null
  notes_morning?: string | null
  notes_midday?: string | null
  notes_evening?: string | null
  notes_bedtime?: string | null
}

export interface DailyEntryUpdate extends Partial<DailyEntryInsert> {}

// Enum Types
export type BurnoutLevel = 'Low' | 'Medium' | 'High'
export type AngerFrequency = 'None' | '1x' | '2x' | 'Often'
export type MoodSwings = 'None' | 'Mild' | 'Strong'
export type MoneyStressLevel = 'None' | 'Moderate' | 'High'
export type DailyStatus = '🟢 BEAST MODE' | '🟡 IN PROGRESS' | '🔴 WEAKNESS ALERT'

// Analytics Types
export interface DailyStats {
  date: string
  completion_percentage: number
  daily_status: string
  emotional_state: number | null
  energy_rating: number | null
  health_rating: number | null
  focus_rating: number | null
  job_applications: number
  study_hours: number
  gym: boolean
  burnout_level: BurnoutLevel | null
  anger_frequency: AngerFrequency | null
  mood_swings: MoodSwings | null
  money_stress_level: MoneyStressLevel | null
}

export interface WeeklySummary {
  total_entries: number
  avg_completion: number
  perfect_days: number
  avg_mood: number
  total_job_apps: number
  total_study_hours: number
  gym_sessions: number
}

// UI Component Types
export interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  trend?: number
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple'
}

export interface CustomSliderProps {
  value: number
  onValueChange: (value: number) => void
  label: string
  min?: number
  max?: number
  formatLabel?: (value: number) => string
}

export interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
}

export interface SessionCardProps {
  section: {
    id: string
    title: string
    icon: React.ComponentType<{ className?: string }>
    description: string
  }
  isActive: boolean
  isCompleted: boolean
  onClick: () => void
  form: any
}

export interface ChartDataPoint {
  date: string
  completion: number
  mood: number
  energy: number
  focus: number
}

// Form Types
export interface SessionFormProps {
  data: Partial<DailyEntry>
  onUpdate: (data: Partial<DailyEntry>) => void
  onComplete: () => void
}

// Store Types
export interface AppState {
  currentEntry: DailyEntry | null
  entries: DailyEntry[]
  isLoading: boolean
  error: string | null
  currentStreak: number
  weeklySummary: WeeklySummary | null
  
  // Actions
  fetchTodayEntry: () => Promise<void>
  updateEntry: (data: Partial<DailyEntry>) => Promise<void>
  fetchWeeklySummary: () => Promise<void>
  fetchCurrentStreak: () => Promise<void>
}
