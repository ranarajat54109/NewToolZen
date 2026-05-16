'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface TimeEntry {
  id: string;
  operation: 'add' | 'subtract';
  hours: number;
  minutes: number;
}

export default function HoursMinutesCalculator() {
  const [hoursInput, setHoursInput] = useState('');
  const [minutesInput, setMinutesInput] = useState('');
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [hourlyRate, setHourlyRate] = useState('');

  const [totalMinutes, setTotalMinutes] = useState(0);

  useEffect(() => {
    let mins = 0;
    entries.forEach(entry => {
      const eMins = (entry.hours * 60) + entry.minutes;
      if (entry.operation === 'add') {
        mins += eMins;
      } else {
        mins -= eMins;
      }
    });
    setTotalMinutes(mins);
  }, [entries]);

  const handleAddEntry = (operation: 'add' | 'subtract') => {
    const h = parseInt(hoursInput) || 0;
    const m = parseInt(minutesInput) || 0;
    
    if (h === 0 && m === 0) return;

    setEntries([...entries, {
      id: Date.now().toString(),
      operation,
      hours: h,
      minutes: m
    }]);

    setHoursInput('');
    setMinutesInput('');
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const clearAll = () => {
    setEntries([]);
  };

  const isNeg = totalMinutes < 0;
  const absMins = Math.abs(totalMinutes);
  const tHours = Math.floor(absMins / 60);
  const tMins = absMins % 60;
  const decimalHours = (absMins / 60) * (isNeg ? -1 : 1);
  const rate = parseFloat(hourlyRate) || 0;
  const payout = decimalHours * rate;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 font-sans text-slate-800 dark:text-slate-200">
      <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-orange-200/90 font-lightish">Hours and Minutes Calculator</h1>
      
      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Hours:</label>
          <input 
            type="number" min="0" value={hoursInput} onChange={(e) => setHoursInput(e.target.value)}
            className="w-32 bg-slate-700/60 text-slate-200 border border-slate-600 rounded-lg py-2.5 px-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Minutes:</label>
          <input 
            type="number" min="0" value={minutesInput} onChange={(e) => setMinutesInput(e.target.value)}
            className="w-32 bg-slate-700/60 text-slate-200 border border-slate-600 rounded-lg py-2.5 px-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          onClick={() => handleAddEntry('add')}
          className="bg-[#2563eb] hover:bg-blue-600 text-slate-100 font-medium py-2.5 px-6 rounded-lg transition-colors border border-blue-600"
        >
          + Add Time
        </button>
        <button 
          onClick={() => handleAddEntry('subtract')}
          className="bg-[#9f1239] hover:bg-rose-800 text-slate-100 font-medium py-2.5 px-6 rounded-lg transition-colors border border-rose-800"
        >
          - Subtract Time
        </button>
      </div>

      {entries.length > 0 && (
        <button onClick={clearAll} className="text-rose-400 hover:text-rose-300 text-sm font-medium mb-4 flex items-center underline underline-offset-2">
          <X className="w-4 h-4 mr-1" /> Clear All Entries
        </button>
      )}

      <div className="flex flex-wrap gap-2 mb-8 min-h-[40px]">
        {entries.map(entry => (
          <div key={entry.id} className="flex items-center gap-2 bg-[#1e293b] text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 text-sm font-medium">
            <span className={entry.operation === 'add' ? 'text-blue-400' : 'text-rose-400'}>
              {entry.operation === 'add' ? '+' : '-'} {entry.hours > 0 && `${entry.hours}h`} {entry.minutes > 0 && `${entry.minutes}m`}
            </span>
            <button onClick={() => removeEntry(entry.id)} className="text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <label className="block text-sm font-semibold text-slate-300 mb-2">Hourly Rate (Optional):</label>
        <div className="relative w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
          <input 
            type="number" min="0" step="0.01" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)}
            className="w-full bg-slate-700/60 text-slate-200 border border-slate-600 rounded-lg py-2.5 pl-8 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-[#1e293b]/80 border border-slate-700/80 rounded-xl p-6 max-w-sm">
        <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-2">Total Time:</p>
        <div className="text-4xl font-bold text-white mb-6">
          {isNeg && '-'}{tHours}h {tMins}m
        </div>
        <div className="border-t border-slate-700/80 mb-6 w-10/12"></div>
        <div className="flex justify-between items-end gap-4 w-10/12">
          <div>
            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Decimal Format</p>
            <p className="text-lg font-medium text-[#60a5fa]">{decimalHours.toFixed(2)}h</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Estimated Payout</p>
            <p className="text-lg font-medium text-[#34d399]">${payout.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
