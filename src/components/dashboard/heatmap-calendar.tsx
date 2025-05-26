'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DailyEntry } from '../../../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

interface HeatmapCalendarProps {
  entries: DailyEntry[];
  currentDate?: Date;
}

const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({ 
  entries, 
  currentDate = new Date() 
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getIntensity = (date: Date): number => {
    const entry = entries.find(e => 
      isSameDay(new Date(e.date), date)
    );
    return entry ? entry.completion_percentage : 0;
  };

  const getIntensityColor = (intensity: number): string => {
    if (intensity === 0) return 'bg-gray-100';
    if (intensity < 25) return 'bg-red-200';
    if (intensity < 50) return 'bg-orange-200';
    if (intensity < 75) return 'bg-blue-200';
    if (intensity < 100) return 'bg-green-200';
    return 'bg-green-400';
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
    <Card className="bg-white/50 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')} Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Calendar Grid */}
          <div className="space-y-1">
            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 p-1">
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
                      className={`
                        aspect-square p-1 rounded-lg text-xs font-medium
                        flex items-center justify-center
                        transition-all duration-200 hover:scale-110 cursor-pointer
                        ${getIntensityColor(intensity)}
                        ${isToday ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
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
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Less</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-gray-100"></div>
              <div className="w-3 h-3 rounded bg-red-200"></div>
              <div className="w-3 h-3 rounded bg-orange-200"></div>
              <div className="w-3 h-3 rounded bg-blue-200"></div>
              <div className="w-3 h-3 rounded bg-green-200"></div>
              <div className="w-3 h-3 rounded bg-green-400"></div>
            </div>
            <span>More</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {entries.filter(e => new Date(e.date) >= monthStart && new Date(e.date) <= monthEnd).length}
              </div>
              <div className="text-xs text-gray-600">Days Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {entries.filter(e => 
                  new Date(e.date) >= monthStart && 
                  new Date(e.date) <= monthEnd && 
                  e.completion_percentage >= 75
                ).length}
              </div>
              <div className="text-xs text-gray-600">Great Days</div>
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
              <div className="text-xs text-gray-600">Avg Completion</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { HeatmapCalendar };
