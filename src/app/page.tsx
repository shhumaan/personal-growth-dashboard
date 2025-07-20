'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { StatsCard } from '@/components/dashboard/stats-card';
import { SessionCard } from '@/components/dashboard/session-card';
import { HeatmapCalendar } from '@/components/dashboard/heatmap-calendar';
import { StreakCounter } from '@/components/dashboard/streak-counter';
import { CelebrationNotification } from '@/components/dashboard/celebration-notification';
import { DailyAffirmations } from '@/components/dashboard/daily-affirmations';
import { GentleReminders } from '@/components/dashboard/gentle-reminders';
import { EnhancedProgressRings } from '@/components/dashboard/enhanced-progress-rings';
import { GoalsSection } from '@/components/dashboard/goals-section';
import { DailyTasks } from '@/components/dashboard/daily-tasks';
import { CountdownTimer } from '@/components/dashboard/countdown-timer';
import { AchievementBadges } from '@/components/dashboard/achievement-badges';
import { Onboarding } from '@/components/onboarding';
import { DemoMode } from '@/components/demo-mode';
import { ThemeToggle } from '@/components/theme-toggle';
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
import { DailyEntry } from '../../types';

export default function Dashboard() {
  const {
    currentEntry,
    entries,
    activeSession,
    isLoading,
    error,
    currentStreak,
    motivation,
    fetchTodayEntry,
    updateEntry,
    fetchWeeklySummary,
    fetchCurrentStreak,
    setActiveSession,
    triggerCelebration,
    hideCelebration,
    updateAchievements,
    calculateProgress,
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
        updateAchievements();
        calculateProgress();
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
  }, [fetchTodayEntry, fetchWeeklySummary, fetchCurrentStreak, updateAchievements, calculateProgress]);

  // Trigger celebrations when milestones are reached
  useEffect(() => {
    if (currentStreak > 0 && currentStreak % 7 === 0) {
      triggerCelebration('streak', currentStreak);
    }
  }, [currentStreak, triggerCelebration]);

  useEffect(() => {
    if (currentEntry && currentEntry.completion_percentage === 100) {
      triggerCelebration('perfect_day');
    }
  }, [currentEntry, triggerCelebration]);

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
    
    // Trigger celebration for session completion
    triggerCelebration('session');
    
    // Update achievements and progress
    updateAchievements();
    calculateProgress();
  };

  const handleDateClick = (date: Date, entry?: DailyEntry) => {
    // You can add a modal or side panel here to show the day's details
    console.log('Selected date:', date, 'Entry:', entry);
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
        <div className="dashboard-card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 max-w-md w-full">
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Modal Forms */}
      <AnimatePresence>
        {showForm && activeSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-800/50 max-w-3xl w-full max-h-[90vh] overflow-auto"
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
                  onSubmit={(data) => handleSessionComplete('bedtime', data)}
                  onClose={handleFormClose}
                  initialData={{
                    sleep_time: currentEntry?.sleep_time || '',
                    money_stress_level: currentEntry?.money_stress_level || 'None',
                    notes_bedtime: currentEntry?.notes_bedtime || ''
                  }}
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
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-start mb-8"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <motion.h1 
              className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Growth Dashboard
            </motion.h1>
            {isDemoMode && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg"
              >
                Demo Mode
              </motion.span>
            )}
          </div>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </motion.p>
        </div>
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild className="text-sm bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50">
            <a href="/weekly">
              <Calendar className="w-4 h-4 mr-2" />
              Weekly
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="text-sm bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-sm bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50">
            <a href="/settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </a>
          </Button>
        </motion.div>
      </motion.div>
      
      {/* Main Dashboard - Responsive Grid Layout */}
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Top Section - Session Cards */}
        <motion.div 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl shadow-blue-500/5 dark:shadow-blue-400/5 overflow-hidden">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                  Today&apos;s Journey
                </CardTitle>
                <motion.div 
                  className="flex items-center gap-3"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                >
                  <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl px-4 py-2 text-white text-sm font-semibold flex items-center gap-2 shadow-lg">
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-white"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span>{getCompletionPercentage()}% Complete</span>
                  </div>
                  <div className="text-2xl">
                    {getStatusEmoji()}
                  </div>
                </motion.div>
              </div>
            </CardHeader>
            <CardContent className="pb-6 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {sessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  >
                    <SessionCard
                      section={session}
                      isActive={activeSession === session.id}
                      isCompleted={session.isCompleted}
                      onClick={() => handleSessionClick(session.id)}
                      form={null}
                    />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
          
        {/* Stats Row */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {[
            { title: "Mood", value: currentEntry?.emotional_state || 0, icon: Heart, color: "red" as const },
            { title: "Energy", value: currentEntry?.energy_rating || 0, icon: Zap, color: "orange" as const },
            { title: "Focus", value: currentEntry?.focus_rating || 0, icon: Target, color: "blue" as const },
            { title: "Health", value: currentEntry?.health_rating || 0, icon: Brain, color: "green" as const }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 + index * 0.1, duration: 0.6 }}
            >
              <StatsCard
                title={stat.title}
                value={stat.value}
                subtitle="out of 10"
                icon={stat.icon}
                color={stat.color}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* 90-Day Countdown Timer */}
        <motion.div 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <CountdownTimer 
            targetDate={(() => {
              try {
                const savedSettings = localStorage.getItem('goalTimerSettings');
                if (savedSettings) {
                  const settings = JSON.parse(savedSettings);
                  const startDate = new Date(settings.sprintStartDate);
                  return new Date(startDate.getTime() + settings.sprintDuration * 24 * 60 * 60 * 1000);
                }
              } catch (error) {
                console.error('Error loading goal timer settings:', error);
              }
              return new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
            })()}
            goalTitle={(() => {
              try {
                const savedSettings = localStorage.getItem('goalTimerSettings');
                if (savedSettings) {
                  const settings = JSON.parse(savedSettings);
                  return settings.goalTitle;
                }
              } catch (error) {
                console.error('Error loading goal timer settings:', error);
              }
              return "Master Personal Growth Sprint";
            })()}
            onDateChange={(date) => console.log('New target date:', date)}
            onGoalChange={(title) => console.log('New goal title:', title)}
          />
        </motion.div>

        {/* Main Content Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          {/* Daily Tasks */}
          <motion.div 
            className="order-1"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <DailyTasks onTaskComplete={() => triggerCelebration('task')} />
          </motion.div>

          {/* Progress Rings */}
          <motion.div 
            className="order-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <EnhancedProgressRings 
              dailyProgress={getCompletionPercentage()}
              weeklyProgress={motivation.weeklyProgress || 0}
              monthlyProgress={motivation.monthlyProgress || 0}
              yearlyProgress={motivation.yearlyProgress || 0}
              streakDays={currentStreak}
              totalSessions={motivation.totalSessions || 0}
              completedToday={sessions.filter(s => s.isCompleted).length}
            />
          </motion.div>
          
          {/* Goals Section */}
          <motion.div 
            className="order-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <GoalsSection />
          </motion.div>
        </motion.div>

        {/* Secondary Content Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          {/* Calendar */}
          <motion.div 
            className="order-1"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <HeatmapCalendar entries={entries} onDateClick={handleDateClick} />
          </motion.div>
          
          {/* Streak Counter */}
          <motion.div 
            className="order-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <StreakCounter 
              currentStreak={currentStreak}
              longestStreak={motivation.longestStreak}
              totalDays={entries.length}
            />
          </motion.div>

          {/* Achievement Badges */}
          <motion.div 
            className="order-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <AchievementBadges
              streakDays={currentStreak}
              totalSessions={motivation.totalSessions || 0}
              completedDays={entries.length}
              perfectDays={entries.filter(e => e.completion_percentage === 100).length}
              averageMood={entries.length > 0 ? entries.reduce((sum, e) => sum + (e.emotional_state || 0), 0) / entries.length : 0}
              averageEnergy={entries.length > 0 ? entries.reduce((sum, e) => sum + (e.energy_rating || 0), 0) / entries.length : 0}
            />
          </motion.div>
        </motion.div>

        {/* Bottom Row */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.8 }}
        >
          
          {/* Today's Gratitude */}
          <motion.div 
            className="order-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl shadow-pink-500/5 dark:shadow-pink-400/5 overflow-hidden h-full">
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30">
                    <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <span className="bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400 bg-clip-text text-transparent">
                    Today&apos;s Gratitude
                  </span>
                </h3>
                {currentEntry?.gratitude_entry ? (
                  <motion.div 
                    className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-4 rounded-xl border border-pink-100 dark:border-pink-800/30"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic text-center leading-relaxed">
                      &quot;{currentEntry.gratitude_entry}&quot;
                    </p>
                  </motion.div>
                ) : (
                  <div className="text-center py-6">
                    <motion.div 
                      className="mb-4"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Heart className="w-12 h-12 text-pink-300 dark:text-pink-600 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Share what you&apos;re grateful for today
                      </p>
                    </motion.div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSessionClick('morning')}
                      className="border-pink-200 text-pink-600 hover:bg-pink-50 dark:border-pink-800 dark:text-pink-400 dark:hover:bg-pink-900/20 bg-white/50 backdrop-blur-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Gratitude
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
          
          {/* Daily Affirmations */}
          <motion.div 
            className="order-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <DailyAffirmations 
              mood={currentEntry?.emotional_state || 5}
              currentStreak={currentStreak}
            />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Celebration Notification */}
      <CelebrationNotification
        trigger={motivation.celebrationType || 'session'}
        value={motivation.celebrationValue}
        show={motivation.showCelebration}
        onClose={hideCelebration}
      />
      
      {/* Gentle Reminders */}
      <GentleReminders
        completedSessions={sessions.filter(s => s.isCompleted).map(s => s.id)}
        currentTime={new Date()}
        settings={motivation.reminderSettings}
      />
      
      {/* Show demo mode overlay if active */}
      {isDemoMode && <DemoMode onClose={() => setIsDemoMode(false)} />}
    </main>
  );
}
