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
      focus_rating: data.focus_rating || (data.focus_rating === 0 ? 0 : 5),
      energy_rating: data.energy_rating || (data.energy_rating === 0 ? 0 : 5),
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
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 30 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl shadow-orange-500/10 dark:shadow-orange-400/10 overflow-hidden">
        {/* Animated gradient header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500">
          <motion.div
            className="h-full w-full bg-gradient-to-r from-yellow-300 to-orange-300 opacity-60"
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
        
        <CardHeader className="text-center pb-8 pt-8 bg-gradient-to-br from-orange-50/50 to-yellow-50/50 dark:from-orange-900/20 dark:to-yellow-900/20">
          <motion.div
            className="relative mx-auto mb-6 p-4 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-2xl w-20 h-20 flex items-center justify-center shadow-xl shadow-orange-500/30"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.2 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <div className="absolute inset-0 rounded-2xl bg-orange-300 animate-pulse opacity-30"></div>
            <Sunrise className="h-10 w-10 text-white relative z-10" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 dark:from-orange-400 dark:to-yellow-400 bg-clip-text text-transparent">
              Morning Power-Up
            </CardTitle>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2 font-medium">
              Start your day with intention and gratitude ✨
            </p>
          </motion.div>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <form id="morning-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Wake-up Time */}
            <motion.div
              className="space-y-4 bg-gradient-to-br from-orange-50/80 to-yellow-50/80 dark:from-orange-900/20 dark:to-yellow-900/20 p-6 rounded-2xl border border-orange-200/50 dark:border-orange-800/50 backdrop-blur-sm relative z-[1000000]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4 text-orange-700 dark:text-orange-300">
                <motion.div
                  className="p-2 rounded-xl bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/40 dark:to-yellow-900/40 mr-3"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                >
                  <Coffee className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </motion.div>
                <h4 className="text-lg font-bold">Wake-up Time</h4>
              </div>
              
              <TimePicker
                value={wakeupTime}
                onChange={(time) => setValue('wakeup_time', time)}
              />
              
              {errors.wakeup_time && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 dark:text-red-400 text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg"
                >
                  {errors.wakeup_time.message}
                </motion.p>
              )}
            </motion.div>
            
            {/* Focus Rating */}
            <motion.div
              className="space-y-4 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4 text-blue-700 dark:text-blue-300">
                <motion.div
                  className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 mr-3"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                >
                  <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <h4 className="text-lg font-bold">Focus Level</h4>
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
            </motion.div>
            
            {/* Energy Rating */}
            <motion.div
              className="space-y-4 bg-gradient-to-br from-red-50/80 to-pink-50/80 dark:from-red-900/20 dark:to-pink-900/20 p-6 rounded-2xl border border-red-200/50 dark:border-red-800/50 backdrop-blur-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4 text-red-700 dark:text-red-300">
                <motion.div
                  className="p-2 rounded-xl bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/40 dark:to-pink-900/40 mr-3"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                >
                  <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
                </motion.div>
                <h4 className="text-lg font-bold">Energy Level</h4>
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
            </motion.div>
            
            {/* Gratitude Entry */}
            <motion.div
              className="space-y-4 bg-gradient-to-br from-yellow-50/80 to-amber-50/80 dark:from-yellow-900/20 dark:to-amber-900/20 p-6 rounded-2xl border border-yellow-200/50 dark:border-yellow-800/50 backdrop-blur-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4 text-yellow-700 dark:text-yellow-300">
                <motion.div
                  className="p-2 rounded-xl bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40 mr-3"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                >
                  <PenLine className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </motion.div>
                <h4 className="text-lg font-bold">Gratitude Entry</h4>
              </div>
              
              <Textarea
                {...register('gratitude_entry')}
                placeholder="I'm grateful for... ✨"
                rows={4}
                className="bg-white/70 dark:bg-black/50 backdrop-blur-sm border-2 border-yellow-200 dark:border-yellow-800 text-gray-900 dark:text-white focus:border-yellow-400 focus:ring-yellow-400 dark:focus:border-yellow-500 dark:focus:ring-yellow-500 rounded-xl resize-none text-lg placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-300"
              />
              
              {errors.gratitude_entry && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg"
                >
                  {errors.gratitude_entry.message}
                </motion.p>
              )}
            </motion.div>
            
            {/* Notes */}
            <motion.div
              className="space-y-4 bg-gradient-to-br from-gray-50/80 to-slate-50/80 dark:from-gray-900/20 dark:to-slate-900/20 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4 text-gray-700 dark:text-gray-300">
                <motion.div
                  className="p-2 rounded-xl bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-800/40 dark:to-slate-800/40 mr-3"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                >
                  <PenLine className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </motion.div>
                <h4 className="text-lg font-bold">Morning Notes <span className="text-sm font-normal opacity-70">(Optional)</span></h4>
              </div>
              
              <Textarea
                {...register('notes_morning')}
                placeholder="Any thoughts or plans for the day... 💭"
                rows={4}
                className="bg-white/70 dark:bg-black/50 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:border-orange-400 focus:ring-orange-400 dark:focus:border-orange-500 dark:focus:ring-orange-500 rounded-xl resize-none text-lg placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-300"
              />
            </motion.div>
          </form>
        </CardContent>
        
        <CardFooter className="px-8 pb-8 pt-6 flex justify-between gap-4 bg-gradient-to-r from-orange-50/30 to-yellow-50/30 dark:from-orange-900/10 dark:to-yellow-900/10 border-t border-orange-200/50 dark:border-orange-800/50">
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
              form="morning-form"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl py-3 text-lg font-bold transform hover:scale-105 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Saving Magic...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Complete Journey
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

export { MorningForm };
