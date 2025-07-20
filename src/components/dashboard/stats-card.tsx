'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { StatsCardProps } from '../../../types';
import { motion } from 'framer-motion';

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200/30 dark:border-blue-800/30',
    green: 'bg-gradient-to-br from-emerald-50/80 to-green-50/80 dark:from-emerald-900/30 dark:to-green-900/30 border-emerald-200/30 dark:border-emerald-800/30',
    orange: 'bg-gradient-to-br from-orange-50/80 to-amber-50/80 dark:from-orange-900/30 dark:to-amber-900/30 border-orange-200/30 dark:border-orange-800/30',
    red: 'bg-gradient-to-br from-red-50/80 to-pink-50/80 dark:from-red-900/30 dark:to-pink-900/30 border-red-200/30 dark:border-red-800/30',
    purple: 'bg-gradient-to-br from-purple-50/80 to-violet-50/80 dark:from-purple-900/30 dark:to-violet-900/30 border-purple-200/30 dark:border-purple-800/30',
  };
  
  const iconClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-emerald-600 dark:text-emerald-400',
    orange: 'text-orange-600 dark:text-orange-400',
    red: 'text-red-600 dark:text-red-400',
    purple: 'text-purple-600 dark:text-purple-400',
  };

  const shadowClasses = {
    blue: 'shadow-blue-500/10 dark:shadow-blue-400/10',
    green: 'shadow-emerald-500/10 dark:shadow-emerald-400/10',
    orange: 'shadow-orange-500/10 dark:shadow-orange-400/10',
    red: 'shadow-red-500/10 dark:shadow-red-400/10',
    purple: 'shadow-purple-500/10 dark:shadow-purple-400/10',
  };

  const trendColor = trend && trend > 0 ? 'text-emerald-600' : trend && trend < 0 ? 'text-red-600' : 'text-gray-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card className={`${colorClasses[color]} border backdrop-blur-xl shadow-xl ${shadowClasses[color]} hover:shadow-2xl transition-all duration-500 group relative overflow-hidden`}>
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 dark:via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors">
            {title}
          </CardTitle>
          <motion.div 
            className={`p-2.5 rounded-xl bg-white/70 dark:bg-black/30 backdrop-blur-sm shadow-lg ${iconClasses[color]}`}
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Icon className="h-5 w-5" />
          </motion.div>
        </CardHeader>
        <CardContent className="relative z-10">
          <motion.div 
            className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          >
            {value === 0 ? '—' : value}
          </motion.div>
          <div className="flex items-center justify-between">
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{subtitle}</p>
            )}
            {trend !== undefined && (
              <motion.p 
                className={`text-xs ${trendColor} font-bold flex items-center gap-1`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className={`inline-block w-0 h-0 ${
                  trend > 0 ? 'border-l-[3px] border-r-[3px] border-b-[5px] border-transparent border-b-emerald-600' :
                  trend < 0 ? 'border-l-[3px] border-r-[3px] border-t-[5px] border-transparent border-t-red-600' : ''
                }`} />
                {trend > 0 ? '+' : ''}{trend}%
              </motion.p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export { StatsCard };
