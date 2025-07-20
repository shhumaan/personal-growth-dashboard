'use client';

import React from 'react';
import { format } from 'date-fns';
import { Calendar, BarChart3, ArrowLeft, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WeeklyAnalytics } from '@/components/dashboard/weekly-analytics';
import { HeatmapCalendar } from '@/components/dashboard/heatmap-calendar';
import { ProgressChart } from '@/components/dashboard/progress-chart';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

export default function WeeklyPage() {
  // Mock data - this would come from your store/API
  const mockEntries = [
    {
      id: '1',
      date: format(new Date(), 'yyyy-MM-dd'),
      completion_percentage: 75,
      emotional_state: 7,
      energy_rating: 8,
      focus_rating: 6,
      health_rating: 7,
      session_1_morning: true,
      session_2_midday: false,
      session_3_evening: true,
      session_4_bedtime: true,
      daily_status: '🟡 IN PROGRESS',
      user_id: 'user1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      wakeup_time: null,
      sleep_time: null,
      burnout_level: null,
      anger_frequency: null,
      mood_swings: null,
      money_stress_level: null,
      job_applications: 2,
      study_hours: 3.5,
      gym: true,
      gratitude_entry: null,
      notes_morning: null,
      notes_midday: null,
      notes_evening: null,
      notes_bedtime: null,
    },
    // Add more mock entries for the past week...
  ];

  const mockChartData = [
    { date: 'Mon', completion: 85, mood: 70, energy: 80, focus: 75 },
    { date: 'Tue', completion: 60, mood: 60, energy: 65, focus: 70 },
    { date: 'Wed', completion: 90, mood: 85, energy: 90, focus: 85 },
    { date: 'Thu', completion: 75, mood: 75, energy: 70, focus: 80 },
    { date: 'Fri', completion: 100, mood: 90, energy: 95, focus: 90 },
    { date: 'Sat', completion: 50, mood: 65, energy: 60, focus: 55 },
    { date: 'Sun', completion: 80, mood: 80, energy: 85, focus: 75 },
  ];

  const handleDateClick = (date: Date, entry?: { completion_percentage: number; id: string }) => {
    console.log('Date clicked:', date, entry);
    // Handle date click - could open a modal or navigate to day view
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-500" />
              Weekly View & Analytics
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-1" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Weekly Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <WeeklyAnalytics />
          
          {/* Weekly Progress Chart */}
          <div className="dashboard-card">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Weekly Progress Trends
              </h3>
              <ProgressChart data={mockChartData} title="Weekly Progress Trends" />
            </div>
          </div>
        </div>

        {/* Right Column - Calendar and Additional Insights */}
        <div className="space-y-6">
          {/* Calendar Heatmap */}
          <div className="dashboard-card">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Activity Calendar</h3>
              <HeatmapCalendar entries={mockEntries} onDateClick={handleDateClick} />
            </div>
          </div>

          {/* Weekly Goals Progress */}
          <div className="dashboard-card">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Weekly Goals</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Complete all daily sessions</span>
                  <span className="text-sm font-medium">4/7 days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '57%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Maintain 80%+ completion</span>
                  <span className="text-sm font-medium">3/7 days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '43%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Exercise 3+ times</span>
                  <span className="text-sm font-medium">2/3 sessions</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Summary */}
          <div className="dashboard-card">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Week Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Best Day</span>
                  <span className="text-sm font-medium">Friday (100%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Hardest Day</span>
                  <span className="text-sm font-medium">Saturday (50%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Mood</span>
                  <span className="text-sm font-medium">7.4/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Study Hours</span>
                  <span className="text-sm font-medium">12.5 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Job Applications</span>
                  <span className="text-sm font-medium">5 submitted</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                  💡 This Week&apos;s Insight
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  You performed best on weekdays and showed consistent improvement in focus ratings. 
                  Consider maintaining weekday momentum through the weekend.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}