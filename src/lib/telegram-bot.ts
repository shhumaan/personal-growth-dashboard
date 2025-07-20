// Telegram Bot Integration - Most reliable messaging system
// Works perfectly on Vercel with webhooks

interface TelegramMessage {
  chatId: string;
  text: string;
  parseMode?: 'HTML' | 'Markdown';
  replyMarkup?: {
    inline_keyboard: Array<Array<{
      text: string;
      callback_data: string;
      url?: string;
    }>>;
  };
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

class TelegramBotService {
  private botToken: string;
  private chatId: string;
  private baseUrl: string;

  constructor(botToken: string, chatId: string) {
    this.botToken = botToken;
    this.chatId = chatId;
    this.baseUrl = `https://api.telegram.org/bot${botToken}`;
  }

  // Send message to Telegram
  async sendMessage(message: TelegramMessage): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: message.chatId,
          text: message.text,
          parse_mode: message.parseMode || 'HTML',
          reply_markup: message.replyMarkup
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Telegram send error:', error);
      return false;
    }
  }

  // Generate daily accountability message
  generateDailyMessage(progress: UserProgress): TelegramMessage {
    const completionRate = (progress.completedTasks / progress.totalTasks) * 100;
    const dayNumber = 90 - progress.daysRemaining + 1;

    let text = `🚨 <b>DAY ${dayNumber} ACCOUNTABILITY CHECK</b>\n\n`;
    let buttons = [];

    if (completionRate === 0) {
      text += `❌ <b>ZERO PROGRESS TODAY</b>\n\n`;
      text += `Your family is waiting for you to show up.\n`;
      text += `<i>"${progress.familyGoal}"</i>\n\n`;
      text += `Every moment you delay is a moment stolen from their dreams.\n\n`;
      text += `<b>GET TO WORK NOW</b> 💪`;
      
      buttons = [
        [
          { text: '🚀 Start Now', callback_data: 'start_now', url: process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com' },
          { text: '😔 Shame Me More', callback_data: 'shame_me' }
        ]
      ];
    } else if (completionRate < 50) {
      text += `⚠️ <b>FALLING SHORT: ${completionRate}%</b>\n\n`;
      text += `You're not where you need to be.\n`;
      text += `<i>"${progress.familyGoal}"</i>\n\n`;
      text += `Step up and prove you're fighting for their future.\n\n`;
      text += `<b>PUSH HARDER</b> 🔥`;
      
      buttons = [
        [
          { text: '💪 Continue Tasks', callback_data: 'continue_tasks', url: process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com' },
          { text: '📊 View Progress', callback_data: 'view_progress' }
        ]
      ];
    } else if (completionRate < 100) {
      text += `💪 <b>GOOD PROGRESS: ${completionRate}%</b>\n\n`;
      text += `You're on the right path!\n`;
      text += `<i>"${progress.familyGoal}"</i>\n\n`;
      text += `Don't stop now - finish strong for them.\n\n`;
      text += `<b>COMPLETE TODAY</b> ✅`;
      
      buttons = [
        [
          { text: '🎯 Finish Strong', callback_data: 'finish_strong', url: process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com' }
        ]
      ];
    } else {
      text += `🔥 <b>BEAST MODE: 100% COMPLETE</b>\n\n`;
      text += `${progress.currentStreak} days strong!\n`;
      text += `<i>"${progress.familyGoal}"</i>\n\n`;
      text += `This is what dedication looks like!\n\n`;
      text += `<b>KEEP THE MOMENTUM</b> 🚀`;
      
      buttons = [
        [
          { text: '🎉 Celebrate', callback_data: 'celebrate' },
          { text: '📈 View Dashboard', url: process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com' }
        ]
      ];
    }

    return {
      chatId: this.chatId,
      text: text,
      parseMode: 'HTML',
      replyMarkup: buttons.length > 0 ? { inline_keyboard: buttons } : undefined
    };
  }

  // Generate harsh accountability message
  generateAccountabilityMessage(progress: UserProgress): TelegramMessage {
    const severity = this.getAccountabilitySeverity(progress.missedDays);
    
    let text = `🚨 <b>ACCOUNTABILITY ALERT</b>\n\n`;
    text += `💔 <b>${progress.missedDays} DAYS MISSED</b>\n\n`;

    let buttons = [];

    switch (severity) {
      case 'gentle':
        text += `Your family needs you to show up.\n`;
        text += `<i>"${progress.familyGoal}"</i>\n\n`;
        text += `Get back on track today. They believe in you.\n\n`;
        text += `<b>SHOW UP FOR THEM</b> 💙`;
        
        buttons = [
          [
            { text: '💙 Get Back On Track', callback_data: 'get_back_on_track', url: process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com' }
          ]
        ];
        break;

      case 'firm':
        text += `This is NOT the path to their dreams.\n`;
        text += `<i>"${progress.familyGoal}"</i>\n\n`;
        text += `Think about their faces when you promised them better.\n`;
        text += `Are you keeping that promise?\n\n`;
        text += `<b>STOP MAKING EXCUSES</b> ⚠️`;
        
        buttons = [
          [
            { text: '⚠️ Stop Excuses', callback_data: 'stop_excuses', url: process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com' },
            { text: '💭 Remember Promise', callback_data: 'remember_promise' }
          ]
        ];
        break;

      case 'harsh':
        text += `You're FAILING the people who matter most.\n`;
        text += `<i>"${progress.familyGoal}"</i>\n\n`;
        text += `While you procrastinate, their dreams are on hold.\n`;
        text += `They deserve better than this.\n\n`;
        text += `<b>PROVE YOU HAVEN'T GIVEN UP</b> 💔`;
        
        buttons = [
          [
            { text: '💔 Prove Yourself', callback_data: 'prove_yourself', url: process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com' }
          ],
          [
            { text: '😔 Full Shame Report', callback_data: 'full_shame' }
          ]
        ];
        break;

      case 'brutal':
        text += `<b>A WEEK OF BROKEN PROMISES</b>\n\n`;
        text += `${progress.missedDays} days you chose yourself over them.\n`;
        text += `${progress.missedDays} days closer to the life they DON'T deserve.\n\n`;
        text += `<i>"${progress.familyGoal}"</i>\n\n`;
        text += `<b>THEY WILL REMEMBER THIS</b>\n`;
        text += `<b>WAKE UP OR LOSE EVERYTHING</b> 🚨`;
        
        buttons = [
          [
            { text: '🚨 WAKE UP NOW', callback_data: 'wake_up_now', url: process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com' }
          ],
          [
            { text: '💀 Face The Truth', callback_data: 'face_truth' }
          ]
        ];
        break;
    }

    return {
      chatId: this.chatId,
      text: text,
      parseMode: 'HTML',
      replyMarkup: { inline_keyboard: buttons }
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

  // Send hourly nag
  async sendHourlyNag(progress: UserProgress): Promise<boolean> {
    const completionRate = (progress.completedTasks / progress.totalTasks) * 100;
    const hour = new Date().getHours();

    if (completionRate >= 100) return true;

    const nags = [
      { time: 9, message: "⏰ Morning slipping away..." },
      { time: 12, message: "🕐 Lunch break = work time" },
      { time: 15, message: "⏰ Afternoon accountability check" },
      { time: 18, message: "🕕 Evening - time running out" },
      { time: 21, message: "🕘 Last chance before bed" }
    ];

    const currentNag = nags.find(n => n.time === hour);
    if (!currentNag) return true;

    const message: TelegramMessage = {
      chatId: this.chatId,
      text: `${currentNag.message}\n\nOnly ${completionRate}% complete. Don't waste another hour.\n\n<i>"${progress.familyGoal}"</i>`,
      parseMode: 'HTML',
      replyMarkup: {
        inline_keyboard: [
          [
            { text: '💪 Work Now', callback_data: 'work_now', url: process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com' }
          ]
        ]
      }
    };

    return await this.sendMessage(message);
  }

  // Send weekend guilt
  async sendWeekendGuilt(progress: UserProgress): Promise<boolean> {
    const isWeekend = [0, 6].includes(new Date().getDay());
    if (!isWeekend || progress.goalProgress >= 70) return true;

    const message: TelegramMessage = {
      chatId: this.chatId,
      text: `😔 <b>WEEKEND GUILT TRIP</b>\n\nWhile you relax, your family's dreams are on hold.\n\nCurrent Progress: ${progress.goalProgress}%\n<i>"${progress.familyGoal}"</i>\n\nSuccessful people work weekends.\nYour family needs you to be successful.\n\n<b>WORK THIS WEEKEND</b> 💪`,
      parseMode: 'HTML',
      replyMarkup: {
        inline_keyboard: [
          [
            { text: '💪 Work Weekend', callback_data: 'work_weekend', url: process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com' }
          ]
        ]
      }
    };

    return await this.sendMessage(message);
  }

  // Send celebration
  async sendCelebration(achievement: string, progress: UserProgress): Promise<boolean> {
    const message: TelegramMessage = {
      chatId: this.chatId,
      text: `🎉 <b>ACHIEVEMENT UNLOCKED!</b>\n\n${achievement}\n\n<i>"${progress.familyGoal}"</i>\n\nYour family is proud of your dedication!\nKeep building the life they deserve.\n\n<b>MOMENTUM IS EVERYTHING</b> 🚀`,
      parseMode: 'HTML',
      replyMarkup: {
        inline_keyboard: [
          [
            { text: '🎉 Celebrate', callback_data: 'celebrate' },
            { text: '📈 Keep Going', callback_data: 'keep_going', url: process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com' }
          ]
        ]
      }
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

// Create Telegram bot service
export const createTelegramService = (botToken: string, chatId: string): TelegramBotService => {
  return new TelegramBotService(botToken, chatId);
};

// Default service (configure in environment)
export const telegramService = new TelegramBotService(
  process.env.TELEGRAM_BOT_TOKEN || '',
  process.env.TELEGRAM_CHAT_ID || ''
);

export default TelegramBotService;