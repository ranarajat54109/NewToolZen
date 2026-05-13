'use client';

import React, { useState, useEffect } from 'react';
import { sub, format } from 'date-fns';

export default function PastDateCalculator() {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [years, setYears] = useState('0');
  const [months, setMonths] = useState('0');
  const [weeks, setWeeks] = useState('0');
  const [days, setDays] = useState('0');
  const [resultDate, setResultDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!startDate) {
      setResultDate(null);
      return;
    }

    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      setResultDate(null);
      return;
    }

    const y = parseInt(years, 10) || 0;
    const m = parseInt(months, 10) || 0;
    const w = parseInt(weeks, 10) || 0;
    const d = parseInt(days, 10) || 0;

    const past = sub(start, {
      years: y,
      months: m,
      weeks: w,
      days: d
    });

    setResultDate(past);
  }, [startDate, years, months, weeks, days]);

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-orange-200/90 font-lightish">Past Date Calculator</h1>
      
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm mb-8">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Start Date:</label>
        <input 
          type="date" 
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full sm:w-64 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-sky-500 shadow-inner mb-6 appearance-none"
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Subtract Years</label>
            <input 
              type="number" min="0" value={years} onChange={(e) => setYears(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-sky-500 shadow-inner"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Subtract Months</label>
            <input 
              type="number" min="0" value={months} onChange={(e) => setMonths(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-sky-500 shadow-inner"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Subtract Weeks</label>
            <input 
              type="number" min="0" value={weeks} onChange={(e) => setWeeks(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-sky-500 shadow-inner"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Subtract Days</label>
            <input 
              type="number" min="0" value={days} onChange={(e) => setDays(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-sky-500 shadow-inner"
            />
          </div>
        </div>
      </div>

      {resultDate && (
        <div className="animate-in fade-in duration-300 bg-sky-50 dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700 p-8 rounded-2xl text-center shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Resulting Past Date</p>
          <div className="text-3xl sm:text-4xl font-bold text-sky-700 dark:text-sky-400 tracking-tight">
            {format(resultDate, 'EEEE, MMMM do, yyyy')}
          </div>
        </div>
      )}
    </div>
  );
}
