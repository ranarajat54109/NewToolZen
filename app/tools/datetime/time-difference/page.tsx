'use client';

import React, { useState, useEffect } from 'react';
import { differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';

export default function TimeDifferenceCalculator() {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:30');
  const [diffStr, setDiffStr] = useState<string | null>(null);

  useEffect(() => {
    if (!startTime || !endTime) {
      setDiffStr(null);
      return;
    }

    // Use an arbitrary date, just set the hours and minutes
    const today = new Date().toISOString().split('T')[0];
    const start = new Date(`${today}T${startTime}`);
    let end = new Date(`${today}T${endTime}`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setDiffStr(null);
      return;
    }

    // If end time is before start time, assume it's on the next day
    if (end < start) {
      end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
    }

    const diffMins = differenceInMinutes(end, start);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'Hour' : 'Hours'}`);
    if (mins > 0) parts.push(`${mins} ${mins === 1 ? 'Minute' : 'Minutes'}`);
    
    if (parts.length === 0) {
      setDiffStr('0 Minutes');
    } else {
      setDiffStr(parts.join(' and '));
    }
    
  }, [startTime, endTime]);

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-orange-200/90 font-lightish">Time Difference Calculator</h1>
      
      <div className="flex flex-wrap items-center gap-6 mb-10 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 rounded-2xl shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Start Time:</label>
          <input 
            type="time" 
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">End Time:</label>
          <input 
            type="time" 
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
          />
        </div>
      </div>

      {diffStr && (
        <div className="animate-in fade-in duration-300 bg-indigo-50 dark:bg-slate-800/80 border border-indigo-100 dark:border-slate-700 p-8 rounded-2xl text-center shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Time Difference</p>
          <div className="text-4xl sm:text-5xl font-bold text-indigo-700 dark:text-indigo-400 mb-2 tracking-tight">
            {diffStr}
          </div>
        </div>
      )}
    </div>
  );
}
