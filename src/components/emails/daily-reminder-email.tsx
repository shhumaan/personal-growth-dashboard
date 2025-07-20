import * as React from 'react';

interface DailyReminderEmailProps {
  userName: string;
  familyGoal: string;
  progress: {
    completedTasks: number;
    totalTasks: number;
    currentStreak: number;
    goalProgress: number;
  };
  daysRemaining: number;
  completionPercentage: number;
}

export function DailyReminderEmail({
  userName,
  familyGoal,
  progress,
  daysRemaining,
  completionPercentage
}: DailyReminderEmailProps) {
  const dayNumber = 90 - daysRemaining + 1;
  const isOnTrack = progress.goalProgress >= (dayNumber / 90) * 100;
  
  const getMotivationMessage = () => {
    if (completionPercentage === 0) {
      return {
        message: "Your family is waiting for you to show up. Every moment you delay is a moment stolen from their dreams.",
        tone: "urgent",
        color: "#dc2626"
      };
    } else if (completionPercentage < 50) {
      return {
        message: "You're falling short of what they deserve. Step up and prove you're fighting for their future.",
        tone: "firm",
        color: "#ea580c"
      };
    } else if (completionPercentage < 100) {
      return {
        message: "You're on the right path, but don't stop now. Finish strong for the ones who believe in you.",
        tone: "encouraging",
        color: "#0891b2"
      };
    } else {
      return {
        message: "THIS IS WHAT DEDICATION LOOKS LIKE! You're building the life your family deserves!",
        tone: "celebration",
        color: "#059669"
      };
    }
  };

  const motivation = getMotivationMessage();

  return (
    <html>
      <head>
        <style>{`
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #1e293b 0%, #475569 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            position: relative;
          }
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          }
          .day-counter {
            font-size: 48px;
            font-weight: 800;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }
          .countdown {
            font-size: 18px;
            opacity: 0.9;
            font-weight: 500;
          }
          .motivation-box {
            padding: 30px;
            margin: 30px;
            border-radius: 12px;
            border-left: 6px solid ${motivation.color};
            background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .motivation-text {
            font-size: 18px;
            font-weight: 600;
            color: ${motivation.color};
            text-align: center;
            line-height: 1.5;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            padding: 30px;
            background: #f8fafc;
          }
          .stat-card {
            text-align: center;
            padding: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            border: 1px solid #e2e8f0;
          }
          .stat-number {
            font-size: 32px;
            font-weight: 800;
            color: #1e293b;
            display: block;
          }
          .stat-label {
            font-size: 14px;
            color: #64748b;
            font-weight: 500;
            margin-top: 5px;
          }
          .progress-bar {
            width: 100%;
            height: 12px;
            background: #e2e8f0;
            border-radius: 6px;
            overflow: hidden;
            margin: 20px 0;
          }
          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, ${motivation.color}, ${motivation.color}dd);
            border-radius: 6px;
            transition: width 0.3s ease;
          }
          .task-section {
            padding: 30px;
            background: white;
          }
          .task-title {
            font-size: 22px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 20px;
            text-align: center;
          }
          .family-reminder {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 2px solid #f59e0b;
            border-radius: 12px;
            padding: 25px;
            margin: 30px;
            text-align: center;
          }
          .family-text {
            font-size: 16px;
            color: #92400e;
            font-weight: 600;
            margin-bottom: 10px;
          }
          .family-goal {
            font-size: 20px;
            color: #78350f;
            font-weight: 800;
            font-style: italic;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, ${motivation.color} 0%, ${motivation.color}dd 100%);
            color: white;
            padding: 16px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 700;
            font-size: 16px;
            text-align: center;
            margin: 20px auto;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease;
          }
          .cta-button:hover {
            transform: translateY(-2px);
          }
          .footer {
            text-align: center;
            padding: 30px;
            color: #64748b;
            font-size: 14px;
            background: #f8fafc;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <div className="day-counter">Day {dayNumber}</div>
            <div className="countdown">{daysRemaining} days remaining in your sprint</div>
          </div>

          <div className="motivation-box">
            <div className="motivation-text">
              {motivation.message}
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{progress.currentStreak}</span>
              <div className="stat-label">Day Streak</div>
            </div>
            <div className="stat-card">
              <span className="stat-number">{completionPercentage}%</span>
              <div className="stat-label">Today's Progress</div>
            </div>
            <div className="stat-card">
              <span className="stat-number">{Math.round(progress.goalProgress)}%</span>
              <div className="stat-label">Sprint Progress</div>
            </div>
          </div>

          <div className="task-section">
            <h2 className="task-title">Today's Mission</h2>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${completionPercentage}%`}}></div>
            </div>
            <p style={{textAlign: 'center', color: '#64748b', fontSize: '16px'}}>
              You've completed <strong>{progress.completedTasks} out of {progress.totalTasks}</strong> tasks today.
            </p>
            
            <div style={{textAlign: 'center', margin: '30px 0'}}>
              <a href="https://yourdomain.com/dashboard" className="cta-button">
                Continue Your Journey →
              </a>
            </div>
          </div>

          <div className="family-reminder">
            <div className="family-text">
              Remember what you're fighting for:
            </div>
            <div className="family-goal">
              "{familyGoal}"
            </div>
          </div>

          <div className="footer">
            <p>Every step forward is a step closer to the life they deserve.</p>
            <p><small>Personal Growth Dashboard • You've got this, {userName}! 💪</small></p>
          </div>
        </div>
      </body>
    </html>
  );
}