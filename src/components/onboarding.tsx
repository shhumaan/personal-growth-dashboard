'use client'

import React, { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Target, Heart, TrendingUp, ArrowRight } from 'lucide-react'

interface OnboardingProps {
  onComplete: () => void
}

const steps = [
  {
    title: "Welcome to Your Growth Journey",
    icon: Sparkles,
    content: "Track your daily habits, emotions, and personal development with beautiful visualizations and insights.",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Daily Check-ins",
    icon: Target,
    content: "Complete 4 daily sessions: Morning intentions, Midday progress, Evening reflection, and Bedtime gratitude.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Track Your Emotions",
    icon: Heart,
    content: "Monitor your mood, stress levels, and emotional patterns to build better self-awareness.",
    color: "from-pink-500 to-rose-500"
  },
  {
    title: "See Your Progress",
    icon: TrendingUp,
    content: "Beautiful charts, streak counters, and AI-powered insights help you stay motivated and on track.",
    color: "from-green-500 to-emerald-500"
  }
]

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const skipOnboarding = () => {
    onComplete()
  }

  const step = steps[currentStep]
  const Icon = step.icon

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full glass-card p-8 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              {step.title}
            </h2>
            
            <p className="text-white/70 mb-8 leading-relaxed">
              {step.content}
            </p>
            
            <div className="flex items-center justify-center mb-6 space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={skipOnboarding}
                variant="ghost"
                className="flex-1 text-white/70 hover:text-white"
              >
                Skip
              </Button>
              <Button
                onClick={nextStep}
                variant="glass"
                className="flex-1 group"
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  )
}
