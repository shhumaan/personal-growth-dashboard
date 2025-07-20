// Central notification manager that handles all notification types
// Automatically sends to all configured channels

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

interface NotificationSettings {
  discord: {
    enabled: boolean;
    webhookUrl: string;
    userMention: string;
  };
  telegram: {
    enabled: boolean;
    botToken: string;
    chatId: string;
  };
  whatsapp: {
    enabled: boolean;
    phoneNumber: string;
    businessApiKey?: string;
  };
  push: {
    enabled: boolean;
  };
}

export class NotificationManager {
  private settings: NotificationSettings;

  constructor(settings: NotificationSettings) {
    this.settings = settings;
  }

  // Send daily reminder to all enabled channels
  async sendDailyReminder(progress: UserProgress): Promise<void> {
    const promises = [];

    if (this.settings.discord.enabled) {
      promises.push(this.sendNotification('discord', 'daily', progress));
    }

    if (this.settings.telegram.enabled) {
      promises.push(this.sendNotification('telegram', 'daily', progress));
    }

    if (this.settings.whatsapp.enabled) {
      promises.push(this.sendNotification('whatsapp', 'daily', progress));
    }

    if (this.settings.push.enabled) {
      promises.push(this.sendNotification('push', 'daily', progress));
    }

    await Promise.allSettled(promises);
  }

  // Send accountability alert to all enabled channels
  async sendAccountabilityAlert(progress: UserProgress): Promise<void> {
    if (progress.missedDays < 2) return;

    const promises = [];

    if (this.settings.discord.enabled) {
      promises.push(this.sendNotification('discord', 'accountability', progress));
    }

    if (this.settings.telegram.enabled) {
      promises.push(this.sendNotification('telegram', 'accountability', progress));
    }

    if (this.settings.whatsapp.enabled) {
      promises.push(this.sendNotification('whatsapp', 'accountability', progress));
    }

    if (this.settings.push.enabled) {
      promises.push(this.sendNotification('push', 'accountability', progress));
    }

    await Promise.allSettled(promises);
  }

  // Send celebration to all enabled channels
  async sendCelebration(achievement: string, progress: UserProgress): Promise<void> {
    const promises = [];

    if (this.settings.discord.enabled) {
      promises.push(this.sendNotification('discord', 'celebration', progress, achievement));
    }

    if (this.settings.telegram.enabled) {
      promises.push(this.sendNotification('telegram', 'celebration', progress, achievement));
    }

    if (this.settings.whatsapp.enabled) {
      promises.push(this.sendNotification('whatsapp', 'celebration', progress, achievement));
    }

    if (this.settings.push.enabled) {
      promises.push(this.sendNotification('push', 'celebration', progress, achievement));
    }

    await Promise.allSettled(promises);
  }

  // Send hourly nag (Telegram and Push only)
  async sendHourlyNag(progress: UserProgress): Promise<void> {
    const promises = [];

    if (this.settings.telegram.enabled) {
      promises.push(this.sendNotification('telegram', 'hourly', progress));
    }

    if (this.settings.push.enabled) {
      promises.push(this.sendNotification('push', 'hourly', progress));
    }

    await Promise.allSettled(promises);
  }

  // Send weekend guilt
  async sendWeekendGuilt(progress: UserProgress): Promise<void> {
    const promises = [];

    if (this.settings.telegram.enabled) {
      promises.push(this.sendNotification('telegram', 'weekend', progress));
    }

    if (this.settings.whatsapp.enabled) {
      promises.push(this.sendNotification('whatsapp', 'weekend', progress));
    }

    if (this.settings.push.enabled) {
      promises.push(this.sendNotification('push', 'weekend', progress));
    }

    await Promise.allSettled(promises);
  }

  // Private method to send notification to specific channel
  private async sendNotification(
    channel: 'discord' | 'telegram' | 'whatsapp' | 'push',
    type: string,
    progress: UserProgress,
    achievement?: string
  ): Promise<void> {
    try {
      const response = await fetch(`/api/notifications/${channel}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          progress,
          type,
          ...(achievement && { achievement })
        })
      });

      if (!response.ok) {
        console.error(`Failed to send ${channel} notification:`, await response.text());
      }
    } catch (error) {
      console.error(`Error sending ${channel} notification:`, error);
    }
  }

  // Test notification for setup
  async testNotification(channel: 'discord' | 'telegram' | 'whatsapp' | 'push'): Promise<boolean> {
    const testProgress: UserProgress = {
      completedTasks: 1,
      totalTasks: 3,
      currentStreak: 5,
      goalProgress: 33,
      daysRemaining: 85,
      missedDays: 0,
      familyGoal: "Build a better future for my family",
      userName: "Test User"
    };

    try {
      await this.sendNotification(channel, 'daily', testProgress);
      return true;
    } catch (error) {
      console.error(`Test notification failed for ${channel}:`, error);
      return false;
    }
  }
}

// Create notification manager from settings
export const createNotificationManager = (settings: NotificationSettings): NotificationManager => {
  return new NotificationManager(settings);
};

// Hook for React components
export const useNotificationManager = (settings: NotificationSettings) => {
  const manager = new NotificationManager(settings);
  
  return {
    sendDailyReminder: (progress: UserProgress) => manager.sendDailyReminder(progress),
    sendAccountabilityAlert: (progress: UserProgress) => manager.sendAccountabilityAlert(progress),
    sendCelebration: (achievement: string, progress: UserProgress) => manager.sendCelebration(achievement, progress),
    sendHourlyNag: (progress: UserProgress) => manager.sendHourlyNag(progress),
    sendWeekendGuilt: (progress: UserProgress) => manager.sendWeekendGuilt(progress),
    testNotification: (channel: 'discord' | 'telegram' | 'whatsapp' | 'push') => manager.testNotification(channel)
  };
};

export default NotificationManager;