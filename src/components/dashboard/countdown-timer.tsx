'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Timer, 
  Target, 
  Edit3,
  CheckCircle2,
  AlertCircle,
  Flame
} from 'lucide-react';

interface CountdownTimerProps {
  targetDate?: Date;
  goalTitle?: string;
  onDateChange?: (date: Date) => void;
  onGoalChange?: (title: string) => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  isExpired: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  goalTitle = "90-Day Sprint Goal",
  onDateChange,
  onGoalChange
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
    totalHours: 0,
    isExpired: false
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editGoal, setEditGoal] = useState(goalTitle);
  const [editDate, setEditDate] = useState(
    targetDate ? targetDate.toISOString().split('T')[0] : ''
  );

  // Default to 90 days from now if no target date
  const defaultTargetDate = useMemo(() => {
    return targetDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  }, [targetDate]);

  const calculateTimeRemaining = (target: Date): TimeRemaining => {
    const now = new Date().getTime();
    const targetTime = target.getTime();
    const difference = targetTime - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalDays: 0,
        totalHours: 0,
        isExpired: true
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      totalDays: Math.floor(difference / (1000 * 60 * 60 * 24)),
      totalHours: Math.floor(difference / (1000 * 60 * 60)),
      isExpired: false
    };
  };

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(defaultTargetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [defaultTargetDate]);

  // Initial calculation
  useEffect(() => {
    setTimeRemaining(calculateTimeRemaining(defaultTargetDate));
  }, [defaultTargetDate]);

  const handleSaveChanges = () => {
    if (editDate) {
      const newDate = new Date(editDate);
      onDateChange?.(newDate);
    }
    if (editGoal !== goalTitle) {
      onGoalChange?.(editGoal);
    }
    setIsEditing(false);
  };

  const getProgressPercentage = () => {
    const startDate = new Date(defaultTargetDate.getTime() - 90 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const totalDuration = defaultTargetDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  };

  const getUrgencyLevel = () => {
    if (timeRemaining.isExpired) return 'expired';
    if (timeRemaining.totalDays <= 7) return 'critical';
    if (timeRemaining.totalDays <= 30) return 'urgent';
    return 'normal';
  };

  const getUrgencyColor = () => {
    switch (getUrgencyLevel()) {
      case 'expired': return 'text-red-600 dark:text-red-400';
      case 'critical': return 'text-red-500 dark:text-red-400';
      case 'urgent': return 'text-orange-500 dark:text-orange-400';
      default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getProgressColor = () => {
    switch (getUrgencyLevel()) {
      case 'expired': return 'from-red-500 to-red-600';
      case 'critical': return 'from-red-400 to-red-500';
      case 'urgent': return 'from-orange-400 to-orange-500';
      default: return 'from-blue-500 to-indigo-500';
    }
  };

  const getMilestoneStatus = () => {
    const progress = getProgressPercentage();
    if (progress >= 66.67) return { milestone: '30-Day Mark', status: 'passed', color: 'text-green-600' };
    if (progress >= 33.33) return { milestone: '60-Day Mark', status: 'passed', color: 'text-green-600' };
    return { milestone: '90-Day Sprint', status: 'approaching', color: 'text-blue-600' };
  };

  const milestoneStatus = getMilestoneStatus();
  const progressPercentage = getProgressPercentage();

  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl shadow-blue-500/5 dark:shadow-blue-400/5">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
            <Timer className="w-5 h-5" />
            90-Day Sprint
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`text-sm ${getUrgencyColor()} border-current`}
            >
              {getUrgencyLevel().toUpperCase()}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Edit Form */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={editGoal}
                  onChange={(e) => setEditGoal(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your 90-day goal..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveChanges} size="sm">
                  Save Changes
                </Button>
                <Button 
                  onClick={() => setIsEditing(false)} 
                  variant="outline" 
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Goal Title */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {goalTitle}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Target: {defaultTargetDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Countdown Display */}
        {timeRemaining.isExpired ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
              Time&apos;s Up!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your 90-day sprint has ended. Time to celebrate and plan your next goal!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Days', value: timeRemaining.days },
              { label: 'Hours', value: timeRemaining.hours },
              { label: 'Minutes', value: timeRemaining.minutes },
              { label: 'Seconds', value: timeRemaining.seconds }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30"
              >
                <motion.div
                  key={item.value}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`text-3xl font-bold ${getUrgencyColor()}`}
                >
                  {item.value.toString().padStart(2, '0')}
                </motion.div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <motion.div
              className={`h-3 rounded-full bg-gradient-to-r ${getProgressColor()}`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Start</span>
            <span>30 Days</span>
            <span>60 Days</span>
            <span>90 Days</span>
          </div>
        </div>

        {/* Milestone Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-2">
            {milestoneStatus.status === 'passed' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <Target className="w-5 h-5 text-blue-600" />
            )}
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {milestoneStatus.milestone}
            </span>
          </div>
          <Badge 
            variant="outline" 
            className={`text-xs ${milestoneStatus.color} border-current`}
          >
            {milestoneStatus.status === 'passed' ? 'Completed' : 'In Progress'}
          </Badge>
        </div>

        {/* Urgency Message */}
        {getUrgencyLevel() === 'critical' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-800 dark:text-red-400">
                Final Week! Time to push hard and finish strong! 🔥
              </span>
            </div>
          </motion.div>
        )}

        {getUrgencyLevel() === 'urgent' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-800 dark:text-orange-400">
                Final stretch! Stay focused and maintain momentum! 💪
              </span>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default CountdownTimer;