'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export const TimePicker = ({
  value,
  onChange,
  id,
  name,
  required = false,
  disabled = false,
  className = "",
  label
}: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState<number>(
    value ? parseInt(value.split(':')[0]) : 8
  );
  const [minutes, setMinutes] = useState<number>(
    value ? parseInt(value.split(':')[1]) : 0
  );
  const [period, setPeriod] = useState<'AM' | 'PM'>(
    value ? (parseInt(value.split(':')[0]) >= 12 ? 'PM' : 'AM') : 'AM'
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });

  // Format hours for display (12-hour format)
  const displayHours = () => {
    if (hours === 0) return 12;
    if (hours > 12) return hours - 12;
    return hours;
  };

  // Format minutes with leading zero
  const formatMinutes = useCallback(() => {
    return minutes < 10 ? `0${minutes}` : minutes;
  }, [minutes]);

  // Convert to 24-hour format for the hidden input
  const formatTimeFor24Hour = useCallback(() => {
    let hrs = hours;
    if (period === 'PM' && hrs < 12) hrs += 12;
    if (period === 'AM' && hrs === 12) hrs = 0;
    return `${hrs < 10 ? '0' + hrs : hrs}:${formatMinutes()}`;
  }, [hours, period, formatMinutes]);

  // Update the parent's state when our internal state changes
  useEffect(() => {
    onChange(formatTimeFor24Hour());
  }, [hours, minutes, period, onChange, formatTimeFor24Hour]);

  // Initialize from prop value
  useEffect(() => {
    if (value && value.includes(':')) {
      const [h, m] = value.split(':');
      const hourNum = parseInt(h);
      if (!isNaN(hourNum) && !isNaN(parseInt(m))) {
        setHours(hourNum);
        setMinutes(parseInt(m));
        setPeriod(hourNum >= 12 ? 'PM' : 'AM');
      }
    }
  }, [value]);

  // Click outside handling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Hours increment/decrement handlers
  const incrementHours = () => {
    setHours(prev => (prev === 12 ? 1 : prev + 1));
  };

  const decrementHours = () => {
    setHours(prev => (prev === 1 ? 12 : prev - 1));
  };

  // Minutes increment/decrement handlers
  const incrementMinutes = () => {
    if (minutes === 55) {
      setMinutes(0);
      incrementHours();
    } else {
      setMinutes(prev => prev + 5);
    }
  };

  const decrementMinutes = () => {
    if (minutes === 0) {
      setMinutes(55);
      decrementHours();
    } else {
      setMinutes(prev => prev - 5);
    }
  };

  // Toggle AM/PM
  const togglePeriod = () => {
    setPeriod(prev => (prev === 'AM' ? 'PM' : 'AM'));
  };

  // Calculate dropdown position
  const calculatePosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  // Handle input click
  const handleInputClick = () => {
    if (!disabled) {
      calculatePosition();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        ref={inputRef}
        className={`flex items-center relative ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
        onClick={handleInputClick}
      >
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
            {label}
          </label>
        )}
        <div className="w-full relative">
          <input
            type="time"
            id={id}
            name={name}
            value={formatTimeFor24Hour()}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            disabled={disabled}
            className="sr-only"
          />
          <div className="flex items-center w-full h-10 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400">
            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
            <span className="flex-grow text-gray-900 dark:text-gray-100">
              {displayHours()}:{formatMinutes()} {period}
            </span>
            <svg
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="time-picker-dropdown bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              style={{
                position: 'fixed',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                zIndex: 999999
              }}
            >
              <div className="p-3">
                <div className="flex justify-center gap-4">
                {/* Hours Column */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      incrementHours();
                    }}
                  >
                    <ChevronUp className="h-5 w-5" />
                  </button>
                  <div className="my-1 text-xl font-semibold w-10 text-center text-gray-900 dark:text-white">
                    {displayHours()}
                  </div>
                  <button
                    type="button"
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      decrementHours();
                    }}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </div>

                <div className="text-xl font-bold text-gray-500 dark:text-gray-400 self-center">:</div>

                {/* Minutes Column */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      incrementMinutes();
                    }}
                  >
                    <ChevronUp className="h-5 w-5" />
                  </button>
                  <div className="my-1 text-xl font-semibold w-10 text-center text-gray-900 dark:text-white">
                    {formatMinutes()}
                  </div>
                  <button
                    type="button"
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      decrementMinutes();
                    }}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </div>

                {/* AM/PM Toggle */}
                <div className="flex flex-col justify-center ml-2">
                  <button
                    type="button"
                    className={`px-3 py-1 rounded-t-md text-sm font-medium ${
                      period === 'AM'
                        ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (period !== 'AM') togglePeriod();
                    }}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1 rounded-b-md text-sm font-medium ${
                      period === 'PM'
                        ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (period !== 'PM') togglePeriod();
                    }}
                  >
                    PM
                  </button>
                </div>
                </div>

                {/* Quick preset times */}
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { label: 'Morning', time: '08:00' },
                    { label: 'Noon', time: '12:00' },
                    { label: 'Evening', time: '18:00' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        const [h, m] = preset.time.split(':');
                        const hourNum = parseInt(h);
                        setHours(hourNum);
                        setMinutes(parseInt(m));
                        setPeriod(hourNum >= 12 ? 'PM' : 'AM');
                        setIsOpen(false);
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default TimePicker; 