'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Star, Target, Zap, CheckCircle2, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CelebrationNotificationProps {
  trigger: 'streak' | 'session' | 'milestone' | 'perfect_day' | 'week_complete' | 'task';
  value?: number;
  onClose: () => void;
  show: boolean;
}

export function CelebrationNotification({ 
  trigger, 
  value = 0, 
  onClose, 
  show 
}: CelebrationNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 500);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const getCelebrationContent = () => {
    switch (trigger) {
      case 'streak':
        return {
          icon: Flame,
          title: `${value} Day Streak!`,
          message: value === 1 ? 'Your journey begins!' : 
                   value === 7 ? 'One week strong!' :
                   value === 30 ? 'One month of growth!' :
                   value === 100 ? 'Century Club achieved!' :
                   'You\'re on fire!',
          color: 'from-orange-400 to-red-500',
          emoji: '🔥'
        };
      
      case 'session':
        return {
          icon: CheckCircle2,
          title: 'Session Complete!',
          message: 'Another step toward your goals!',
          color: 'from-green-400 to-blue-500',
          emoji: '✅'
        };
      
      case 'milestone':
        return {
          icon: Trophy,
          title: 'Milestone Reached!',
          message: `${value}% completion achieved!`,
          color: 'from-yellow-400 to-orange-500',
          emoji: '🏆'
        };
      
      case 'perfect_day':
        return {
          icon: Star,
          title: 'Perfect Day!',
          message: 'All sessions completed!',
          color: 'from-purple-400 to-pink-500',
          emoji: '⭐'
        };
      
      case 'week_complete':
        return {
          icon: Target,
          title: 'Week Complete!',
          message: 'Seven days of consistent growth!',
          color: 'from-blue-400 to-purple-500',
          emoji: '🎯'
        };
      
      case 'task':
        return {
          icon: CheckCircle2,
          title: 'Task Completed!',
          message: 'Great job staying on track!',
          color: 'from-green-400 to-teal-500',
          emoji: '✅'
        };
      
      default:
        return {
          icon: Zap,
          title: 'Great Job!',
          message: 'Keep up the momentum!',
          color: 'from-blue-400 to-purple-500',
          emoji: '⚡'
        };
    }
  };

  const content = getCelebrationContent();
  const Icon = content.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.5
          }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <Card className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/20 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                  className={`p-2 rounded-full bg-gradient-to-r ${content.color} text-white flex-shrink-0`}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-2 mb-1"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {content.title}
                    </h3>
                    <span className="text-lg">{content.emoji}</span>
                  </motion.div>
                  
                  <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm text-gray-600 dark:text-gray-300"
                  >
                    {content.message}
                  </motion.p>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 500);
                  }}
                  className="flex-shrink-0 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Animated confetti effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 2 }}
                className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg"
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      opacity: 0, 
                      scale: 0, 
                      x: Math.random() * 100 + '%',
                      y: Math.random() * 100 + '%'
                    }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      y: [0, -20, 0],
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                    className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                    style={{
                      left: `${Math.random() * 80 + 10}%`,
                      top: `${Math.random() * 80 + 10}%`,
                    }}
                  />
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}