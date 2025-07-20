'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Coffee, Sunset, Moon, X, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ReminderSettings {
  enabled: boolean;
  frequency: 'gentle' | 'normal' | 'persistent';
  quietHours: { start: string; end: string };
  customMessages: string[];
}

interface GentleRemindersProps {
  completedSessions: string[];
  currentTime: Date;
  settings?: ReminderSettings;
  className?: string;
}

export function GentleReminders({ 
  completedSessions = [],
  currentTime = new Date(),
  settings = {
    enabled: true,
    frequency: 'normal',
    quietHours: { start: '22:00', end: '07:00' },
    customMessages: []
  },
  className = ''
}: GentleRemindersProps) {
  const [activeReminder, setActiveReminder] = useState<string | null>(null);
  const [dismissedReminders, setDismissedReminders] = useState<Set<string>>(new Set());
  const [showSettings, setShowSettings] = useState(false);

  // Define session times and their corresponding reminders
  const sessionSchedule = useMemo(() => [
    {
      id: 'morning',
      name: 'Morning Power-Up',
      icon: Coffee,
      timeRange: { start: 6, end: 11 },
      messages: [
        "Good morning! ☀️ Ready to start your day with intention?",
        "Morning reflection time! 🌅 How are you feeling today?",
        "Your morning session is waiting! ✨ Just a few minutes of self-care.",
        "Start your day strong! 💪 Your morning check-in is ready.",
      ]
    },
    {
      id: 'midday',
      name: 'Midday Reality Check',
      icon: Clock,
      timeRange: { start: 11, end: 16 },
      messages: [
        "Time for a midday reset! 🔄 How's your energy level?",
        "Midday check-in time! ⏰ Take a moment to refocus.",
        "Afternoon reflection break! 🧘 How has your day been so far?",
        "Quick midday assessment! 📊 Let's see how you're doing.",
      ]
    },
    {
      id: 'evening',
      name: 'Evening Deep Dive',
      icon: Sunset,
      timeRange: { start: 16, end: 21 },
      messages: [
        "Evening reflection time! 🌇 How did today go?",
        "Time to review your day! 📝 What did you learn?",
        "Evening check-in ready! 🌟 Celebrate today's progress.",
        "Your evening session awaits! 🌙 Time to wind down mindfully.",
      ]
    },
    {
      id: 'bedtime',
      name: 'Bedtime Accountability',
      icon: Moon,
      timeRange: { start: 21, end: 23 },
      messages: [
        "Bedtime reflection! 🌙 How was your day overall?",
        "Time to close the day mindfully! ✨ Quick bedtime check-in.",
        "Evening wind-down time! 🛌 Let's reflect on today.",
        "Bedtime accountability! 🙏 End your day with gratitude.",
      ]
    }
  ], []);

  // Check if current time is within quiet hours
  const isQuietTime = useCallback(() => {
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    
    const { start, end } = settings.quietHours;
    
    // Handle overnight quiet hours (e.g., 22:00 to 07:00)
    if (start > end) {
      return currentTimeString >= start || currentTimeString <= end;
    }
    
    // Handle same-day quiet hours (e.g., 13:00 to 14:00)
    return currentTimeString >= start && currentTimeString <= end;
  }, [currentTime, settings.quietHours]);

  // Get current session based on time
  const getCurrentSession = useCallback(() => {
    const currentHour = currentTime.getHours();
    return sessionSchedule.find(session => 
      currentHour >= session.timeRange.start && currentHour < session.timeRange.end
    );
  }, [currentTime, sessionSchedule]);

  // Get reminder frequency timing
  const getReminderInterval = useCallback(() => {
    switch (settings.frequency) {
      case 'gentle': return 60 * 60 * 1000; // 1 hour
      case 'normal': return 30 * 60 * 1000; // 30 minutes
      case 'persistent': return 15 * 60 * 1000; // 15 minutes
      default: return 30 * 60 * 1000;
    }
  }, [settings.frequency]);

  // Check if reminder should be shown
  const shouldShowReminder = useCallback(() => {
    if (!settings.enabled || isQuietTime()) return false;
    
    const currentSession = getCurrentSession();
    if (!currentSession) return false;
    
    const isSessionCompleted = completedSessions.includes(currentSession.id);
    const isReminderDismissed = dismissedReminders.has(currentSession.id);
    
    return !isSessionCompleted && !isReminderDismissed;
  }, [settings.enabled, isQuietTime, getCurrentSession, completedSessions, dismissedReminders]);

  // Get random message for current session
  const getCurrentMessage = () => {
    const currentSession = getCurrentSession();
    if (!currentSession) return '';
    
    const allMessages = [
      ...currentSession.messages,
      ...settings.customMessages
    ];
    
    return allMessages[Math.floor(Math.random() * allMessages.length)];
  };

  // Handle reminder display
  useEffect(() => {
    if (!shouldShowReminder()) return;
    
    const interval = setInterval(() => {
      if (shouldShowReminder()) {
        const currentSession = getCurrentSession();
        if (currentSession) {
          setActiveReminder(currentSession.id);
        }
      }
    }, getReminderInterval());
    
    return () => clearInterval(interval);
  }, [shouldShowReminder, getCurrentSession, getReminderInterval]);

  const dismissReminder = (sessionId: string) => {
    setDismissedReminders(prev => new Set(Array.from(prev).concat(sessionId)));
    setActiveReminder(null);
  };

  const currentSession = getCurrentSession();
  const currentMessage = getCurrentMessage();

  if (!settings.enabled || !currentSession || !activeReminder) {
    return null;
  }

  const SessionIcon = currentSession.icon;

  return (
    <AnimatePresence>
      {activeReminder && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed bottom-4 right-4 z-40 max-w-sm ${className}`}
        >
          <Card className="backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border border-white/20 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SessionIcon className="w-5 h-5 text-blue-500" />
                  <CardTitle className="text-sm font-medium">
                    {currentSession.name}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {settings.frequency}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                    className="h-6 w-6 p-0"
                  >
                    <Settings className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissReminder(currentSession.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {currentMessage}
              </p>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    // Handle session start
                    setActiveReminder(null);
                  }}
                  className="flex-1"
                >
                  Start Session
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dismissReminder(currentSession.id)}
                  className="flex-1"
                >
                  Later
                </Button>
              </div>
              
              {/* Progress indicator */}
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <div className="flex gap-1">
                  {sessionSchedule.map(session => (
                    <div
                      key={session.id}
                      className={`w-2 h-2 rounded-full ${
                        completedSessions.includes(session.id)
                          ? 'bg-green-500'
                          : session.id === currentSession.id
                          ? 'bg-blue-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span>{completedSessions.length}/4 sessions today</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}