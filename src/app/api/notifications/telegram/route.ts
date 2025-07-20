import { NextRequest, NextResponse } from 'next/server';
import { telegramService } from '@/lib/telegram-bot';

// Force dynamic route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { progress, type } = await request.json();

    if (!progress) {
      return NextResponse.json({ error: 'Progress data required' }, { status: 400 });
    }

    let success = false;

    switch (type) {
      case 'daily':
        success = await telegramService.sendDailyReminder(progress);
        break;
      case 'accountability':
        success = await telegramService.sendAccountabilityAlert(progress);
        break;
      case 'hourly':
        success = await telegramService.sendHourlyNag(progress);
        break;
      case 'weekend':
        success = await telegramService.sendWeekendGuilt(progress);
        break;
      case 'celebration':
        const { achievement } = await request.json();
        success = await telegramService.sendCelebration(achievement || 'Task completed!', progress);
        break;
      default:
        return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
    }

    if (success) {
      return NextResponse.json({ message: 'Telegram notification sent successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to send Telegram notification' }, { status: 500 });
    }
  } catch (error) {
    console.error('Telegram notification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}