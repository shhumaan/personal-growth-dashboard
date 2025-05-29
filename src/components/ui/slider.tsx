'use client';

import * as React from "react";
import { CustomSliderProps } from "../../../types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { motion } from "framer-motion";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  value,
  onValueChange,
  label,
  min = 1,
  max = 10,
  formatLabel,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  // Get color based on value
  const getColor = (val: number) => {
    if (val <= 3) return {
      bg: 'bg-red-500',
      lighter: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-500',
      solid: '#ef4444',
      trail: '#fecaca',
      darkTrail: '#7f1d1d40'
    };
    if (val <= 6) return {
      bg: 'bg-amber-500',
      lighter: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-500',
      solid: '#f59e0b',
      trail: '#fef3c7',
      darkTrail: '#78350f40'
    };
    if (val <= 8) return {
      bg: 'bg-blue-500',
      lighter: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-500',
      solid: '#3b82f6',
      trail: '#dbeafe',
      darkTrail: '#1e3a8a40'
    };
    return {
      bg: 'bg-green-500',
      lighter: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-300',
      border: 'border-green-500',
      solid: '#22c55e',
      trail: '#dcfce7',
      darkTrail: '#14532d40'
    };
  };

  const colors = getColor(value);
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 640;

  // Create an array of steps for the visual feedback dots
  const steps = React.useMemo(() => {
    return Array.from({ length: max - min + 1 }, (_, i) => i + min);
  }, [min, max]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <motion.span 
          className={cn(
            "text-sm font-medium px-3 py-1 rounded-full",
            colors.bg, "text-white"
          )}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          key={value}
        >
          {formatLabel ? formatLabel(value) : value}
        </motion.span>
      </div>
      
      <div className="relative px-1 py-2">
        {/* Custom track with gradient based on value */}
        <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 relative">
          <motion.div 
            className={`absolute top-0 left-0 h-full rounded-full ${colors.bg}`} 
            style={{ width: `${percentage}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
        
        {/* Visual feedback dots */}
        <div className="flex justify-between mt-2 px-1">
          {steps.map((step) => {
            const isActive = value >= step;
            return (
              <div 
                key={step}
                className={`relative group ${isSmallScreen ? 'hidden' : ''}`}
              >
                <div 
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    isActive ? colors.bg : 'bg-gray-300 dark:bg-gray-600'
                  }`} 
                />
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${colors.lighter} ${colors.text} whitespace-nowrap`}>
                    {step}
                  </div>
                  <div className={`w-2 h-2 rotate-45 ${colors.lighter} absolute -bottom-1 left-1/2 transform -translate-x-1/2`}></div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* The actual slider input */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onValueChange(Number(e.target.value))}
          className="absolute top-0 left-0 w-full appearance-none bg-transparent cursor-pointer h-10 z-10 opacity-0"
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
        
        {/* The visible thumb */}
        <div 
          className="absolute top-1.5 transform -translate-y-1/2 pointer-events-none"
          style={{ 
            left: `calc(${percentage}% - 8px)`,
            transition: 'left 0.1s ease-out'
          }}
        >
          <motion.div 
            className={`w-4 h-4 rounded-full bg-white border-2 ${colors.border} shadow-md`}
            whileTap={{ scale: 1.2 }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>
      
      {/* Descriptive legend */}
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
        <span>Low</span>
        <span>Average</span>
        <span>High</span>
      </div>
    </div>
  );
};

export { CustomSlider };
