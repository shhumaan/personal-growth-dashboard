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
      health_rating: data.health_rating || (data.health_rating === 0 ? 0 : 5),
      anger_frequency: data.anger_frequency || 'None',
      mood_swings: data.mood_swings || 'None',
      gym: data.gym !== undefined ? data.gym : false,
      notes_evening: data.notes_evening || '',
      session_3_evening: true
    }
  });

  const healthRating = watch('health_rating');
  const gym = watch('gym');

  const onSubmit = async (formData: EveningSessionData) => {
    try {
      setFormError(null);
      onComplete(formData);
    } catch (error) {
      setFormError("There was an error submitting the form. Please try again.");
      console.error("Form submission error:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 30 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl shadow-purple-500/10 dark:shadow-purple-400/10 overflow-hidden">
        {/* Animated gradient header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600">
          <motion.div
            className="h-full w-full bg-gradient-to-r from-pink-400 to-purple-400 opacity-80"
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
        
        <CardHeader className="text-center pb-8 pt-8 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20">
          <motion.div
            className="relative mx-auto mb-6 p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl w-20 h-20 flex items-center justify-center shadow-xl shadow-purple-500/30"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.2 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <div className="absolute inset-0 rounded-2xl bg-purple-300 animate-pulse opacity-50"></div>
            <Sunset className="h-10 w-10 text-white relative z-10" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CardTitle className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              Evening Deep Dive
            </CardTitle>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2 font-medium">
              Review progress and plan improvements 🌅
            </p>
          </motion.div>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
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
            <motion.div
              className="space-y-4 bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-2xl border border-purple-200/50 dark:border-purple-800/50 backdrop-blur-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4 text-purple-700 dark:text-purple-300">
                <motion.div
                  className="p-2 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 mr-3"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                >
                  <Heart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </motion.div>
                <h4 className="text-lg font-bold">Overall Health Today</h4>
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
            </motion.div>

            {/* Anger Frequency */}
            <motion.div
              className="space-y-4 bg-gradient-to-br from-red-50/80 to-pink-50/80 dark:from-red-900/20 dark:to-pink-900/20 p-6 rounded-2xl border border-red-200/50 dark:border-red-800/50 backdrop-blur-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4 text-red-700 dark:text-red-300">
                <motion.div
                  className="p-2 rounded-xl bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/40 dark:to-pink-900/40 mr-3"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                >
                  <Frown className="h-5 w-5 text-red-600 dark:text-red-400" />
                </motion.div>
                <h4 className="text-lg font-bold">Anger/Frustration Today</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'None', label: 'None', color: 'green' },
                  { value: '1x', label: '1x', color: 'yellow' },
                  { value: '2x', label: '2x', color: 'orange' },
                  { value: 'Often', label: 'Often', color: 'red' }
                ].map((option) => (
                  <motion.label
                    key={option.value}
                    className={`
                      flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all backdrop-blur-sm font-semibold
                      ${watch('anger_frequency') === option.value 
                        ? option.color === 'green' ? 'border-green-500 bg-green-100/80 text-green-700 dark:border-green-400 dark:bg-green-950/50 dark:text-green-300 shadow-lg' :
                          option.color === 'yellow' ? 'border-yellow-500 bg-yellow-100/80 text-yellow-700 dark:border-yellow-400 dark:bg-yellow-950/50 dark:text-yellow-300 shadow-lg' :
                          option.color === 'orange' ? 'border-orange-500 bg-orange-100/80 text-orange-700 dark:border-orange-400 dark:bg-orange-950/50 dark:text-orange-300 shadow-lg' :
                          'border-red-500 bg-red-100/80 text-red-700 dark:border-red-400 dark:bg-red-950/50 dark:text-red-300 shadow-lg'
                        : 'border-gray-300/60 bg-white/60 hover:border-gray-400 text-gray-700 dark:border-gray-600/60 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:border-gray-500 hover:shadow-md'
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
            </motion.div>

            {/* Mood Swings */}
            <motion.div
              className="space-y-4 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-2xl border border-indigo-200/50 dark:border-indigo-800/50 backdrop-blur-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4 text-indigo-700 dark:text-indigo-300">
                <motion.div
                  className="p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 mr-3"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                >
                  <Heart className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </motion.div>
                <h4 className="text-lg font-bold">Mood Swings Today</h4>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'None', color: 'green' },
                  { value: 'Mild', color: 'orange' },
                  { value: 'Strong', color: 'red' }
                ].map((option) => (
                  <motion.label
                    key={option.value}
                    className={`
                      flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all backdrop-blur-sm font-semibold
                      ${watch('mood_swings') === option.value 
                        ? option.color === 'green' ? 'border-green-500 bg-green-100/80 text-green-700 dark:border-green-400 dark:bg-green-950/50 dark:text-green-300 shadow-lg' :
                          option.color === 'orange' ? 'border-orange-500 bg-orange-100/80 text-orange-700 dark:border-orange-400 dark:bg-orange-950/50 dark:text-orange-300 shadow-lg' :
                          'border-red-500 bg-red-100/80 text-red-700 dark:border-red-400 dark:bg-red-950/50 dark:text-red-300 shadow-lg'
                        : 'border-gray-300/60 bg-white/60 hover:border-gray-400 text-gray-700 dark:border-gray-600/60 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:border-gray-500 hover:shadow-md'
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
            </motion.div>

            {/* Gym */}
            <motion.div
              className="space-y-4 bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl border border-green-200/50 dark:border-green-800/50 backdrop-blur-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4 text-green-700 dark:text-green-300">
                <motion.div
                  className="p-2 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 mr-3"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                >
                  <Dumbbell className="h-5 w-5 text-green-600 dark:text-green-400" />
                </motion.div>
                <h4 className="text-lg font-bold">Did you work out today?</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: true, label: 'Yes 💪', color: 'green' },
                  { value: false, label: 'No', color: 'gray' }
                ].map((option) => (
                  <motion.label
                    key={String(option.value)}
                    className={`
                      flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all backdrop-blur-sm font-semibold
                      ${gym === option.value 
                        ? option.color === 'green' ? 'border-green-500 bg-green-100/80 text-green-700 dark:border-green-400 dark:bg-green-950/50 dark:text-green-300 shadow-lg' :
                          'border-gray-500 bg-gray-100/80 text-gray-700 dark:border-gray-500 dark:bg-gray-950/50 dark:text-gray-300 shadow-lg'
                        : 'border-gray-300/60 bg-white/60 hover:border-gray-400 text-gray-700 dark:border-gray-600/60 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:border-gray-500 hover:shadow-md'
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
            </motion.div>

            {/* Notes */}
            <motion.div
              className="space-y-4 bg-gradient-to-br from-gray-100/90 to-slate-100/90 dark:from-gray-900/40 dark:to-slate-900/40 p-6 rounded-2xl border border-gray-300/60 dark:border-gray-700/60 backdrop-blur-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4 text-gray-700 dark:text-gray-300">
                <motion.div
                  className="p-2 rounded-xl bg-gradient-to-br from-gray-200 to-slate-200 dark:from-gray-800/60 dark:to-slate-800/60 mr-3"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                >
                  <PenLine className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </motion.div>
                <h4 className="text-lg font-bold">Evening Notes <span className="text-sm font-normal opacity-70">(Optional)</span></h4>
              </div>
              <Textarea
                id="notes_evening"
                {...register('notes_evening')}
                placeholder="Any additional thoughts about your day... 💭"
                className="bg-white/70 dark:bg-black/50 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:border-purple-400 focus:ring-purple-400 dark:focus:border-purple-500 dark:focus:ring-purple-500 rounded-xl resize-none text-lg placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-300"
                rows={4}
              />
            </motion.div>
          </form>
        </CardContent>

        <CardFooter className="px-8 pb-8 pt-6 flex justify-between gap-4 bg-gradient-to-r from-purple-50/30 to-pink-50/30 dark:from-purple-900/10 dark:to-pink-900/10 border-t border-purple-200/50 dark:border-purple-800/50">
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
              disabled={isSubmitting}
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
              form="evening-form"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl py-3 text-lg font-bold transform hover:scale-105 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Saving Progress...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Complete Evening
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

export { EveningForm };
