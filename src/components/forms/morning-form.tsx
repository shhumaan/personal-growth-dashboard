'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { CustomSlider } from '../ui/slider';
import { morningSessionSchema, MorningSessionData } from '@/lib/validations';
import { Sunrise, Coffee, Target, Heart, Loader2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { DailyEntry } from '@/types';

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

  const onSubmit = (formData: MorningSessionData) => {
    onComplete(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="w-full max-w-md mx-auto border border-orange-200 dark:border-orange-900">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full w-fit">
            <Sunrise className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Morning Power-Up
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Start your day with intention and gratitude
          </p>
        </CardHeader>
        
        <CardContent>
          <form id="morning-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Wake-up Time */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium">
                <Coffee className="h-4 w-4 mr-2 text-orange-600 dark:text-orange-400" />
                Wake-up Time
              </label>
              <Input
                type="time"
                {...register('wakeup_time')}
              />
              {errors.wakeup_time && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.wakeup_time.message}</p>
              )}
            </div>
            
            {/* Focus Rating */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium">
                <Target className="h-4 w-4 mr-2 text-orange-600 dark:text-orange-400" />
                Focus Level
              </label>
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
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium">
                <Heart className="h-4 w-4 mr-2 text-orange-600 dark:text-orange-400" />
                Energy Level
              </label>
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
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium">
                What are you grateful for today?
              </label>
              <Textarea
                {...register('gratitude_entry')}
                placeholder="I'm grateful for..."
                rows={3}
              />
              {errors.gratitude_entry && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.gratitude_entry.message}</p>
              )}
            </div>
            
            {/* Notes */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium">
                Morning Notes (Optional)
              </label>
              <Textarea
                {...register('notes_morning')}
                placeholder="Any thoughts or plans for the day..."
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
            form="morning-form"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
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

export { MorningForm };
