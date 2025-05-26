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
      return 'bg-green-50/80 border-green-200 shadow-green-100';
    }
    if (isActive) {
      return 'bg-blue-50/80 border-blue-200 shadow-blue-100';
    }
    return 'bg-white/50 border-gray-200 hover:border-gray-300';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-200 ${getCardStyles()}`}
        onClick={onClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                isCompleted ? 'bg-green-100' :
                isActive ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <section.icon className={`h-5 w-5 ${
                  isCompleted ? 'text-green-600' :
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`} />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {section.title}
                </CardTitle>
              </div>
            </div>
            {getStatusIcon()}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-gray-600 mb-3">
            {section.description}
          </p>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              isCompleted ? 'bg-green-100 text-green-700' :
              isActive ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {getStatusText()}
            </span>
            <motion.div
              animate={{
                opacity: isActive ? [1, 0.5, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: isActive ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              {isActive && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export { SessionCard };
