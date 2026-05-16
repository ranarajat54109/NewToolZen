'use client';

import React, { useState, useEffect } from 'react';
import { differenceInYears, differenceInMonths, differenceInWeeks, differenceInDays, addYears, addMonths } from 'date-fns';

export default function DateDifference() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [diffStrings, setDiffStrings] = useState<{ main: string[], others: string[] } | null>(null);

  useEffect(() => {
    if (!startDate || !endDate) {
      setDiffStrings(null);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

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

    const totalDays = differenceInDays(later, earlier);
    const totalWeeks = differenceInWeeks(later, earlier);
    const totalMonths = differenceInMonths(later, earlier);

    const mainParts = [];
    if (years > 0) mainParts.push(`${years} ${years === 1 ? 'Year' : 'Years'}`);
    if (months > 0) mainParts.push(`${months} ${months === 1 ? 'Month' : 'Months'}`);
    
    const remainderWeeks = Math.floor(days / 7);
    const remainderDays = days % 7;
    
    if (remainderWeeks > 0) mainParts.push(`${remainderWeeks} ${remainderWeeks === 1 ? 'Week' : 'Weeks'}`);
    if (remainderDays > 0) mainParts.push(`${remainderDays} ${remainderDays === 1 ? 'Day' : 'Days'}`);
    
    if (mainParts.length === 0) mainParts.push('0 Days');

    const others = [];
    if (totalMonths > 0) others.push(`${totalMonths} Months, ${days} Days`);
    if (totalWeeks > 0) others.push(`${totalWeeks} Weeks, ${totalDays % 7} Days`);
    others.push(`${totalDays} Days in total`);

    setDiffStrings({
      main: mainParts,
      others: others
    });

  }, [startDate, endDate]);

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-orange-200/90 font-lightish">Date Difference Calculator</h1>
      
      <div className="flex flex-wrap items-center gap-6 mb-10">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">Start Date:</label>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-700/60 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm appearance-none"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">End Date:</label>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-700/60 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm appearance-none"
          />
        </div>
      </div>

      {diffStrings && (
        <div className="space-y-6 animate-in fade-in duration-300 border-t border-slate-200 dark:border-slate-800 pt-8">
          <div>
            <span className="block text-sm text-slate-600 dark:text-slate-400 mb-3">Time between dates:</span>
            <div className="flex flex-wrap gap-2">
              {diffStrings.main.map((part, i) => (
                <div key={i} className="bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 px-4 py-2 rounded-md font-semibold text-lg shadow-sm border border-blue-200 dark:border-blue-800/50">
                  {part}
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-sm text-slate-500 dark:text-slate-500 mb-3">Alternative equivalents:</span>
            <div className="flex flex-col gap-2">
              {diffStrings.others.map((part, i) => (
                <div key={i} className="text-slate-700 dark:text-slate-300 text-base flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></div>
                  {part}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
