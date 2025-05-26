'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { CustomSlider } from '../ui/slider';
import { middaySessionSchema, MiddaySessionData } from '../../lib/validations';
import { Sun, Briefcase, BookOpen, AlertTriangle, Loader2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { DailyEntry } from '../../types';

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
    formState: { errors, isSubmitting }
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="w-full max-w-md mx-auto border border-blue-200 dark:border-blue-900">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit">
            <Sun className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Midday Check-in
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            How are you feeling and progressing today?
          </p>
        </CardHeader>
        
        <CardContent>
          <form id="midday-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Emotional State */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium">
                Emotional State
              </label>
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
            </div>

            {/* Burnout Level */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-medium">
                <AlertTriangle className="h-4 w-4 mr-2 text-orange-600 dark:text-orange-400" />
                Burnout Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Low', 'Medium', 'High'].map((level) => (
                  <label
                    key={level}
                    className={`
                      flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${watch('burnout_level') === level 
                        ? level === 'Low' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                          level === 'Medium' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' :
                          'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      value={level}
                      {...register('burnout_level')}
                      className="sr-only"
                    />
                    <span className={`text-sm font-medium ${
                      watch('burnout_level') === level 
                        ? level === 'Low' ? 'text-green-700 dark:text-green-400' :
                          level === 'Medium' ? 'text-orange-700 dark:text-orange-400' :
                          'text-red-700 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {level}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Job Applications */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium">
                <Briefcase className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                Job Applications Today
              </label>
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setValue('job_applications', Math.max(0, jobApplications - 1))}
                  disabled={jobApplications <= 0}
                >
                  -
                </Button>
                <span className="text-2xl font-bold min-w-[3rem] text-center">
                  {jobApplications}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setValue('job_applications', jobApplications + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Study Hours */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium">
                <BookOpen className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                Study Hours Today
              </label>
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setValue('study_hours', Math.max(0, studyHours - 0.5))}
                  disabled={studyHours <= 0}
                >
                  -
                </Button>
                <span className="text-2xl font-bold min-w-[3rem] text-center">
                  {studyHours}h
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setValue('study_hours', studyHours + 0.5)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Midday Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Midday Notes (Optional)
              </label>
              <Textarea
                {...register('notes_midday')}
                placeholder="How's your day going? Any challenges or wins?"
                rows={3}
              />
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            type="submit"
            form="midday-form"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>Complete Session</>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export { MiddayForm };
