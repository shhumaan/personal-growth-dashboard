'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { EmailSettings } from '@/components/dashboard/email-settings';
import { GoalTimerSettings } from '@/components/dashboard/goal-timer-settings';
import { useToast } from '@/components/ui/use-toast';
import { migrateLocalStorageToDatabase, loadSettingsFromDatabase } from '@/lib/migrate-settings';
import { supabase } from '@/lib/supabase';
import { Auth } from '@/components/auth';
import { 
  ArrowLeft, 
  Target, 
  Trophy, 
  Plus, 
  X, 
  Bell, 
  Sun,
  Save,
  Trash2,
  MessageCircle,
  Send,
  BellRing,
  Heart
} from 'lucide-react';

interface CustomGoal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category: string;
}

interface CustomAchievement {
  id: string;
  title: string;
  description: string;
  requirement: number;
  icon: string;
  color: string;
  category: string;
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [, setIsAuthenticating] = useState(true);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [storageType, setStorageType] = useState<'localStorage' | 'database'>('localStorage');
  const [isMigrating, setIsMigrating] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  
  const [motivationalFeatures, setMotivationalFeatures] = useState({
    celebrationNotifications: true,
    gentleReminders: true
  });

  const [personalInfo, setPersonalInfo] = useState({
    name: 'Test User',
    familyGoal: 'Build a better future for my family'
  });

  const [customGoals, setCustomGoals] = useState<CustomGoal[]>([]);
  const [customAchievements, setCustomAchievements] = useState<CustomAchievement[]>([]);

  // Check authentication and load settings
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        setIsAuthenticating(false);

        if (user) {
          // Try to load from database first
          const dbData = await loadSettingsFromDatabase();
          if (dbData && (dbData.settings || (dbData.goals && dbData.goals.length > 0))) {
            setStorageType('database');
            
            // Load settings from database
            if (dbData.settings) {
              if (dbData.settings.custom_achievements) {
                setCustomAchievements(dbData.settings.custom_achievements);
              }
              if (dbData.settings.personal_info) {
                setPersonalInfo(dbData.settings.personal_info);
              }
              if (dbData.settings.motivational_features) {
                setMotivationalFeatures(dbData.settings.motivational_features);
              }
              if (dbData.settings.notification_settings) {
                setNotificationSettings(dbData.settings.notification_settings);
              }
            }
            
            if (dbData.goals && dbData.goals.length > 0) {
              // Convert database goals to localStorage format
              const convertedGoals = dbData.goals.map((goal: {
                id: string;
                title: string;
                description?: string;
                target_value?: number;
                current_value?: number;
                category: string;
              }) => ({
                id: goal.id,
                title: goal.title,
                description: goal.description || '',
                targetValue: goal.target_value || 1,
                currentValue: goal.current_value || 0,
                unit: 'items', // Default unit
                category: goal.category
              }));
              setCustomGoals(convertedGoals);
            } else {
              // Load default goals if none in database
              loadDefaultGoals();
            }
            
            // Load default achievements if none in database
            if (!dbData.settings?.custom_achievements) {
              loadDefaultAchievements();
            }
          } else {
            // Load from localStorage if no database data
            loadFromLocalStorage();
          }
        } else {
          // Not authenticated, use localStorage
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticating(false);
        loadFromLocalStorage();
      }
    };

    const loadDefaultGoals = () => {
      const defaultGoals = [{
        id: '1',
        title: 'Read Books',
        description: 'Read books this month',
        targetValue: 3,
        currentValue: 1,
        unit: 'books',
        category: 'learning'
      }];
      setCustomGoals(defaultGoals);
    };

    const loadDefaultAchievements = () => {
      const defaultAchievements = [{
        id: '1',
        title: 'Bookworm',
        description: 'Read 10 books',
        requirement: 10,
        icon: 'Book',
        color: 'text-blue-600',
        category: 'learning'
      }];
      setCustomAchievements(defaultAchievements);
    };

    const loadFromLocalStorage = () => {
      try {
        const savedGoals = localStorage.getItem('customGoals');
        if (savedGoals) {
          setCustomGoals(JSON.parse(savedGoals));
        } else {
          // Set default example goal only if none exist
          const defaultGoals = [{
            id: '1',
            title: 'Read Books',
            description: 'Read books this month',
            targetValue: 3,
            currentValue: 1,
            unit: 'books',
            category: 'learning'
          }];
          setCustomGoals(defaultGoals);
          localStorage.setItem('customGoals', JSON.stringify(defaultGoals));
        }

        const savedAchievements = localStorage.getItem('customAchievements');
        if (savedAchievements) {
          setCustomAchievements(JSON.parse(savedAchievements));
        } else {
          // Set default example achievement only if none exist
          const defaultAchievements = [{
            id: '1',
            title: 'Bookworm',
            description: 'Read 10 books',
            requirement: 10,
            icon: 'Book',
            color: 'text-blue-600',
            category: 'learning'
          }];
          setCustomAchievements(defaultAchievements);
          localStorage.setItem('customAchievements', JSON.stringify(defaultAchievements));
        }
      } catch (error) {
        console.error('Error loading settings from localStorage:', error);
      }
    };

    checkAuth();
  }, []);

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetValue: 0,
    unit: '',
    category: 'personal'
  });

  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    requirement: 0,
    icon: 'Trophy',
    color: 'text-blue-600',
    category: 'personal'
  });

  const [reminderSettings, setReminderSettings] = useState({
    enabled: true,
    frequency: 'normal' as 'gentle' | 'normal' | 'persistent',
    quietStart: '22:00',
    quietEnd: '07:00',
    customMessages: [] as string[]
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      enabled: true,
      tested: false
    },
    discord: {
      enabled: false,
      webhookUrl: '',
      userMention: '',
      tested: false
    },
    telegram: {
      enabled: false,
      botToken: '',
      chatId: '',
      tested: false
    },
    whatsapp: {
      enabled: false,
      phoneNumber: '',
      businessApiKey: '',
      tested: false
    },
    push: {
      enabled: true,
      tested: false
    }
  });

  const addCustomGoal = async () => {
    if (newGoal.title && newGoal.targetValue > 0) {
      const goal: CustomGoal = {
        id: Date.now().toString(),
        ...newGoal,
        currentValue: 0
      };
      const updatedGoals = [...customGoals, goal];
      setCustomGoals(updatedGoals);
      
      if (user && storageType === 'database') {
        // Save to database
        const { error } = await supabase
          .from('goals')
          .insert({
            title: goal.title,
            description: goal.description,
            category: goal.category as 'personal' | 'career' | 'health' | 'learning' | 'financial' | 'relationships',
            target_value: goal.targetValue,
            current_value: goal.currentValue,
            track_daily: true
          });
        
        if (error) {
          console.error('Error saving goal to database:', error);
          toast({ title: 'Error', description: 'Failed to save goal to database', variant: 'destructive' });
        } else {
          toast({ title: 'Success', description: 'Goal saved to database!' });
        }
      } else {
        // Save to localStorage as fallback
        localStorage.setItem('customGoals', JSON.stringify(updatedGoals));
      }
      
      setNewGoal({ title: '', description: '', targetValue: 0, unit: '', category: 'personal' });
    }
  };

  const addCustomAchievement = async () => {
    if (newAchievement.title && newAchievement.requirement > 0) {
      const achievement: CustomAchievement = {
        id: Date.now().toString(),
        ...newAchievement
      };
      const updatedAchievements = [...customAchievements, achievement];
      setCustomAchievements(updatedAchievements);
      
      if (user && storageType === 'database') {
        // Save to database in user_settings
        const { error } = await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            custom_achievements: updatedAchievements,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });
        
        if (error) {
          console.error('Error saving achievement to database:', error);
          toast({ title: 'Error', description: 'Failed to save achievement to database', variant: 'destructive' });
        } else {
          toast({ title: 'Success', description: 'Achievement saved to database!' });
        }
      } else {
        // Save to localStorage as fallback
        localStorage.setItem('customAchievements', JSON.stringify(updatedAchievements));
      }
      
      setNewAchievement({ 
        title: '', 
        description: '', 
        requirement: 0, 
        icon: 'Trophy', 
        color: 'text-blue-600', 
        category: 'personal' 
      });
    }
  };

  const removeGoal = async (id: string) => {
    const updatedGoals = customGoals.filter(g => g.id !== id);
    setCustomGoals(updatedGoals);
    
    if (user && storageType === 'database') {
      // Delete from database
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting goal from database:', error);
        toast({ title: 'Error', description: 'Failed to delete goal from database', variant: 'destructive' });
      }
    } else {
      localStorage.setItem('customGoals', JSON.stringify(updatedGoals));
    }
  };

  const removeAchievement = async (id: string) => {
    const updatedAchievements = customAchievements.filter(a => a.id !== id);
    setCustomAchievements(updatedAchievements);
    
    if (user && storageType === 'database') {
      // Save updated achievements to database
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          custom_achievements: updatedAchievements,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
      
      if (error) {
        console.error('Error updating achievements in database:', error);
        toast({ title: 'Error', description: 'Failed to update achievements in database', variant: 'destructive' });
      }
    } else {
      localStorage.setItem('customAchievements', JSON.stringify(updatedAchievements));
    }
  };

  const updateGoalProgress = async (id: string, newValue: number) => {
    const updatedGoals = customGoals.map(g => 
      g.id === id ? { ...g, currentValue: Math.max(0, newValue) } : g
    );
    setCustomGoals(updatedGoals);
    
    if (user && storageType === 'database') {
      // Update in database
      const { error } = await supabase
        .from('goals')
        .update({
          current_value: Math.max(0, newValue),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating goal progress in database:', error);
        toast({ title: 'Error', description: 'Failed to update goal progress in database', variant: 'destructive' });
      }
    } else {
      localStorage.setItem('customGoals', JSON.stringify(updatedGoals));
    }
  };

  const handleMigrateToDatabase = async () => {
    if (!user) {
      toast({ 
        title: 'Authentication Required', 
        description: 'Please sign in to migrate your data to the database.',
        variant: 'destructive'
      });
      return;
    }

    setIsMigrating(true);
    try {
      const success = await migrateLocalStorageToDatabase();
      if (success) {
        setStorageType('database');
        toast({ 
          title: '✅ Migration Successful!', 
          description: 'Your settings have been moved to the database and will now persist across devices.'
        });
      } else {
        toast({ 
          title: '❌ Migration Failed', 
          description: 'There was an error migrating your data. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Migration error:', error);
      toast({ 
        title: '❌ Migration Error', 
        description: 'An unexpected error occurred during migration.',
        variant: 'destructive'
      });
    } finally {
      setIsMigrating(false);
    }
  };

  const saveAllSettings = async () => {
    if (!user) {
      toast({ title: 'Error', description: 'Please sign in to save settings to database', variant: 'destructive' });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          personal_info: personalInfo,
          motivational_features: motivationalFeatures,
          notification_settings: notificationSettings,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving settings to database:', error);
        toast({ title: 'Error', description: 'Failed to save settings to database', variant: 'destructive' });
      } else {
        toast({ title: 'Success!', description: 'All settings saved to database successfully' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({ title: 'Error', description: 'An unexpected error occurred', variant: 'destructive' });
    }
  };

  const handleLogin = () => {
    setShowAuth(false);
    // Reload the page to refresh auth state
    window.location.reload();
  };

  const testNotification = async (channel: 'discord' | 'telegram' | 'whatsapp' | 'push') => {
    try {
      const testProgress = {
        completedTasks: 2,
        totalTasks: 5,
        currentStreak: 3,
        goalProgress: 40,
        daysRemaining: 87,
        missedDays: 0,
        familyGoal: "Build a better future for my family",
        userName: "Test User"
      };

      const response = await fetch(`/api/notifications/${channel}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          progress: testProgress,
          type: 'daily'
        })
      });

      if (response.ok) {
        setNotificationSettings(prev => ({
          ...prev,
          [channel]: {
            ...prev[channel],
            tested: true
          }
        }));
        toast({ title: `✅ ${channel.toUpperCase()} notification test successful!`, description: 'Check your device for a notification.' });
      } else {
        toast({ title: `❌ ${channel.toUpperCase()} notification test failed.`, description: 'Check your settings and try again.', variant: 'destructive' });
      }
    } catch (error) {
      console.error(`Test notification error for ${channel}:`, error);
      toast({ title: `❌ Error testing ${channel.toUpperCase()} notification.`, description: 'Something went wrong. Check the console for details.', variant: 'destructive' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Configure your dashboard preferences and create custom goals
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Data Storage Status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className={`border-2 ${storageType === 'database' ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${storageType === 'database' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-yellow-100 dark:bg-yellow-900/50'}`}>
                  {storageType === 'database' ? 
                    <span className="text-green-600 dark:text-green-400 text-lg">🗄️</span> :
                    <span className="text-yellow-600 dark:text-yellow-400 text-lg">💾</span>
                  }
                </div>
                <div>
                  <h3 className={`font-semibold ${storageType === 'database' ? 'text-green-900 dark:text-green-100' : 'text-yellow-900 dark:text-yellow-100'}`}>
                    Data Storage: {storageType === 'database' ? 'Database (Persistent)' : 'Browser Storage (Temporary)'}
                  </h3>
                  <p className={`text-sm ${storageType === 'database' ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                    {storageType === 'database' ? 
                      '✅ Your data is safely stored in the cloud and syncs across devices' :
                      '⚠️ Your data is stored locally and may be lost if you clear browser data'
                    }
                  </p>
                </div>
              </div>
              {storageType === 'localStorage' && user && (
                <Button 
                  onClick={handleMigrateToDatabase}
                  disabled={isMigrating}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isMigrating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Migrating...
                    </>
                  ) : (
                    'Migrate to Database'
                  )}
                </Button>
              )}
              {storageType === 'localStorage' && !user && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowAuth(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                >
                  Sign in to Save to Database
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6">
        {/* Personal Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl shadow-blue-500/5 dark:shadow-blue-400/5">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
                  <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                Personal Information
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Customize your profile to make the experience more personal
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Your Name
                  </label>
                  <Input
                    placeholder="Enter your name (e.g., Champion, Warrior)"
                    value={personalInfo.name}
                    onChange={(e) => {
                      const newInfo = { ...personalInfo, name: e.target.value };
                      setPersonalInfo(newInfo);
                      if (user && storageType === 'database') {
                        // Auto-save to database
                        supabase.from('user_settings').upsert({
                          user_id: user.id,
                          personal_info: newInfo,
                          updated_at: new Date().toISOString()
                        }, { onConflict: 'user_id' });
                      }
                    }}
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">This is how you&apos;ll be addressed in notifications</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-500" />
                    Family Goal
                  </label>
                  <Input
                    placeholder="What you're working toward for your family"
                    value={personalInfo.familyGoal}
                    onChange={(e) => {
                      const newInfo = { ...personalInfo, familyGoal: e.target.value };
                      setPersonalInfo(newInfo);
                      if (user && storageType === 'database') {
                        // Auto-save to database
                        supabase.from('user_settings').upsert({
                          user_id: user.id,
                          personal_info: newInfo,
                          updated_at: new Date().toISOString()
                        }, { onConflict: 'user_id' });
                      }
                    }}
                    className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-pink-500 focus:ring-pink-500/20"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Your deeper motivation and purpose</p>
                </div>
              </div>
              
              {/* Preview */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-400 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Preview
                </h4>
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  <p className="mb-1">
                    &quot;Hello <strong className="text-blue-900 dark:text-blue-200">{personalInfo.name || 'Champion'}</strong>! 
                    Ready to work toward your goal: <em>&apos;{personalInfo.familyGoal || 'Build a better future for my family'}&apos;</em>?&quot;
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Motivational Features */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl shadow-yellow-500/5 dark:shadow-yellow-400/5">
            <CardHeader className="pb-4 bg-gradient-to-r from-yellow-50/50 to-orange-50/50 dark:from-yellow-900/20 dark:to-orange-900/20">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30">
                  <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                Motivational Features
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Configure how you want to be motivated and celebrated
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                      <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-emerald-900 dark:text-emerald-100">Celebration Notifications</p>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300">
                        Get exciting celebrations when you complete goals and achieve milestones
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMotivationalFeatures(prev => ({ ...prev, celebrationNotifications: !prev.celebrationNotifications }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      motivationalFeatures.celebrationNotifications 
                        ? 'bg-emerald-600' 
                        : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        motivationalFeatures.celebrationNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                      <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">Gentle Reminders</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Receive kind, encouraging reminders to help you stay on track
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMotivationalFeatures(prev => ({ ...prev, gentleReminders: !prev.gentleReminders }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      motivationalFeatures.gentleReminders 
                        ? 'bg-blue-600' 
                        : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        motivationalFeatures.gentleReminders ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
              
              {/* Preview */}
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-medium text-yellow-900 dark:text-yellow-400 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  Active Features
                </h4>
                <div className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1">
                  {motivationalFeatures.celebrationNotifications && (
                    <p>• 🎉 Celebrations enabled for achievements and milestones</p>
                  )}
                  {motivationalFeatures.gentleReminders && (
                    <p>• 💝 Gentle reminders to support your journey</p>
                  )}
                  {!motivationalFeatures.celebrationNotifications && !motivationalFeatures.gentleReminders && (
                    <p className="text-gray-500 dark:text-gray-400">No motivational features are currently active</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Preferences */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Preferred Channels</label>
                <div className="flex gap-2 mt-2">
                  {(['email', 'discord', 'telegram', 'push'] as const).map(channel => (
                    <Button
                      key={channel}
                      variant={notificationSettings[channel].enabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNotificationSettings(prev => ({
                        ...prev,
                        [channel]: { ...prev[channel], enabled: !prev[channel].enabled }
                      }))}
                    >
                      {channel.charAt(0).toUpperCase() + channel.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Do Not Disturb Start</label>
                  <Input
                    type="time"
                    value={reminderSettings.quietStart}
                    onChange={(e) => setReminderSettings(prev => ({ ...prev, quietStart: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Do Not Disturb End</label>
                  <Input
                    type="time"
                    value={reminderSettings.quietEnd}
                    onChange={(e) => setReminderSettings(prev => ({ ...prev, quietEnd: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Goal Timer Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <GoalTimerSettings onSettingsChange={(settings) => console.log('Settings updated:', settings)} />
        </motion.div>

        {/* Email Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <EmailSettings userId="default-user" userEmail="" />
        </motion.div>

        {/* Discord Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Discord Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Discord Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get accountability messages in Discord
                  </p>
                </div>
                <Button
                  variant={notificationSettings.discord.enabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNotificationSettings(prev => ({
                    ...prev,
                    discord: { ...prev.discord, enabled: !prev.discord.enabled }
                  }))}
                >
                  {notificationSettings.discord.enabled ? 'On' : 'Off'}
                </Button>
              </div>
              
              {notificationSettings.discord.enabled && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Discord Webhook URL</label>
                    <Input
                      placeholder="https://discord.com/api/webhooks/..."
                      value={notificationSettings.discord.webhookUrl}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        discord: { ...prev.discord, webhookUrl: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">User Mention (optional)</label>
                    <Input
                      placeholder="<@your_user_id>"
                      value={notificationSettings.discord.userMention}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        discord: { ...prev.discord, userMention: e.target.value }
                      }))}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testNotification('discord')}
                    disabled={!notificationSettings.discord.webhookUrl}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Test Discord Notification
                    {notificationSettings.discord.tested && ' ✅'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Telegram Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="w-5 h-5 mr-2" />
                Telegram Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Telegram Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get hourly reminders and accountability messages
                  </p>
                </div>
                <Button
                  variant={notificationSettings.telegram.enabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNotificationSettings(prev => ({
                    ...prev,
                    telegram: { ...prev.telegram, enabled: !prev.telegram.enabled }
                  }))}
                >
                  {notificationSettings.telegram.enabled ? 'On' : 'Off'}
                </Button>
              </div>
              
              {notificationSettings.telegram.enabled && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Bot Token</label>
                    <Input
                      placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                      value={notificationSettings.telegram.botToken}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        telegram: { ...prev.telegram, botToken: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Chat ID</label>
                    <Input
                      placeholder="123456789"
                      value={notificationSettings.telegram.chatId}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        telegram: { ...prev.telegram, chatId: e.target.value }
                      }))}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testNotification('telegram')}
                    disabled={!notificationSettings.telegram.botToken || !notificationSettings.telegram.chatId}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Test Telegram Notification
                    {notificationSettings.telegram.tested && ' ✅'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* WhatsApp Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable WhatsApp Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get messages directly to your phone
                  </p>
                </div>
                <Button
                  variant={notificationSettings.whatsapp.enabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNotificationSettings(prev => ({
                    ...prev,
                    whatsapp: { ...prev.whatsapp, enabled: !prev.whatsapp.enabled }
                  }))}
                >
                  {notificationSettings.whatsapp.enabled ? 'On' : 'Off'}
                </Button>
              </div>
              
              {notificationSettings.whatsapp.enabled && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input
                      placeholder="+1234567890"
                      value={notificationSettings.whatsapp.phoneNumber}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        whatsapp: { ...prev.whatsapp, phoneNumber: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Business API Key (optional)</label>
                    <Input
                      placeholder="Business API key for automated messages"
                      value={notificationSettings.whatsapp.businessApiKey}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        whatsapp: { ...prev.whatsapp, businessApiKey: e.target.value }
                      }))}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testNotification('whatsapp')}
                    disabled={!notificationSettings.whatsapp.phoneNumber}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Test WhatsApp Notification
                    {notificationSettings.whatsapp.tested && ' ✅'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Push Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BellRing className="w-5 h-5 mr-2" />
                Browser Push Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get browser notifications with interactive buttons
                  </p>
                </div>
                <Button
                  variant={notificationSettings.push.enabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNotificationSettings(prev => ({
                    ...prev,
                    push: { ...prev.push, enabled: !prev.push.enabled }
                  }))}
                >
                  {notificationSettings.push.enabled ? 'On' : 'Off'}
                </Button>
              </div>
              
              {notificationSettings.push.enabled && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Push notifications work directly in your browser. No additional setup required.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testNotification('push')}
                  >
                    <BellRing className="w-4 h-4 mr-2" />
                    Test Push Notification
                    {notificationSettings.push.tested && ' ✅'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Theme Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sun className="w-5 h-5 mr-2" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred theme
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reminder Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Reminders</p>
                  <p className="text-sm text-muted-foreground">
                    Get gentle nudges to complete your sessions
                  </p>
                </div>
                <Button
                  variant={reminderSettings.enabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setReminderSettings(prev => ({
                    ...prev,
                    enabled: !prev.enabled
                  }))}
                >
                  {reminderSettings.enabled ? 'On' : 'Off'}
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Quiet Hours Start</label>
                  <Input
                    type="time"
                    value={reminderSettings.quietStart}
                    onChange={(e) => setReminderSettings(prev => ({
                      ...prev,
                      quietStart: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Quiet Hours End</label>
                  <Input
                    type="time"
                    value={reminderSettings.quietEnd}
                    onChange={(e) => setReminderSettings(prev => ({
                      ...prev,
                      quietEnd: e.target.value
                    }))}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Frequency</label>
                <div className="flex gap-2 mt-2">
                  {(['gentle', 'normal', 'persistent'] as const).map(freq => (
                    <Button
                      key={freq}
                      variant={reminderSettings.frequency === freq ? "default" : "outline"}
                      size="sm"
                      onClick={() => setReminderSettings(prev => ({
                        ...prev,
                        frequency: freq
                      }))}
                    >
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Custom Goals */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl shadow-green-500/5 dark:shadow-green-400/5">
            <CardHeader className="pb-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
                  <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                Custom Goals
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Create and track your personalized goals beyond the daily sessions
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Existing Goals */}
              <div className="space-y-4">
                {customGoals.map(goal => {
                  const progressPercentage = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
                  return (
                    <div key={goal.id} className="p-5 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{goal.title}</h4>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs font-medium px-2 py-1 ${
                                goal.category === 'learning' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                goal.category === 'health' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                goal.category === 'work' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                goal.category === 'creative' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' :
                                'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {goal.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{goal.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGoal(goal.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateGoalProgress(goal.id, goal.currentValue - 1)}
                              className="w-8 h-8 p-0 rounded-full"
                            >
                              -
                            </Button>
                            <span className="font-mono text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                              {goal.currentValue} / {goal.targetValue} {goal.unit}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateGoalProgress(goal.id, goal.currentValue + 1)}
                              className="w-8 h-8 p-0 rounded-full"
                            >
                              +
                            </Button>
                          </div>
                          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {progressPercentage.toFixed(1)}%
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add New Goal */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Add New Goal
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Goal title (e.g., Read Books)"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-white dark:bg-gray-700"
                    />
                    <Input
                      placeholder="Target number"
                      type="number"
                      value={newGoal.targetValue || ''}
                      onChange={(e) => setNewGoal(prev => ({ 
                        ...prev, 
                        targetValue: parseInt(e.target.value) || 0 
                      }))}
                      className="bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Unit (e.g., books, hours, days)"
                      value={newGoal.unit}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                      className="bg-white dark:bg-gray-700"
                    />
                    <select
                      className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-green-500 focus:ring-green-500/20"
                      value={newGoal.category}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="personal">🏠 Personal</option>
                      <option value="learning">📚 Learning</option>
                      <option value="health">💪 Health</option>
                      <option value="work">💼 Work</option>
                      <option value="creative">🎨 Creative</option>
                    </select>
                  </div>
                  <Textarea
                    placeholder="Goal description (What are you trying to achieve?)"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-white dark:bg-gray-700 min-h-[80px]"
                  />
                  <Button 
                    onClick={addCustomGoal} 
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    disabled={!newGoal.title || !newGoal.targetValue}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Goal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Custom Achievements */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl shadow-purple-500/5 dark:shadow-purple-400/5">
            <CardHeader className="pb-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                  <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                Custom Achievements
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Design milestone badges to celebrate your journey and accomplishments
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Existing Achievements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customAchievements.map(achievement => (
                  <div key={achievement.id} className="p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm group hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${
                            achievement.color.includes('blue') ? 'bg-blue-100 dark:bg-blue-900/30' :
                            achievement.color.includes('green') ? 'bg-green-100 dark:bg-green-900/30' :
                            achievement.color.includes('purple') ? 'bg-purple-100 dark:bg-purple-900/30' :
                            achievement.color.includes('orange') ? 'bg-orange-100 dark:bg-orange-900/30' :
                            achievement.color.includes('red') ? 'bg-red-100 dark:bg-red-900/30' :
                            'bg-yellow-100 dark:bg-yellow-900/30'
                          }`}>
                            <Trophy className={`w-5 h-5 ${achievement.color}`} />
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{achievement.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{achievement.description}</p>
                        <div className="flex gap-2">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs font-medium px-2 py-1 ${
                              achievement.category === 'learning' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                              achievement.category === 'health' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                              achievement.category === 'work' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                              achievement.category === 'creative' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {achievement.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs font-medium px-2 py-1">
                            Goal: {achievement.requirement}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAchievement(achievement.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Achievement */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Create New Achievement
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Achievement title (e.g., Bookworm)"
                      value={newAchievement.title}
                      onChange={(e) => setNewAchievement(prev => ({ 
                        ...prev, 
                        title: e.target.value 
                      }))}
                      className="bg-white dark:bg-gray-700"
                    />
                    <Input
                      placeholder="Requirement number"
                      type="number"
                      value={newAchievement.requirement || ''}
                      onChange={(e) => setNewAchievement(prev => ({ 
                        ...prev, 
                        requirement: parseInt(e.target.value) || 0 
                      }))}
                      className="bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-purple-500 focus:ring-purple-500/20"
                      value={newAchievement.category}
                      onChange={(e) => setNewAchievement(prev => ({ 
                        ...prev, 
                        category: e.target.value 
                      }))}
                    >
                      <option value="personal">🏠 Personal</option>
                      <option value="learning">📚 Learning</option>
                      <option value="health">💪 Health</option>
                      <option value="work">💼 Work</option>
                      <option value="creative">🎨 Creative</option>
                    </select>
                    <select
                      className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-purple-500 focus:ring-purple-500/20"
                      value={newAchievement.color}
                      onChange={(e) => setNewAchievement(prev => ({ 
                        ...prev, 
                        color: e.target.value 
                      }))}
                    >
                      <option value="text-blue-600">🔵 Blue</option>
                      <option value="text-green-600">🟢 Green</option>
                      <option value="text-purple-600">🟣 Purple</option>
                      <option value="text-orange-600">🟠 Orange</option>
                      <option value="text-red-600">🔴 Red</option>
                      <option value="text-yellow-600">🟡 Yellow</option>
                    </select>
                  </div>
                  <Textarea
                    placeholder="Achievement description (What does this achievement represent?)"
                    value={newAchievement.description}
                    onChange={(e) => setNewAchievement(prev => ({ 
                      ...prev, 
                      description: e.target.value 
                    }))}
                    className="bg-white dark:bg-gray-700 min-h-[80px]"
                  />
                  <Button 
                    onClick={addCustomAchievement} 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    disabled={!newAchievement.title || !newAchievement.requirement}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Achievement
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Save Settings */}
        <div className="flex justify-end">
          <Button 
            onClick={saveAllSettings}
            disabled={!user}
            className="w-full md:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            {user ? 'Save All Settings' : 'Sign in to Save Settings'}
          </Button>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAuth(false)}
              className="absolute -top-4 -right-4 z-10 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 rounded-full w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
            <Auth onLogin={handleLogin} />
          </div>
        </div>
      )}
    </div>
  );
}
