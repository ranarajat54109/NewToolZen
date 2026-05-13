'use client';

import React, { useState, useEffect } from 'react';
import { differenceInYears, differenceInMonths, differenceInWeeks, differenceInDays, addYears, addMonths } from 'date-fns';

export default function AgeCalculator() {
  const [birthday, setBirthday] = useState('');
  const [ageStrings, setAgeStrings] = useState<{ main: string[], others: string[] } | null>(null);

  useEffect(() => {
    if (!birthday) {
      setAgeStrings(null);
      return;
    }

    const birthDate = new Date(birthday);
    const today = new Date();

    if (isNaN(birthDate.getTime()) || birthDate > today) {
      setAgeStrings(null);
      return;
    }

    // Main age string (Years, Months, Days)
    let years = differenceInYears(today, birthDate);
    const afterYears = addYears(birthDate, years);
    
    let months = differenceInMonths(today, afterYears);
    const afterMonths = addMonths(afterYears, months);
    
    let days = differenceInDays(today, afterMonths);

    // Some approximation to Weeks if days >= 7 and user interface implies months & weeks & days
    // Wait, the screenshot shows "2 months 2 weeks" and "or 10 weeks or 73 days"
    const totalDays = differenceInDays(today, birthDate);
    const totalWeeks = differenceInWeeks(today, birthDate);
    const totalMonths = differenceInMonths(today, birthDate);

    // To get strictly "2 months 2 weeks" we calculate total elapsed weeks minus total elapsed months in weeks approx?
    // Actually, let's keep the standard exact age: X years, Y months, Z days. Then the "or... X months, Y weeks, Z days"
    
    const mainParts = [];
    if (years > 0) mainParts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
    if (months > 0) mainParts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
    
    // Convert remaining days into weeks and days
    const remainderWeeks = Math.floor(days / 7);
    const remainderDays = days % 7;
    
    if (remainderWeeks > 0) mainParts.push(`${remainderWeeks} ${remainderWeeks === 1 ? 'week' : 'weeks'}`);
    if (remainderDays > 0) mainParts.push(`${remainderDays} ${remainderDays === 1 ? 'day' : 'days'}`);
    
    // If it's literally today
    if (mainParts.length === 0) mainParts.push('0 days');

    const others = [];
    if (totalMonths > 0) others.push(`or ${totalMonths} months ${days} days`);
    if (totalWeeks > 0) others.push(`or ${totalWeeks} weeks ${totalDays % 7} days`);
    others.push(`or ${totalDays} days`);

    setAgeStrings({
      main: mainParts,
      others: others
    });

  }, [birthday]);

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-orange-200/90 font-lightish">Age Calculator</h1>
      
      <div className="mb-8">
        <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">Birthday:</label>
        <div className="relative max-w-xs">
          <input 
            type="date" 
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-700/60 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm appearance-none"
          />
        </div>
      </div>

      {ageStrings && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <span className="block text-sm text-slate-600 dark:text-slate-400 mb-3">Age:</span>
            <div className="flex flex-wrap gap-2">
              {ageStrings.main.map((part, i) => (
                <div key={i} className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/80 dark:text-indigo-200 px-4 py-2 rounded-md font-semibold text-lg shadow-sm">
                  {part}
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-sm text-slate-500 dark:text-slate-500 mb-3">or...</span>
            <div className="flex flex-wrap gap-2">
              {ageStrings.others.map((part, i) => (
                <div key={i} className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 px-4 py-2 rounded-md font-medium shadow-sm">
                  {part.replace('or ', 'or ')}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
