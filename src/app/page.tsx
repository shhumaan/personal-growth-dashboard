'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { StatsCard } from '@/components/dashboard/stats-card';
import { ProgressChart } from '@/components/dashboard/progress-chart';
import { SessionCard } from '@/components/dashboard/session-card';
import { HeatmapCalendar } from '@/components/dashboard/heatmap-calendar';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { Onboarding } from '@/components/onboarding';
import { DemoMode } from '@/components/demo-mode';
import { ProgressRing } from '@/components/ui/progress-ring';
import { MorningForm } from '@/components/forms/morning-form';
import { MiddayForm } from '@/components/forms/midday-form';
import { EveningForm } from '@/components/forms/evening-form';
import { BedtimeForm } from '@/components/forms/bedtime-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Sunrise, 
  Sun, 
  Sunset, 
  Moon, 
  TrendingUp, 
  Target, 
  Brain, 
  Heart,
  Zap,
  Calendar,
  BarChart3,
  Plus,
  Settings,
  Loader2
} from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';
import { DailyEntry, WeeklySummary } from '../../types';

export default function Dashboard() {
  const {
    currentEntry,
    entries,
    weeklySummary,
    chartData,
    activeSession,
    isLoading,
    error,
    currentStreak,
    fetchTodayEntry,
    updateEntry,
    fetchWeeklySummary,
    fetchCurrentStreak,
    setActiveSession,
  } = useAppStore();

  const [showForm, setShowForm] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchTodayEntry();
        await fetchWeeklySummary();
        await fetchCurrentStreak();
      } catch (err) {
        console.error('Failed to load data:', err);
        activateDemoMode();
      }
    };
    
    loadData();
    
    // Show onboarding for new users
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const activateDemoMode = () => {
    setIsDemoMode(true);
    // Demo mode logic will be implemented in DemoMode component
  };

  const handleSessionClick = (sessionId: string) => {
    setActiveSession(sessionId);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setActiveSession(null);
  };

  const handleSessionComplete = async (sessionId: string, data: Partial<DailyEntry>) => {
    await updateEntry(data);
    setShowForm(false);
    setActiveSession(null);
  };

  const getCompletionPercentage = (): number => {
    if (!currentEntry) return 0;
    return currentEntry.completion_percentage;
  };

  // Get emoji status based on daily_status
  const getStatusEmoji = (): string => {
    if (!currentEntry?.daily_status) return '🔴';
    if (currentEntry.daily_status.includes('BEAST')) return '🟢';
    if (currentEntry.daily_status.includes('PROGRESS')) return '🟡';
    return '🔴';
  };

  // Session data for the four daily sessions
  const sessions = [
    {
      id: 'morning',
      title: 'Morning Power-Up',
      icon: Sunrise,
      description: 'Start your day with intention and clarity',
      isCompleted: currentEntry?.session_1_morning || false,
    },
    {
      id: 'midday',
      title: 'Midday Reality Check',
      icon: Sun,
      description: 'Reset and refocus for the afternoon',
      isCompleted: currentEntry?.session_2_midday || false,
    },
    {
      id: 'evening',
      title: 'Evening Deep Dive',
      icon: Sunset,
      description: 'Review progress and plan improvements',
      isCompleted: currentEntry?.session_3_evening || false,
    },
    {
      id: 'bedtime',
      title: 'Bedtime Accountability',
      icon: Moon,
      description: 'Reflect on the day and prepare for tomorrow',
      isCompleted: currentEntry?.session_4_bedtime || false,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Loading your dashboard...</span>
      </div>
    );
  }

  if (error && !isDemoMode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md w-full backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">Connection Error</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <div className="flex gap-4">
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="flex-1"
            >
              Try Again
            </Button>
            <Button 
              onClick={activateDemoMode} 
              className="flex-1"
            >
              Use Demo Mode
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Modal Forms */}
      <AnimatePresence>
        {showForm && activeSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto"
            >
              {activeSession === 'morning' && (
                <MorningForm
                  data={currentEntry || {}}
                  onComplete={(data) => handleSessionComplete('morning', data)}
                  onCancel={handleFormClose}
                />
              )}
              {activeSession === 'midday' && (
                <MiddayForm
                  data={currentEntry || {}}
                  onComplete={(data) => handleSessionComplete('midday', data)}
                  onCancel={handleFormClose}
                />
              )}
              {activeSession === 'evening' && (
                <EveningForm
                  data={currentEntry || {}}
                  onComplete={(data) => handleSessionComplete('evening', data)}
                  onCancel={handleFormClose}
                />
              )}
              {activeSession === 'bedtime' && (
                <BedtimeForm
                  data={currentEntry || {}}
                  onComplete={(data) => handleSessionComplete('bedtime', data)}
                  onCancel={handleFormClose}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show onboarding for new users */}
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding onComplete={() => {
            setShowOnboarding(false);
            localStorage.setItem('hasSeenOnboarding', 'true');
          }} />
        )}
      </AnimatePresence>

      {/* Header with date and controls */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Growth Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Calendar className="w-3 h-3 mr-1" />
            Weekly View
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <BarChart3 className="w-3 h-3 mr-1" />
            Analytics
          </Button>
          <Button variant="outline" size="sm" asChild className="text-xs">
            <a href="/settings">
              <Settings className="w-3 h-3 mr-1" />
              Settings
            </a>
          </Button>
        </div>
      </div>
      
      {/* Main Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Session Cards */}
        <div className="space-y-4">
          <Card className="overflow-hidden backdrop-blur-xl bg-white/30 dark:bg-gray-900/30 border border-white/10">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Daily Sessions</CardTitle>
                <div className="flex items-center">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span>{getCompletionPercentage()}% Complete</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-1 gap-3">
                {sessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    section={session}
                    isActive={activeSession === session.id}
                    isCompleted={session.isCompleted}
                    onClick={() => handleSessionClick(session.id)}
                    form={null}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Weekly Stats */}
          {weeklySummary && (
            <DashboardStats weeklySummary={weeklySummary} currentStreak={currentStreak} />
          )}
        </div>
        
        {/* Middle Column - Today's Stats */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <StatsCard
              title="Mood"
              value={currentEntry?.emotional_state || 0}
              subtitle="out of 10"
              icon={Heart}
              color="red"
            />
            <StatsCard
              title="Energy"
              value={currentEntry?.energy_rating || 0}
              subtitle="out of 10"
              icon={Zap}
              color="orange"
            />
            <StatsCard
              title="Focus"
              value={currentEntry?.focus_rating || 0}
              subtitle="out of 10"
              icon={Target}
              color="blue"
            />
            <StatsCard
              title="Health"
              value={currentEntry?.health_rating || 0}
              subtitle="out of 10"
              icon={Brain}
              color="green"
            />
          </div>
          
          {/* Progress Chart */}
          <Card className="backdrop-blur-xl bg-white/30 dark:bg-gray-900/30 border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              {chartData && chartData.length > 0 ? (
                <ProgressChart data={chartData} />
              ) : (
                <div className="h-[200px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <p>Not enough data yet. Check back soon!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Heatmap and Notes */}
        <div className="space-y-4">
          <Card className="backdrop-blur-xl bg-white/30 dark:bg-gray-900/30 border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <HeatmapCalendar entries={entries} />
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-xl bg-white/30 dark:bg-gray-900/30 border border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Today's Gratitude</CardTitle>
            </CardHeader>
            <CardContent>
              {currentEntry?.gratitude_entry ? (
                <div className="prose prose-sm dark:prose-invert">
                  <p className="text-gray-700 dark:text-gray-300 italic">
                    "{currentEntry.gratitude_entry}"
                  </p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 dark:text-gray-400 mb-3">
                    No gratitude entry yet. Add one in your morning session.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSessionClick('morning')}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Gratitude
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Show demo mode overlay if active */}
      {isDemoMode && <DemoMode />}
    </main>
  );
}
