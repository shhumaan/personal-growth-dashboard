// Re-export types from Supabase
export type {
  Database,
  DailyEntry,
  DailyEntryInsert,
  DailyEntryUpdate,
  DailyStats,
  WeeklySummary,
  BurnoutLevel,
  AngerFrequency,
  MoodSwings,
  MoneyStressLevel,
  DailyStatus,
  SessionFormProps,
  AppState
} from './supabase'

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

// Legacy interfaces - keeping for backward compatibility
export interface WeeklyStats {
  averageCompletion: number
  beastModeDays: number
  totalJobApplications: number
  totalStudyHours: number
  averageMood: number
  averageEnergy: number
  gymSessions: number
}
