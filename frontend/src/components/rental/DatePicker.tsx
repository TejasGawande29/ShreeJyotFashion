'use client';

import React, { useState, useEffect } from 'react';
import { FiCalendar, FiX } from 'react-icons/fi';

interface DatePickerProps {
  label: string;
  value: string | null;
  onChange: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export default function DatePicker({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = 'Select date',
  error,
  disabled = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
      setCurrentMonth(new Date(value));
    }
  }, [value]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const isDateDisabled = (date: Date) => {
    if (disabled) return true;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return true;
    
    if (minDate && date < new Date(minDate)) return true;
    if (maxDate && date > new Date(maxDate)) return true;
    
    return false;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    
    if (isDateDisabled(selected)) return;
    
    setSelectedDate(selected);
    onChange(selected.toISOString().split('T')[0]); // YYYY-MM-DD format
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(null);
    onChange('');
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isDisabled = isDateDisabled(date);
      const isSelected = selectedDate && isSameDay(date, selectedDate);
      const isToday = isSameDay(date, new Date());

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateSelect(day)}
          disabled={isDisabled}
          className={`h-10 flex items-center justify-center rounded-lg text-sm transition-colors ${
            isSelected
              ? 'bg-pink-500 text-white font-semibold'
              : isToday
              ? 'bg-pink-100 text-pink-600 font-medium'
              : isDisabled
              ? 'text-gray-300 cursor-not-allowed'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {/* Input Field */}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-4 py-3 border rounded-lg text-left flex items-center justify-between ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-2 focus:ring-pink-500'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'}`}
        >
          <span className={selectedDate ? 'text-gray-900' : 'text-gray-400'}>
            {selectedDate ? formatDate(selectedDate) : placeholder}
          </span>
          <div className="flex items-center space-x-2">
            {selectedDate && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <FiX className="w-4 h-4 text-gray-500" />
              </button>
            )}
            <FiCalendar className="w-5 h-5 text-gray-400" />
          </div>
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>

      {/* Calendar Dropdown */}
      {isOpen && !disabled && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Calendar */}
          <div className="absolute z-20 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={previousMonth}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <span className="text-lg font-semibold text-gray-900">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>

              <button
                type="button"
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div
                  key={day}
                  className="h-10 flex items-center justify-center text-xs font-semibold text-gray-500"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>

            {/* Today Button */}
            <div className="mt-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  if (!isDateDisabled(today)) {
                    setSelectedDate(today);
                    setCurrentMonth(today);
                    onChange(today.toISOString().split('T')[0]);
                    setIsOpen(false);
                  }
                }}
                className="w-full py-2 px-4 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors text-sm font-medium"
              >
                Today
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
