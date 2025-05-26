'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Globe, Settings, BookOpen } from 'lucide-react';

interface DemoModeProps {
  onClose: () => void;
}

export function DemoMode({ onClose }: DemoModeProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Your Personal Growth Dashboard! 🌱',
      description: 'Track your daily habits, emotions, and personal development journey with beautiful visualizations.',
      icon: <Globe className="w-8 h-8 text-purple-400" />,
    },
    {
      title: 'Demo Mode Active 🎯',
      description: 'You\'re currently in demo mode with sample data. To connect your own Notion database, visit Settings.',
      icon: <Settings className="w-8 h-8 text-blue-400" />,
    },
    {
      title: 'Four Daily Check-ins 📅',
      description: 'Morning intentions, midday progress, evening reflection, and bedtime gratitude. Build consistency with guided sessions.',
      icon: <BookOpen className="w-8 h-8 text-green-400" />,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full glass-card p-6 animate-scale-in">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            {steps[currentStep].icon}
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            {steps[currentStep].title}
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            {steps[currentStep].description}
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-purple-400' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={handleSkip} 
            variant="ghost" 
            className="flex-1 text-white/70"
          >
            Skip
          </Button>
          <Button 
            onClick={handleNext} 
            variant="glass" 
            className="flex-1 flex items-center justify-center gap-2"
          >
            {currentStep < steps.length - 1 ? (
              <>
                Next <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Get Started <CheckCircle className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
