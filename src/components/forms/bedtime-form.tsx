'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { bedtimeSessionSchema, BedtimeSessionData } from '../../lib/validations';
import { Moon, DollarSign, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface BedtimeFormProps {
  onSubmit: (data: BedtimeSessionData) => void;
  onClose: () => void;
  initialData?: Partial<BedtimeSessionData>;
}

const BedtimeForm: React.FC<BedtimeFormProps> = ({ 
  onSubmit, 
  onClose, 
  initialData 
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<BedtimeSessionData>({
    resolver: zodResolver(bedtimeSessionSchema),
    defaultValues: {
      sleep_time: initialData?.sleep_time || '',
      money_stress_level: initialData?.money_stress_level || 'None',
      notes_bedtime: initialData?.notes_bedtime || '',
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-indigo-100 rounded-full w-fit">
            <Moon className="h-8 w-8 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Bedtime Check-in
          </CardTitle>
          <p className="text-sm text-gray-600">
            End your day with reflection and peace
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Sleep Time */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Clock className="h-4 w-4 mr-2 text-indigo-600" />
                Planned Sleep Time
              </label>
              <Input
                type="time"
                {...register('sleep_time')}
                className="bg-white/80"
              />
              {errors.sleep_time && (
                <p className="text-xs text-red-600">{errors.sleep_time.message}</p>
              )}
            </div>

            {/* Money Stress Level */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                Financial Stress Today
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'None', color: 'green' },
                  { value: 'Moderate', color: 'orange' },
                  { value: 'High', color: 'red' }
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`
                      flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${watch('money_stress_level') === option.value 
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
                      {...register('money_stress_level')}
                      className="sr-only"
                    />
                    <span className={`text-sm font-medium ${
                      watch('money_stress_level') === option.value 
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

            {/* Bedtime Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Bedtime Reflection (Optional)
              </label>
              <Textarea
                {...register('notes_bedtime')}
                placeholder="What went well today? What could be better tomorrow?"
                className="bg-white/80 min-h-[80px]"
              />
            </div>

            {/* Sleep Tips */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-indigo-800 mb-2">
                💡 Sleep Well Tips
              </h4>
              <ul className="text-xs text-indigo-700 space-y-1">
                <li>• Put away screens 30 minutes before sleep</li>
                <li>• Practice deep breathing or meditation</li>
                <li>• Keep your room cool and dark</li>
                <li>• Review your wins from today</li>
              </ul>
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
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Complete Day'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export { BedtimeForm };
