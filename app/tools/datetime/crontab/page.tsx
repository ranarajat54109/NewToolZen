'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function CrontabGenerator() {
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');
  const [copied, setCopied] = useState(false);

  const cronString = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cronString);
    setCopied(true);
    toast.success('Crontab copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const commonPresets = [
    { label: 'Every minute', value: ['*', '*', '*', '*', '*'] },
    { label: 'Every 5 minutes', value: ['*/5', '*', '*', '*', '*'] },
    { label: 'Every hour', value: ['0', '*', '*', '*', '*'] },
    { label: 'Every day at midnight', value: ['0', '0', '*', '*', '*'] },
    { label: 'Every Sunday at midnight', value: ['0', '0', '*', '*', '0'] },
    { label: 'Every Monday at 9AM', value: ['0', '9', '*', '*', '1'] },
  ];

  const applyPreset = (preset: string[]) => {
    setMinute(preset[0]);
    setHour(preset[1]);
    setDayOfMonth(preset[2]);
    setMonth(preset[3]);
    setDayOfWeek(preset[4]);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-orange-200/90 font-lightish">Crontab Generator</h1>
      
      <div className="bg-white dark:bg-slate-900/50 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mb-8">
        
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Minute</label>
            <input 
              type="text" 
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-violet-500 font-mono shadow-inner text-center text-lg"
              placeholder="*"
            />
            <p className="text-xs text-slate-500 mt-2 text-center">0-59</p>
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Hour</label>
            <input 
              type="text" 
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-violet-500 font-mono shadow-inner text-center text-lg"
              placeholder="*"
            />
            <p className="text-xs text-slate-500 mt-2 text-center">0-23</p>
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Day (Month)</label>
            <input 
              type="text" 
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-violet-500 font-mono shadow-inner text-center text-lg"
              placeholder="*"
            />
            <p className="text-xs text-slate-500 mt-2 text-center">1-31</p>
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Month</label>
            <input 
              type="text" 
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-violet-500 font-mono shadow-inner text-center text-lg"
              placeholder="*"
            />
            <p className="text-xs text-slate-500 mt-2 text-center">1-12</p>
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Day (Week)</label>
            <input 
              type="text" 
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-violet-500 font-mono shadow-inner text-center text-lg"
              placeholder="*"
            />
            <p className="text-xs text-slate-500 mt-2 text-center">0-6 (0 is Sunday)</p>
          </div>
        </div>

        <div className="bg-slate-900 relative rounded-xl overflow-hidden border border-slate-800 shadow-xl group">
          <div className="flex items-center px-6 py-8">
             <span className="font-mono text-3xl sm:text-5xl text-violet-400 font-bold tracking-[0.2em]">{cronString}</span>
          </div>
          <button 
             onClick={handleCopy}
             className="absolute right-4 top-1/2 -translate-y-1/2 bg-violet-600 hover:bg-violet-500 text-white p-3 rounded-lg transition-colors focus:ring-2 focus:ring-violet-400 outline-none"
             title="Copy to clipboard"
          >
            {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
          </button>
        </div>

      </div>

      <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-slate-700/50 pb-2">Common Presets</h2>
        <div className="flex flex-wrap gap-2">
           {commonPresets.map((preset, i) => (
             <button 
               key={i}
               onClick={() => applyPreset(preset.value)}
               className="bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm transition-colors border border-slate-200 dark:border-slate-700"
             >
               {preset.label}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
}
