'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Calendar, TrendingUp, CheckCircle, Clock, Star, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/ui/progress-ring';

interface Goal {
  id: string;
  title: string;
  description?: string;
  category: 'personal' | 'career' | 'health' | 'learning' | 'financial' | 'relationships';
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  target_value?: number;
  current_value: number;
  target_date?: string;
  progress_percentage: number;
  completed_at?: string;
  track_daily: boolean;
  created_at: string;
}

interface GoalsSectionProps {
  className?: string;
}

export function GoalsSection({ className = '' }: GoalsSectionProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load goals from local storage (settings page custom goals)
  useEffect(() => {
    try {
      const savedCustomGoals = localStorage.getItem('customGoals');
      if (savedCustomGoals) {
        const customGoals = JSON.parse(savedCustomGoals);
        // Convert custom goals to goals format
        const convertedGoals: Goal[] = customGoals.map((goal: any) => ({
          id: goal.id,
          title: goal.title,
          description: goal.description,
          category: goal.category as 'personal' | 'career' | 'health' | 'learning' | 'financial' | 'relationships',
          status: goal.currentValue >= goal.targetValue ? 'completed' : 'active',
          priority: 'medium',
          target_value: goal.targetValue,
          current_value: goal.currentValue,
          progress_percentage: Math.round((goal.currentValue / goal.targetValue) * 100),
          track_daily: true,
          created_at: new Date().toISOString()
        }));
        setGoals(convertedGoals);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading custom goals:', error);
      setGoals([]);
      setIsLoading(false);
    }
  }, []);

  const filteredGoals = goals.filter(goal => {
    const statusMatch = filter === 'all' || goal.status === filter;
    const categoryMatch = categoryFilter === 'all' || goal.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const categories = ['all', 'personal', 'career', 'health', 'learning', 'financial', 'relationships'];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health': return '🏃‍♂️';
      case 'learning': return '📚';
      case 'career': return '💼';
      case 'financial': return '💰';
      case 'personal': return '🧘‍♂️';
      case 'relationships': return '❤️';
      default: return '🎯';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'active': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'paused': return <Clock className="w-4 h-4 text-orange-500" />;
      default: return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  const isOverdue = (goal: Goal) => {
    if (!goal.target_date || goal.status === 'completed') return false;
    return new Date(goal.target_date) < new Date() && goal.status === 'active';
  };

  const getDaysRemaining = (targetDate: string) => {
    const days = Math.ceil((new Date(targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (isLoading) {
    return (
      <Card className={`dashboard-card ${className}`}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`dashboard-card overflow-hidden ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            Goals
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => {
            // Simple goal addition - you can enhance this with a proper modal
            const title = prompt('Enter goal title:');
            if (title) {
              const newGoal: Goal = {
                id: Date.now().toString(),
                title,
                category: 'personal',
                status: 'active',
                priority: 'medium',
                current_value: 0,
                progress_percentage: 0,
                track_daily: false,
                created_at: new Date().toISOString()
              };
              setGoals([...goals, newGoal]);
            }
          }}>
            <Plus className="w-4 h-4 mr-1" />
            Add Goal
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <div className="flex gap-1">
            {['all', 'active', 'completed'].map((status) => (
              <Button
                key={status}
                size="sm"
                variant={filter === status ? "default" : "outline"}
                onClick={() => setFilter(status as any)}
                className="text-xs"
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {goals.filter(g => g.status === 'active').length}
            </div>
            <div className="text-xs text-gray-500">Active Goals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {goals.filter(g => g.status === 'completed').length}
            </div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress_percentage, 0) / goals.length) : 0}%
            </div>
            <div className="text-xs text-gray-500">Avg Progress</div>
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  goal.status === 'completed' 
                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                    : isOverdue(goal)
                    ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(goal.status)}
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">
                        {goal.title}
                      </h3>
                      <span className="text-lg">{getCategoryIcon(goal.category)}</span>
                    </div>
                    
                    {goal.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {goal.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getPriorityColor(goal.priority)} variant="outline">
                        {goal.priority}
                      </Badge>
                      
                      {goal.target_date && (
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {isOverdue(goal) ? 'Overdue' : `${getDaysRemaining(goal.target_date)} days`}
                        </Badge>
                      )}
                      
                      {goal.track_daily && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          Daily
                        </Badge>
                      )}
                    </div>
                    
                    {goal.target_value && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Progress: {goal.current_value} / {goal.target_value}
                        {goal.category === 'financial' && ' $'}
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    <ProgressRing 
                      progress={goal.progress_percentage} 
                      size={60}
                      strokeWidth={6}
                      color={goal.status === 'completed' ? '#22c55e' : '#8b5cf6'}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredGoals.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {filter === 'all' ? 'No goals yet' : `No ${filter} goals`}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">
              {filter === 'all' 
                ? 'Set your first goal and start your journey towards success!' 
                : `You don't have any ${filter} goals right now.`
              }
            </p>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg"
              onClick={() => {
                const title = prompt('Enter goal title:');
                if (title) {
                  const newGoal: Goal = {
                    id: Date.now().toString(),
                    title,
                    category: 'personal',
                    status: 'active',
                    priority: 'medium',
                    current_value: 0,
                    progress_percentage: 0,
                    track_daily: false,
                    created_at: new Date().toISOString()
                  };
                  setGoals([...goals, newGoal]);
                }
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              {filter === 'all' ? 'Create your first goal' : 'Add new goal'}
            </Button>
          </div>
        )}

        {/* Goal insights */}
        {goals.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-3 mt-6">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              🎯 Goal Insights
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {goals.filter(g => g.status === 'completed').length === 0 ? 
                "Start achieving your goals! Complete your first goal to build momentum." :
                goals.filter(g => isOverdue(g)).length > 0 ?
                `You have ${goals.filter(g => isOverdue(g)).length} overdue goal(s). Consider adjusting timelines or priorities.` :
                goals.filter(g => g.status === 'active').length > 5 ?
                "You have many active goals. Consider focusing on the most important ones." :
                "Great progress! Keep working consistently towards your goals."
              }
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}