import { NextRequest, NextResponse } from 'next/server';
import { pushNotificationService } from '@/lib/push-notifications';

// Force dynamic route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { progress, type } = await request.json();

    if (!progress) {
      return NextResponse.json({ error: 'Progress data required' }, { status: 400 });
    }

    switch (type) {
      case 'daily':
        await pushNotificationService.sendDailyReminder(progress);
        break;
      case 'accountability':
        await pushNotificationService.sendAccountabilityAlert(progress);
        break;
      case 'hourly':
        await pushNotificationService.sendHourlyNag(progress);
        break;
      case 'weekend':
        await pushNotificationService.sendWeekendGuilt(progress);
        break;
      case 'celebration':
        const { achievement } = await request.json();
        await pushNotificationService.sendCelebration(achievement || 'Task completed!');
        break;
      default:
        return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Push notification sent successfully' });
  } catch (error) {
    console.error('Push notification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}