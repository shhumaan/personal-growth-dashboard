// Email service for sending notifications
// This will need to be configured with your preferred email provider

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface EmailSettings {
  dailyReminders: boolean;
  weeklyReports: boolean;
  milestoneAlerts: boolean;
  motivationalEmails: boolean;
  preferredTime: string; // HH:MM format
  timezone: string;
}

interface UserProgress {
  completedTasks: number;
  totalTasks: number;
  currentStreak: number;
  goalProgress: number;
  daysRemaining: number;
  recentAchievements: string[];
}

class EmailService {
  private apiKey: string;
  private baseUrl: string;
  private senderEmail: string;
  private senderName: string;

  constructor() {
    // Initialize with environment variables
    this.apiKey = process.env.EMAIL_API_KEY || '';
    this.baseUrl = process.env.EMAIL_API_URL || '';
    this.senderEmail = process.env.SENDER_EMAIL || 'noreply@yourdomain.com';
    this.senderName = process.env.SENDER_NAME || 'Personal Growth Dashboard';
  }

  // Daily goal reminder email
  generateDailyReminderEmail(userProgress: UserProgress): EmailTemplate {
    const { completedTasks, totalTasks, currentStreak, daysRemaining } = userProgress;
    const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

    return {
      subject: `🎯 Day ${90 - daysRemaining + 1} of 90 - Your Daily Goals Await!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; }
            .progress-bar { background: #e0e0e0; border-radius: 10px; height: 20px; margin: 20px 0; }
            .progress-fill { background: linear-gradient(90deg, #4CAF50, #45a049); height: 100%; border-radius: 10px; }
            .task-section { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
            .stats { display: flex; justify-content: space-around; margin: 20px 0; }
            .stat-box { text-align: center; padding: 15px; background: white; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            .cta-button { background: #667eea; color: white; padding: 15px 30px; border: none; border-radius: 25px; text-decoration: none; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; color: #666; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌟 Good Morning, Champion!</h1>
              <p>Day ${90 - daysRemaining + 1} of your 90-day sprint</p>
            </div>

            <div class="stats">
              <div class="stat-box">
                <h3>${currentStreak}</h3>
                <p>Day Streak</p>
              </div>
              <div class="stat-box">
                <h3>${daysRemaining}</h3>
                <p>Days Left</p>
              </div>
              <div class="stat-box">
                <h3>${completionPercentage}%</h3>
                <p>Today's Progress</p>
              </div>
            </div>

            <div class="task-section">
              <h2>🎯 Today's Mission</h2>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${completionPercentage}%"></div>
              </div>
              <p>You've completed <strong>${completedTasks} out of ${totalTasks}</strong> tasks today.</p>
              
              <h3>What's Next:</h3>
              <ul>
                <li>✅ Complete your morning reflection</li>
                <li>📚 Focus on your learning goals</li>
                <li>💪 Take action on your main objective</li>
                <li>🌅 Plan tomorrow's priorities</li>
              </ul>
            </div>

            <div style="text-align: center;">
              <a href="https://yourdomain.com/dashboard" class="cta-button">
                Open Dashboard
              </a>
            </div>

            <div style="background: #e8f5e8; padding: 15px; border-radius: 10px; margin: 20px 0;">
              <p><strong>💡 Daily Tip:</strong> The key to success is consistency. Small daily actions compound into extraordinary results!</p>
            </div>

            <div class="footer">
              <p>Keep pushing forward! You've got this! 🚀</p>
              <p><small>Personal Growth Dashboard • <a href="#unsubscribe">Unsubscribe</a></small></p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        🌟 Good Morning, Champion!
        
        Day ${90 - daysRemaining + 1} of your 90-day sprint
        
        📊 Your Stats:
        • Current Streak: ${currentStreak} days
        • Days Remaining: ${daysRemaining}
        • Today's Progress: ${completionPercentage}%
        
        🎯 Today's Mission:
        You've completed ${completedTasks} out of ${totalTasks} tasks today.
        
        What's Next:
        • Complete your morning reflection
        • Focus on your learning goals
        • Take action on your main objective
        • Plan tomorrow's priorities
        
        💡 Daily Tip: The key to success is consistency. Small daily actions compound into extraordinary results!
        
        Keep pushing forward! You've got this! 🚀
        
        Open Dashboard: https://yourdomain.com/dashboard
      `
    };
  }

  // Weekly progress report email
  generateWeeklyReportEmail(userProgress: UserProgress): EmailTemplate {
    const { currentStreak, goalProgress, recentAchievements } = userProgress;

    return {
      subject: `📊 Weekly Progress Report - Week ${Math.ceil((90 - userProgress.daysRemaining) / 7)}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; }
            .achievement { background: #f0f8ff; padding: 15px; border-left: 4px solid #4CAF50; margin: 10px 0; }
            .progress-circle { width: 100px; height: 100px; border-radius: 50%; background: conic-gradient(#4CAF50 ${goalProgress * 3.6}deg, #e0e0e0 0deg); margin: 0 auto; display: flex; align-items: center; justify-content: center; }
            .insights { background: #fff3cd; padding: 15px; border-radius: 10px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Weekly Progress Report</h1>
              <p>Week ${Math.ceil((90 - userProgress.daysRemaining) / 7)} of 13</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <div class="progress-circle">
                <span style="font-size: 24px; font-weight: bold;">${goalProgress}%</span>
              </div>
              <p>Overall Goal Progress</p>
            </div>

            <div class="insights">
              <h3>📈 This Week's Insights</h3>
              <p>You maintained a <strong>${currentStreak}-day streak</strong> this week!</p>
              <p>You're ${goalProgress >= 75 ? 'exceeding' : goalProgress >= 50 ? 'meeting' : 'behind'} your target pace.</p>
            </div>

            <div>
              <h3>🏆 Recent Achievements</h3>
              ${recentAchievements.map(achievement => `<div class="achievement">${achievement}</div>`).join('')}
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://yourdomain.com/dashboard" style="background: #667eea; color: white; padding: 15px 30px; border: none; border-radius: 25px; text-decoration: none;">
                View Full Report
              </a>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        📊 Weekly Progress Report - Week ${Math.ceil((90 - userProgress.daysRemaining) / 7)}
        
        Overall Goal Progress: ${goalProgress}%
        Current Streak: ${currentStreak} days
        
        📈 This Week's Insights:
        You maintained a ${currentStreak}-day streak this week!
        You're ${goalProgress >= 75 ? 'exceeding' : goalProgress >= 50 ? 'meeting' : 'behind'} your target pace.
        
        🏆 Recent Achievements:
        ${recentAchievements.join('\n')}
        
        View Full Report: https://yourdomain.com/dashboard
      `
    };
  }

  // Milestone alert email
  generateMilestoneEmail(milestone: string, progress: number): EmailTemplate {
    return {
      subject: `🎉 Milestone Achieved: ${milestone}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .celebration { background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); padding: 30px; border-radius: 15px; text-align: center; margin: 20px 0; }
            .badge { background: #4CAF50; color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="celebration">
              <h1>🎉 CONGRATULATIONS! 🎉</h1>
              <h2>You've reached: ${milestone}</h2>
              <div class="badge">${progress}% Complete</div>
              <p>You're making incredible progress on your 90-day journey!</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <p><strong>Keep the momentum going!</strong></p>
              <p>Every milestone is a step closer to your ultimate goal.</p>
            </div>

            <div style="background: #f0f8ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>🔥 What's Next:</h3>
              <ul>
                <li>Celebrate this achievement (you earned it!)</li>
                <li>Reflect on what's working well</li>
                <li>Adjust your strategy if needed</li>
                <li>Set your sights on the next milestone</li>
              </ul>
            </div>

            <div style="text-align: center;">
              <a href="https://yourdomain.com/dashboard" style="background: #667eea; color: white; padding: 15px 30px; border: none; border-radius: 25px; text-decoration: none;">
                View Your Progress
              </a>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        🎉 CONGRATULATIONS! 🎉
        
        You've reached: ${milestone}
        ${progress}% Complete
        
        You're making incredible progress on your 90-day journey!
        
        🔥 What's Next:
        • Celebrate this achievement (you earned it!)
        • Reflect on what's working well
        • Adjust your strategy if needed
        • Set your sights on the next milestone
        
        Keep the momentum going!
        
        View Your Progress: https://yourdomain.com/dashboard
      `
    };
  }

  // Send email function (to be implemented with your email provider)
  async sendEmail(to: string, template: EmailTemplate): Promise<boolean> {
    try {
      // This is a placeholder - implement with your chosen email service
      // Examples: SendGrid, AWS SES, Nodemailer, etc.
      
      console.log('Sending email to:', to);
      console.log('Subject:', template.subject);
      console.log('HTML length:', template.html.length);
      
      // Example with fetch (adapt to your email service)
      const response = await fetch(`${this.baseUrl}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          to,
          from: `${this.senderName} <${this.senderEmail}>`,
          subject: template.subject,
          html: template.html,
          text: template.text
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  // Schedule daily reminder
  async scheduleDailyReminder(userEmail: string, settings: EmailSettings, progress: UserProgress): Promise<void> {
    if (!settings.dailyReminders) return;

    const template = this.generateDailyReminderEmail(progress);
    await this.sendEmail(userEmail, template);
  }

  // Schedule weekly report
  async scheduleWeeklyReport(userEmail: string, settings: EmailSettings, progress: UserProgress): Promise<void> {
    if (!settings.weeklyReports) return;

    const template = this.generateWeeklyReportEmail(progress);
    await this.sendEmail(userEmail, template);
  }

  // Send milestone alert
  async sendMilestoneAlert(userEmail: string, milestone: string, progress: number): Promise<void> {
    const template = this.generateMilestoneEmail(milestone, progress);
    await this.sendEmail(userEmail, template);
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Helper function to save user email preferences
export const saveEmailSettings = (userId: string, settings: EmailSettings): void => {
  localStorage.setItem(`email-settings-${userId}`, JSON.stringify(settings));
};

// Helper function to load user email preferences
export const loadEmailSettings = (userId: string): EmailSettings | null => {
  const saved = localStorage.getItem(`email-settings-${userId}`);
  return saved ? JSON.parse(saved) : null;
};

// Default email settings
export const defaultEmailSettings: EmailSettings = {
  dailyReminders: true,
  weeklyReports: true,
  milestoneAlerts: true,
  motivationalEmails: true,
  preferredTime: '08:00',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
};