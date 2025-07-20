import * as React from 'react';

interface AccountabilityEmailProps {
  userName: string;
  familyGoal: string;
  missedDays: number;
  daysRemaining: number;
  severity: 'gentle' | 'firm' | 'harsh' | 'brutal';
}

export function AccountabilityEmail({
  userName,
  familyGoal,
  missedDays,
  daysRemaining,
  severity
}: AccountabilityEmailProps) {
  
  const getMessage = () => {
    switch (severity) {
      case 'gentle':
        return {
          title: "Your family needs you to show up",
          message: "You've missed a few days, but it's not too late. They believe in you, and they're counting on you to get back on track.",
          action: "Get back on track today",
          color: "#0891b2",
          emoji: "💙"
        };
      case 'firm':
        return {
          title: "This is not the path to their dreams",
          message: `${missedDays} days without progress. Think about their faces when you promised them a better life. Are you keeping that promise?`,
          action: "Stop making excuses",
          color: "#ea580c",
          emoji: "⚠️"
        };
      case 'harsh':
        return {
          title: "You're failing the people who matter most",
          message: `${missedDays} days of choosing comfort over commitment. While you're procrastinating, their dreams are on hold. They deserve better.`,
          action: "Prove you haven't given up",
          color: "#dc2626",
          emoji: "💔"
        };
      case 'brutal':
        return {
          title: "A WEEK OF BROKEN PROMISES",
          message: `${missedDays} days. That's ${missedDays} days you chose yourself over them. That's ${missedDays} days closer to the life they DON'T deserve because you couldn't show up. They will remember this.`,
          action: "WAKE UP OR LOSE EVERYTHING",
          color: "#991b1b",
          emoji: "🚨"
        };
    }
  };

  const msg = getMessage();
  const timeWasted = missedDays * 24; // hours
  const percentageLost = (missedDays / 90) * 100;

  return (
    <html>
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <style>{`
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0;
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
            border: 3px solid ${msg.color};
          }
          .header { 
            background: linear-gradient(135deg, ${msg.color} 0%, ${msg.color}dd 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            position: relative;
          }
          .header::before {
            content: '${msg.emoji}';
            font-size: 60px;
            position: absolute;
            top: 20px;
            right: 30px;
            opacity: 0.3;
          }
          .alert-title {
            font-size: 28px;
            font-weight: 900;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }
          .days-missed {
            font-size: 48px;
            font-weight: 800;
            margin: 20px 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }
          .reality-check {
            padding: 40px 30px;
            background: ${severity === 'brutal' ? '#fef2f2' : '#fefefe'};
            border-left: 8px solid ${msg.color};
          }
          .reality-text {
            font-size: 20px;
            font-weight: 600;
            color: ${msg.color};
            line-height: 1.5;
            text-align: center;
            margin-bottom: 30px;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            padding: 30px;
            background: #fef2f2;
          }
          .stat-card {
            text-align: center;
            padding: 20px;
            background: white;
            border-radius: 12px;
            border: 2px solid ${msg.color}33;
          }
          .stat-number {
            font-size: 32px;
            font-weight: 800;
            color: ${msg.color};
            display: block;
          }
          .stat-label {
            font-size: 14px;
            color: #64748b;
            font-weight: 500;
            margin-top: 5px;
          }
          .family-section {
            background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
            border: 3px solid #f59e0b;
            border-radius: 12px;
            padding: 30px;
            margin: 30px;
            text-align: center;
          }
          .family-header {
            font-size: 18px;
            color: #92400e;
            font-weight: 700;
            margin-bottom: 15px;
          }
          .family-goal {
            font-size: 24px;
            color: #78350f;
            font-weight: 800;
            font-style: italic;
            margin-bottom: 20px;
            line-height: 1.3;
          }
          .family-question {
            font-size: 16px;
            color: #92400e;
            font-weight: 600;
          }
          .consequences {
            padding: 30px;
            background: #fef2f2;
            margin: 30px;
            border-radius: 12px;
            border: 2px solid ${msg.color};
          }
          .consequences-title {
            font-size: 20px;
            font-weight: 800;
            color: ${msg.color};
            margin-bottom: 20px;
            text-align: center;
          }
          .consequence-item {
            font-size: 16px;
            color: #374151;
            margin: 15px 0;
            padding-left: 25px;
            position: relative;
          }
          .consequence-item::before {
            content: '💔';
            position: absolute;
            left: 0;
            top: 0;
          }
          .action-section {
            background: ${msg.color};
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .action-title {
            font-size: 24px;
            font-weight: 900;
            margin-bottom: 20px;
            text-transform: uppercase;
          }
          .cta-button {
            display: inline-block;
            background: white;
            color: ${msg.color};
            padding: 20px 40px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 900;
            font-size: 18px;
            text-transform: uppercase;
            margin: 20px auto;
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
            transition: transform 0.2s ease;
          }
          .cta-button:hover {
            transform: translateY(-3px);
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
            <div className="alert-title">{msg.title}</div>
            <div className="days-missed">{missedDays} DAYS</div>
            <div>Since you last showed up for them</div>
          </div>

          <div className="reality-check">
            <div className="reality-text">
              {msg.message}
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{timeWasted}</span>
              <div className="stat-label">Hours Wasted</div>
            </div>
            <div className="stat-card">
              <span className="stat-number">{Math.round(percentageLost)}%</span>
              <div className="stat-label">Sprint Lost</div>
            </div>
            <div className="stat-card">
              <span className="stat-number">{daysRemaining}</span>
              <div className="stat-label">Days Left</div>
            </div>
          </div>

          <div className="family-section">
            <div className="family-header">
              YOU PROMISED THEM:
            </div>
            <div className="family-goal">
              &quot;{familyGoal}&quot;
            </div>
            <div className="family-question">
              Are you keeping that promise?
            </div>
          </div>

          <div className="consequences">
            <div className="consequences-title">
              THE COST OF YOUR INACTION:
            </div>
            <div className="consequence-item">
              Their dreams are on hold while you choose comfort
            </div>
            <div className="consequence-item">
              Every missed day is a broken promise to them
            </div>
            <div className="consequence-item">
              They deserve someone who shows up consistently
            </div>
            <div className="consequence-item">
              Your future self will regret this moment of weakness
            </div>
          </div>

          <div className="action-section">
            <div className="action-title">{msg.action}</div>
            <p style={{fontSize: '16px', margin: '20px 0'}}>
              {severity === 'brutal' 
                ? "This is your last chance to prove you haven't given up on them."
                : "They still believe in you. Don't let them down again."
              }
            </p>
            <a href="https://yourdomain.com/dashboard" className="cta-button">
              REDEEM YOURSELF NOW
            </a>
          </div>

          <div className="footer">
            <p>Your family is watching. Make them proud, {userName}.</p>
            <p><small>Personal Growth Dashboard • Time to step up 💪</small></p>
          </div>
        </div>
      </body>
    </html>
  );
}