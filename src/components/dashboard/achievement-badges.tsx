'use client';

import { motion } from 'framer-motion';
import { Trophy, Star, Flame, Target, Calendar, Zap, Heart, Brain, Award, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  requirement: number;
  currentProgress: number;
  category: 'streak' | 'sessions' | 'consistency' | 'milestones' | 'mood' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  isUnlocked: boolean;
}

interface AchievementBadgesProps {
  streakDays: number;
  totalSessions: number;
  completedDays: number;
  perfectDays: number;
  averageMood: number;
  averageEnergy: number;
  className?: string;
}

export function AchievementBadges({
  streakDays = 0,
  totalSessions = 0,
  completedDays = 0,
  perfectDays = 0,
  averageMood = 0,
  averageEnergy = 0,
  className = ''
}: AchievementBadgesProps) {
  // Load custom achievements from localStorage
  const getCustomAchievements = (): Achievement[] => {
    try {
      const savedAchievements = localStorage.getItem('customAchievements');
      if (savedAchievements) {
        const customAchievements = JSON.parse(savedAchievements);
        return customAchievements.map((custom: any) => ({
          id: `custom-${custom.id}`,
          title: custom.title,
          description: custom.description,
          icon: Trophy, // Default icon for custom achievements
          color: custom.color,
          bgColor: custom.color.includes('blue') ? 'bg-blue-100' :
                   custom.color.includes('green') ? 'bg-green-100' :
                   custom.color.includes('purple') ? 'bg-purple-100' :
                   custom.color.includes('orange') ? 'bg-orange-100' :
                   custom.color.includes('red') ? 'bg-red-100' :
                   'bg-yellow-100',
          requirement: custom.requirement,
          currentProgress: 0, // This could be connected to actual progress tracking
          category: 'special' as const,
          rarity: custom.requirement >= 100 ? 'legendary' as const :
                  custom.requirement >= 50 ? 'epic' as const :
                  custom.requirement >= 20 ? 'rare' as const : 'common' as const,
          isUnlocked: false // Could be connected to actual achievement tracking
        }));
      }
    } catch (error) {
      console.error('Error loading custom achievements:', error);
    }
    return [];
  };

  // Define all possible achievements (default + custom)
  const achievements: Achievement[] = [
    // Streak Achievements
    {
      id: 'first-day',
      title: 'First Step',
      description: 'Complete your first day',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      requirement: 1,
      currentProgress: streakDays,
      category: 'streak',
      rarity: 'common',
      isUnlocked: streakDays >= 1
    },
    {
      id: 'week-warrior',
      title: 'Week Warrior',
      description: '7 days in a row',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      requirement: 7,
      currentProgress: streakDays,
      category: 'streak',
      rarity: 'common',
      isUnlocked: streakDays >= 7
    },
    {
      id: 'month-master',
      title: 'Month Master',
      description: '30 days in a row',
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      requirement: 30,
      currentProgress: streakDays,
      category: 'streak',
      rarity: 'rare',
      isUnlocked: streakDays >= 30
    },
    {
      id: 'century-club',
      title: 'Century Club',
      description: '100 days in a row',
      icon: Trophy,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      requirement: 100,
      currentProgress: streakDays,
      category: 'streak',
      rarity: 'epic',
      isUnlocked: streakDays >= 100
    },
    {
      id: 'year-champion',
      title: 'Year Champion',
      description: '365 days in a row',
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      requirement: 365,
      currentProgress: streakDays,
      category: 'streak',
      rarity: 'legendary',
      isUnlocked: streakDays >= 365
    },

    // Session Achievements
    {
      id: 'session-starter',
      title: 'Session Starter',
      description: 'Complete 10 sessions',
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      requirement: 10,
      currentProgress: totalSessions,
      category: 'sessions',
      rarity: 'common',
      isUnlocked: totalSessions >= 10
    },
    {
      id: 'session-pro',
      title: 'Session Pro',
      description: 'Complete 100 sessions',
      icon: Star,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      requirement: 100,
      currentProgress: totalSessions,
      category: 'sessions',
      rarity: 'rare',
      isUnlocked: totalSessions >= 100
    },
    {
      id: 'session-master',
      title: 'Session Master',
      description: 'Complete 500 sessions',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      requirement: 500,
      currentProgress: totalSessions,
      category: 'sessions',
      rarity: 'epic',
      isUnlocked: totalSessions >= 500
    },

    // Consistency Achievements
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: '10 perfect days (100% completion)',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      requirement: 10,
      currentProgress: perfectDays,
      category: 'consistency',
      rarity: 'rare',
      isUnlocked: perfectDays >= 10
    },
    {
      id: 'dedicated',
      title: 'Dedicated',
      description: '50 days completed',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      requirement: 50,
      currentProgress: completedDays,
      category: 'consistency',
      rarity: 'rare',
      isUnlocked: completedDays >= 50
    },

    // Mood Achievements
    {
      id: 'positive-vibes',
      title: 'Positive Vibes',
      description: 'Maintain 7+ average mood',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      requirement: 7,
      currentProgress: averageMood,
      category: 'mood',
      rarity: 'rare',
      isUnlocked: averageMood >= 7
    },
    {
      id: 'energy-master',
      title: 'Energy Master',
      description: 'Maintain 8+ average energy',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      requirement: 8,
      currentProgress: averageEnergy,
      category: 'mood',
      rarity: 'rare',
      isUnlocked: averageEnergy >= 8
    },
    {
      id: 'zen-master',
      title: 'Zen Master',
      description: 'Maintain 9+ average mood and energy',
      icon: Brain,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      requirement: 9,
      currentProgress: Math.min(averageMood, averageEnergy),
      category: 'mood',
      rarity: 'epic',
      isUnlocked: averageMood >= 9 && averageEnergy >= 9
    },
    // Add custom achievements
    ...getCustomAchievements()
  ];

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const nextAchievements = achievements
    .filter(a => !a.isUnlocked)
    .sort((a, b) => (a.requirement - a.currentProgress) - (b.requirement - b.currentProgress))
    .slice(0, 3);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityBadge = (rarity: string) => {
    const colors = {
      common: 'bg-gray-100 text-gray-800',
      rare: 'bg-blue-100 text-blue-800',
      epic: 'bg-purple-100 text-purple-800',
      legendary: 'bg-yellow-100 text-yellow-800'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  return (
    <Card className={`dashboard-card ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Achievements
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {unlockedAchievements.length}/{achievements.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Unlocked Achievements */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Unlocked ({unlockedAchievements.length})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {unlockedAchievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border-2 ${getRarityColor(achievement.rarity)} relative`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${achievement.bgColor}`}>
                      <Icon className={`w-4 h-4 ${achievement.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                        {achievement.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    className={`absolute -top-1 -right-1 text-xs ${getRarityBadge(achievement.rarity)}`}
                    variant="secondary"
                  >
                    {achievement.rarity}
                  </Badge>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Next Achievements */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Next Goals
          </h3>
          <div className="space-y-3">
            {nextAchievements.map((achievement, index) => {
              const Icon = achievement.icon;
              const progress = Math.min((achievement.currentProgress / achievement.requirement) * 100, 100);
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${achievement.bgColor} opacity-50`}>
                      <Icon className={`w-4 h-4 ${achievement.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {achievement.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {Math.floor(achievement.currentProgress)}/{achievement.requirement}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {achievement.description}
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Achievement Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            🏆 Achievement Progress
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {unlockedAchievements.length === 0 ? 
              "Start your journey to unlock your first achievement!" :
              unlockedAchievements.length < 5 ?
              "Great start! Keep going to unlock more achievements." :
              unlockedAchievements.length < 10 ?
              "You're building an impressive collection!" :
              "Achievement master! You're an inspiration to others."
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}