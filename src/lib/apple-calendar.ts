// Apple Calendar Integration for Personal Growth Dashboard
// This creates .ics files that work seamlessly with Apple Calendar

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  allDay?: boolean;
  alarm?: number; // minutes before event
  recurrence?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    interval?: number;
    until?: Date;
  };
}

interface GoalMilestone {
  title: string;
  targetDate: Date;
  description: string;
  reminderDays: number[];
}

class AppleCalendarService {
  private formatDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  private formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  private escapeText(text: string): string {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  }

  generateICS(events: CalendarEvent[]): string {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Personal Growth Dashboard//90-Day Sprint//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    events.forEach(event => {
      ics.push('BEGIN:VEVENT');
      ics.push(`UID:${event.id}@personal-growth-dashboard.com`);
      ics.push(`DTSTAMP:${this.formatDate(new Date())}`);
      
      if (event.allDay) {
        ics.push(`DTSTART;VALUE=DATE:${this.formatDateLocal(event.startDate)}`);
        ics.push(`DTEND;VALUE=DATE:${this.formatDateLocal(new Date(event.endDate.getTime() + 24 * 60 * 60 * 1000))}`);
      } else {
        ics.push(`DTSTART:${this.formatDate(event.startDate)}`);
        ics.push(`DTEND:${this.formatDate(event.endDate)}`);
      }
      
      ics.push(`SUMMARY:${this.escapeText(event.title)}`);
      ics.push(`DESCRIPTION:${this.escapeText(event.description)}`);
      
      if (event.alarm) {
        ics.push('BEGIN:VALARM');
        ics.push('ACTION:DISPLAY');
        ics.push(`DESCRIPTION:${this.escapeText(event.title)} reminder`);
        ics.push(`TRIGGER:-PT${event.alarm}M`);
        ics.push('END:VALARM');
      }
      
      if (event.recurrence) {
        let rrule = `FREQ=${event.recurrence.frequency}`;
        if (event.recurrence.interval) {
          rrule += `;INTERVAL=${event.recurrence.interval}`;
        }
        if (event.recurrence.until) {
          rrule += `;UNTIL=${this.formatDate(event.recurrence.until)}`;
        }
        ics.push(`RRULE:${rrule}`);
      }
      
      ics.push('END:VEVENT');
    });

    ics.push('END:VCALENDAR');
    return ics.join('\r\n');
  }

  // Create 90-day sprint calendar with all necessary events
  create90DaySprintCalendar(
    sprintStartDate: Date,
    goalTitle: string,
    userName: string,
    familyGoal: string
  ): string {
    const events: CalendarEvent[] = [];
    const sprintEndDate = new Date(sprintStartDate.getTime() + 90 * 24 * 60 * 60 * 1000);

    // Sprint Start Event
    events.push({
      id: 'sprint-start',
      title: `🚀 90-Day Sprint Begins: ${goalTitle}`,
      description: `Today begins your 90-day journey toward: "${familyGoal}"\\n\\nThis is your moment, ${userName}. Make it count.`,
      startDate: sprintStartDate,
      endDate: new Date(sprintStartDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours
      alarm: 0 // Alert immediately
    });

    // Sprint End Event
    events.push({
      id: 'sprint-end',
      title: `🏆 90-Day Sprint Completion: ${goalTitle}`,
      description: `Today marks the end of your 90-day sprint!\\n\\nReflect on your journey and celebrate your growth.\\n\\nGoal: "${familyGoal}"`,
      startDate: sprintEndDate,
      endDate: new Date(sprintEndDate.getTime() + 2 * 60 * 60 * 1000),
      alarm: 0
    });

    // Daily Morning Reminders (every day for 90 days)
    const morningTime = new Date(sprintStartDate);
    morningTime.setHours(7, 30, 0, 0);
    
    events.push({
      id: 'daily-morning-reminder',
      title: '🌅 Morning Power-Up Time',
      description: `Start your day with intention.\\n\\nRemember: "${familyGoal}"\\n\\nEvery day matters. Make this one count.`,
      startDate: morningTime,
      endDate: new Date(morningTime.getTime() + 30 * 60 * 1000), // 30 minutes
      alarm: 5,
      recurrence: {
        frequency: 'DAILY',
        until: sprintEndDate
      }
    });

    // Evening Reflection (every day for 90 days)
    const eveningTime = new Date(sprintStartDate);
    eveningTime.setHours(20, 0, 0, 0);
    
    events.push({
      id: 'daily-evening-reflection',
      title: '🌅 Evening Deep Dive',
      description: `Time to reflect on today's progress.\\n\\nDid you move closer to: "${familyGoal}"?\\n\\nBe honest with yourself.`,
      startDate: eveningTime,
      endDate: new Date(eveningTime.getTime() + 30 * 60 * 1000),
      alarm: 10,
      recurrence: {
        frequency: 'DAILY',
        until: sprintEndDate
      }
    });

    // Weekly Review (every Sunday)
    const firstSunday = new Date(sprintStartDate);
    const daysToSunday = (7 - firstSunday.getDay()) % 7;
    firstSunday.setDate(firstSunday.getDate() + daysToSunday);
    firstSunday.setHours(10, 0, 0, 0);

    events.push({
      id: 'weekly-review',
      title: '📊 Weekly Sprint Review',
      description: `Weekly check-in on your 90-day journey.\\n\\n- Review this week's progress\\n- Analyze what worked and what didn't\\n- Plan next week's priorities\\n\\nGoal: "${familyGoal}"`,
      startDate: firstSunday,
      endDate: new Date(firstSunday.getTime() + 60 * 60 * 1000), // 1 hour
      alarm: 15,
      recurrence: {
        frequency: 'WEEKLY',
        until: sprintEndDate
      }
    });

    // 30-Day Milestone
    const day30 = new Date(sprintStartDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    day30.setHours(9, 0, 0, 0);
    
    events.push({
      id: 'milestone-30',
      title: '🎯 30-Day Milestone Check',
      description: `One-third of your sprint complete!\\n\\nTime for a major review:\\n- Are you on track for: "${familyGoal}"?\\n- What needs to change in the next 60 days?\\n- Celebrate your progress so far!`,
      startDate: day30,
      endDate: new Date(day30.getTime() + 90 * 60 * 1000), // 1.5 hours
      alarm: 60 // 1 hour warning
    });

    // 60-Day Milestone
    const day60 = new Date(sprintStartDate.getTime() + 60 * 24 * 60 * 60 * 1000);
    day60.setHours(9, 0, 0, 0);
    
    events.push({
      id: 'milestone-60',
      title: '🔥 60-Day Milestone - Final Push!',
      description: `Two-thirds complete! The final stretch begins now.\\n\\nCritical review time:\\n- How close are you to: "${familyGoal}"?\\n- What must happen in the final 30 days?\\n- Time to go ALL IN!`,
      startDate: day60,
      endDate: new Date(day60.getTime() + 90 * 60 * 1000),
      alarm: 60
    });

    // Final Week Countdown (Last 7 days)
    for (let i = 7; i >= 1; i--) {
      const countdownDay = new Date(sprintEndDate.getTime() - i * 24 * 60 * 60 * 1000);
      countdownDay.setHours(8, 0, 0, 0);
      
      events.push({
        id: `countdown-${i}`,
        title: `⚡ FINAL ${i} DAY${i > 1 ? 'S' : ''} - Sprint Ending Soon!`,
        description: `Only ${i} day${i > 1 ? 's' : ''} left in your sprint!\\n\\nEverything you do today matters.\\n\\nGoal: "${familyGoal}"\\n\\nGive it EVERYTHING you have!`,
        startDate: countdownDay,
        endDate: new Date(countdownDay.getTime() + 15 * 60 * 1000), // 15 minutes
        alarm: 0,
        allDay: false
      });
    }

    return this.generateICS(events);
  }

  // Create a downloadable .ics file
  downloadSprintCalendar(
    sprintStartDate: Date,
    goalTitle: string,
    userName: string,
    familyGoal: string
  ): void {
    const icsContent = this.create90DaySprintCalendar(sprintStartDate, goalTitle, userName, familyGoal);
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `90-day-sprint-${goalTitle.replace(/\s+/g, '-').toLowerCase()}.ics`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Generate calendar URL for Apple Calendar (webcal://)
  generateCalendarURL(): string {
    // In a real implementation, you'd host this .ics file on your server
    // and return a webcal:// URL that Apple Calendar can subscribe to
    
    // For now, return instructions for manual import
    return 'Download the .ics file and double-click to add to Apple Calendar';
  }

  // Create milestone-specific events
  createMilestoneEvents(milestones: GoalMilestone[]): CalendarEvent[] {
    const events: CalendarEvent[] = [];

    milestones.forEach((milestone, index) => {
      // Main milestone event
      events.push({
        id: `milestone-${index}`,
        title: `🎯 Milestone: ${milestone.title}`,
        description: milestone.description,
        startDate: milestone.targetDate,
        endDate: new Date(milestone.targetDate.getTime() + 60 * 60 * 1000),
        alarm: 60,
        allDay: false
      });

      // Reminder events leading up to milestone
      milestone.reminderDays.forEach(daysBefore => {
        const reminderDate = new Date(milestone.targetDate.getTime() - daysBefore * 24 * 60 * 60 * 1000);
        reminderDate.setHours(9, 0, 0, 0);

        events.push({
          id: `milestone-${index}-reminder-${daysBefore}`,
          title: `⏰ ${daysBefore} days until: ${milestone.title}`,
          description: `Milestone approaching!\\n\\n${milestone.description}\\n\\nAre you on track?`,
          startDate: reminderDate,
          endDate: new Date(reminderDate.getTime() + 15 * 60 * 1000),
          alarm: 15,
          allDay: false
        });
      });
    });

    return events;
  }
}

// Export singleton instance
export const appleCalendarService = new AppleCalendarService();

// Utility function to create and download sprint calendar
export const createSprintCalendar = (
  goalTitle: string,
  userName: string,
  familyGoal: string,
  startDate?: Date
) => {
  const sprintStart = startDate || new Date();
  appleCalendarService.downloadSprintCalendar(sprintStart, goalTitle, userName, familyGoal);
};

export default appleCalendarService;