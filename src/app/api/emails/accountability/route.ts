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
    const { userEmail, userName, familyGoal, missedDays, daysRemaining, currentStreak } = body;

    if (!userEmail || !userName || !familyGoal || missedDays === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Only send if they've missed 2+ days
    if (missedDays < 2) {
      return NextResponse.json(
        { message: 'Accountability email not needed yet' },
        { status: 200 }
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

    const progress = {
      completedTasks: 0,
      totalTasks: 5,
      currentStreak,
      goalProgress: 0,
      daysRemaining,
      recentAchievements: [],
      missedDays,
      familyGoal,
      userName
    };

    const success = await resendService.sendAccountabilityMessage(emailSettings, progress);

    if (success) {
      return NextResponse.json({ message: 'Accountability email sent successfully' });
    } else {
      return NextResponse.json(
        { error: 'Failed to send accountability email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Accountability email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Test endpoint for accountability emails
export async function GET() {
  try {
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

    // Test with 3 missed days (firm tone)
    const testProgress = {
      completedTasks: 0,
      totalTasks: 5,
      currentStreak: 0,
      goalProgress: 25,
      daysRemaining: 75,
      recentAchievements: [],
      missedDays: 3,
      familyGoal: testSettings.familyGoal,
      userName: testSettings.userName
    };

    const success = await resendService.sendAccountabilityMessage(testSettings, testProgress);

    if (success) {
      return NextResponse.json({ 
        message: 'Test accountability email sent successfully',
        recipient: testSettings.userEmail,
        missedDays: testProgress.missedDays,
        severity: 'firm'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send test accountability email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Test accountability email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}