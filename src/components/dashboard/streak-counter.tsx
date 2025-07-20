'use client';

import { motion } from 'framer-motion';
import { Flame, Trophy, Star, Calendar, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak?: number;
  totalDays?: number;
  className?: string;
}

export function StreakCounter({ 
  currentStreak, 
  longestStreak = 0, 
  totalDays = 0,
  className = '' 
}: StreakCounterProps) {
  const getStreakStatus = () => {
    if (currentStreak === 0) return { text: 'Start your journey!', color: 'text-gray-500', bgColor: 'bg-gray-100' };
    if (currentStreak < 7) return { text: 'Building momentum', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (currentStreak < 30) return { text: 'On fire!', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    if (currentStreak < 100) return { text: 'Unstoppable!', color: 'text-red-600', bgColor: 'bg-red-100' };
    return { text: 'Legend!', color: 'text-purple-600', bgColor: 'bg-purple-100' };
  };

  const getStreakIcon = () => {
    if (currentStreak === 0) return Target;
    if (currentStreak < 7) return Calendar;
    if (currentStreak < 30) return Flame;
    if (currentStreak < 100) return Trophy;
    return Star;
  };

  const status = getStreakStatus();
  const StreakIcon = getStreakIcon();

  const getNextMilestone = () => {
    if (currentStreak < 7) return { target: 7, label: 'Week Warrior' };
    if (currentStreak < 30) return { target: 30, label: 'Month Master' };
    if (currentStreak < 100) return { target: 100, label: 'Century Club' };
    if (currentStreak < 365) return { target: 365, label: 'Year Champion' };
    return { target: currentStreak + 100, label: 'Legend' };
  };

  const milestone = getNextMilestone();
  const progressToNextMilestone = Math.min((currentStreak / milestone.target) * 100, 100);

  return (
    <Card className={`dashboard-card ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <StreakIcon className="w-5 h-5 text-orange-500" />
          Streak Counter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Streak Display */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="text-4xl font-bold text-orange-500 mb-2">
              {currentStreak}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {currentStreak === 1 ? 'day' : 'days'} in a row
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color} mt-2`}>
              {status.text}
            </div>
          </motion.div>
        </div>

        {/* Progress to Next Milestone */}
        {currentStreak < milestone.target && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Next: {milestone.label}</span>
              <span className="text-gray-600 dark:text-gray-400">{currentStreak}/{milestone.target}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToNextMilestone}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full"
              />
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">{longestStreak}</div>
            <div className="text-xs text-gray-500">Best Streak</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">{totalDays}</div>
            <div className="text-xs text-gray-500">Total Days</div>
          </div>
        </div>

        {/* Motivation Message */}
        <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentStreak === 0 ? 
              "🎯 Complete your first session to start your streak!" :
              currentStreak === 1 ?
              "🔥 Great start! One more day to build momentum!" :
              currentStreak < 7 ?
              `💪 ${7 - currentStreak} days to your first week!` :
              currentStreak < 30 ?
              `🚀 ${30 - currentStreak} days to your first month!` :
              "🌟 You're absolutely crushing it! Keep going!"
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}