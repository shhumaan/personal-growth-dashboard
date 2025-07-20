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
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 30 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-400/10 overflow-hidden">
        {/* Animated gradient header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500">
          <motion.div
            className="h-full w-full bg-gradient-to-r from-purple-300 to-indigo-300 opacity-60"
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
        
        <CardHeader className="text-center pb-8 pt-8 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <motion.div
            className="relative mx-auto mb-6 p-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl w-20 h-20 flex items-center justify-center shadow-xl shadow-indigo-500/30"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.2 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <div className="absolute inset-0 rounded-2xl bg-indigo-300 animate-pulse opacity-30"></div>
            <Moon className="h-10 w-10 text-white relative z-10" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Bedtime Accountability
            </CardTitle>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2 font-medium">
              Reflect on the day and prepare for tomorrow 🌙
            </p>
          </motion.div>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <form id="bedtime-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Sleep Time */}
            <motion.div
              className="space-y-4 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-2xl border border-indigo-200/50 dark:border-indigo-800/50 backdrop-blur-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4 text-indigo-700 dark:text-indigo-300">
                <motion.div
                  className="p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 mr-3"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                >
                  <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </motion.div>
                <h4 className="text-lg font-bold">Planned Sleep Time</h4>
              </div>
              <Input
                type="time"
                {...register('sleep_time')}
                className="bg-white/70 dark:bg-black/50 backdrop-blur-sm border-2 border-indigo-200 dark:border-indigo-700 text-gray-900 dark:text-white focus:border-indigo-400 focus:ring-indigo-400 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 rounded-xl text-lg h-12 transition-all duration-300"
              />
              {errors.sleep_time && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 dark:text-red-400 text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg"
                >
                  {errors.sleep_time.message}
                </motion.p>
              )}
            </motion.div>

            {/* Money Stress Level */}
            <motion.div
              className="space-y-4 bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl border border-green-200/50 dark:border-green-800/50 backdrop-blur-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4 text-green-700 dark:text-green-300">
                <motion.div
                  className="p-2 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 mr-3"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                >
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </motion.div>
                <h4 className="text-lg font-bold">Financial Stress Today</h4>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'None', color: 'green' },
                  { value: 'Moderate', color: 'orange' },
                  { value: 'High', color: 'red' }
                ].map((option) => (
                  <motion.label
                    key={option.value}
                    className={`
                      flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all backdrop-blur-sm font-semibold
                      ${watch('money_stress_level') === option.value 
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
                      {...register('money_stress_level')}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">
                      {option.value}
                    </span>
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Bedtime Notes */}
            <motion.div
              className="space-y-4 bg-gradient-to-br from-gray-50/80 to-slate-50/80 dark:from-gray-900/20 dark:to-slate-900/20 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4 text-gray-700 dark:text-gray-300">
                <motion.div
                  className="p-2 rounded-xl bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-800/40 dark:to-slate-800/40 mr-3"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                >
                  <PenLine className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </motion.div>
                <h4 className="text-lg font-bold">Bedtime Reflection <span className="text-sm font-normal opacity-70">(Optional)</span></h4>
              </div>
              <Textarea
                {...register('notes_bedtime')}
                placeholder="What went well today? What could be better tomorrow? 💭"
                className="bg-white/70 dark:bg-black/50 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:border-indigo-400 focus:ring-indigo-400 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 rounded-xl resize-none text-lg placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-300"
                rows={4}
              />
            </motion.div>

            {/* Sleep Tips */}
            <motion.div
              className="bg-gradient-to-br from-purple-50/80 to-violet-50/80 dark:from-purple-900/20 dark:to-violet-900/20 p-6 rounded-2xl border border-purple-200/50 dark:border-purple-800/50 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4 text-purple-700 dark:text-purple-300">
                <motion.div
                  className="p-2 rounded-xl bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/40 dark:to-violet-900/40 mr-3"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400">
                    <path d="M12 2v8"></path>
                    <path d="m4.93 10.93 1.41 1.41"></path>
                    <path d="M2 18h2"></path>
                    <path d="M20 18h2"></path>
                    <path d="m19.07 10.93-1.41 1.41"></path>
                    <path d="M22 22H2"></path>
                    <path d="m8 22 4-10 4 10"></path>
                  </svg>
                </motion.div>
                <h4 className="text-lg font-bold">Sleep Well Tips ✨</h4>
              </div>
              <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-3 pl-2">
                <motion.li 
                  className="flex items-start bg-white/50 dark:bg-black/30 p-3 rounded-lg backdrop-blur-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <span className="mr-3 text-purple-500 font-bold">•</span>
                  <span className="font-medium">Put away screens 30 minutes before sleep</span>
                </motion.li>
                <motion.li 
                  className="flex items-start bg-white/50 dark:bg-black/30 p-3 rounded-lg backdrop-blur-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <span className="mr-3 text-purple-500 font-bold">•</span>
                  <span className="font-medium">Practice deep breathing or meditation</span>
                </motion.li>
                <motion.li 
                  className="flex items-start bg-white/50 dark:bg-black/30 p-3 rounded-lg backdrop-blur-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <span className="mr-3 text-purple-500 font-bold">•</span>
                  <span className="font-medium">Keep your room cool and dark</span>
                </motion.li>
                <motion.li 
                  className="flex items-start bg-white/50 dark:bg-black/30 p-3 rounded-lg backdrop-blur-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 }}
                >
                  <span className="mr-3 text-purple-500 font-bold">•</span>
                  <span className="font-medium">Review your wins from today</span>
                </motion.li>
              </ul>
            </motion.div>
          </form>
        </CardContent>

        <CardFooter className="px-8 pb-8 pt-6 flex justify-between gap-4 bg-gradient-to-r from-indigo-50/30 to-purple-50/30 dark:from-indigo-900/10 dark:to-purple-900/10 border-t border-indigo-200/50 dark:border-indigo-800/50">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
            className="flex-1"
          >
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
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
              form="bedtime-form"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl py-3 text-lg font-bold transform hover:scale-105 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Saving Dreams...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Complete Day
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

export { BedtimeForm };
