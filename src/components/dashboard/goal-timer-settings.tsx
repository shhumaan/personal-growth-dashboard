'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Timer, 
  Target, 
  Calendar, 
  Edit3,
  Save,
  RefreshCw,
  Apple,
  Clock,
  Users,
  Heart
} from 'lucide-react';
import { createSprintCalendar } from '@/lib/apple-calendar';

interface GoalTimerSettings {
  goalTitle: string;
  familyGoal: string;
  userName: string;
  sprintStartDate: string;
  sprintDuration: number; // days
  reminderTimes: {
    morning: string;
    midday: string;
    evening: string;
    bedtime: string;
  };
  weeklyReviewDay: 'sunday' | 'saturday' | 'custom';
  customReviewTime: string;
  motivationLevel: 'gentle' | 'firm' | 'intense' | 'brutal';
}

interface GoalTimerSettingsProps {
  onSettingsChange?: (settings: GoalTimerSettings) => void;
}

export const GoalTimerSettings: React.FC<GoalTimerSettingsProps> = ({ 
  onSettingsChange 
}) => {
  const [settings, setSettings] = useState<GoalTimerSettings>({
    goalTitle: 'Master Personal Growth Sprint',
    familyGoal: 'Build a successful career to provide the best life for my family',
    userName: 'Champion',
    sprintStartDate: new Date().toISOString().split('T')[0],
    sprintDuration: 90,
    reminderTimes: {
      morning: '07:30',
      midday: '12:30',
      evening: '18:00',
      bedtime: '21:30'
    },
    weeklyReviewDay: 'sunday',
    customReviewTime: '10:00',
    motivationLevel: 'firm'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('goalTimerSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage and notify parent
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('goalTimerSettings', JSON.stringify(settings));
      onSettingsChange?.(settings);
      setIsEditing(false);
      
      // Optional: Send to backend
      // await fetch('/api/user/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // });
      
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof GoalTimerSettings, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReminderTimeChange = (
    reminderType: keyof GoalTimerSettings['reminderTimes'], 
    time: string
  ) => {
    setSettings(prev => ({
      ...prev,
      reminderTimes: {
        ...prev.reminderTimes,
        [reminderType]: time
      }
    }));
  };

  const calculateEndDate = () => {
    const startDate = new Date(settings.sprintStartDate);
    const endDate = new Date(startDate.getTime() + settings.sprintDuration * 24 * 60 * 60 * 1000);
    return endDate.toLocaleDateString();
  };

  const getDaysRemaining = () => {
    const startDate = new Date(settings.sprintStartDate);
    const endDate = new Date(startDate.getTime() + settings.sprintDuration * 24 * 60 * 60 * 1000);
    const now = new Date();
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    return Math.max(0, daysRemaining);
  };

  const handleDownloadCalendar = () => {
    const startDate = new Date(settings.sprintStartDate);
    createSprintCalendar(
      settings.goalTitle,
      settings.userName,
      settings.familyGoal,
      startDate
    );
  };

  const motivationLevels = [
    { 
      value: 'gentle', 
      label: 'Gentle Encouragement', 
      description: 'Supportive and understanding tone',
      color: 'text-blue-600'
    },
    { 
      value: 'firm', 
      label: 'Firm Motivation', 
      description: 'Direct and focused accountability',
      color: 'text-orange-600'
    },
    { 
      value: 'intense', 
      label: 'Intense Drive', 
      description: 'High-energy, no-excuses approach',
      color: 'text-red-600'
    },
    { 
      value: 'brutal', 
      label: 'Brutal Honesty', 
      description: 'Harsh truth, maximum accountability',
      color: 'text-red-800'
    }
  ] as const;

  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl shadow-blue-500/5 dark:shadow-blue-400/5">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
            <Timer className="w-5 h-5" />
            Goal Timer Settings
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {getDaysRemaining()} days left
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Goal Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            Goal Configuration
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sprint Title
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={settings.goalTitle}
                  onChange={(e) => handleInputChange('goalTitle', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your 90-day sprint title..."
                />
              ) : (
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md font-medium">
                  {settings.goalTitle}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={settings.userName}
                  onChange={(e) => handleInputChange('userName', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name..."
                />
              ) : (
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md font-medium">
                  {settings.userName}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Family Goal (What you&apos;re fighting for)
            </label>
            {isEditing ? (
              <textarea
                value={settings.familyGoal}
                onChange={(e) => handleInputChange('familyGoal', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Describe what you're working toward for your family..."
              />
            ) : (
              <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md italic font-medium text-gray-800 dark:text-gray-200">
                &quot;{settings.familyGoal}&quot;
              </div>
            )}
          </div>
        </div>

        {/* Sprint Timeline */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Sprint Timeline
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={settings.sprintStartDate}
                  onChange={(e) => handleInputChange('sprintStartDate', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md font-medium">
                  {new Date(settings.sprintStartDate).toLocaleDateString()}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (Days)
              </label>
              {isEditing ? (
                <input
                  type="number"
                  min="30"
                  max="365"
                  value={settings.sprintDuration}
                  onChange={(e) => handleInputChange('sprintDuration', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md font-medium">
                  {settings.sprintDuration} days
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md font-medium text-blue-800 dark:text-blue-200">
                {calculateEndDate()}
              </div>
            </div>
          </div>
        </div>

        {/* Reminder Times */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Daily Reminder Times
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(settings.reminderTimes).map(([type, time]) => (
              <div key={type}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                  {type}
                </label>
                {isEditing ? (
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => handleReminderTimeChange(type as keyof GoalTimerSettings['reminderTimes'], e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md font-medium text-center">
                    {time}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Motivation Level */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Motivation Intensity
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {motivationLevels.map((level) => (
              <button
                key={level.value}
                disabled={!isEditing}
                onClick={() => handleInputChange('motivationLevel', level.value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  settings.motivationLevel === level.value
                    ? `border-current ${level.color} bg-gray-50 dark:bg-gray-800`
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                } ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className={`font-semibold ${level.color}`}>
                  {level.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {level.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {isEditing ? (
            <>
              <Button 
                onClick={saveSettings}
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Settings
              </Button>
              <Button 
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={handleDownloadCalendar}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              >
                <Apple className="w-4 h-4 mr-2" />
                Download Apple Calendar
              </Button>
              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="flex-1"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Settings
              </Button>
            </>
          )}
        </div>

        {/* Preview */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-900 dark:text-blue-400 mb-2">
            Current Sprint Overview
          </h4>
          <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <p>• <strong>{settings.userName}</strong> is working toward: &quot;{settings.familyGoal}&quot;</p>
            <p>• {getDaysRemaining()} days remaining in &quot;{settings.goalTitle}&quot;</p>
            <p>• Daily reminders at {settings.reminderTimes.morning}, {settings.reminderTimes.evening}</p>
            <p>• Motivation level: <span className="font-semibold">{motivationLevels.find(l => l.value === settings.motivationLevel)?.label}</span></p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalTimerSettings;