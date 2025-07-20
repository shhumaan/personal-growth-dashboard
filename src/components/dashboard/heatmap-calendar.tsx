'use client';

import React from 'react';
import { DailyEntry } from '../../../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

interface HeatmapCalendarProps {
  entries: DailyEntry[];
  currentDate?: Date;
  onDateClick?: (date: Date, entry?: DailyEntry) => void;
}

const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({ 
  entries, 
  currentDate = new Date(),
  onDateClick
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEntryForDate = (date: Date): DailyEntry | undefined => {
    return entries.find(e => isSameDay(new Date(e.date), date));
  };

  const getIntensity = (date: Date): number => {
    const entry = getEntryForDate(date);
    return entry ? entry.completion_percentage : 0;
  };

  const handleDateClick = (date: Date) => {
    if (onDateClick) {
      const entry = getEntryForDate(date);
      onDateClick(date, entry);
    }
  };

  const getIntensityColor = (intensity: number): string => {
    if (intensity === 0) return 'bg-muted hover:bg-muted/80';
    if (intensity < 25) return 'bg-red-100 hover:bg-red-200 text-red-700';
    if (intensity < 50) return 'bg-orange-100 hover:bg-orange-200 text-orange-700';
    if (intensity < 75) return 'bg-blue-100 hover:bg-blue-200 text-blue-700';
    if (intensity < 100) return 'bg-green-100 hover:bg-green-200 text-green-700';
    return 'bg-green-500 hover:bg-green-600 text-white';
  };

  const getIntensityText = (intensity: number): string => {
    if (intensity === 0) return 'No data';
    if (intensity < 25) return 'Low';
    if (intensity < 50) return 'Fair';
    if (intensity < 75) return 'Good';
    if (intensity < 100) return 'Great';
    return 'Perfect';
  };

  // Group days by weeks
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  daysInMonth.forEach((day, index) => {
    if (index > 0 && day.getDay() === 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return (
    <div className="dashboard-card">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          {format(currentDate, 'MMMM yyyy')} Progress
        </h3>
        
        <div className="space-y-4">
          {/* Calendar Grid */}
          <div className="space-y-2">
            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 mb-3">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground p-1">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {week.map((day, dayIndex) => {
                  const intensity = getIntensity(day);
                  const isToday = isSameDay(day, new Date());
                  
                  return (
                    <div
                      key={dayIndex}
                      onClick={() => handleDateClick(day)}
                      className={`
                        aspect-square p-1 rounded-md text-xs font-medium
                        flex items-center justify-center
                        transition-all duration-200 cursor-pointer hover:scale-105
                        ${getIntensityColor(intensity)}
                        ${isToday ? 'ring-2 ring-primary ring-offset-1' : ''}
                      `}
                      title={`${format(day, 'MMM d')}: ${getIntensityText(intensity)} (${intensity}%)`}
                    >
                      {format(day, 'd')}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-muted"></div>
              <div className="w-3 h-3 rounded bg-red-100"></div>
              <div className="w-3 h-3 rounded bg-orange-100"></div>
              <div className="w-3 h-3 rounded bg-blue-100"></div>
              <div className="w-3 h-3 rounded bg-green-100"></div>
              <div className="w-3 h-3 rounded bg-green-500"></div>
            </div>
            <span>More</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">
                {entries.filter(e => new Date(e.date) >= monthStart && new Date(e.date) <= monthEnd).length}
              </div>
              <div className="text-xs text-muted-foreground">Days Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {entries.filter(e => 
                  new Date(e.date) >= monthStart && 
                  new Date(e.date) <= monthEnd && 
                  e.completion_percentage >= 75
                ).length}
              </div>
              <div className="text-xs text-muted-foreground">Great Days</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {Math.round(
                  entries
                    .filter(e => new Date(e.date) >= monthStart && new Date(e.date) <= monthEnd)
                    .reduce((sum, e) => sum + e.completion_percentage, 0) / 
                  Math.max(1, entries.filter(e => new Date(e.date) >= monthStart && new Date(e.date) <= monthEnd).length)
                )}%
              </div>
              <div className="text-xs text-muted-foreground">Avg Completion</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { HeatmapCalendar };
