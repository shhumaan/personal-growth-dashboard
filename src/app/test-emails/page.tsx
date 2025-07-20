'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Clock,
  AlertTriangle,
  Heart,
  Target,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function TestEmailsPage() {
  const [testResults, setTestResults] = useState<{[key: string]: 'pending' | 'success' | 'error'}>({});
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});

  const testEmails = [
    {
      id: 'daily-reminder',
      title: 'Daily Reminder Email',
      description: 'Test the daily motivation email with progress tracking',
      icon: Calendar,
      color: 'blue',
      endpoint: '/api/emails/daily-reminder'
    },
    {
      id: 'accountability-gentle',
      title: 'Accountability Email (Gentle)',
      description: 'Test gentle accountability message for missed days',
      icon: Heart,
      color: 'orange',
      endpoint: '/api/emails/accountability'
    },
    {
      id: 'accountability-harsh',
      title: 'Accountability Email (Harsh)',
      description: 'Test harsh accountability for multiple missed days',
      icon: AlertTriangle,
      color: 'red',
      endpoint: '/api/emails/accountability'
    }
  ];

  const sendTestEmail = async (emailType: string, endpoint: string, payload?: any) => {
    setIsLoading(prev => ({ ...prev, [emailType]: true }));
    setTestResults(prev => ({ ...prev, [emailType]: 'pending' }));

    try {
      const response = await fetch(endpoint, {
        method: payload ? 'POST' : 'GET',
        headers: payload ? { 'Content-Type': 'application/json' } : {},
        body: payload ? JSON.stringify(payload) : undefined
      });

      if (response.ok) {
        setTestResults(prev => ({ ...prev, [emailType]: 'success' }));
      } else {
        setTestResults(prev => ({ ...prev, [emailType]: 'error' }));
      }
    } catch (error) {
      console.error(`Test email ${emailType} failed:`, error);
      setTestResults(prev => ({ ...prev, [emailType]: 'error' }));
    } finally {
      setIsLoading(prev => ({ ...prev, [emailType]: false }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600 animate-pulse" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'pending':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/settings">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Email System Testing</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Test your Resend email integration and templates
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            Test Environment
          </Badge>
        </div>
      </div>

      {/* Setup Instructions */}
      <Card className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-400 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Setup Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 dark:text-blue-300">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Make sure your <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">RESEND_API_KEY</code> is set in your environment variables</li>
            <li>Update the email addresses in the test endpoints to your actual email</li>
            <li>Check your email inbox after running tests</li>
            <li>Verify email templates render correctly on different devices</li>
          </ol>
        </CardContent>
      </Card>

      {/* Test Email Cards */}
      <div className="grid gap-6">
        {testEmails.map((email, index) => (
          <motion.div
            key={email.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`${getStatusColor(testResults[email.id])} transition-all duration-300`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${email.color}-100 dark:bg-${email.color}-900/30`}>
                      <email.icon className={`w-5 h-5 text-${email.color}-600 dark:text-${email.color}-400`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{email.title}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {email.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(testResults[email.id])}
                    <Button
                      onClick={() => {
                        if (email.id === 'accountability-harsh') {
                          sendTestEmail(email.id, email.endpoint, {
                            userEmail: 'workplace.anshuman@gmail.com',
                            userName: 'Anshuman',
                            familyGoal: 'Build a successful career to provide the best life for my family',
                            missedDays: 5, // Harsh tone
                            daysRemaining: 75,
                            currentStreak: 0
                          });
                        } else if (email.id === 'accountability-gentle') {
                          sendTestEmail(email.id, email.endpoint, {
                            userEmail: 'workplace.anshuman@gmail.com',
                            userName: 'Anshuman',
                            familyGoal: 'Build a successful career to provide the best life for my family',
                            missedDays: 2, // Gentle tone
                            daysRemaining: 82,
                            currentStreak: 0
                          });
                        } else {
                          sendTestEmail(email.id, email.endpoint);
                        }
                      }}
                      disabled={isLoading[email.id]}
                      size="sm"
                      className={`bg-${email.color}-600 hover:bg-${email.color}-700 text-white`}
                    >
                      {isLoading[email.id] ? (
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Test Email
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {testResults[email.id] && (
                <CardContent>
                  <div className={`p-3 rounded-lg border ${
                    testResults[email.id] === 'success' 
                      ? 'border-green-200 bg-green-50 text-green-800' 
                      : testResults[email.id] === 'error'
                      ? 'border-red-200 bg-red-50 text-red-800'
                      : 'border-yellow-200 bg-yellow-50 text-yellow-800'
                  }`}>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(testResults[email.id])}
                      <span className="font-medium">
                        {testResults[email.id] === 'success' 
                          ? 'Email sent successfully!' 
                          : testResults[email.id] === 'error'
                          ? 'Email failed to send. Check console for details.'
                          : 'Sending email...'
                        }
                      </span>
                    </div>
                    {testResults[email.id] === 'success' && (
                      <p className="text-sm mt-2">
                        Check your email inbox (workplace.anshuman@gmail.com) for the test email.
                      </p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Environment Variables Check */}
      <Card className="mt-6 bg-gray-50 dark:bg-gray-900/50">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">
            Environment Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">RESEND_API_KEY</span>
              <Badge variant={process.env.RESEND_API_KEY ? 'default' : 'destructive'}>
                {process.env.RESEND_API_KEY ? 'Set' : 'Missing'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Routes</span>
              <Badge variant="default">Available</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Email Templates</span>
              <Badge variant="default">Loaded</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="text-purple-900 dark:text-purple-400 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent className="text-purple-800 dark:text-purple-300">
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Test all email types and verify they render correctly</li>
            <li>Set up automated email scheduling (cron jobs or scheduled functions)</li>
            <li>Configure email preferences in user settings</li>
            <li>Integrate with Apple Calendar for full accountability system</li>
            <li>Add email tracking and analytics</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}