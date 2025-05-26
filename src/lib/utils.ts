// filepath: /Volumes/anshu ssd/notion/src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import type { DailyEntry } from "../../types";

/**
 * Combines class names with Tailwind's merge function
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a time string (HH:MM) to a human-readable format
 */
export const formatTime = (time: string | null): string => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

/**
 * Formats a date string to a human-readable format
 */
export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'EEEE, MMMM d, yyyy');
};

/**
 * Returns a date string in YYYY-MM-DD format
 */
export const getDateString = (date: Date = new Date()): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Gets the appropriate color based on a percentage value
 */
export const getStatusColor = (percentage: number): string => {
  if (percentage >= 100) return 'text-green-600 dark:text-green-400';
  if (percentage >= 75) return 'text-blue-600 dark:text-blue-400';
  if (percentage >= 50) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
};

/**
 * Gets a status text based on a percentage value
 */
export const getStatusText = (percentage: number): string => {
  if (percentage >= 100) return 'Complete';
  if (percentage >= 75) return 'Excellent';
  if (percentage >= 50) return 'Good';
  if (percentage >= 25) return 'Needs Work';
  return 'Getting Started';
};

/**
 * Safely gets a numerical value from a DailyEntry field that might be null
 */
export const safeGetNumber = (
  entry: DailyEntry | null | undefined, 
  field: keyof DailyEntry, 
  defaultValue = 0
): number => {
  if (!entry) return defaultValue;
  const value = entry[field];
  if (typeof value === 'number') return value;
  return defaultValue;
};

/**
 * Safely calculates the average of a numerical field in an array of entries
 */
export const calculateAverage = (
  entries: DailyEntry[], 
  field: keyof DailyEntry
): number => {
  if (entries.length === 0) return 0;
  
  const validEntries = entries.filter(entry => {
    const value = entry[field];
    return typeof value === 'number' && value !== null;
  });
  
  if (validEntries.length === 0) return 0;
  
  const sum = validEntries.reduce((acc, entry) => {
    const value = entry[field];
    return acc + (typeof value === 'number' ? value : 0);
  }, 0);
  
  return Math.round((sum / validEntries.length) * 10) / 10;
};
