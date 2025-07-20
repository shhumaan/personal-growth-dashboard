import { NextRequest, NextResponse } from 'next/server';
import { resendService } from '@/lib/resend-service';

// Force dynamic route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check if email service is available
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { userEmail, userName, familyGoal, progress } = body;

    if (!userEmail || !userName || !familyGoal || !progress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const emailSettings = {
      userEmail,
      userName,
      familyGoal,
      preferredTime: '08:00',
      timezone: 'UTC',
      enabledTypes: {
        dailyReminders: true,
        weeklyReports: true,
        milestoneAlerts: true,
        accountabilityMessages: true,
      }
    };

    const success = await resendService.sendDailyReminder(emailSettings, progress);

    if (success) {
      return NextResponse.json({ message: 'Daily reminder sent successfully' });
    } else {
      return NextResponse.json(
        { error: 'Failed to send daily reminder' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Daily reminder API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Test endpoint - GET request for quick testing
export async function GET() {
  try {
    // Sample data for testing
    const testSettings = {
      userEmail: 'workplace.anshuman@gmail.com',
      userName: 'Anshuman',
      familyGoal: 'Build a successful career to provide the best life for my family',
      preferredTime: '08:00',
      timezone: 'UTC',
      enabledTypes: {
        dailyReminders: true,
        weeklyReports: true,
        milestoneAlerts: true,
        accountabilityMessages: true,
      }
    };

    const testProgress = {
      completedTasks: 2,
      totalTasks: 5,
      currentStreak: 7,
      goalProgress: 45,
      daysRemaining: 67,
      recentAchievements: ['Completed 7-day streak', 'Finished morning routine'],
      missedDays: 0,
      familyGoal: testSettings.familyGoal,
      userName: testSettings.userName
    };

    const success = await resendService.sendDailyReminder(testSettings, testProgress);

    if (success) {
      return NextResponse.json({ 
        message: 'Test daily reminder sent successfully',
        recipient: testSettings.userEmail 
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send test daily reminder' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Test daily reminder error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}