'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { CustomSlider } from '../ui/slider';
import { eveningSessionSchema, EveningSessionData } from '../../lib/validations';
import { Sunset, Heart, Frown, Dumbbell, Loader2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { DailyEntry } from '../../types';

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
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
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

  const onSubmit = (formData: EveningSessionData) => {
    onComplete(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
            <Sunset className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Evening Check-in
          </CardTitle>
          <p className="text-sm text-gray-600">
            Reflect on your health and emotions today
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Health Rating */}
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

            {/* Anger Frequency */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Frown className="h-4 w-4 mr-2 text-red-600" />
                Anger/Frustration Today
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'None', label: 'None', color: 'green' },
                  { value: '1x', label: '1x', color: 'yellow' },
                  { value: '2x', label: '2x', color: 'orange' },
                  { value: 'Often', label: 'Often', color: 'red' }
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`
                      flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${watch('anger_frequency') === option.value 
                        ? option.color === 'green' ? 'border-green-500 bg-green-50' :
                          option.color === 'yellow' ? 'border-yellow-500 bg-yellow-50' :
                          option.color === 'orange' ? 'border-orange-500 bg-orange-50' :
                          'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      {...register('anger_frequency')}
                      className="sr-only"
                    />
                    <span className={`text-sm font-medium ${
                      watch('anger_frequency') === option.value 
                        ? option.color === 'green' ? 'text-green-700' :
                          option.color === 'yellow' ? 'text-yellow-700' :
                          option.color === 'orange' ? 'text-orange-700' :
                          'text-red-700'
                        : 'text-gray-600'
                    }`}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Mood Swings */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Heart className="h-4 w-4 mr-2 text-pink-600" />
                Mood Swings Today
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'None', color: 'green' },
                  { value: 'Mild', color: 'orange' },
                  { value: 'Strong', color: 'red' }
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`
                      flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${watch('mood_swings') === option.value 
                        ? option.color === 'green' ? 'border-green-500 bg-green-50' :
                          option.color === 'orange' ? 'border-orange-500 bg-orange-50' :
                          'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      {...register('mood_swings')}
                      className="sr-only"
                    />
                    <span className={`text-sm font-medium ${
                      watch('mood_swings') === option.value 
                        ? option.color === 'green' ? 'text-green-700' :
                          option.color === 'orange' ? 'text-orange-700' :
                          'text-red-700'
                        : 'text-gray-600'
                    }`}>
                      {option.value}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Gym */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Dumbbell className="h-4 w-4 mr-2 text-blue-600" />
                Did you work out today?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: true, label: 'Yes', color: 'green' },
                  { value: false, label: 'No', color: 'gray' }
                ].map((option) => (
                  <label
                    key={String(option.value)}
                    className={`
                      flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${gym === option.value 
                        ? option.color === 'green' ? 'border-green-500 bg-green-50' :
                          'border-gray-500 bg-gray-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      value={String(option.value)}
                      {...register('gym', { 
                        setValueAs: (value) => value === 'true' 
                      })}
                      className="sr-only"
                    />
                    <span className={`text-sm font-medium ${
                      gym === option.value 
                        ? option.color === 'green' ? 'text-green-700' :
                          'text-gray-700'
                        : 'text-gray-600'
                    }`}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Evening Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Evening Reflection (Optional)
              </label>
              <Textarea
                {...register('notes_evening')}
                placeholder="How was your day? Any insights or reflections?"
                className="bg-white/80 min-h-[60px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Complete Session'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export { EveningForm };
