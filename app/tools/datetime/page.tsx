'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CalendarMinus, 
  Clock, 
  CalendarClock, 
  Cake, 
  Calculator, 
  Timer,
  CalendarPlus,
  History,
  ArrowRightLeft,
  Asterisk,
  History as UnixClock
} from 'lucide-react';
import { motion } from 'framer-motion';

const mainTools = [
  { name: 'Date Difference', path: '/tools/datetime/date-difference', icon: CalendarMinus, color: 'text-blue-500' },
  { name: 'Time Difference', path: '/tools/datetime/time-difference', icon: Clock, color: 'text-indigo-400' },
  { name: 'Date Time Difference', path: '/tools/datetime/datetime-difference', icon: CalendarClock, color: 'text-teal-400' },
  { name: 'Birthday Generator', path: '/tools/datetime/birthday-generator', icon: Cake, color: 'text-pink-500' },
  { name: 'Age Calculator', path: '/tools/datetime/age-calculator', icon: Calculator, color: 'text-orange-400' },
  { name: 'Hours and Minutes Calculator', path: '/tools/datetime/hours-minutes', icon: Timer, color: 'text-emerald-400' },
  { name: 'Future Date Calculator', path: '/tools/datetime/future-date', icon: CalendarPlus, color: 'text-purple-400' },
  { name: 'Past Date Calculator', path: '/tools/datetime/past-date', icon: History, color: 'text-sky-400' },
  { name: 'Time Converter', path: '/tools/datetime/time-converter', icon: ArrowRightLeft, color: 'text-blue-400' }
];

const devTools = [
  { name: 'Crontab Generator', path: '/tools/datetime/crontab', icon: Asterisk, color: 'text-violet-400' },
  { name: 'Unix Timestamp Converter', path: '/tools/datetime/unix-timestamp', icon: UnixClock, color: 'text-cyan-400' }
];

export default function DateTimeHub() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 font-sans text-slate-800 dark:text-slate-100">
      <h1 className="text-3xl font-bold mb-8 tracking-tight text-slate-900 dark:text-orange-200/90 font-lightish">Dates and Times Tools</h1>
      
      <div className="flex flex-wrap gap-4 mb-12">
        {mainTools.map((tool) => (
          <Link 
            key={tool.name} 
            href={tool.path}
            className="flex flex-col items-center justify-center p-6 bg-transparent rounded-xl border border-slate-300 dark:border-slate-700/60 hover:dark:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all shadow-sm w-[220px] h-[120px] group"
          >
            <tool.icon className={`w-8 h-8 mb-4 ${tool.color} group-hover:scale-110 transition-transform`} />
            <span className="text-sm font-medium text-center text-slate-700 dark:text-slate-200">{tool.name}</span>
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400">Devs</h2>
        <div className="h-px bg-slate-200 dark:bg-slate-800/80 flex-1 max-w-xs"></div>
      </div>

      <div className="flex flex-wrap gap-4">
        {devTools.map((tool) => (
          <Link 
            key={tool.name} 
            href={tool.path}
            className="flex flex-col items-center justify-center p-6 bg-transparent rounded-xl border border-slate-300 dark:border-slate-700/60 hover:dark:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all shadow-sm w-[220px] h-[120px] group"
          >
            <tool.icon className={`w-8 h-8 mb-4 ${tool.color} group-hover:scale-110 transition-transform`} />
            <span className="text-sm font-medium text-center text-slate-700 dark:text-slate-200">{tool.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
