'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Heart, Star, Zap, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DailyAffirmationsProps {
  mood?: number;
  goals?: string[];
  currentStreak?: number;
  className?: string;
}

export function DailyAffirmations({ 
  mood = 5, 
  goals = [], 
  currentStreak = 0,
  className = '' 
}: DailyAffirmationsProps) {
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  // Categorized affirmations for different situations
  const affirmations = {
    general: [
      "I am capable of achieving my goals through consistent daily actions.",
      "Every small step I take today builds the foundation for my success.",
      "I choose to focus on progress, not perfection.",
      "My commitment to growth strengthens with each passing day.",
      "I have the power to create positive change in my life.",
      "Today is another opportunity to become the best version of myself.",
      "I embrace challenges as opportunities to learn and grow.",
      "My consistency today shapes my future success.",
    ],
    
    motivation: [
      "I am building unstoppable momentum with each session I complete.",
      "My dedication to self-improvement inspires others around me.",
      "I have the strength to overcome any obstacle in my path.",
      "Every day I choose growth over comfort, progress over perfection.",
      "I am worthy of the success that comes from consistent effort.",
      "My future self thanks me for the work I'm doing today.",
      "I turn my dreams into reality through daily disciplined action.",
      "I am becoming more resilient and determined with each challenge.",
    ],
    
    streak: [
      "My consistency streak reflects my commitment to personal excellence.",
      "Each day I maintain my streak, I prove my dedication to myself.",
      "I am building a habit that will serve me for a lifetime.",
      "My streak is evidence of my ability to keep promises to myself.",
      "I choose consistency over intensity, showing up every single day.",
      "My daily practice is creating the person I want to become.",
      "I am proud of my commitment and the progress I'm making.",
      "Every streak milestone is a celebration of my inner strength.",
    ],
    
    lowMood: [
      "It's okay to have difficult days - they make the good ones even better.",
      "I am learning to be gentle with myself while still moving forward.",
      "My worth isn't determined by my mood, but by my commitment to keep going.",
      "Even on tough days, I can find small moments of progress and gratitude.",
      "I give myself permission to feel while still taking positive action.",
      "My resilience grows stronger each time I push through challenges.",
      "I honor my feelings while choosing actions that support my wellbeing.",
      "Tomorrow is a new day, full of fresh possibilities and renewed energy.",
    ],
    
    highMood: [
      "I harness this positive energy to fuel my personal growth journey.",
      "My optimism and enthusiasm are powerful tools for achieving my goals.",
      "I use this good mood to uplift others and spread positivity.",
      "Today's positive energy is a gift I can share with the world.",
      "I am grateful for this feeling of joy and use it to inspire action.",
      "My positive mindset attracts opportunities and success into my life.",
      "I celebrate this moment while maintaining focus on my long-term vision.",
      "This good mood is a reminder of all the progress I've already made.",
    ]
  };

  // Get personalized affirmations based on user state
  const getPersonalizedAffirmations = () => {
    let selectedAffirmations = [];
    
    if (mood <= 3) {
      selectedAffirmations = [...affirmations.lowMood];
    } else if (mood >= 8) {
      selectedAffirmations = [...affirmations.highMood];
    } else {
      selectedAffirmations = [...affirmations.general];
    }
    
    if (currentStreak > 0) {
      selectedAffirmations.push(...affirmations.streak);
    }
    
    selectedAffirmations.push(...affirmations.motivation);
    
    return selectedAffirmations;
  };

  const personalizedAffirmations = getPersonalizedAffirmations();

  const changeAffirmation = () => {
    setIsChanging(true);
    setTimeout(() => {
      setCurrentAffirmation(prev => 
        (prev + 1) % personalizedAffirmations.length
      );
      setIsChanging(false);
    }, 200);
  };

  // Auto-rotate affirmations every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      changeAffirmation();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [personalizedAffirmations.length]);

  const getAffirmationIcon = () => {
    if (mood <= 3) return Heart;
    if (mood >= 8) return Star;
    if (currentStreak > 0) return Zap;
    return Target;
  };

  const AffirmationIcon = getAffirmationIcon();

  return (
    <Card className={`dashboard-card ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Daily Affirmation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative min-h-[120px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAffirmation}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ 
                duration: 0.3,
                ease: "easeInOut"
              }}
              className="text-center"
            >
              <div className="mb-4">
                <AffirmationIcon className="w-8 h-8 mx-auto text-purple-500 mb-2" />
              </div>
              
              <blockquote className="text-lg font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                "{personalizedAffirmations[currentAffirmation]}"
              </blockquote>
              
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="flex gap-1">
                  {personalizedAffirmations.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentAffirmation 
                          ? 'bg-purple-500 scale-125' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={changeAffirmation}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            disabled={isChanging}
          >
            <RefreshCw className={`w-4 h-4 ${isChanging ? 'animate-spin' : ''}`} />
            New Affirmation
          </Button>
        </div>

        {/* Personalization hint */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          {mood <= 3 && "💙 Gentle encouragement for today"}
          {mood >= 8 && "✨ Channeling your positive energy"}
          {currentStreak > 0 && "🔥 Celebrating your consistency"}
        </div>
      </CardContent>
    </Card>
  );
}