'use client'

import React from 'react'
import { Card, CardContent } from '../ui/card'
import { ProgressRing } from '../ui/progress-ring'
import { motion } from 'framer-motion'
import { TrendingUp, Target, Calendar, Zap } from 'lucide-react'

interface DashboardStatsProps {
  todayProgress: number
  streakDays: number
  weeklyAverage: number
  totalEntries: number
}

export function DashboardStats({ 
  todayProgress, 
  streakDays, 
  weeklyAverage, 
  totalEntries 
}: DashboardStatsProps) {
  const stats = [
    {
      title: "Today's Progress",
      value: `${todayProgress}%`,
      icon: Target,
      color: "text-purple-400",
      bgColor: "from-purple-500/20 to-purple-600/20",
      component: (
        <ProgressRing 
          progress={todayProgress} 
          size={60} 
          strokeWidth={6}
        />
      )
    },
    {
      title: "Current Streak",
      value: `${streakDays} days`,
      icon: Zap,
      color: "text-orange-400",
      bgColor: "from-orange-500/20 to-orange-600/20"
    },
    {
      title: "Weekly Average",
      value: `${weeklyAverage}%`,
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "from-green-500/20 to-green-600/20"
    },
    {
      title: "Total Entries",
      value: totalEntries.toString(),
      icon: Calendar,
      color: "text-blue-400",
      bgColor: "from-blue-500/20 to-blue-600/20"
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.bgColor}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  {stat.component && stat.component}
                </div>
                
                <div>
                  <p className="text-white/60 text-xs font-medium mb-1">
                    {stat.title}
                  </p>
                  {!stat.component && (
                    <p className="text-white text-lg font-bold">
                      {stat.value}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
