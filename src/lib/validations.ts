import { z } from 'zod';

export const dailyEntrySchema = z.object({
  date: z.string(),
  session_1_morning: z.boolean().default(false),
  session_2_midday: z.boolean().default(false),
  session_3_evening: z.boolean().default(false),
  session_4_bedtime: z.boolean().default(false),
  wakeup_time: z.string().nullable().default(null),
  sleep_time: z.string().nullable().default(null),
  focus_rating: z.number().min(1).max(10).nullable().default(null),
  energy_rating: z.number().min(1).max(10).nullable().default(null),
  health_rating: z.number().min(1).max(10).nullable().default(null),
  emotional_state: z.number().min(1).max(10).nullable().default(null),
  burnout_level: z.enum(['Low', 'Medium', 'High']).nullable().default(null),
  anger_frequency: z.enum(['None', '1x', '2x', 'Often']).nullable().default(null),
  mood_swings: z.enum(['None', 'Mild', 'Strong']).nullable().default(null),
  money_stress_level: z.enum(['None', 'Moderate', 'High']).nullable().default(null),
  job_applications: z.number().min(0).default(0),
  study_hours: z.number().min(0).default(0),
  gym: z.boolean().default(false),
  gratitude_entry: z.string().nullable().default(null),
  notes_morning: z.string().nullable().default(null),
  notes_midday: z.string().nullable().default(null),
  notes_evening: z.string().nullable().default(null),
  notes_bedtime: z.string().nullable().default(null),
});

export const morningSessionSchema = z.object({
  wakeup_time: z.string().min(1, 'Wakeup time is required'),
  focus_rating: z.number().min(1).max(10),
  energy_rating: z.number().min(1).max(10),
  gratitude_entry: z.string().min(1, 'Gratitude entry is required'),
  notes_morning: z.string().optional(),
  session_1_morning: z.literal(true).default(true),
});

export const middaySessionSchema = z.object({
  emotional_state: z.number().min(1).max(10),
  burnout_level: z.enum(['Low', 'Medium', 'High']),
  job_applications: z.number().min(0),
  study_hours: z.number().min(0),
  notes_midday: z.string().optional(),
  session_2_midday: z.literal(true).default(true),
});

export const eveningSessionSchema = z.object({
  health_rating: z.number().min(1).max(10),
  anger_frequency: z.enum(['None', '1x', '2x', 'Often']),
  mood_swings: z.enum(['None', 'Mild', 'Strong']),
  gym: z.boolean(),
  notes_evening: z.string().optional(),
  session_3_evening: z.literal(true).default(true),
});

export const bedtimeSessionSchema = z.object({
  sleep_time: z.string().min(1, 'Sleep time is required'),
  money_stress_level: z.enum(['None', 'Moderate', 'High']),
  notes_bedtime: z.string().optional(),
  session_4_bedtime: z.literal(true).default(true),
});

export type MorningSessionData = z.infer<typeof morningSessionSchema>;
export type MiddaySessionData = z.infer<typeof middaySessionSchema>;
export type EveningSessionData = z.infer<typeof eveningSessionSchema>;
export type BedtimeSessionData = z.infer<typeof bedtimeSessionSchema>;
export type DailyEntryData = z.infer<typeof dailyEntrySchema>;
