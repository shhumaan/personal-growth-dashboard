'use client';

import * as React from "react";
import { CustomSliderProps } from "../../../types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
  
  const getColor = (val: number) => {
    if (val <= 3) return 'bg-red-500';
    if (val <= 6) return 'bg-orange-500';
    if (val <= 8) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className={cn(
          "text-sm font-semibold px-2 py-1 rounded-lg text-white",
          getColor(value)
        )}>
          {formatLabel ? formatLabel(value) : value}
        </span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onValueChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, ${getColor(value).replace('bg-', '')} 0%, ${getColor(value).replace('bg-', '')} ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
          }}
        />
        
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: white;
            border: 2px solid ${getColor(value).includes('red') ? '#ef4444' : 
                                getColor(value).includes('orange') ? '#f97316' :
                                getColor(value).includes('blue') ? '#3b82f6' : '#22c55e'};
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: white;
            border: 2px solid ${getColor(value).includes('red') ? '#ef4444' : 
                                getColor(value).includes('orange') ? '#f97316' :
                                getColor(value).includes('blue') ? '#3b82f6' : '#22c55e'};
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
        `}</style>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export { CustomSlider };
