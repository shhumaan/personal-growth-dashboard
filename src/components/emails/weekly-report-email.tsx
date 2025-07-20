import * as React from 'react';

interface WeeklyReportEmailProps {
  userName: string;
  familyGoal: string;
  progress: {
    completedTasks: number;
    totalTasks: number;
    currentStreak: number;
    goalProgress: number;
    recentAchievements: string[];
  };
  weekNumber: number;
  isOnTrack: boolean;
}

export function WeeklyReportEmail({
  userName,
  familyGoal,
  progress,
  weekNumber,
  isOnTrack
}: WeeklyReportEmailProps) {
  const getWeeklyMessage = () => {
    if (isOnTrack && progress.goalProgress >= 75) {
      return {
        title: "CRUSHING IT! 🔥",
        message: "You're absolutely dominating this sprint! Your family must be so proud.",
        color: "#059669",
        tone: "celebration"
      };
    } else if (isOnTrack) {
      return {
        title: "Steady Progress 📈",
        message: "You're on track and building momentum. Keep this consistency going!",
        color: "#0891b2",
        tone: "encouraging"
      };
    } else {
      return {
        title: "Course Correction Needed ⚠️",
        message: "You're falling behind. Your family needs you to step up this week.",
        color: "#dc2626",
        tone: "urgent"
      };
    }
  };

  const weeklyMsg = getWeeklyMessage();

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
            background: linear-gradient(135deg, ${weeklyMsg.color} 0%, ${weeklyMsg.color}dd 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
          }
          .week-number {
            font-size: 48px;
            font-weight: 800;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }
          .week-title {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 10px;
          }
          .progress-overview {
            padding: 30px;
            background: white;
          }
          .progress-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin: 20px 0;
          }
          .progress-stat {
            text-align: center;
            padding: 20px;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 12px;
            border: 2px solid ${weeklyMsg.color}33;
          }
          .stat-number {
            font-size: 28px;
            font-weight: 800;
            color: ${weeklyMsg.color};
            display: block;
          }
          .stat-label {
            font-size: 12px;
            color: #64748b;
            font-weight: 500;
            margin-top: 5px;
          }
          .achievements-section {
            padding: 30px;
            background: #f8fafc;
          }
          .achievement-item {
            padding: 15px;
            background: white;
            border-radius: 8px;
            margin: 10px 0;
            border-left: 4px solid ${weeklyMsg.color};
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          .family-reminder {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 2px solid #f59e0b;
            border-radius: 12px;
            padding: 25px;
            margin: 30px;
            text-align: center;
          }
          .insights-section {
            padding: 30px;
            background: ${weeklyMsg.tone === 'urgent' ? '#fef2f2' : '#f0f9ff'};
            border-left: 6px solid ${weeklyMsg.color};
          }
          .insights-title {
            font-size: 20px;
            font-weight: 700;
            color: ${weeklyMsg.color};
            margin-bottom: 15px;
          }
          .insights-text {
            font-size: 16px;
            color: #374151;
            line-height: 1.6;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <div className="week-number">Week {weekNumber}</div>
            <div className="week-title">{weeklyMsg.title}</div>
            <div>{weeklyMsg.message}</div>
          </div>

          <div className="progress-overview">
            <h2 style={{textAlign: 'center', marginBottom: '20px', color: '#1e293b'}}>
              Weekly Performance Summary
            </h2>
            
            <div className="progress-grid">
              <div className="progress-stat">
                <span className="stat-number">{progress.currentStreak}</span>
                <div className="stat-label">Day Streak</div>
              </div>
              <div className="progress-stat">
                <span className="stat-number">{Math.round(progress.goalProgress)}%</span>
                <div className="stat-label">Sprint Progress</div>
              </div>
              <div className="progress-stat">
                <span className="stat-number">{progress.completedTasks}</span>
                <div className="stat-label">Tasks Completed</div>
              </div>
              <div className="progress-stat">
                <span className="stat-number">{isOnTrack ? '✅' : '⚠️'}</span>
                <div className="stat-label">{isOnTrack ? 'On Track' : 'Behind'}</div>
              </div>
            </div>
          </div>

          {progress.recentAchievements.length > 0 && (
            <div className="achievements-section">
              <h3 style={{color: '#1e293b', marginBottom: '20px'}}>🏆 This Week's Wins</h3>
              {progress.recentAchievements.map((achievement, index) => (
                <div key={index} className="achievement-item">
                  {achievement}
                </div>
              ))}
            </div>
          )}

          <div className="family-reminder">
            <h3 style={{color: '#92400e', marginBottom: '10px'}}>
              Remember Your Why:
            </h3>
            <div style={{fontSize: '18px', color: '#78350f', fontWeight: '700', fontStyle: 'italic'}}>
              "{familyGoal}"
            </div>
          </div>

          <div className="insights-section">
            <div className="insights-title">Week {weekNumber} Insights & Next Steps</div>
            <div className="insights-text">
              {isOnTrack ? (
                <>
                  <p><strong>What's Working:</strong> Your consistency is paying off. You're building the habits that will transform your family's future.</p>
                  <p><strong>Keep Going:</strong> Maintain this momentum. Small daily actions are compounding into significant progress.</p>
                  <p><strong>Next Week Focus:</strong> Continue your current strategy while looking for opportunities to push even harder.</p>
                </>
              ) : (
                <>
                  <p><strong>Reality Check:</strong> You're not where you need to be. Your family deserves better than excuses.</p>
                  <p><strong>What Must Change:</strong> Identify what's holding you back and eliminate it. No more compromise.</p>
                  <p><strong>This Week's Mission:</strong> Get back on track or risk failing the people who matter most.</p>
                </>
              )}
            </div>
          </div>

          <div style={{textAlign: 'center', padding: '30px'}}>
            <a 
              href="https://yourdomain.com/dashboard" 
              style={{
                display: 'inline-block',
                background: `linear-gradient(135deg, ${weeklyMsg.color} 0%, ${weeklyMsg.color}dd 100%)`,
                color: 'white',
                padding: '16px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '16px'
              }}
            >
              View Full Dashboard →
            </a>
          </div>

          <div style={{textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '14px'}}>
            <p>Week {weekNumber} of 13 complete. Keep pushing forward, {userName}! 💪</p>
          </div>
        </div>
      </body>
    </html>
  );
}