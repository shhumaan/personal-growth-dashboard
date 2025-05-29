'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { CustomSlider } from '../ui/slider';
import { TimePicker } from '../ui/time-picker';
import { morningSessionSchema, MorningSessionData } from '@/lib/validations';
import { Sunrise, Coffee, Target, Heart, Loader2, XCircle, PenLine } from 'lucide-react';
import { motion } from 'framer-motion';
import type { DailyEntry } from '../../../types/supabase';

interface MorningFormProps {
  data: Partial<DailyEntry>;
  onComplete: (data: Partial<DailyEntry>) => void;
  onCancel: () => void;
}

const MorningForm: React.FC<MorningFormProps> = ({ 
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
  } = useForm<MorningSessionData>({
    resolver: zodResolver(morningSessionSchema),
    defaultValues: {
      wakeup_time: data.wakeup_time || '',
      focus_rating: data.focus_rating || 5,
      energy_rating: data.energy_rating || 5,
      gratitude_entry: data.gratitude_entry || '',
      notes_morning: data.notes_morning || '',
      session_1_morning: true
    }
  });

  const focusRating = watch('focus_rating');
  const energyRating = watch('energy_rating');
  const wakeupTime = watch('wakeup_time');

  const onSubmit = (formData: MorningSessionData) => {
    onComplete(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="backdrop-blur-xl bg-white dark:bg-black border border-orange-200 dark:border-orange-900 shadow-xl rounded-xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-400"></div>
        
        <CardHeader className="text-center pb-6">
          <div className="relative mx-auto mb-5 p-3 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
            <div className="absolute inset-0 rounded-full bg-orange-200 dark:bg-orange-900 animate-pulse opacity-50"></div>
            <Sunrise className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-black dark:text-white">
            Morning Power-Up
          </CardTitle>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            Start your day with intention and gratitude
          </p>
        </CardHeader>
        
        <CardContent className="px-6 pb-6">
          <form id="morning-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Wake-up Time */}
            <div className="space-y-4 bg-orange-50 dark:bg-orange-950 p-5 rounded-xl">
              <div className="flex items-center mb-2 text-orange-700 dark:text-orange-300">
                <Coffee className="h-5 w-5 mr-2" />
                <h4 className="text-sm font-medium">Wake-up Time</h4>
              </div>
              
              <TimePicker
                value={wakeupTime}
                onChange={(time) => setValue('wakeup_time', time)}
              />
              
              {errors.wakeup_time && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-600 dark:text-red-400 text-center"
                >
                  {errors.wakeup_time.message}
                </motion.p>
              )}
            </div>
            
            {/* Focus Rating */}
            <div className="space-y-3 bg-blue-50 dark:bg-blue-950 p-5 rounded-xl">
              <div className="flex items-center mb-2 text-blue-700 dark:text-blue-300">
                <Target className="h-5 w-5 mr-2" />
                <h4 className="text-sm font-medium">Focus Level</h4>
              </div>
              
              <CustomSlider
                value={focusRating}
                onValueChange={(value) => setValue('focus_rating', value)}
                label="Focus Level"
                min={1}
                max={10}
                formatLabel={(value) => {
                  const labels = ["Distracted", "Average", "Laser-Focused"];
                  if (value <= 3) return labels[0];
                  if (value <= 7) return labels[1];
                  return labels[2];
                }}
              />
            </div>
            
            {/* Energy Rating */}
            <div className="space-y-3 bg-red-50 dark:bg-red-950 p-5 rounded-xl">
              <div className="flex items-center mb-2 text-red-700 dark:text-red-300">
                <Heart className="h-5 w-5 mr-2" />
                <h4 className="text-sm font-medium">Energy Level</h4>
              </div>
              
              <CustomSlider
                value={energyRating}
                onValueChange={(value) => setValue('energy_rating', value)}
                label="Energy Level"
                min={1}
                max={10}
                formatLabel={(value) => {
                  const labels = ["Exhausted", "Moderate", "Energized"];
                  if (value <= 3) return labels[0];
                  if (value <= 7) return labels[1];
                  return labels[2];
                }}
              />
            </div>
            
            {/* Gratitude Entry */}
            <div className="space-y-3 bg-yellow-50 dark:bg-yellow-950 p-5 rounded-xl">
              <div className="flex items-center mb-2 text-yellow-700 dark:text-yellow-300">
                <PenLine className="h-5 w-5 mr-2" />
                <h4 className="text-sm font-medium">Gratitude Entry</h4>
              </div>
              
              <Textarea
                {...register('gratitude_entry')}
                placeholder="I&apos;m grateful for..."
                rows={3}
                className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 text-black dark:text-white focus:border-orange-500 focus:ring-orange-500 dark:focus:border-orange-400 dark:focus:ring-orange-400 rounded-lg resize-none"
              />
              
              {errors.gratitude_entry && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-600 dark:text-red-400"
                >
                  {errors.gratitude_entry.message}
                </motion.p>
              )}
            </div>
            
            {/* Notes */}
            <div className="space-y-3 bg-gray-50 dark:bg-gray-950 p-5 rounded-xl">
              <div className="flex items-center mb-2 text-gray-700 dark:text-gray-300">
                <PenLine className="h-5 w-5 mr-2" />
                <h4 className="text-sm font-medium">Morning Notes (Optional)</h4>
              </div>
              
              <Textarea
                {...register('notes_morning')}
                placeholder="Any thoughts or plans for the day..."
                rows={3}
                className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 text-black dark:text-white focus:border-orange-500 focus:ring-orange-500 dark:focus:border-orange-400 dark:focus:ring-orange-400 rounded-lg resize-none"
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
            form="morning-form"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
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

export { MorningForm };
