// Web Push Notifications - Works perfectly on Vercel
// Sends notifications directly to your browser/phone

interface NotificationData {
  title: string;
  message: string;
  icon?: string;
  badge?: string;
  data?: Record<string, unknown>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  tag?: string;
  requireInteraction?: boolean;
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

class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null;
  private permission: NotificationPermission = 'default';

  async initialize(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported');
      return false;
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      
      // Request permission
      this.permission = await Notification.requestPermission();
      
      return this.permission === 'granted';
    } catch (error) {
      console.error('Push notification setup failed:', error);
      return false;
    }
  }

  async sendNotification(data: NotificationData): Promise<void> {
    if (this.permission !== 'granted' || !this.registration) {
      console.warn('Push notifications not available');
      return;
    }

    try {
      await this.registration.showNotification(data.title, {
        body: data.message,
        icon: data.icon || '/icon-192x192.png',
        badge: data.badge || '/badge-72x72.png',
        data: { ...data.data, actions: data.actions },
        tag: data.tag,
        requireInteraction: data.requireInteraction
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  // Daily reminder notifications
  async sendDailyReminder(progress: UserProgress): Promise<void> {
    const completionRate = (progress.completedTasks / progress.totalTasks) * 100;
    const dayNumber = 90 - progress.daysRemaining + 1;

    let notification: NotificationData;

    if (completionRate === 0) {
      notification = {
        title: `🚨 Day ${dayNumber}: Your family is waiting...`,
        message: `You haven't started today's tasks. "${progress.familyGoal}" - Don't let them down.`,
        icon: '/notification-urgent.png',
        requireInteraction: true,
        tag: 'daily-reminder',
        actions: [
          { action: 'start-now', title: 'Start Now', icon: '/action-start.png' },
          { action: 'remind-later', title: 'Remind in 30min', icon: '/action-remind.png' }
        ]
      };
    } else if (completionRate < 50) {
      notification = {
        title: `⚠️ Day ${dayNumber}: You're falling short`,
        message: `${completionRate}% complete. Step up for: "${progress.familyGoal}"`,
        icon: '/notification-warning.png',
        requireInteraction: true,
        tag: 'daily-reminder',
        actions: [
          { action: 'continue', title: 'Continue Tasks', icon: '/action-continue.png' },
          { action: 'view-progress', title: 'View Progress', icon: '/action-view.png' }
        ]
      };
    } else if (completionRate < 100) {
      notification = {
        title: `💪 Day ${dayNumber}: Almost there!`,
        message: `${completionRate}% complete. Finish strong for your family!`,
        icon: '/notification-progress.png',
        tag: 'daily-reminder',
        actions: [
          { action: 'finish-strong', title: 'Finish Strong', icon: '/action-finish.png' }
        ]
      };
    } else {
      notification = {
        title: `🔥 Day ${dayNumber}: BEAST MODE!`,
        message: `100% complete! ${progress.currentStreak} days strong. Your family is proud!`,
        icon: '/notification-success.png',
        tag: 'daily-reminder',
        actions: [
          { action: 'celebrate', title: 'Celebrate 🎉', icon: '/action-celebrate.png' }
        ]
      };
    }

    await this.sendNotification(notification);
  }

  // Accountability notifications for missed days
  async sendAccountabilityAlert(progress: UserProgress): Promise<void> {
    if (progress.missedDays < 2) return;

    const severity = this.getAccountabilitySeverity(progress.missedDays);
    let notification: NotificationData;

    switch (severity) {
      case 'gentle':
        notification = {
          title: `💙 Your family needs you to show up`,
          message: `${progress.missedDays} missed days. Get back on track for: "${progress.familyGoal}"`,
          icon: '/notification-gentle.png',
          tag: 'accountability'
        };
        break;

      case 'firm':
        notification = {
          title: `⚠️ This is not the path to their dreams`,
          message: `${progress.missedDays} days without progress. They're counting on you.`,
          icon: '/notification-firm.png',
          requireInteraction: true,
          tag: 'accountability'
        };
        break;

      case 'harsh':
        notification = {
          title: `💔 You're failing the people who matter most`,
          message: `${progress.missedDays} days of broken promises. They deserve better.`,
          icon: '/notification-harsh.png',
          requireInteraction: true,
          tag: 'accountability'
        };
        break;

      case 'brutal':
        notification = {
          title: `🚨 A WEEK OF BROKEN PROMISES`,
          message: `${progress.missedDays} days of choosing yourself over them. WAKE UP!`,
          icon: '/notification-brutal.png',
          requireInteraction: true,
          tag: 'accountability'
        };
        break;
    }

    notification.actions = [
      { action: 'redeem-now', title: 'Redeem Yourself', icon: '/action-redeem.png' },
      { action: 'view-shame', title: 'View Full Shame', icon: '/action-shame.png' }
    ];

    await this.sendNotification(notification);
  }

  // Hourly nagging for incomplete days
  async sendHourlyNag(progress: UserProgress): Promise<void> {
    const completionRate = (progress.completedTasks / progress.totalTasks) * 100;
    const hour = new Date().getHours();

    if (completionRate >= 100) return; // Don't nag if complete

    const nags = [
      { time: 9, message: "Morning slipping away..." },
      { time: 12, message: "Lunch break = work time" },
      { time: 15, message: "Afternoon accountability check" },
      { time: 18, message: "Evening - time running out" },
      { time: 21, message: "Last chance before bed" }
    ];

    const currentNag = nags.find(n => n.time === hour);
    if (!currentNag) return;

    await this.sendNotification({
      title: `⏰ ${currentNag.message}`,
      message: `Only ${completionRate}% complete. Don't waste another hour.`,
      icon: '/notification-nag.png',
      tag: 'hourly-nag',
      actions: [
        { action: 'work-now', title: 'Work Now', icon: '/action-work.png' }
      ]
    });
  }

  // Weekend guilt trip
  async sendWeekendGuilt(progress: UserProgress): Promise<void> {
    const isWeekend = [0, 6].includes(new Date().getDay());
    if (!isWeekend) return;

    if (progress.goalProgress < 70) {
      await this.sendNotification({
        title: `😔 Weekend Guilt Trip`,
        message: `While you relax, your family's dreams are on hold. ${progress.goalProgress}% complete.`,
        icon: '/notification-guilt.png',
        requireInteraction: true,
        tag: 'weekend-guilt',
        actions: [
          { action: 'work-weekend', title: 'Work This Weekend', icon: '/action-weekend.png' }
        ]
      });
    }
  }

  // Success celebration
  async sendCelebration(achievement: string): Promise<void> {
    await this.sendNotification({
      title: `🎉 ACHIEVEMENT UNLOCKED!`,
      message: `${achievement} - Your family is proud!`,
      icon: '/notification-celebration.png',
      tag: 'celebration',
      actions: [
        { action: 'share-win', title: 'Share This Win', icon: '/action-share.png' }
      ]
    });
  }

  private getAccountabilitySeverity(missedDays: number): 'gentle' | 'firm' | 'harsh' | 'brutal' {
    if (missedDays >= 7) return 'brutal';
    if (missedDays >= 5) return 'harsh';
    if (missedDays >= 3) return 'firm';
    return 'gentle';
  }

  // Schedule recurring notifications
  async scheduleRecurringNotifications(progress: UserProgress): Promise<void> {
    // This would typically be handled by the service worker
    // For now, we'll set up timers (in production, use Vercel Cron Jobs)
    
    // Daily reminder at 8 AM
    const now = new Date();
    const tomorrow8AM = new Date(now);
    tomorrow8AM.setDate(now.getDate() + 1);
    tomorrow8AM.setHours(8, 0, 0, 0);
    
    const timeUntil8AM = tomorrow8AM.getTime() - now.getTime();
    
    setTimeout(() => {
      this.sendDailyReminder(progress);
    }, timeUntil8AM);
  }
}

// Export singleton instance
export const pushNotificationService = new PushNotificationService();

// Utility functions
export const initializePushNotifications = async (): Promise<boolean> => {
  return await pushNotificationService.initialize();
};

export const sendInstantAccountabilityAlert = async (progress: UserProgress): Promise<void> => {
  await pushNotificationService.sendAccountabilityAlert(progress);
};

export const sendInstantDailyReminder = async (progress: UserProgress): Promise<void> => {
  await pushNotificationService.sendDailyReminder(progress);
};

export default pushNotificationService;