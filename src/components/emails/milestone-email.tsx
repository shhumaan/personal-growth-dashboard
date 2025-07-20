import * as React from 'react';

interface MilestoneEmailProps {
  userName: string;
  familyGoal: string;
  milestone: string;
  progress: number;
  daysRemaining: number;
}

export function MilestoneEmail({
  userName,
  familyGoal,
  milestone,
  progress,
  daysRemaining
}: MilestoneEmailProps) {
  
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
            background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            border: 3px solid #f59e0b;
          }
          .header { 
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
            color: white; 
            padding: 50px 30px; 
            text-align: center; 
            position: relative;
          }
          .celebration-emoji {
            font-size: 60px;
            margin-bottom: 20px;
          }
          .milestone-title {
            font-size: 32px;
            font-weight: 900;
            margin-bottom: 15px;
            text-transform: uppercase;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }
          .milestone-name {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 10px;
          }
          .progress-section {
            padding: 40px 30px;
            background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
            text-align: center;
          }
          .progress-circle {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: conic-gradient(#f59e0b ${progress * 3.6}deg, #e5e7eb 0deg);
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            font-weight: 800;
            color: #92400e;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            padding: 30px;
          }
          .stat-card {
            text-align: center;
            padding: 25px;
            background: white;
            border-radius: 12px;
            border: 2px solid #fbbf24;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          }
          .stat-number {
            font-size: 36px;
            font-weight: 800;
            color: #d97706;
            display: block;
          }
          .stat-label {
            font-size: 14px;
            color: #64748b;
            font-weight: 600;
            margin-top: 5px;
          }
          .family-celebration {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border: 3px solid #10b981;
            border-radius: 12px;
            padding: 30px;
            margin: 30px;
            text-align: center;
          }
          .family-header {
            font-size: 20px;
            color: #065f46;
            font-weight: 800;
            margin-bottom: 15px;
          }
          .family-goal {
            font-size: 22px;
            color: #047857;
            font-weight: 700;
            font-style: italic;
            margin-bottom: 20px;
            line-height: 1.3;
          }
          .celebration-message {
            padding: 30px;
            background: #f0f9ff;
            border-left: 6px solid #0ea5e9;
            margin: 30px;
          }
          .next-steps {
            padding: 30px;
            background: #fef2f2;
            border-left: 6px solid #ef4444;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <div className="celebration-emoji">🎉</div>
            <div className="milestone-title">Milestone Achieved!</div>
            <div className="milestone-name">{milestone}</div>
          </div>

          <div className="progress-section">
            <h2 style={{color: '#92400e', marginBottom: '30px', fontSize: '24px'}}>
              Sprint Progress Update
            </h2>
            <div className="progress-circle">
              {Math.round(progress)}%
            </div>
            <p style={{color: '#78350f', fontSize: '18px', fontWeight: '600'}}>
              You're making real progress toward your family's dreams!
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{Math.round(progress)}%</span>
              <div className="stat-label">Sprint Complete</div>
            </div>
            <div className="stat-card">
              <span className="stat-number">{daysRemaining}</span>
              <div className="stat-label">Days Remaining</div>
            </div>
          </div>

          <div className="family-celebration">
            <div className="family-header">
              🏆 YOU'RE BUILDING THE LIFE THEY DESERVE! 🏆
            </div>
            <div className="family-goal">
              "{familyGoal}"
            </div>
            <p style={{color: '#065f46', fontSize: '16px', fontWeight: '600'}}>
              This milestone brings you one giant step closer to making this a reality!
            </p>
          </div>

          <div className="celebration-message">
            <h3 style={{color: '#0369a1', fontSize: '20px', fontWeight: '700', marginBottom: '15px'}}>
              🌟 Take a Moment to Celebrate
            </h3>
            <p style={{color: '#374151', fontSize: '16px', lineHeight: '1.6'}}>
              <strong>{userName}</strong>, you've just achieved something significant! This isn't just a milestone - 
              it's proof that you're committed to creating a better future for your family. 
              They would be proud of your dedication and consistency.
            </p>
          </div>

          <div className="next-steps">
            <h3 style={{color: '#dc2626', fontSize: '20px', fontWeight: '700', marginBottom: '15px'}}>
              🔥 Don't Stop Now - Keep The Momentum
            </h3>
            <div style={{color: '#374151', fontSize: '16px', lineHeight: '1.6'}}>
              <p><strong>What This Means:</strong> You've proven you can do this. Your family's future is getting brighter with every step.</p>
              <p><strong>Next Focus:</strong> Use this momentum to push even harder. The next milestone is within reach.</p>
              <p><strong>Remember:</strong> Consistency beats perfection. Keep showing up every single day.</p>
            </div>
          </div>

          <div style={{textAlign: 'center', padding: '40px 30px'}}>
            <a 
              href="https://yourdomain.com/dashboard" 
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                padding: '20px 40px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '800',
                fontSize: '18px',
                textTransform: 'uppercase',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
              }}
            >
              Continue Your Journey →
            </a>
          </div>

          <div style={{textAlign: 'center', padding: '30px', color: '#64748b', fontSize: '14px', background: '#f8fafc'}}>
            <p>Milestone achieved! Keep building the future your family deserves, {userName}! 🚀</p>
            <p><small>Personal Growth Dashboard • You're unstoppable! 💪</small></p>
          </div>
        </div>
      </body>
    </html>
  );
}