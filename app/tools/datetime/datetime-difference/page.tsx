'use client';

import React, { useState, useEffect } from 'react';
import { differenceInYears, differenceInMonths, differenceInDays, differenceInHours, differenceInMinutes, addYears, addMonths, addDays, addHours } from 'date-fns';

export default function DateTimeDifferenceCalculator() {
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [diffStrings, setDiffStrings] = useState<{ main: string[], others: string[] } | null>(null);

  useEffect(() => {
    if (!startDateTime || !endDateTime) {
      setDiffStrings(null);
      return;
    }

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setDiffStrings(null);
      return;
    }

    const isNegative = end < start;
    const earlier = isNegative ? end : start;
    const later = isNegative ? start : end;

    let years = differenceInYears(later, earlier);
    const afterYears = addYears(earlier, years);
    
    let months = differenceInMonths(later, afterYears);
    const afterMonths = addMonths(afterYears, months);
    
    let days = differenceInDays(later, afterMonths);
    const afterDays = addDays(afterMonths, days);

    let hours = differenceInHours(later, afterDays);
    const afterHours = addHours(afterDays, hours);

    let minutes = differenceInMinutes(later, afterHours);

    const totalDays = differenceInDays(later, earlier);
    const totalHours = differenceInHours(later, earlier);
    const totalMinutes = differenceInMinutes(later, earlier);

    const mainParts = [];
    if (years > 0) mainParts.push(`${years} ${years === 1 ? 'Year' : 'Years'}`);
    if (months > 0) mainParts.push(`${months} ${months === 1 ? 'Month' : 'Months'}`);
    if (days > 0) mainParts.push(`${days} ${days === 1 ? 'Day' : 'Days'}`);
    
    if (hours > 0) mainParts.push(`${hours} ${hours === 1 ? 'Hour' : 'Hours'}`);
    if (minutes > 0) mainParts.push(`${minutes} ${minutes === 1 ? 'Minute' : 'Minutes'}`);
    
    if (mainParts.length === 0) mainParts.push('0 Minutes');

    const others = [];
    if (totalDays > 0) others.push(`${totalDays} Days, ${hours} Hours, ${minutes} Minutes`);
    if (totalHours > 0) others.push(`${totalHours} Hours, ${minutes} Minutes`);
    others.push(`${totalMinutes} Minutes in total`);

    setDiffStrings({
      main: mainParts,
      others: others
    });

  }, [startDateTime, endDateTime]);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-orange-200/90 font-lightish">Date & Time Difference Calculator</h1>
      
      <div className="flex flex-col md:flex-row gap-6 mb-10 bg-white dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Start Date & Time:</label>
          <input 
            type="datetime-local" 
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-teal-500 shadow-inner"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">End Date & Time:</label>
          <input 
            type="datetime-local" 
            value={endDateTime}
            onChange={(e) => setEndDateTime(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-teal-500 shadow-inner"
          />
        </div>
      </div>

      {diffStrings && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wider">Exact Difference:</span>
            <div className="flex flex-wrap gap-2">
              {diffStrings.main.map((part, i) => (
                <div key={i} className="bg-teal-50 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200 px-4 py-2 rounded-lg font-bold text-lg shadow-sm border border-teal-200 dark:border-teal-800/50">
                  {part}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-6">
            <span className="block text-sm font-semibold text-slate-500 dark:text-slate-500 mb-3 uppercase tracking-wider">Alternative conversions:</span>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {diffStrings.others.map((part, i) => (
                <div key={i} className="bg-white dark:bg-slate-800/50 p-4 border border-slate-200 dark:border-slate-700/50 rounded-xl shadow-sm">
                  <span className="text-slate-700 dark:text-slate-300 text-base font-medium font-mono">{part}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
