'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Clock, 
  Check,
  X,
  Calendar,
  Target,
  TrendingUp,
  Heart
} from 'lucide-react';
import { emailService, saveEmailSettings, loadEmailSettings, defaultEmailSettings } from '@/lib/email-service';

interface EmailSettings {
  dailyReminders: boolean;
  weeklyReports: boolean;
  milestoneAlerts: boolean;
  motivationalEmails: boolean;
  preferredTime: string;
  timezone: string;
}

interface EmailSettingsProps {
  userId?: string;
  userEmail?: string;
}

export const EmailSettings: React.FC<EmailSettingsProps> = ({ 
  userId = 'default-user',
  userEmail = ''
}) => {
  const [settings, setSettings] = useState<EmailSettings>(defaultEmailSettings);
  const [email, setEmail] = useState(userEmail);
  const [isTestingSample, setIsTestingSample] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<'success' | 'error' | null>(null);

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = loadEmailSettings(userId);
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, [userId]);

  // Save settings whenever they change
  useEffect(() => {
    saveEmailSettings(userId, settings);
  }, [settings, userId]);

  const handleSettingChange = (key: keyof EmailSettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTestEmail = async () => {
    if (!email) {
      alert('Please enter your email address first');
      return;
    }

    setIsTestingSample(true);
    setLastTestResult(null);

    try {
      // Generate sample data for testing
      const sampleProgress = {
        completedTasks: 3,
        totalTasks: 5,
        currentStreak: 7,
        goalProgress: 45,
        daysRemaining: 67,
        recentAchievements: ['Completed 7-day streak', 'Finished morning routine', 'Achieved daily goal']
      };

      const template = emailService.generateDailyReminderEmail(sampleProgress);
      const success = await emailService.sendEmail(email, template);
      
      setLastTestResult(success ? 'success' : 'error');
    } catch (error) {
      console.error('Test email failed:', error);
      setLastTestResult('error');
    } finally {
      setIsTestingSample(false);
    }
  };

  const getTimezoneDisplay = () => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZoneName: 'long',
        timeZone: settings.timezone
      }).formatToParts(new Date()).find(part => part.type === 'timeZoneName')?.value || settings.timezone;
    } catch {
      return settings.timezone;
    }
  };

  const emailTypes = [
    {
      key: 'dailyReminders' as keyof EmailSettings,
      title: 'Daily Goal Reminders',
      description: 'Get your daily tasks and motivation every morning',
      icon: Calendar,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      key: 'weeklyReports' as keyof EmailSettings,
      title: 'Weekly Progress Reports',
      description: 'Comprehensive weekly summary of your achievements',
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      key: 'milestoneAlerts' as keyof EmailSettings,
      title: 'Milestone Celebrations',
      description: 'Notifications when you reach important milestones',
      icon: Target,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      key: 'motivationalEmails' as keyof EmailSettings,
      title: 'Motivational Messages',
      description: 'Inspirational content to keep you motivated',
      icon: Heart,
      color: 'text-pink-600 dark:text-pink-400'
    }
  ];

  return (
    <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl shadow-blue-500/5 dark:shadow-blue-400/5">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Notifications
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Stay on track with personalized email reminders and progress updates
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Email Address */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={handleTestEmail}
              disabled={isTestingSample || !email}
              size="sm"
              variant="outline"
              className="whitespace-nowrap"
            >
              {isTestingSample ? 'Sending...' : 'Test Email'}
            </Button>
          </div>
          {lastTestResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2 text-sm ${
                lastTestResult === 'success' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {lastTestResult === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              {lastTestResult === 'success' ? 'Test email sent successfully!' : 'Failed to send test email'}
            </motion.div>
          )}
        </div>

        {/* Email Types */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notification Types
          </h3>
          
          {emailTypes.map((type, index) => (
            <motion.div
              key={type.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white dark:bg-gray-700 ${type.color}`}>
                  <type.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {type.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {type.description}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => handleSettingChange(type.key, !settings[type.key])}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings[type.key] 
                    ? 'bg-blue-600' 
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings[type.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Timing Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Timing Preferences
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Time
              </label>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <input
                  type="time"
                  value={settings.preferredTime}
                  onChange={(e) => handleSettingChange('preferredTime', e.target.value)}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timezone
              </label>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {getTimezoneDisplay()}
                </Badge>
                <Button
                  onClick={() => handleSettingChange('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone)}
                  size="sm"
                  variant="ghost"
                  className="text-xs"
                >
                  Auto-detect
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-900 dark:text-blue-400 mb-2">
            Email Preview
          </h4>
          <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <p>• Daily reminders at {settings.preferredTime}</p>
            <p>• Weekly reports every Sunday</p>
            <p>• Milestone celebrations when earned</p>
            <p>• Motivational messages when needed</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setSettings(defaultEmailSettings)}
            variant="outline"
            className="flex-1"
          >
            Reset to Default
          </Button>
          <Button
            onClick={() => {
              // Save settings (already handled by useEffect)
              alert('Settings saved successfully!');
            }}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          >
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailSettings;