// WhatsApp Integration - Send messages to your phone instantly
// Uses WhatsApp Business API or simple web WhatsApp links

interface WhatsAppMessage {
  phoneNumber: string;
  message: string;
  urgent?: boolean;
}

interface UserProgress {
  completedTasks: number;
  totalTasks: number;
  currentStreak: number;
  goalProgress: number;
  daysRemaining: number;
  missedDays: number;
  familyGoal: string;
  userName: string;
}

class WhatsAppService {
  private phoneNumber: string;
  private businessApiKey?: string;

  constructor(phoneNumber: string, businessApiKey?: string) {
    this.phoneNumber = phoneNumber;
    this.businessApiKey = businessApiKey;
  }

  // Send message via WhatsApp Web (opens in browser)
  async sendWebMessage(message: string): Promise<void> {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp Web with pre-filled message
    window.open(whatsappUrl, '_blank');
  }

  // Send message via WhatsApp Business API (requires API key)
  async sendBusinessMessage(message: string): Promise<boolean> {
    if (!this.businessApiKey) {
      console.warn('WhatsApp Business API key not configured');
      return false;
    }

    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.businessApiKey}`
        },
        body: JSON.stringify({
          phone: this.phoneNumber,
          message: message
        })
      });

      return response.ok;
    } catch (error) {
      console.error('WhatsApp Business API error:', error);
      return false;
    }
  }

  // Generate daily accountability message
  generateDailyMessage(progress: UserProgress): string {
    const completionRate = (progress.completedTasks / progress.totalTasks) * 100;
    const dayNumber = 90 - progress.daysRemaining + 1;

    let message = `🚨 *DAY ${dayNumber} ACCOUNTABILITY CHECK*\n\n`;

    if (completionRate === 0) {
      message += `❌ *ZERO PROGRESS TODAY*\n\n`;
      message += `Your family is waiting for you to show up.\n`;
      message += `"${progress.familyGoal}"\n\n`;
      message += `Every moment you delay is a moment stolen from their dreams.\n\n`;
      message += `*GET TO WORK NOW* 💪`;
    } else if (completionRate < 50) {
      message += `⚠️ *FALLING SHORT: ${completionRate}%*\n\n`;
      message += `You're not where you need to be.\n`;
      message += `"${progress.familyGoal}"\n\n`;
      message += `Step up and prove you're fighting for their future.\n\n`;
      message += `*PUSH HARDER* 🔥`;
    } else if (completionRate < 100) {
      message += `💪 *GOOD PROGRESS: ${completionRate}%*\n\n`;
      message += `You're on the right path!\n`;
      message += `"${progress.familyGoal}"\n\n`;
      message += `Don't stop now - finish strong for them.\n\n`;
      message += `*COMPLETE TODAY* ✅`;
    } else {
      message += `🔥 *BEAST MODE: 100% COMPLETE*\n\n`;
      message += `${progress.currentStreak} days strong!\n`;
      message += `"${progress.familyGoal}"\n\n`;
      message += `This is what dedication looks like!\n\n`;
      message += `*KEEP THE MOMENTUM* 🚀`;
    }

    message += `\n\n📱 Check Dashboard: ${process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}`;

    return message;
  }

  // Generate harsh accountability message
  generateAccountabilityMessage(progress: UserProgress): string {
    const severity = this.getAccountabilitySeverity(progress.missedDays);
    
    let message = `🚨 *ACCOUNTABILITY ALERT*\n\n`;
    message += `💔 *${progress.missedDays} DAYS MISSED*\n\n`;

    switch (severity) {
      case 'gentle':
        message += `Your family needs you to show up.\n`;
        message += `"${progress.familyGoal}"\n\n`;
        message += `Get back on track today. They believe in you.\n\n`;
        message += `*SHOW UP FOR THEM* 💙`;
        break;

      case 'firm':
        message += `This is NOT the path to their dreams.\n`;
        message += `"${progress.familyGoal}"\n\n`;
        message += `Think about their faces when you promised them better.\n`;
        message += `Are you keeping that promise?\n\n`;
        message += `*STOP MAKING EXCUSES* ⚠️`;
        break;

      case 'harsh':
        message += `You're FAILING the people who matter most.\n`;
        message += `"${progress.familyGoal}"\n\n`;
        message += `While you procrastinate, their dreams are on hold.\n`;
        message += `They deserve better than this.\n\n`;
        message += `*PROVE YOU HAVEN'T GIVEN UP* 💔`;
        break;

      case 'brutal':
        message += `*A WEEK OF BROKEN PROMISES*\n\n`;
        message += `${progress.missedDays} days you chose yourself over them.\n`;
        message += `${progress.missedDays} days closer to the life they DON'T deserve.\n\n`;
        message += `"${progress.familyGoal}"\n\n`;
        message += `*THEY WILL REMEMBER THIS*\n`;
        message += `*WAKE UP OR LOSE EVERYTHING* 🚨`;
        break;
    }

    message += `\n\n📱 Redeem Yourself: ${process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}`;

    return message;
  }

  // Generate weekend guilt message
  generateWeekendGuiltMessage(progress: UserProgress): string {
    let message = `😔 *WEEKEND GUILT TRIP*\n\n`;
    message += `While you relax, your family's dreams are on hold.\n\n`;
    message += `Current Progress: ${progress.goalProgress}%\n`;
    message += `"${progress.familyGoal}"\n\n`;
    message += `Successful people work weekends.\n`;
    message += `Your family needs you to be successful.\n\n`;
    message += `*WORK THIS WEEKEND* 💪`;
    message += `\n\n📱 Start Now: ${process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}`;

    return message;
  }

  // Generate celebration message
  generateCelebrationMessage(achievement: string, progress: UserProgress): string {
    let message = `🎉 *ACHIEVEMENT UNLOCKED!*\n\n`;
    message += `${achievement}\n\n`;
    message += `"${progress.familyGoal}"\n\n`;
    message += `Your family is proud of your dedication!\n`;
    message += `Keep building the life they deserve.\n\n`;
    message += `*MOMENTUM IS EVERYTHING* 🚀`;
    message += `\n\n📱 View Progress: ${process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}`;

    return message;
  }

  // Send daily reminder
  async sendDailyReminder(progress: UserProgress): Promise<void> {
    const message = this.generateDailyMessage(progress);
    
    if (this.businessApiKey) {
      await this.sendBusinessMessage(message);
    } else {
      await this.sendWebMessage(message);
    }
  }

  // Send accountability alert
  async sendAccountabilityAlert(progress: UserProgress): Promise<void> {
    if (progress.missedDays < 2) return;

    const message = this.generateAccountabilityMessage(progress);
    
    if (this.businessApiKey) {
      await this.sendBusinessMessage(message);
    } else {
      await this.sendWebMessage(message);
    }
  }

  // Send weekend guilt
  async sendWeekendGuilt(progress: UserProgress): Promise<void> {
    const isWeekend = [0, 6].includes(new Date().getDay());
    if (!isWeekend || progress.goalProgress >= 70) return;

    const message = this.generateWeekendGuiltMessage(progress);
    
    if (this.businessApiKey) {
      await this.sendBusinessMessage(message);
    } else {
      await this.sendWebMessage(message);
    }
  }

  // Send celebration
  async sendCelebration(achievement: string, progress: UserProgress): Promise<void> {
    const message = this.generateCelebrationMessage(achievement, progress);
    
    if (this.businessApiKey) {
      await this.sendBusinessMessage(message);
    } else {
      await this.sendWebMessage(message);
    }
  }

  private getAccountabilitySeverity(missedDays: number): 'gentle' | 'firm' | 'harsh' | 'brutal' {
    if (missedDays >= 7) return 'brutal';
    if (missedDays >= 5) return 'harsh';
    if (missedDays >= 3) return 'firm';
    return 'gentle';
  }
}

// Create WhatsApp service instance
export const createWhatsAppService = (phoneNumber: string, businessApiKey?: string): WhatsAppService => {
  return new WhatsAppService(phoneNumber, businessApiKey);
};

// Default service (configure in settings)
export const whatsAppService = new WhatsAppService(
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+1234567890',
  process.env.WHATSAPP_BUSINESS_API_KEY
);

export default WhatsAppService;