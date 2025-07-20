import { Resend } from 'resend';
import { DailyReminderEmail } from '@/components/emails/daily-reminder-email';
import { WeeklyReportEmail } from '@/components/emails/weekly-report-email';
import { MilestoneEmail } from '@/components/emails/milestone-email';
import { AccountabilityEmail } from '@/components/emails/accountability-email';

const resend = new Resend(process.env.RESEND_API_KEY);

interface UserProgress {
  completedTasks: number;
  totalTasks: number;
  currentStreak: number;
  goalProgress: number;
  daysRemaining: number;
  recentAchievements: string[];
  missedDays: number;
  familyGoal: string;
  userName: string;
}

interface EmailSettings {
  userEmail: string;
  userName: string;
  familyGoal: string;
  preferredTime: string;
  timezone: string;
  enabledTypes: {
    dailyReminders: boolean;
    weeklyReports: boolean;
    milestoneAlerts: boolean;
    accountabilityMessages: boolean;
  };
}

class ResendEmailService {
  // Send daily reminder with emotional motivation
  async sendDailyReminder(settings: EmailSettings, progress: UserProgress): Promise<boolean> {
    if (!settings.enabledTypes.dailyReminders) return false;

    try {
      const { data, error } = await resend.emails.send({
        from: 'Your Growth Coach <noreply@yourdomain.com>',
        to: [settings.userEmail],
        subject: this.getDailySubject(progress),
        react: DailyReminderEmail({
          userName: settings.userName,
          familyGoal: settings.familyGoal,
          progress,
          daysRemaining: progress.daysRemaining,
          completionPercentage: Math.round((progress.completedTasks / progress.totalTasks) * 100)
        }),
      });

      if (error) {
        console.error('Daily reminder email failed:', error);
        return false;
      }

      console.log('Daily reminder sent:', data?.id);
      return true;
    } catch (error) {
      console.error('Daily reminder error:', error);
      return false;
    }
  }

  // Send weekly progress report
  async sendWeeklyReport(settings: EmailSettings, progress: UserProgress): Promise<boolean> {
    if (!settings.enabledTypes.weeklyReports) return false;

    try {
      const { error } = await resend.emails.send({
        from: 'Your Growth Coach <noreply@yourdomain.com>',
        to: [settings.userEmail],
        subject: `Week ${Math.ceil((90 - progress.daysRemaining) / 7)} Report: ${this.getWeeklyMotivation(progress)}`,
        react: WeeklyReportEmail({
          userName: settings.userName,
          familyGoal: settings.familyGoal,
          progress,
          weekNumber: Math.ceil((90 - progress.daysRemaining) / 7),
          isOnTrack: progress.goalProgress >= (90 - progress.daysRemaining) / 90 * 100
        }),
      });

      if (error) {
        console.error('Weekly report email failed:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Weekly report error:', error);
      return false;
    }
  }

  // Send milestone celebration
  async sendMilestone(settings: EmailSettings, milestone: string, progress: UserProgress): Promise<boolean> {
    if (!settings.enabledTypes.milestoneAlerts) return false;

    try {
      const { error } = await resend.emails.send({
        from: 'Your Growth Coach <noreply@yourdomain.com>',
        to: [settings.userEmail],
        subject: `🎉 MILESTONE ACHIEVED: ${milestone}!`,
        react: MilestoneEmail({
          userName: settings.userName,
          familyGoal: settings.familyGoal,
          milestone,
          progress: progress.goalProgress,
          daysRemaining: progress.daysRemaining
        }),
      });

      if (error) {
        console.error('Milestone email failed:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Milestone error:', error);
      return false;
    }
  }

  // Send harsh accountability message when falling behind
  async sendAccountabilityMessage(settings: EmailSettings, progress: UserProgress): Promise<boolean> {
    if (!settings.enabledTypes.accountabilityMessages) return false;
    if (progress.missedDays < 2) return false; // Only send after 2+ missed days

    try {
      const { error } = await resend.emails.send({
        from: 'Your Growth Coach <noreply@yourdomain.com>',
        to: [settings.userEmail],
        subject: this.getAccountabilitySubject(progress),
        react: AccountabilityEmail({
          userName: settings.userName,
          familyGoal: settings.familyGoal,
          missedDays: progress.missedDays,
          daysRemaining: progress.daysRemaining,
          severity: this.getAccountabilitySeverity(progress.missedDays)
        }),
      });

      if (error) {
        console.error('Accountability email failed:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Accountability error:', error);
      return false;
    }
  }

  private getDailySubject(progress: UserProgress): string {
    const { daysRemaining, currentStreak, completedTasks, totalTasks } = progress;
    const completionRate = (completedTasks / totalTasks) * 100;

    if (completionRate === 0) {
      return `Day ${90 - daysRemaining + 1}: Your family is counting on you...`;
    } else if (completionRate < 50) {
      return `Day ${90 - daysRemaining + 1}: Don't let them down today`;
    } else if (completionRate < 100) {
      return `Day ${90 - daysRemaining + 1}: Almost there - finish strong!`;
    } else {
      return `Day ${90 - daysRemaining + 1}: BEAST MODE - ${currentStreak} days strong! 🔥`;
    }
  }

  private getWeeklyMotivation(progress: UserProgress): string {
    const onTrack = progress.goalProgress >= (90 - progress.daysRemaining) / 90 * 100;
    
    if (!onTrack) {
      return "Time is running out...";
    } else if (progress.goalProgress >= 75) {
      return "You're crushing it!";
    } else {
      return "Steady progress continues";
    }
  }

  private getAccountabilitySubject(progress: UserProgress): string {
    const { missedDays } = progress;
    
    if (missedDays >= 7) {
      return "🚨 WAKE UP! Your family's future is slipping away...";
    } else if (missedDays >= 5) {
      return "⚠️ This is not the path to the life they deserve";
    } else if (missedDays >= 3) {
      return "💔 Your family needs you to show up";
    } else {
      return "⏰ Every day matters - get back on track";
    }
  }

  private getAccountabilitySeverity(missedDays: number): 'gentle' | 'firm' | 'harsh' | 'brutal' {
    if (missedDays >= 7) return 'brutal';
    if (missedDays >= 5) return 'harsh';
    if (missedDays >= 3) return 'firm';
    return 'gentle';
  }
}

// Export singleton instance
export const resendService = new ResendEmailService();

// Utility functions for email scheduling
export const scheduleEmail = async (type: 'daily' | 'weekly' | 'milestone' | 'accountability', settings: EmailSettings, progress: UserProgress) => {
  switch (type) {
    case 'daily':
      return await resendService.sendDailyReminder(settings, progress);
    case 'weekly':
      return await resendService.sendWeeklyReport(settings, progress);
    case 'milestone':
      return await resendService.sendMilestone(settings, 'Custom Milestone', progress);
    case 'accountability':
      return await resendService.sendAccountabilityMessage(settings, progress);
  }
};

export default resendService;