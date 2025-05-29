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
      emotional_state: data.emotional_state || 5,
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="backdrop-blur-xl bg-white dark:bg-black border border-blue-200 dark:border-blue-900 shadow-xl rounded-xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400"></div>
        
        <CardHeader className="text-center pb-6">
          <div className="relative mx-auto mb-5 p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
            <div className="absolute inset-0 rounded-full bg-blue-200 dark:bg-blue-900 animate-pulse opacity-50"></div>
            <Sun className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-black dark:text-white">
            Midday Check-in
          </CardTitle>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            How are you feeling and progressing today?
          </p>
        </CardHeader>
        
        <CardContent className="px-6 pb-6">
          <form id="midday-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Emotional State */}
            <div className="space-y-3 bg-blue-50 dark:bg-blue-950 p-5 rounded-xl">
              <div className="flex items-center mb-2 text-blue-700 dark:text-blue-300">
                <Zap className="h-5 w-5 mr-2" />
                <h4 className="text-sm font-medium">Emotional State</h4>
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
              <div className="text-xs text-gray-700 dark:text-gray-300 pt-1 text-center">
                Reflect on your current emotional state at this midpoint of your day
              </div>
            </div>
            
            {/* Burnout Level */}
            <div className="space-y-3 bg-amber-50 dark:bg-amber-950 p-5 rounded-xl">
              <div className="flex items-center mb-2 text-amber-700 dark:text-amber-300">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <h4 className="text-sm font-medium">Burnout Level</h4>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
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
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Job Applications */}
              <div className="space-y-2 bg-indigo-50 dark:bg-indigo-950 p-4 rounded-xl">
                <div className="flex items-center justify-center mb-1 text-indigo-700 dark:text-indigo-300">
                  <Briefcase className="h-4 w-4 mr-1" />
                  <h4 className="text-xs font-medium">Job Applications</h4>
                </div>
                
                <div className="flex items-center justify-center space-x-3">
                  <motion.button
                    type="button"
                    className={`h-8 w-8 rounded-full border border-indigo-300 dark:border-indigo-700 flex items-center justify-center text-black dark:text-white ${jobApplications <= 0 ? 'opacity-50' : 'hover:bg-indigo-100 dark:hover:bg-indigo-900'}`}
                    onClick={() => setValue('job_applications', Math.max(0, jobApplications - 1))}
                    disabled={jobApplications <= 0}
                    whileTap={{ scale: 0.9 }}
                  >
                    -
                  </motion.button>
                  <motion.span 
                    className="text-xl font-bold min-w-[2rem] text-center text-indigo-700 dark:text-indigo-300"
                    key={jobApplications}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                  >
                    {jobApplications}
                  </motion.span>
                  <motion.button
                    type="button"
                    className="h-8 w-8 rounded-full border border-indigo-300 dark:border-indigo-700 flex items-center justify-center text-black dark:text-white hover:bg-indigo-100 dark:hover:bg-indigo-900"
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
                    className={`h-8 w-8 rounded-full border border-purple-300 dark:border-purple-700 flex items-center justify-center text-black dark:text-white ${studyHours <= 0 ? 'opacity-50' : 'hover:bg-purple-100 dark:hover:bg-purple-900'}`}
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
                    className="h-8 w-8 rounded-full border border-purple-300 dark:border-purple-700 flex items-center justify-center text-black dark:text-white hover:bg-purple-100 dark:hover:bg-purple-900"
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
        
        <CardFooter className="px-6 pb-6 pt-0 flex justify-between border-t border-gray-200 dark:border-gray-800">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-gray-300 text-black hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          
          <Button 
            type="submit"
            form="midday-form"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center">
                Complete
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export { MiddayForm };
