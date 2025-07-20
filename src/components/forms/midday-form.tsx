'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { CustomSlider } from '../ui/slider';
import { middaySessionSchema, MiddaySessionData } from '@/lib/validations';
import { Sun, Briefcase, BookOpen, AlertTriangle, Loader2, XCircle, Info, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DailyEntry } from '@/types';

interface MiddayFormProps {
  data: Partial<DailyEntry>;
  onComplete: (data: Partial<DailyEntry>) => void;
  onCancel: () => void;
}

const MiddayForm: React.FC<MiddayFormProps> = ({ 
  data, 
  onComplete, 
  onCancel 
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting }
  } = useForm<MiddaySessionData>({
    resolver: zodResolver(middaySessionSchema),
    defaultValues: {
      emotional_state: data.emotional_state || (data.emotional_state === 0 ? 0 : 5),
      burnout_level: data.burnout_level || 'Low',
      job_applications: data.job_applications || 0,
      study_hours: data.study_hours || 0,
      notes_midday: data.notes_midday || '',
      session_2_midday: true
    }
  });

  const emotionalState = watch('emotional_state');
  const jobApplications = watch('job_applications');
  const studyHours = watch('study_hours');

  const onSubmit = (formData: MiddaySessionData) => {
    onComplete(formData);
  };

  // Recommendations based on inputs
  const getStudyRecommendation = (hours: number) => {
    if (hours === 0) return "Consider allocating at least 1 hour for study today";
    if (hours < 2) return "Good start! Aim for 2-3 hours of focused study for optimal results";
    if (hours < 4) return "Great progress! Taking breaks every 25-30 minutes can boost retention";
    return "Excellent! Make sure to take breaks and stay hydrated";
  };

  const getJobAppRecommendation = (apps: number) => {
    if (apps === 0) return "Consider submitting at least 1-2 quality applications today";
    if (apps < 3) return "Good progress! Focus on quality over quantity";
    return "Excellent job hunting progress! Remember to follow up on previous applications";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 30 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl shadow-blue-500/10 dark:shadow-blue-400/10 overflow-hidden">
        {/* Animated gradient header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500">
          <motion.div
            className="h-full w-full bg-gradient-to-r from-indigo-300 to-blue-300 opacity-60"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
        
        <CardHeader className="text-center pb-8 pt-8 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <motion.div
            className="relative mx-auto mb-6 p-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl w-20 h-20 flex items-center justify-center shadow-xl shadow-blue-500/30"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.2 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <div className="absolute inset-0 rounded-2xl bg-blue-300 animate-pulse opacity-30"></div>
            <Sun className="h-10 w-10 text-white relative z-10" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Midday Reality Check
            </CardTitle>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2 font-medium">
              Reset and refocus for the afternoon 🌟
            </p>
          </motion.div>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <form id="midday-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Emotional State */}
            <motion.div
              className="space-y-4 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4 text-blue-700 dark:text-blue-300">
                <motion.div
                  className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 mr-3"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                >
                  <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <h4 className="text-lg font-bold">Emotional State</h4>
              </div>
              
              <CustomSlider
                value={emotionalState}
                onValueChange={(value) => setValue('emotional_state', value)}
                label="Emotional State"
                min={1}
                max={10}
                formatLabel={(value) => {
                  if (value <= 3) return `${value} - Struggling`;
                  if (value <= 6) return `${value} - Okay`;
                  if (value <= 8) return `${value} - Good`;
                  return `${value} - Excellent`;
                }}
              />
              <div className="text-sm text-gray-600 dark:text-gray-400 pt-2 text-center font-medium">
                Reflect on your current emotional state at this midpoint of your day
              </div>
            </motion.div>
            
            {/* Burnout Level */}
            <motion.div
              className="space-y-4 bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-2xl border border-amber-200/50 dark:border-amber-800/50 backdrop-blur-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4 text-amber-700 dark:text-amber-300">
                <motion.div
                  className="p-2 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 mr-3"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                >
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </motion.div>
                <h4 className="text-lg font-bold">Burnout Level</h4>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {['Low', 'Medium', 'High'].map((level) => (
                  <motion.label
                    key={level}
                    className={`
                      flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${watch('burnout_level') === level 
                        ? level === 'Low' ? 'border-green-500 bg-green-100 text-green-700 dark:border-green-400 dark:bg-green-950 dark:text-green-300' :
                          level === 'Medium' ? 'border-amber-500 bg-amber-100 text-amber-700 dark:border-amber-400 dark:bg-amber-950 dark:text-amber-300' :
                          'border-red-500 bg-red-100 text-red-700 dark:border-red-400 dark:bg-red-950 dark:text-red-300'
                        : 'border-gray-300 bg-white hover:border-gray-400 text-black dark:border-gray-600 dark:bg-black dark:text-white dark:hover:border-gray-500'
                      }
                    `}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      value={level}
                      {...register('burnout_level')}
                      className="sr-only"
                    />
                    <span className={`text-sm font-medium`}>
                      {level}
                    </span>
                  </motion.label>
                ))}
              </div>
              
              <AnimatePresence>
                {watch('burnout_level') === 'High' && (
                  <motion.div 
                    className="text-xs text-red-700 dark:text-red-300 flex items-start mt-2 bg-red-50 dark:bg-red-950 p-2 rounded-lg border border-red-200 dark:border-red-800"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Info className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Consider taking short breaks or a brief walk to reduce burnout</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Job Applications */}
              <div className="space-y-2 bg-blue-50 dark:bg-blue-950 p-4 rounded-xl">
                <div className="flex items-center justify-center mb-1 text-blue-700 dark:text-blue-300">
                  <Briefcase className="h-4 w-4 mr-1" />
                  <h4 className="text-xs font-medium">Job Applications</h4>
                </div>
                
                <div className="flex items-center justify-center space-x-3">
                  <motion.button
                    type="button"
                    className={`h-8 w-8 rounded-full border border-blue-300 dark:border-blue-700 flex items-center justify-center text-blue-600 dark:text-blue-400 ${jobApplications <= 0 ? 'opacity-50' : 'hover:bg-blue-100 dark:hover:bg-blue-900'}`}
                    onClick={() => setValue('job_applications', Math.max(0, jobApplications - 1))}
                    disabled={jobApplications <= 0}
                    whileTap={{ scale: 0.9 }}
                  >
                    -
                  </motion.button>
                  <motion.span 
                    className="text-xl font-bold min-w-[2rem] text-center text-blue-700 dark:text-blue-300"
                    key={jobApplications}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                  >
                    {jobApplications}
                  </motion.span>
                  <motion.button
                    type="button"
                    className="h-8 w-8 rounded-full border border-blue-300 dark:border-blue-700 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900"
                    onClick={() => setValue('job_applications', jobApplications + 1)}
                    whileTap={{ scale: 0.9 }}
                  >
                    +
                  </motion.button>
                </div>
                <div className="text-xs text-gray-700 dark:text-gray-300 text-center mt-2">
                  {getJobAppRecommendation(jobApplications)}
                </div>
              </div>

              {/* Study Hours */}
              <div className="space-y-2 bg-purple-50 dark:bg-purple-950 p-4 rounded-xl">
                <div className="flex items-center justify-center mb-1 text-purple-700 dark:text-purple-300">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <h4 className="text-xs font-medium">Study Hours</h4>
                </div>
                
                <div className="flex items-center justify-center space-x-3">
                  <motion.button
                    type="button"
                    className={`h-8 w-8 rounded-full border border-purple-300 dark:border-purple-700 flex items-center justify-center text-purple-600 dark:text-purple-400 ${studyHours <= 0 ? 'opacity-50' : 'hover:bg-purple-100 dark:hover:bg-purple-900'}`}
                    onClick={() => setValue('study_hours', Math.max(0, studyHours - 0.5))}
                    disabled={studyHours <= 0}
                    whileTap={{ scale: 0.9 }}
                  >
                    -
                  </motion.button>
                  <motion.span 
                    className="text-xl font-bold min-w-[2.5rem] text-center text-purple-700 dark:text-purple-300"
                    key={studyHours}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                  >
                    {studyHours}h
                  </motion.span>
                  <motion.button
                    type="button"
                    className="h-8 w-8 rounded-full border border-purple-300 dark:border-purple-700 flex items-center justify-center text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900"
                    onClick={() => setValue('study_hours', studyHours + 0.5)}
                    whileTap={{ scale: 0.9 }}
                  >
                    +
                  </motion.button>
                </div>
                <div className="text-xs text-gray-700 dark:text-gray-300 text-center mt-2">
                  {getStudyRecommendation(studyHours)}
                </div>
              </div>
            </div>

            {/* Midday Notes */}
            <div className="space-y-3 bg-gray-50 dark:bg-gray-950 p-5 rounded-xl">
              <div className="flex items-center mb-2 text-gray-700 dark:text-gray-300">
                <Info className="h-5 w-5 mr-2" />
                <h4 className="text-sm font-medium">Midday Notes (Optional)</h4>
              </div>
              <Textarea
                {...register('notes_midday')}
                placeholder="How&apos;s your day going? Any challenges or wins?"
                rows={3}
                className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 text-black dark:text-white focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 rounded-lg resize-none"
              />
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="px-8 pb-8 pt-6 flex justify-between gap-4 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/10 border-t border-blue-200/50 dark:border-blue-800/50">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
            className="flex-1"
          >
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="w-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 rounded-xl py-3 text-lg font-semibold transition-all duration-300 backdrop-blur-sm"
            >
              <XCircle className="h-5 w-5 mr-2" />
              Cancel
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
            className="flex-1"
          >
            <Button 
              type="submit"
              form="midday-form"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl py-3 text-lg font-bold transform hover:scale-105 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Saving Progress...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Complete Check-in
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </motion.svg>
                </div>
              )}
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export { MiddayForm };
