import React, { useState } from 'react';
import { JournalEntry } from '../types';

interface JournalCalendarProps {
  entries: JournalEntry[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onEntrySelect: (entry: JournalEntry) => void;
}

const JournalCalendar: React.FC<JournalCalendarProps> = ({
  entries,
  selectedDate,
  onDateSelect,
  onEntrySelect
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEntryForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return entries.find(entry => entry.date.startsWith(dateStr));
  };

  const getMoodColor = (rating: number) => {
    if (rating >= 8) return 'bg-green-100 text-green-800';
    if (rating >= 6) return 'bg-yellow-100 text-yellow-800';
    if (rating >= 4) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getEnergyColor = (rating: number) => {
    if (rating >= 8) return 'bg-blue-100 text-blue-800';
    if (rating >= 6) return 'bg-indigo-100 text-indigo-800';
    if (rating >= 4) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return formatDate(date) === selectedDate;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-xl font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Calendar Days */}
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="p-2"></div>;
          }

          const entry = getEntryForDate(day);
          const dayStr = formatDate(day);
          const isCurrentDay = isToday(day);
          const isSelectedDay = isSelected(day);

          return (
            <div
              key={dayStr}
              className={`p-2 min-h-[80px] border rounded-lg cursor-pointer transition-colors ${
                isCurrentDay
                  ? 'bg-primary-50 border-primary-200'
                  : isSelectedDay
                  ? 'bg-primary-100 border-primary-300'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => onDateSelect(dayStr)}
            >
              <div className="flex flex-col h-full">
                <div className={`text-sm font-medium ${
                  isCurrentDay ? 'text-primary-600' : 'text-gray-900'
                }`}>
                  {day.getDate()}
                </div>
                
                {entry && (
                  <div className="flex-1 flex flex-col justify-center space-y-1 mt-1">
                    <div className={`text-xs px-1 py-0.5 rounded-full text-center ${getMoodColor(entry.mood.rating)}`}>
                      😊 {entry.mood.rating}
                    </div>
                    <div className={`text-xs px-1 py-0.5 rounded-full text-center ${getEnergyColor(entry.energy.rating)}`}>
                      ⚡ {entry.energy.rating}
                    </div>
                    {entry.sleep.hours > 0 && (
                      <div className="text-xs px-1 py-0.5 rounded-full text-center bg-purple-100 text-purple-800">
                        😴 {entry.sleep.hours}h
                      </div>
                    )}
                    {entry.exercise.duration > 0 && (
                      <div className="text-xs px-1 py-0.5 rounded-full text-center bg-orange-100 text-orange-800">
                        🏃 {entry.exercise.duration}m
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-100 rounded-full"></div>
            <span>Mood: 8-10</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-100 rounded-full"></div>
            <span>Energy: 8-10</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-100 rounded-full"></div>
            <span>Sleep Hours</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-100 rounded-full"></div>
            <span>Exercise Minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalCalendar;
