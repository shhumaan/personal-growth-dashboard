import { NextRequest, NextResponse } from 'next/server';
import { whatsAppService } from '@/lib/whatsapp-integration';

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
        await whatsAppService.sendDailyReminder(progress);
        break;
      case 'accountability':
        await whatsAppService.sendAccountabilityAlert(progress);
        break;
      case 'weekend':
        await whatsAppService.sendWeekendGuilt(progress);
        break;
      case 'celebration':
        const { achievement } = await request.json();
        await whatsAppService.sendCelebration(achievement || 'Task completed!', progress);
        break;
      default:
        return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
    }

    return NextResponse.json({ message: 'WhatsApp notification sent successfully' });
  } catch (error) {
    console.error('WhatsApp notification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}