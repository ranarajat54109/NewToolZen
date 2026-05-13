'use client';

import React, { useState, useEffect } from 'react';

const CONVERSIONS = {
  Milliseconds: 1,
  Seconds: 1000,
  Minutes: 60000,
  Hours: 3600000,
  Days: 86400000,
  Weeks: 604800000,
  Years: 31536000000 // 365 Days
};

type Unit = keyof typeof CONVERSIONS;

export default function TimeConverter() {
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState<Unit>('Hours');
  const [toUnit, setToUnit] = useState<Unit>('Minutes');
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      setResult(null);
      return;
    }

    const valueInMs = num * CONVERSIONS[fromUnit];
    const converted = valueInMs / CONVERSIONS[toUnit];

    // Format avoiding huge e notation if simple, or rounding
    const formatted = parseFloat(converted.toPrecision(12)).toString();
    setResult(formatted);
  }, [value, fromUnit, toUnit]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-orange-200/90 font-lightish">Time Converter</h1>
      
      <div className="bg-white dark:bg-slate-900/50 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        
        <div className="flex flex-col md:flex-row gap-6 items-center w-full">
          {/* From */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">From</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-1/2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
              />
              <select 
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value as Unit)}
                className="w-1/2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 shadow-inner cursor-pointer"
              >
                {Object.keys(CONVERSIONS).map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <button 
            onClick={swapUnits}
            className="hidden md:flex mt-6 w-10 h-10 items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full transition-colors shrink-0 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 5l-1.5 1.5"/><path d="m15 5.88-1.5-1.5L12 5.88"/><path d="M15 5.88V14"/><path d="m7 10 1.5-1.5L10 10"/></svg>
          </button>

          {/* To */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">To</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                readOnly
                value={result || ''}
                className="w-1/2 bg-slate-100 dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg py-3 px-4 outline-none shadow-inner opacity-80 cursor-not-allowed font-mono"
              />
              <select 
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value as Unit)}
                className="w-1/2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 shadow-inner cursor-pointer"
              >
                {Object.keys(CONVERSIONS).map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>

        {result && (
          <div className="mt-8 text-center bg-blue-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-blue-100/50 dark:border-slate-700/30 animate-in fade-in duration-300">
             <p className="text-slate-600 dark:text-slate-400">
               <span className="font-semibold text-slate-800 dark:text-slate-200">{value}</span> {fromUnit.toLowerCase()} is equal to <span className="font-semibold text-blue-600 dark:text-blue-400">{result}</span> {toUnit.toLowerCase()}
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
