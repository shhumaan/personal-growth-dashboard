'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { SessionCardProps } from '../../../types';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Play } from 'lucide-react';

const SessionCard: React.FC<SessionCardProps> = ({
  section,
  isActive,
  isCompleted,
  onClick,
}) => {
  const getStatusIcon = () => {
    if (isCompleted) {
      return <CheckCircle className="h-6 w-6 text-green-600" />;
    }
    if (isActive) {
      return <Play className="h-6 w-6 text-blue-600" />;
    }
    return <Clock className="h-6 w-6 text-gray-400" />;
  };

  const getStatusText = () => {
    if (isCompleted) return 'Completed';
    if (isActive) return 'In Progress';
    return 'Pending';
  };

  const getCardStyles = () => {
    if (isCompleted) {
      return 'bg-gradient-to-br from-emerald-50/80 to-green-50/80 dark:from-emerald-900/30 dark:to-green-900/30 border-emerald-200/50 dark:border-emerald-700/50 shadow-xl shadow-emerald-500/10 dark:shadow-emerald-400/10 backdrop-blur-sm';
    }
    if (isActive) {
      return 'bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200/50 dark:border-blue-700/50 shadow-xl shadow-blue-500/10 dark:shadow-blue-400/10 backdrop-blur-sm ring-2 ring-blue-500/20';
    }
    return 'bg-white/60 dark:bg-gray-800/60 border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/60 dark:hover:border-gray-600/60 hover:shadow-xl hover:shadow-gray-500/10 dark:hover:shadow-gray-400/10 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-500 ${getCardStyles()} group relative overflow-hidden`}
        onClick={onClick}
      >
        {/* Gradient overlay for visual appeal */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div 
                className={`p-3 rounded-2xl shadow-lg ${
                  isCompleted ? 'bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40' :
                  isActive ? 'bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40' : 
                  'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800'
                }`}
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <section.icon className={`h-6 w-6 ${
                  isCompleted ? 'text-emerald-600 dark:text-emerald-400' :
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                }`} />
              </motion.div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                  {section.title}
                </CardTitle>
              </div>
            </div>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {getStatusIcon()}
            </motion.div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 relative z-10">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors">
            {section.description}
          </p>
          <div className="flex items-center justify-between">
            <motion.span 
              className={`text-sm font-semibold px-4 py-2 rounded-xl shadow-sm ${
                isCompleted ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 dark:from-emerald-900/40 dark:to-green-900/40 dark:text-emerald-300' :
                isActive ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-300' :
                'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 dark:from-gray-700 dark:to-gray-800 dark:text-gray-400'
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {getStatusText()}
            </motion.span>
            {isActive && (
              <motion.div
                className="flex items-center gap-1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.6, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="w-2 h-2 bg-blue-400 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.6, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3
                  }}
                />
                <motion.div
                  className="w-2 h-2 bg-blue-300 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.6, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6
                  }}
                />
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export { SessionCard };
