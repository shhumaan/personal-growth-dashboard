import { NextRequest, NextResponse } from 'next/server';
import { discordService } from '@/lib/discord-integration';

// Force dynamic route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check if Discord service is configured
    if (!process.env.DISCORD_BOT_TOKEN) {
      return NextResponse.json(
        { error: 'Discord service not configured' },
        { status: 503 }
      );
    }

    const { progress, type } = await request.json();

    if (!progress) {
      return NextResponse.json({ error: 'Progress data required' }, { status: 400 });
    }

    let success = false;

    switch (type) {
      case 'daily':
        success = await discordService.sendDailyReminder(progress);
        break;
      case 'accountability':
        success = await discordService.sendAccountabilityAlert(progress);
        break;
      case 'celebration':
        const { achievement } = await request.json();
        success = await discordService.sendCelebration(achievement || 'Task completed!', progress);
        break;
      default:
        return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
    }

    if (success) {
      return NextResponse.json({ message: 'Discord notification sent successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to send Discord notification' }, { status: 500 });
    }
  } catch (error) {
    console.error('Discord notification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}