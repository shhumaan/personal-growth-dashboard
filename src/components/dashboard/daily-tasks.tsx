'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Target, 
  Clock, 
  Trash2
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface DailyTask {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  category: 'work' | 'health' | 'learning' | 'personal' | 'finance';
  estimatedTime: number; // in minutes
  isCompleted: boolean;
  linkedGoalId?: string;
  dueTime?: string;
  completedAt?: string;
  createdAt: string;
}

interface DailyTasksProps {
  onTaskComplete?: (taskId: string) => void;
}

const PRIORITY_COLORS = {
  high: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400',
  low: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400'
};

const CATEGORY_COLORS = {
  work: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  health: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  learning: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  personal: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
  finance: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
};

export const DailyTasks: React.FC<DailyTasksProps> = ({ 
  onTaskComplete 
}) => {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState<Partial<DailyTask>>({
    title: '',
    description: '',
    priority: 'medium',
    category: 'work',
    estimatedTime: 30
  });

  const { currentEntry } = useAppStore();

  // Load tasks from localStorage or default tasks
  useEffect(() => {
    const savedTasks = localStorage.getItem('dailyTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Default tasks aligned with existing forms
      const defaultTasks: DailyTask[] = [
        {
          id: 'task-1',
          title: 'Job Applications',
          description: 'Apply to relevant job positions',
          priority: 'high',
          category: 'work',
          estimatedTime: 60,
          isCompleted: (currentEntry?.job_applications || 0) > 0,
          createdAt: new Date().toISOString()
        },
        {
          id: 'task-2',
          title: 'Study Session',
          description: 'Focus on skill development',
          priority: 'high',
          category: 'learning',
          estimatedTime: 120,
          isCompleted: (currentEntry?.study_hours || 0) > 0,
          createdAt: new Date().toISOString()
        },
        {
          id: 'task-3',
          title: 'Gym Workout',
          description: 'Physical exercise session',
          priority: 'medium',
          category: 'health',
          estimatedTime: 90,
          isCompleted: currentEntry?.gym || false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'task-4',
          title: 'Morning Reflection',
          description: 'Complete morning power-up session',
          priority: 'high',
          category: 'personal',
          estimatedTime: 15,
          isCompleted: currentEntry?.session_1_morning || false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'task-5',
          title: 'Evening Review',
          description: 'Complete evening deep dive session',
          priority: 'medium',
          category: 'personal',
          estimatedTime: 20,
          isCompleted: currentEntry?.session_3_evening || false,
          createdAt: new Date().toISOString()
        }
      ];
      setTasks(defaultTasks);
    }
  }, [currentEntry]);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('dailyTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleTaskToggle = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTasks = tasks.map(t => 
      t.id === taskId 
        ? { 
            ...t, 
            isCompleted: !t.isCompleted,
            completedAt: !t.isCompleted ? new Date().toISOString() : undefined
          }
        : t
    );
    
    setTasks(updatedTasks);
    
    // Trigger celebration for task completion
    if (!task.isCompleted) {
      onTaskComplete?.(taskId);
    }
  };

  const handleAddTask = () => {
    if (!newTask.title?.trim()) return;

    const task: DailyTask = {
      id: `task-${Date.now()}`,
      title: newTask.title!,
      description: newTask.description || '',
      priority: newTask.priority || 'medium',
      category: newTask.category || 'work',
      estimatedTime: newTask.estimatedTime || 30,
      isCompleted: false,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', priority: 'medium', category: 'work', estimatedTime: 30 });
    setShowAddForm(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    // Sort by priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  const completedCount = tasks.filter(t => t.isCompleted).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl shadow-blue-500/5 dark:shadow-blue-400/5">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
            <Target className="w-5 h-5" />
            Today&apos;s Tasks
          </CardTitle>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">
              {completedCount}/{totalCount} Complete
            </Badge>
            <Button
              size="sm"
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Task
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Daily Progress</span>
            <span>{Math.round(completionPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Add Task Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newTask.title || ''}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Description (optional)..."
                  value={newTask.description || ''}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                />
                <div className="flex gap-4">
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'high' | 'medium' | 'low' })}
                    className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value as 'work' | 'health' | 'learning' | 'personal' | 'finance' })}
                    className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="work">Work</option>
                    <option value="health">Health</option>
                    <option value="learning">Learning</option>
                    <option value="personal">Personal</option>
                    <option value="finance">Finance</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Minutes"
                    value={newTask.estimatedTime || ''}
                    onChange={(e) => setNewTask({ ...newTask, estimatedTime: parseInt(e.target.value) || 30 })}
                    className="w-24 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddTask} size="sm">
                    Add Task
                  </Button>
                  <Button 
                    onClick={() => setShowAddForm(false)} 
                    variant="outline" 
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tasks List */}
        <div className="space-y-3">
          {sortedTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                task.isCompleted 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleTaskToggle(task.id)}
                  className={`mt-1 transition-colors ${
                    task.isCompleted 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {task.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${
                      task.isCompleted 
                        ? 'line-through text-gray-500 dark:text-gray-400' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${PRIORITY_COLORS[task.priority]}`}>
                        {task.priority}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${CATEGORY_COLORS[task.category]}`}>
                        {task.category}
                      </Badge>
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className={`text-sm mt-1 ${
                      task.isCompleted 
                        ? 'text-gray-400 dark:text-gray-500' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {task.estimatedTime}m
                    </span>
                    {task.completedAt && (
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed {new Date(task.completedAt).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No tasks for today. Add your first task to get started!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyTasks;