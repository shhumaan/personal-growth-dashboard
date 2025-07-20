'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Calendar, Target, Brain, Heart, Zap, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WeeklyData {
  week: string;
  totalSessions: number;
  avgCompletion: number;
  avgMood: number;
  avgEnergy: number;
  avgFocus: number;
  avgHealth: number;
  perfectDays: number;
  totalJobApps: number;
  totalStudyHours: number;
  gymSessions: number;
  streakDays: number;
}

interface WeeklyAnalyticsProps {
  className?: string;
}

export function WeeklyAnalytics({ className = '' }: WeeklyAnalyticsProps) {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = current week
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - this would come from your API
  useEffect(() => {
    setTimeout(() => {
      const mockData: WeeklyData[] = [
        {
          week: 'This Week',
          totalSessions: 14,
          avgCompletion: 78,
          avgMood: 7.2,
          avgEnergy: 6.8,
          avgFocus: 7.5,
          avgHealth: 6.9,
          perfectDays: 2,
          totalJobApps: 5,
          totalStudyHours: 12.5,
          gymSessions: 3,
          streakDays: 4,
        },
        {
          week: 'Last Week',
          totalSessions: 16,
          avgCompletion: 82,
          avgMood: 6.9,
          avgEnergy: 7.1,
          avgFocus: 7.2,
          avgHealth: 7.3,
          perfectDays: 3,
          totalJobApps: 7,
          totalStudyHours: 15.0,
          gymSessions: 4,
          streakDays: 5,
        },
        {
          week: '2 Weeks Ago',
          totalSessions: 12,
          avgCompletion: 65,
          avgMood: 6.5,
          avgEnergy: 6.2,
          avgFocus: 6.8,
          avgHealth: 6.4,
          perfectDays: 1,
          totalJobApps: 3,
          totalStudyHours: 8.0,
          gymSessions: 2,
          streakDays: 3,
        },
        {
          week: '3 Weeks Ago',
          totalSessions: 10,
          avgCompletion: 58,
          avgMood: 6.1,
          avgEnergy: 5.9,
          avgFocus: 6.3,
          avgHealth: 6.0,
          perfectDays: 1,
          totalJobApps: 2,
          totalStudyHours: 6.5,
          gymSessions: 1,
          streakDays: 2,
        },
      ];
      setWeeklyData(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const currentWeek = weeklyData[selectedWeek];
  const previousWeek = weeklyData[selectedWeek + 1];

  const getTrend = (current: number, previous: number) => {
    if (!previous) return { trend: 0, icon: null, color: 'text-gray-500' };
    const change = ((current - previous) / previous) * 100;
    if (change > 5) return { trend: change, icon: TrendingUp, color: 'text-green-500' };
    if (change < -5) return { trend: change, icon: TrendingDown, color: 'text-red-500' };
    return { trend: change, icon: null, color: 'text-gray-500' };
  };

  const MetricCard = ({ 
    title, 
    value, 
    unit = '', 
    icon: Icon, 
    current, 
    previous, 
    color = 'text-blue-500',
    format = 'number'
  }: {
    title: string;
    value: number;
    unit?: string;
    icon: any;
    current: number;
    previous?: number;
    color?: string;
    format?: 'number' | 'decimal' | 'percentage';
  }) => {
    const trend = previous ? getTrend(current, previous) : { trend: 0, icon: null, color: 'text-gray-500' };
    const TrendIcon = trend.icon;
    
    const formatValue = (val: number) => {
      switch (format) {
        case 'decimal': return val.toFixed(1);
        case 'percentage': return `${val}%`;
        default: return val.toString();
      }
    };

    return (
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Icon className={`w-5 h-5 ${color}`} />
            {TrendIcon && (
              <div className={`flex items-center ${trend.color}`}>
                <TrendIcon className="w-4 h-4 mr-1" />
                <span className="text-xs font-medium">
                  {Math.abs(trend.trend).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {formatValue(value)}{unit}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {title}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <Card className={`dashboard-card ${className}`}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentWeek) {
    return (
      <Card className={`dashboard-card ${className}`}>
        <CardContent className="p-6 text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No analytics data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`dashboard-card ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Weekly Analytics
          </CardTitle>
          <div className="flex gap-1">
            {weeklyData.map((week, index) => (
              <Button
                key={week.week}
                size="sm"
                variant={selectedWeek === index ? "default" : "outline"}
                onClick={() => setSelectedWeek(index)}
                className="text-xs"
              >
                {week.week}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Completion Rate"
            value={currentWeek.avgCompletion}
            icon={Target}
            current={currentWeek.avgCompletion}
            previous={previousWeek?.avgCompletion}
            color="text-purple-500"
            format="percentage"
          />
          
          <MetricCard
            title="Total Sessions"
            value={currentWeek.totalSessions}
            icon={Clock}
            current={currentWeek.totalSessions}
            previous={previousWeek?.totalSessions}
            color="text-blue-500"
          />
          
          <MetricCard
            title="Perfect Days"
            value={currentWeek.perfectDays}
            icon={Target}
            current={currentWeek.perfectDays}
            previous={previousWeek?.perfectDays}
            color="text-green-500"
          />
          
          <MetricCard
            title="Streak Days"
            value={currentWeek.streakDays}
            icon={TrendingUp}
            current={currentWeek.streakDays}
            previous={previousWeek?.streakDays}
            color="text-orange-500"
          />
        </div>

        {/* Wellness Metrics */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Wellness Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="Avg Mood"
              value={currentWeek.avgMood}
              unit="/10"
              icon={Heart}
              current={currentWeek.avgMood}
              previous={previousWeek?.avgMood}
              color="text-red-500"
              format="decimal"
            />
            
            <MetricCard
              title="Avg Energy"
              value={currentWeek.avgEnergy}
              unit="/10"
              icon={Zap}
              current={currentWeek.avgEnergy}
              previous={previousWeek?.avgEnergy}
              color="text-yellow-500"
              format="decimal"
            />
            
            <MetricCard
              title="Avg Focus"
              value={currentWeek.avgFocus}
              unit="/10"
              icon={Brain}
              current={currentWeek.avgFocus}
              previous={previousWeek?.avgFocus}
              color="text-blue-500"
              format="decimal"
            />
            
            <MetricCard
              title="Avg Health"
              value={currentWeek.avgHealth}
              unit="/10"
              icon={Heart}
              current={currentWeek.avgHealth}
              previous={previousWeek?.avgHealth}
              color="text-green-500"
              format="decimal"
            />
          </div>
        </div>

        {/* Activity Metrics */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Activity Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-500 mb-1">
                  {currentWeek.totalJobApps}
                </div>
                <div className="text-xs text-gray-500">Job Applications</div>
                {previousWeek && (
                  <div className="text-xs mt-1">
                    {currentWeek.totalJobApps > previousWeek.totalJobApps ? (
                      <span className="text-green-500">↗ +{currentWeek.totalJobApps - previousWeek.totalJobApps}</span>
                    ) : currentWeek.totalJobApps < previousWeek.totalJobApps ? (
                      <span className="text-red-500">↘ -{previousWeek.totalJobApps - currentWeek.totalJobApps}</span>
                    ) : (
                      <span className="text-gray-500">→ Same</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-500 mb-1">
                  {currentWeek.totalStudyHours}h
                </div>
                <div className="text-xs text-gray-500">Study Hours</div>
                {previousWeek && (
                  <div className="text-xs mt-1">
                    {currentWeek.totalStudyHours > previousWeek.totalStudyHours ? (
                      <span className="text-green-500">↗ +{(currentWeek.totalStudyHours - previousWeek.totalStudyHours).toFixed(1)}h</span>
                    ) : currentWeek.totalStudyHours < previousWeek.totalStudyHours ? (
                      <span className="text-red-500">↘ -{(previousWeek.totalStudyHours - currentWeek.totalStudyHours).toFixed(1)}h</span>
                    ) : (
                      <span className="text-gray-500">→ Same</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500 mb-1">
                  {currentWeek.gymSessions}
                </div>
                <div className="text-xs text-gray-500">Gym Sessions</div>
                {previousWeek && (
                  <div className="text-xs mt-1">
                    {currentWeek.gymSessions > previousWeek.gymSessions ? (
                      <span className="text-green-500">↗ +{currentWeek.gymSessions - previousWeek.gymSessions}</span>
                    ) : currentWeek.gymSessions < previousWeek.gymSessions ? (
                      <span className="text-red-500">↘ -{previousWeek.gymSessions - currentWeek.gymSessions}</span>
                    ) : (
                      <span className="text-gray-500">→ Same</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Weekly Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            📊 Weekly Insights
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {currentWeek.avgCompletion >= 80 ? 
              "Excellent week! You're maintaining high completion rates and consistent progress." :
              currentWeek.avgCompletion >= 60 ?
              "Good progress this week. Consider focusing on completing more daily sessions." :
              "This week shows room for improvement. Try to establish more consistent daily habits."
            }
            {previousWeek && currentWeek.avgCompletion > previousWeek.avgCompletion && 
              " You're showing positive growth compared to last week!"
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}