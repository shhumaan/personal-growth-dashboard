'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Target, TrendingUp, Clock } from 'lucide-react';

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

function ProgressRing({ 
  value, 
  max, 
  size = 100, 
  strokeWidth = 8, 
  color = '#3B82F6',
  backgroundColor = '#E5E7EB',
  label = '',
  showPercentage = true,
  animated = true
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((value / max) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? circumference : strokeDashoffset}
          animate={animated ? { strokeDashoffset } : {}}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {showPercentage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-lg font-bold text-gray-800 dark:text-gray-200"
          >
            {Math.min(Math.round(percentage), 100)}%
          </motion.div>
        )}
        {label && (
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {label}
          </div>
        )}
      </div>
    </div>
  );
}

interface EnhancedProgressRingsProps {
  dailyProgress: number;
  weeklyProgress: number;
  monthlyProgress: number;
  yearlyProgress: number;
  streakDays: number;
  totalSessions: number;
  completedToday: number;
  className?: string;
}

export function EnhancedProgressRings({
  dailyProgress = 0,
  weeklyProgress = 0,
  monthlyProgress = 0,
  yearlyProgress = 0,
  streakDays = 0,
  totalSessions = 0,
  completedToday = 0,
  className = ''
}: EnhancedProgressRingsProps) {
  const progressData = [
    {
      label: 'Today',
      value: dailyProgress,
      max: 100,
      color: '#10B981',
      icon: Clock,
      description: `${completedToday}/4 sessions`,
      size: 120
    },
    {
      label: 'This Week',
      value: weeklyProgress,
      max: 100,
      color: '#3B82F6',
      icon: Calendar,
      description: `${Math.round(weeklyProgress)}% complete`,
      size: 100
    },
    {
      label: 'This Month',
      value: monthlyProgress,
      max: 100,
      color: '#8B5CF6',
      icon: Target,
      description: `${Math.round(monthlyProgress)}% complete`,
      size: 100
    },
    {
      label: 'This Year',
      value: yearlyProgress,
      max: 100,
      color: '#F59E0B',
      icon: TrendingUp,
      description: `${Math.round(yearlyProgress)}% complete`,
      size: 100
    }
  ];

  const getProgressStatus = (value: number) => {
    if (value >= 90) return { text: 'Excellent', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' };
    if (value >= 70) return { text: 'Great', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' };
    if (value >= 50) return { text: 'Good', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' };
    return { text: 'Keep Going', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' };
  };

  return (
    <motion.div 
      className={`${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl shadow-blue-500/5 dark:shadow-blue-400/5 overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-200 bg-clip-text text-transparent flex items-center gap-3">
            <motion.div
              className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40"
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </motion.div>
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Main daily progress ring */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <ProgressRing
                value={progressData[0].value}
                max={progressData[0].max}
                size={140}
                strokeWidth={12}
                color={progressData[0].color}
                backgroundColor="rgba(209, 213, 219, 0.3)"
                label="Today"
                showPercentage={true}
                animated={true}
              />
            </motion.div>
            <motion.div 
              className="mt-4 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Badge className={`${getProgressStatus(dailyProgress).color} font-semibold px-3 py-1`}>
                {getProgressStatus(dailyProgress).text}
              </Badge>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                {progressData[0].description}
              </p>
            </motion.div>
          </div>

          {/* Secondary progress rings */}
          <div className="grid grid-cols-3 gap-4">
            {progressData.slice(1).map((data, index) => {
              const IconComponent = data.icon;
              return (
                <motion.div
                  key={data.label}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <ProgressRing
                    value={data.value}
                    max={data.max}
                    size={80}
                    strokeWidth={6}
                    color={data.color}
                    backgroundColor="rgba(209, 213, 219, 0.3)"
                    showPercentage={false}
                    animated={true}
                  />
                  <div className="mt-3 text-center">
                    <div className="flex items-center gap-1 justify-center mb-1">
                      <IconComponent className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {data.label}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      {Math.round(data.value)}%
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Stats summary */}
          <motion.div 
            className="mt-8 grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {streakDays}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Day Streak
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {totalSessions}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Total Sessions
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

