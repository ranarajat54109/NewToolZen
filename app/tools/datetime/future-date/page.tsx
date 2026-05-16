'use client';

import React, { useState, useEffect } from 'react';
import { add, format } from 'date-fns';

export default function FutureDateCalculator() {
  const [mode, setMode] = useState<'date' | 'datetime'>('date');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [startDateTime, setStartDateTime] = useState(new Date().toISOString().slice(0, 16));
  
  const [years, setYears] = useState('');
  const [months, setMonths] = useState('');
  const [weeks, setWeeks] = useState('');
  const [days, setDays] = useState('');
  
  const [resultDate, setResultDate] = useState<Date | null>(null);

  useEffect(() => {
    let start: Date;
    if (mode === 'date') {
      if (!startDate) { setResultDate(null); return; }
      start = new Date(startDate);
    } else {
      if (!startDateTime) { setResultDate(null); return; }
      start = new Date(startDateTime);
    }
    
    if (isNaN(start.getTime())) {
      setResultDate(null);
      return;
    }

    const y = parseInt(years, 10) || 0;
    const m = parseInt(months, 10) || 0;
    const w = parseInt(weeks, 10) || 0;
    const d = parseInt(days, 10) || 0;

    const future = add(start, {
      years: y,
      months: m,
      weeks: w,
      days: d
    });

    setResultDate(future);
  }, [mode, startDate, startDateTime, years, months, weeks, days]);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 font-sans text-slate-800 dark:text-slate-200">
      <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-orange-200/90 font-lightish">Future Date Calculator</h1>
      
      <div className="flex items-center gap-6 mb-8 text-slate-300">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="futureDateMode" 
            value="date" 
            checked={mode === 'date'} 
            onChange={() => setMode('date')}
            className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-600 dark:bg-slate-700"
          />
          <span className="text-lg">Date</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="futureDateMode" 
            value="datetime" 
            checked={mode === 'datetime'} 
            onChange={() => setMode('datetime')}
            className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-600 dark:bg-slate-700"
          />
          <span className="text-lg">Date and Time</span>
        </label>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-semibold text-slate-400 mb-2">{mode === 'date' ? 'Date:' : 'Date & Time:'}</label>
        <div className="relative max-w-[280px]">
          {mode === 'date' ? (
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-700/60 text-slate-200 border border-slate-600 rounded-lg py-3 flex items-center justify-between px-4 outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            />
          ) : (
            <input 
              type="datetime-local" 
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              className="w-full bg-slate-700/60 text-slate-200 border border-slate-600 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            />
          )}
        </div>
      </div>

      <h2 className="text-lg font-bold text-orange-200/90 mb-4">Add:</h2>
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[120px] max-w-[180px]">
          <label className="block text-sm font-semibold text-slate-400 mb-2">Days:</label>
          <input 
            type="number" min="0" value={days} onChange={(e) => setDays(e.target.value)}
            className="w-full bg-slate-700/60 text-slate-200 border border-slate-600 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1 min-w-[120px] max-w-[180px]">
          <label className="block text-sm font-semibold text-slate-400 mb-2">Weeks:</label>
          <input 
            type="number" min="0" value={weeks} onChange={(e) => setWeeks(e.target.value)}
            className="w-full bg-slate-700/60 text-slate-200 border border-slate-600 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1 min-w-[120px] max-w-[180px]">
          <label className="block text-sm font-semibold text-slate-400 mb-2">Months:</label>
          <input 
            type="number" min="0" value={months} onChange={(e) => setMonths(e.target.value)}
            className="w-full bg-slate-700/60 text-slate-200 border border-slate-600 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1 min-w-[120px] max-w-[180px]">
          <label className="block text-sm font-semibold text-slate-400 mb-2">Years:</label>
          <input 
            type="number" min="0" value={years} onChange={(e) => setYears(e.target.value)}
            className="w-full bg-slate-700/60 text-slate-200 border border-slate-600 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {resultDate && (
        <div className="bg-[#1e293b]/80 border border-slate-700/80 rounded-xl p-6 mt-8 max-w-xl">
          <p className="text-[12px] font-bold text-slate-400 tracking-widest uppercase mb-3">Resulting Date</p>
          <div className="text-3xl font-bold text-white tracking-wide">
            {format(resultDate, mode === 'date' ? 'dd-MM-yyyy' : 'dd-MM-yyyy HH:mm')}
          </div>
        </div>
      )}
    </div>
  );
}
