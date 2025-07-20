// Discord Integration - Send accountability messages via Discord webhook
// Works perfectly on Vercel with webhooks

interface DiscordEmbed {
  title: string;
  description: string;
  color: number;
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  footer?: {
    text: string;
    icon_url?: string;
  };
  timestamp?: string;
  thumbnail?: {
    url: string;
  };
}

interface DiscordMessage {
  content?: string;
  embeds?: DiscordEmbed[];
  components?: Array<{
    type: 1; // Action Row
    components: Array<{
      type: 2; // Button
      style: 1 | 2 | 3 | 4 | 5; // Primary, Secondary, Success, Danger, Link
      label: string;
      url?: string;
      custom_id?: string;
      emoji?: {
        name: string;
      };
    }>;
  }>;
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

class DiscordService {
  private webhookUrl: string;
  private userMention: string;

  constructor(webhookUrl: string, userMention: string = '') {
    this.webhookUrl = webhookUrl;
    this.userMention = userMention;
  }

  // Send message to Discord
  async sendMessage(message: DiscordMessage): Promise<boolean> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      });

      return response.ok;
    } catch (error) {
      console.error('Discord send error:', error);
      return false;
    }
  }

  // Generate daily accountability message
  generateDailyMessage(progress: UserProgress): DiscordMessage {
    const completionRate = (progress.completedTasks / progress.totalTasks) * 100;
    const dayNumber = 90 - progress.daysRemaining + 1;

    let embed: DiscordEmbed;
    let content = this.userMention ? `${this.userMention} ` : '';

    if (completionRate === 0) {
      embed = {
        title: `🚨 DAY ${dayNumber} ACCOUNTABILITY CHECK`,
        description: `**ZERO PROGRESS TODAY**\n\nYour family is waiting for you to show up.\n\n*"${progress.familyGoal}"*\n\nEvery moment you delay is a moment stolen from their dreams.\n\n**GET TO WORK NOW** 💪`,
        color: 0xFF0000, // Red
        fields: [
          {
            name: 'Progress',
            value: `${completionRate}%`,
            inline: true
          },
          {
            name: 'Streak',
            value: `${progress.currentStreak} days`,
            inline: true
          },
          {
            name: 'Days Left',
            value: `${progress.daysRemaining}`,
            inline: true
          }
        ],
        footer: {
          text: 'No excuses. Your family needs you.',
        },
        timestamp: new Date().toISOString(),
        thumbnail: {
          url: 'https://cdn.discordapp.com/emojis/🚨.png'
        }
      };
      content += '🚨 **WAKE UP CALL** 🚨';
    } else if (completionRate < 50) {
      embed = {
        title: `⚠️ DAY ${dayNumber}: FALLING SHORT`,
        description: `**${completionRate}% COMPLETE**\n\nYou're not where you need to be.\n\n*"${progress.familyGoal}"*\n\nStep up and prove you're fighting for their future.\n\n**PUSH HARDER** 🔥`,
        color: 0xFFA500, // Orange
        fields: [
          {
            name: 'Progress',
            value: `${completionRate}%`,
            inline: true
          },
          {
            name: 'Streak',
            value: `${progress.currentStreak} days`,
            inline: true
          },
          {
            name: 'Status',
            value: 'Behind Target',
            inline: true
          }
        ],
        footer: {
          text: 'Time to step up your game.',
        },
        timestamp: new Date().toISOString()
      };
      content += '⚠️ **COURSE CORRECTION NEEDED** ⚠️';
    } else if (completionRate < 100) {
      embed = {
        title: `💪 DAY ${dayNumber}: GOOD PROGRESS`,
        description: `**${completionRate}% COMPLETE**\n\nYou're on the right path!\n\n*"${progress.familyGoal}"*\n\nDon't stop now - finish strong for them.\n\n**COMPLETE TODAY** ✅`,
        color: 0x00FF00, // Green
        fields: [
          {
            name: 'Progress',
            value: `${completionRate}%`,
            inline: true
          },
          {
            name: 'Streak',
            value: `${progress.currentStreak} days`,
            inline: true
          },
          {
            name: 'Status',
            value: 'On Track',
            inline: true
          }
        ],
        footer: {
          text: 'Keep the momentum going!',
        },
        timestamp: new Date().toISOString()
      };
      content += '💪 **ALMOST THERE** 💪';
    } else {
      embed = {
        title: `🔥 DAY ${dayNumber}: BEAST MODE`,
        description: `**100% COMPLETE**\n\n${progress.currentStreak} days strong!\n\n*"${progress.familyGoal}"*\n\nThis is what dedication looks like!\n\n**KEEP THE MOMENTUM** 🚀`,
        color: 0x00FF00, // Green
        fields: [
          {
            name: 'Progress',
            value: '100%',
            inline: true
          },
          {
            name: 'Streak',
            value: `${progress.currentStreak} days`,
            inline: true
          },
          {
            name: 'Status',
            value: 'BEAST MODE',
            inline: true
          }
        ],
        footer: {
          text: 'Your family is proud!',
        },
        timestamp: new Date().toISOString()
      };
      content += '🔥 **ABSOLUTE UNIT** 🔥';
    }

    return {
      content: content,
      embeds: [embed],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 5, // Link
              label: 'Open Dashboard',
              url: process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com',
              emoji: { name: '📱' }
            }
          ]
        }
      ]
    };
  }

  // Generate accountability message
  generateAccountabilityMessage(progress: UserProgress): DiscordMessage {
    const severity = this.getAccountabilitySeverity(progress.missedDays);
    let embed: DiscordEmbed;
    let content = this.userMention ? `${this.userMention} ` : '';

    switch (severity) {
      case 'gentle':
        embed = {
          title: '💙 Your family needs you to show up',
          description: `**${progress.missedDays} DAYS MISSED**\n\n*"${progress.familyGoal}"*\n\nGet back on track today. They believe in you.\n\n**SHOW UP FOR THEM** 💙`,
          color: 0x0099FF, // Blue
          footer: { text: 'They still believe in you.' },
          timestamp: new Date().toISOString()
        };
        content += '💙 **GENTLE REMINDER** 💙';
        break;

      case 'firm':
        embed = {
          title: '⚠️ This is NOT the path to their dreams',
          description: `**${progress.missedDays} DAYS MISSED**\n\n*"${progress.familyGoal}"*\n\nThink about their faces when you promised them better.\nAre you keeping that promise?\n\n**STOP MAKING EXCUSES** ⚠️`,
          color: 0xFFA500, // Orange
          footer: { text: 'Promises are meant to be kept.' },
          timestamp: new Date().toISOString()
        };
        content += '⚠️ **FIRM WARNING** ⚠️';
        break;

      case 'harsh':
        embed = {
          title: '💔 You\'re FAILING the people who matter most',
          description: `**${progress.missedDays} DAYS MISSED**\n\n*"${progress.familyGoal}"*\n\nWhile you procrastinate, their dreams are on hold.\nThey deserve better than this.\n\n**PROVE YOU HAVEN\'T GIVEN UP** 💔`,
          color: 0xFF4500, // Red-Orange
          footer: { text: 'They deserve better.' },
          timestamp: new Date().toISOString()
        };
        content += '💔 **HARSH REALITY** 💔';
        break;

      case 'brutal':
        embed = {
          title: '🚨 A WEEK OF BROKEN PROMISES',
          description: `**${progress.missedDays} DAYS MISSED**\n\n${progress.missedDays} days you chose yourself over them.\n${progress.missedDays} days closer to the life they DON'T deserve.\n\n*"${progress.familyGoal}"*\n\n**THEY WILL REMEMBER THIS**\n**WAKE UP OR LOSE EVERYTHING** 🚨`,
          color: 0xFF0000, // Red
          footer: { text: 'Last chance.' },
          timestamp: new Date().toISOString()
        };
        content += '🚨 **BRUTAL TRUTH** 🚨';
        break;
    }

    embed.fields = [
      {
        name: 'Days Missed',
        value: `${progress.missedDays}`,
        inline: true
      },
      {
        name: 'Days Remaining',
        value: `${progress.daysRemaining}`,
        inline: true
      },
      {
        name: 'Sprint Progress',
        value: `${progress.goalProgress}%`,
        inline: true
      }
    ];

    return {
      content: content,
      embeds: [embed],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 4, // Danger
              label: 'Redeem Yourself',
              url: process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com',
              emoji: { name: '💪' }
            }
          ]
        }
      ]
    };
  }

  // Send daily reminder
  async sendDailyReminder(progress: UserProgress): Promise<boolean> {
    const message = this.generateDailyMessage(progress);
    return await this.sendMessage(message);
  }

  // Send accountability alert
  async sendAccountabilityAlert(progress: UserProgress): Promise<boolean> {
    if (progress.missedDays < 2) return true;

    const message = this.generateAccountabilityMessage(progress);
    return await this.sendMessage(message);
  }

  // Send celebration
  async sendCelebration(achievement: string, progress: UserProgress): Promise<boolean> {
    const embed: DiscordEmbed = {
      title: '🎉 ACHIEVEMENT UNLOCKED!',
      description: `**${achievement}**\n\n*"${progress.familyGoal}"*\n\nYour family is proud of your dedication!\nKeep building the life they deserve.\n\n**MOMENTUM IS EVERYTHING** 🚀`,
      color: 0x00FF00, // Green
      footer: { text: 'Keep the momentum going!' },
      timestamp: new Date().toISOString()
    };

    const message: DiscordMessage = {
      content: this.userMention ? `${this.userMention} 🎉 **CELEBRATION TIME** 🎉` : '🎉 **CELEBRATION TIME** 🎉',
      embeds: [embed],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 3, // Success
              label: 'Keep Going',
              url: process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com',
              emoji: { name: '🚀' }
            }
          ]
        }
      ]
    };

    return await this.sendMessage(message);
  }

  private getAccountabilitySeverity(missedDays: number): 'gentle' | 'firm' | 'harsh' | 'brutal' {
    if (missedDays >= 7) return 'brutal';
    if (missedDays >= 5) return 'harsh';
    if (missedDays >= 3) return 'firm';
    return 'gentle';
  }
}

// Create Discord service
export const createDiscordService = (webhookUrl: string, userMention?: string): DiscordService => {
  return new DiscordService(webhookUrl, userMention);
};

// Default service (configure in environment)
export const discordService = new DiscordService(
  process.env.DISCORD_WEBHOOK_URL || '',
  process.env.DISCORD_USER_MENTION || ''
);

export default DiscordService;