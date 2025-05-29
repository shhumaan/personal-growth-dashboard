'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { bedtimeSessionSchema, BedtimeSessionData } from '@/lib/validations';
import { Moon, DollarSign, Clock, XCircle, Loader2, PenLine } from 'lucide-react';
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
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="backdrop-blur-xl bg-white dark:bg-black border border-indigo-200 dark:border-indigo-900 shadow-xl rounded-xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400"></div>
        
        <CardHeader className="text-center pb-6">
          <div className="relative mx-auto mb-5 p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
            <div className="absolute inset-0 rounded-full bg-indigo-200 dark:bg-indigo-900 animate-pulse opacity-50"></div>
            <Moon className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-black dark:text-white">
            Bedtime Check-in
          </CardTitle>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            End your day with reflection and peace
          </p>
        </CardHeader>
        
        <CardContent className="px-6 pb-6">
          <form id="bedtime-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Sleep Time */}
            <div className="space-y-3 bg-indigo-50 dark:bg-indigo-950 p-5 rounded-xl">
              <div className="flex items-center mb-2 text-indigo-700 dark:text-indigo-300">
                <Clock className="h-5 w-5 mr-2" />
                <h4 className="text-sm font-medium">Planned Sleep Time</h4>
              </div>
              <Input
                type="time"
                {...register('sleep_time')}
                className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 text-black dark:text-white focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 h-10"
              />
              {errors.sleep_time && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-600 dark:text-red-400"
                >
                  {errors.sleep_time.message}
                </motion.p>
              )}
            </div>

            {/* Money Stress Level */}
            <div className="space-y-3 bg-green-50 dark:bg-green-950 p-5 rounded-xl">
              <div className="flex items-center mb-2 text-green-700 dark:text-green-300">
                <DollarSign className="h-5 w-5 mr-2" />
                <h4 className="text-sm font-medium">Financial Stress Today</h4>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'None', color: 'green' },
                  { value: 'Moderate', color: 'orange' },
                  { value: 'High', color: 'red' }
                ].map((option) => (
                  <motion.label
                    key={option.value}
                    className={`
                      flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${watch('money_stress_level') === option.value 
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
                      {...register('money_stress_level')}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">
                      {option.value}
                    </span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Bedtime Notes */}
            <div className="space-y-3 bg-gray-50 dark:bg-gray-950 p-5 rounded-xl">
              <div className="flex items-center mb-2 text-gray-700 dark:text-gray-300">
                <PenLine className="h-5 w-5 mr-2" />
                <h4 className="text-sm font-medium">Bedtime Reflection (Optional)</h4>
              </div>
              <Textarea
                {...register('notes_bedtime')}
                placeholder="What went well today? What could be better tomorrow?"
                className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 text-black dark:text-white focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 rounded-lg resize-none"
                rows={4}
              />
            </div>

            {/* Sleep Tips */}
            <div className="bg-purple-50 dark:bg-purple-950 p-5 rounded-xl border border-purple-100 dark:border-purple-800">
              <div className="flex items-center mb-3 text-purple-700 dark:text-purple-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M12 2v8"></path>
                  <path d="m4.93 10.93 1.41 1.41"></path>
                  <path d="M2 18h2"></path>
                  <path d="M20 18h2"></path>
                  <path d="m19.07 10.93-1.41 1.41"></path>
                  <path d="M22 22H2"></path>
                  <path d="m8 22 4-10 4 10"></path>
                </svg>
                <h4 className="text-sm font-medium">Sleep Well Tips</h4>
              </div>
              <ul className="text-xs text-purple-700 dark:text-purple-300 space-y-2 pl-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Put away screens 30 minutes before sleep</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Practice deep breathing or meditation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Keep your room cool and dark</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Review your wins from today</span>
                </li>
              </ul>
            </div>
          </form>
        </CardContent>

        <CardFooter className="px-6 pb-6 pt-0 flex justify-between border-t border-gray-200 dark:border-gray-800">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="border-gray-300 text-black hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          
          <Button 
            type="submit"
            form="bedtime-form"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center">
                Complete Day
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

export { BedtimeForm };
