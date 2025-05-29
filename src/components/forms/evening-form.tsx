'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { CustomSlider } from '../ui/slider';
import { eveningSessionSchema, EveningSessionData } from '@/lib/validations';
import { Sunset, Heart, Frown, Dumbbell, Loader2, XCircle, AlertTriangle, PenLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DailyEntry } from '@/types';

// Custom Alert component as a fallback since there might be no ui/alert component
const Alert = ({ className = "", children, variant = "destructive", ...props }: {
  className?: string;
  children: React.ReactNode;
  variant?: "destructive" | "default";
  [key: string]: unknown;
}) => (
  <div 
    className={`${
      variant === "destructive" 
        ? "border border-red-500 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-950 dark:text-red-200" 
        : "border border-gray-300 bg-white text-black"
    } relative w-full rounded-lg p-4 mb-4 ${className}`}
    role="alert"
    {...props}
  >
    <div className="flex items-center">
      <AlertTriangle className="h-4 w-4 mr-2 text-red-600 dark:text-red-300" />
      {children}
    </div>
  </div>
);

const AlertDescription = ({ className = "", children, ...props }: {
  className?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}) => (
  <div className={`text-sm font-medium ${className}`} {...props}>
    {children}
  </div>
);

interface EveningFormProps {
  data: Partial<DailyEntry>;
  onComplete: (data: Partial<DailyEntry>) => void;
  onCancel: () => void;
}

const EveningForm: React.FC<EveningFormProps> = ({ 
  data, 
  onComplete, 
  onCancel 
}) => {
  const [formError, setFormError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting }
  } = useForm<EveningSessionData>({
    resolver: zodResolver(eveningSessionSchema),
    defaultValues: {
      health_rating: data.health_rating || 5,
      anger_frequency: data.anger_frequency || 'None',
      mood_swings: data.mood_swings || 'None',
      gym: data.gym || false,
      notes_evening: data.notes_evening || '',
      session_3_evening: true
    }
  });

  const healthRating = watch('health_rating');
  const gym = watch('gym');

  const onSubmit = async (formData: EveningSessionData) => {
    try {
      setFormError(null);
      await onComplete(formData);
    } catch (error) {
      setFormError("There was an error submitting the form. Please try again.");
      console.error("Form submission error:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="backdrop-blur-xl bg-white dark:bg-black border border-purple-200 dark:border-purple-900 shadow-xl rounded-xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-400"></div>
        
        <CardHeader className="text-center pb-6">
          <div className="relative mx-auto mb-5 p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
            <div className="absolute inset-0 rounded-full bg-purple-200 dark:bg-purple-900 animate-pulse opacity-50"></div>
            <Sunset className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-black dark:text-white">
            Bedtime Check-in
          </CardTitle>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            Wind down and reflect on your day
          </p>
        </CardHeader>
        
        <CardContent className="px-6 pb-6">
          <form id="evening-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence>
              {formError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Alert variant="destructive">
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Health Rating */}
            <div className="space-y-3 bg-purple-50 dark:bg-purple-950 p-5 rounded-xl">
              <div className="flex items-center mb-2 text-purple-700 dark:text-purple-300">
                <Heart className="h-5 w-5 mr-2" />
                <h4 className="text-sm font-medium">Overall Health Today</h4>
              </div>
              <CustomSlider
                label="Overall Health Today"
                value={healthRating}
                onValueChange={(value) => setValue('health_rating', value)}
                formatLabel={(value) => {
                  if (value <= 3) return `${value} - Poor`;
                  if (value <= 6) return `${value} - Fair`;
                  if (value <= 8) return `${value} - Good`;
                  return `${value} - Excellent`;
                }}
              />
            </div>

            {/* Anger Frequency */}
            <div className="space-y-3 bg-red-50 dark:bg-red-950 p-5 rounded-xl">
              <div className="flex items-center mb-2 text-red-700 dark:text-red-300">
                <Frown className="h-5 w-5 mr-2" />
                <h4 className="text-sm font-medium">Anger/Frustration Today</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'None', label: 'None', color: 'green' },
                  { value: '1x', label: '1x', color: 'yellow' },
                  { value: '2x', label: '2x', color: 'orange' },
                  { value: 'Often', label: 'Often', color: 'red' }
                ].map((option) => (
                  <motion.label
                    key={option.value}
                    className={`
                      flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${watch('anger_frequency') === option.value 
                        ? option.color === 'green' ? 'border-green-500 bg-green-100 text-green-700 dark:border-green-400 dark:bg-green-950 dark:text-green-300' :
                          option.color === 'yellow' ? 'border-yellow-500 bg-yellow-100 text-yellow-700 dark:border-yellow-400 dark:bg-yellow-950 dark:text-yellow-300' :
                          option.color === 'orange' ? 'border-orange-500 bg-orange-100 text-orange-700 dark:border-orange-400 dark:bg-orange-950 dark:text-orange-300' :
                          'border-red-500 bg-red-100 text-red-700 dark:border-red-400 dark:bg-red-950 dark:text-red-300'
                        : 'border-gray-300 bg-white hover:border-gray-400 text-black dark:border-gray-600 dark:bg-black dark:text-white dark:hover:border-gray-500'
                      }
                    `}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      {...register('anger_frequency')}
                      className="sr-only"
                      aria-label={`Anger frequency: ${option.label}`}
                    />
                    <span className="text-sm font-medium">
                      {option.label}
                    </span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Mood Swings */}
            <div className="space-y-3 bg-pink-50 dark:bg-pink-950 p-5 rounded-xl">
              <div className="flex items-center mb-2 text-pink-700 dark:text-pink-300">
                <Heart className="h-5 w-5 mr-2" />
                <h4 className="text-sm font-medium">Mood Swings Today</h4>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'None', color: 'green' },
                  { value: 'Mild', color: 'orange' },
                  { value: 'Strong', color: 'red' }
                ].map((option) => (
                  <motion.label
                    key={option.value}
                    className={`
                      flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${watch('mood_swings') === option.value 
                        ? option.color === 'green' ? 'border-green-500 bg-green-100 text-green-700 dark:border-green-400 dark:bg-green-950 dark:text-green-300' :
                          option.color === 'orange' ? 'border-orange-500 bg-orange-100 text-orange-700 dark:border-orange-400 dark:bg-orange-950 dark:text-orange-300' :
                          'border-red-500 bg-red-100 text-red-700 dark:border-red-400 dark:bg-red-950 dark:text-red-300'
                        : 'border-gray-300 bg-white hover:border-gray-400 text-black dark:border-gray-600 dark:bg-black dark:text-white dark:hover:border-gray-500'
                      }
                    `}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      {...register('mood_swings')}
                      className="sr-only"
                      aria-label={`Mood swings: ${option.value}`}
                    />
                    <span className="text-sm font-medium">
                      {option.value}
                    </span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Gym */}
            <div className="space-y-3 bg-blue-50 dark:bg-blue-950 p-5 rounded-xl">
              <div className="flex items-center mb-2 text-blue-700 dark:text-blue-300">
                <Dumbbell className="h-5 w-5 mr-2" />
                <h4 className="text-sm font-medium">Did you work out today?</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: true, label: 'Yes', color: 'green' },
                  { value: false, label: 'No', color: 'gray' }
                ].map((option) => (
                  <motion.label
                    key={String(option.value)}
                    className={`
                      flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${gym === option.value 
                        ? option.color === 'green' ? 'border-green-500 bg-green-100 text-green-700 dark:border-green-400 dark:bg-green-950 dark:text-green-300' :
                          'border-gray-500 bg-gray-100 text-black dark:border-gray-500 dark:bg-gray-950 dark:text-white'
                        : 'border-gray-300 bg-white hover:border-gray-400 text-black dark:border-gray-600 dark:bg-black dark:text-white dark:hover:border-gray-500'
                      }
                    `}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      value={String(option.value)}
                      checked={gym === option.value}
                      onChange={() => setValue('gym', option.value)}
                      className="sr-only"
                      aria-label={`Worked out today: ${option.label}`}
                    />
                    <span className="text-sm font-medium">
                      {option.label}
                    </span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3 bg-gray-50 dark:bg-gray-950 p-5 rounded-xl">
              <div className="flex items-center mb-2 text-gray-700 dark:text-gray-300">
                <PenLine className="h-5 w-5 mr-2" />
                <h4 className="text-sm font-medium">Evening Notes (Optional)</h4>
              </div>
              <Textarea
                id="notes_evening"
                {...register('notes_evening')}
                placeholder="Any additional thoughts about your day..."
                className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 text-black dark:text-white focus:border-purple-500 focus:ring-purple-500 dark:focus:border-purple-400 dark:focus:ring-purple-400 rounded-lg resize-none"
                rows={4}
              />
            </div>
          </form>
        </CardContent>

        <CardFooter className="px-6 pb-6 pt-0 flex justify-between border-t border-gray-200 dark:border-gray-800">
          <Button
            type="button"
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
            className="border-gray-300 text-black hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          
          <Button 
            form="evening-form"
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
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

export { EveningForm };
