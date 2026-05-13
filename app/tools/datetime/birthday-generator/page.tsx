'use client';

import React, { useState } from 'react';
import { format, subYears, addDays, differenceInDays } from 'date-fns';

export default function RandomBirthdayGenerator() {
  const [mode, setMode] = useState<'age' | 'year'>('age');
  const [minAge, setMinAge] = useState('18');
  const [maxAge, setMaxAge] = useState('36');
  const [minYear, setMinYear] = useState('1980');
  const [maxYear, setMaxYear] = useState('2000');
  const [result, setResult] = useState<{ date: Date, age: number, isToday: boolean } | null>(null);

  const generateBirthday = () => {
    let startDate: Date;
    let endDate: Date;
    const today = new Date();

    if (mode === 'age') {
      const minA = parseInt(minAge, 10);
      const maxA = parseInt(maxAge, 10);
      
      if (isNaN(minA) || isNaN(maxA) || minA > maxA || minA < 0) return;

      // If maxAge is 36, they were born between today - 37 years + 1 day and today - 36 years
      // Minimum age 18: born between today - 19 years + 1 day and today - 18 years
      // So the range of birthdates is:
      // Oldest possible birthdate = today minus (maxAge + 1) years + 1 day
      // Youngest possible birthdate = today minus minAge years
      startDate = addDays(subYears(today, maxA + 1), 1);
      endDate = subYears(today, minA);
    } else {
      const minY = parseInt(minYear, 10);
      const maxY = parseInt(maxYear, 10);
      
      if (isNaN(minY) || isNaN(maxY) || minY > maxY) return;
      
      startDate = new Date(minY, 0, 1);
      endDate = new Date(maxY, 11, 31, 23, 59, 59);
    }

    // Ensure start is before end
    if (startDate > endDate) {
      const temp = startDate;
      startDate = endDate;
      endDate = temp;
    }

    const diffDays = differenceInDays(endDate, startDate);
    const randomDaysOff = Math.floor(Math.random() * (diffDays + 1));
    const generatedDate = addDays(startDate, randomDaysOff);
    
    // Calculate precise age
    let calcAge = today.getFullYear() - generatedDate.getFullYear();
    const m = today.getMonth() - generatedDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < generatedDate.getDate())) {
      calcAge--;
    }

    const isBirthdayToday = today.getMonth() === generatedDate.getMonth() && today.getDate() === generatedDate.getDate();

    setResult({
      date: generatedDate,
      age: Math.max(0, calcAge),
      isToday: isBirthdayToday
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-orange-200/90 font-lightish">Random Birthday Generator</h1>
      
      <div className="flex items-center gap-6 mb-8 text-slate-700 dark:text-slate-300">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="generationMode" 
            value="age" 
            checked={mode === 'age'} 
            onChange={() => setMode('age')}
            className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-600 dark:bg-slate-700"
          />
          <span className="text-lg">By age</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            name="generationMode" 
            value="year" 
            checked={mode === 'year'} 
            onChange={() => setMode('year')}
            className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-600 dark:bg-slate-700"
          />
          <span className="text-lg">By birth year</span>
        </label>
      </div>

      <div className="flex flex-wrap gap-6 mb-8">
        {mode === 'age' ? (
          <>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-slate-600 dark:text-slate-400 mb-2">Minimum Age:</label>
              <input 
                type="number" 
                value={minAge}
                onChange={(e) => setMinAge(e.target.value)}
                min="0"
                className="w-full bg-slate-100 dark:bg-slate-700/60 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-slate-600 dark:text-slate-400 mb-2">Maximum Age:</label>
              <input 
                type="number" 
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
                min="0"
                className="w-full bg-slate-100 dark:bg-slate-700/60 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-slate-600 dark:text-slate-400 mb-2">Start Year:</label>
              <input 
                type="number" 
                value={minYear}
                onChange={(e) => setMinYear(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-700/60 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-slate-600 dark:text-slate-400 mb-2">End Year:</label>
              <input 
                type="number" 
                value={maxYear}
                onChange={(e) => setMaxYear(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-700/60 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
          </>
        )}
      </div>

      <button 
        onClick={generateBirthday}
        className="bg-[#2563eb] hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-md active:scale-95"
      >
        Generate Date
      </button>

      {result && (
        <div className="mt-12 p-8 bg-blue-50 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 rounded-xl shadow-sm text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
          <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold mb-2">Generated Birthday</p>
          <div className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4 tracking-tight">
            {format(result.date, 'MMMM do, yyyy')}
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            This person would be <span className="font-semibold text-blue-600 dark:text-blue-400">{result.age} years old</span> today.
          </p>
          {result.isToday && (
            <p className="mt-4 text-emerald-600 dark:text-emerald-400 font-medium">
              🎉 It's their birthday today!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
