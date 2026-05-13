'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Clock, CalendarDays, Calculator } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function UnixTimestampConverter() {
  const [mounted, setMounted] = useState(false);
  const [currentSec, setCurrentSec] = useState(0);
  const [currentMs, setCurrentMs] = useState(0);

  // Timestamp to Date
  const [tsInput, setTsInput] = useState('');
  const [tsDate, setTsDate] = useState<Date | null>(null);
  const [timezone, setTimezone] = useState('');
  const [timezones, setTimezones] = useState<string[]>([]);

  useEffect(() => {
    try {
      setTimezones(Intl.supportedValuesOf('timeZone'));
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch(e) {}
  }, []);

  // Date to Timestamp
  const [dtYear, setDtYear] = useState('');
  const [dtMonth, setDtMonth] = useState('');
  const [dtDay, setDtDay] = useState('');
  const [dtHour, setDtHour] = useState('');
  const [dtMin, setDtMin] = useState('');
  const [dtSec, setDtSec] = useState('');
  
  const [dtResultSec, setDtResultSec] = useState<number | null>(null);
  const [dtResultMs, setDtResultMs] = useState<number | null>(null);

  // Timestamp Calculator
  const [calcBase, setCalcBase] = useState('');
  const [calcBaseMode, setCalcBaseMode] = useState<'sec'|'ms'>('sec');
  const [calcDay, setCalcDay] = useState('0');
  const [calcHr, setCalcHr] = useState('0');
  const [calcMin, setCalcMin] = useState('0');
  const [calcSec, setCalcSec] = useState('0');
  
  const [calcResultMs, setCalcResultMs] = useState<number | null>(null);

  // Live timer
  useEffect(() => {
    setMounted(true);
    const msInit = Date.now();
    setCurrentMs(msInit);
    setCurrentSec(Math.floor(msInit / 1000));

    const now = new Date();
    setDtYear(now.getFullYear().toString());
    setDtMonth((now.getMonth() + 1).toString());
    setDtDay(now.getDate().toString());
    setDtHour(now.getHours().toString());
    setDtMin(now.getMinutes().toString());
    setDtSec(now.getSeconds().toString());

    const timer = setInterval(() => {
      const ms = Date.now();
      setCurrentMs(ms);
      setCurrentSec(Math.floor(ms / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // TS Input parser
  useEffect(() => {
    if (!tsInput) {
      setTsDate(null);
      return;
    }
    const val = parseInt(tsInput, 10);
    if (isNaN(val)) {
      setTsDate(null);
      return;
    }
    const isMs = val > 100000000000; // rough heuristic
    setTsDate(new Date(isMs ? val : val * 1000));
  }, [tsInput]);

  // DT parser
  useEffect(() => {
    const y = parseInt(dtYear, 10);
    const m = parseInt(dtMonth, 10) - 1;
    const d = parseInt(dtDay, 10);
    const hr = parseInt(dtHour, 10);
    const min = parseInt(dtMin, 10);
    const sec = parseInt(dtSec, 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d) && !isNaN(hr) && !isNaN(min) && !isNaN(sec)) {
      const date = new Date(y, m, d, hr, min, sec);
      const ms = date.getTime();
      setDtResultMs(ms);
      setDtResultSec(Math.floor(ms / 1000));
    } else {
      setDtResultMs(null);
      setDtResultSec(null);
    }
  }, [dtYear, dtMonth, dtDay, dtHour, dtMin, dtSec]);

  // Calc Engine
  useEffect(() => {
    if (!calcBase) {
      setCalcResultMs(null);
      return;
    }
    const base = parseInt(calcBase, 10);
    if (isNaN(base)) return;
    
    const isMs = base > 100000000000;
    setCalcBaseMode(isMs ? 'ms' : 'sec');
    const startMs = isMs ? base : base * 1000;
    
    const d = parseInt(calcDay, 10) || 0;
    const h = parseInt(calcHr, 10) || 0;
    const m = parseInt(calcMin, 10) || 0;
    const s = parseInt(calcSec, 10) || 0;

    const shiftMs = (d * 86400000) + (h * 3600000) + (m * 60000) + (s * 1000);
    setCalcResultMs(startMs + shiftMs);
  }, [calcBase, calcDay, calcHr, calcMin, calcSec]);

  const copyToClipboard = (text: string | number) => {
    navigator.clipboard.writeText(text.toString());
    toast.success('Copied to clipboard');
  };

  const formatWithTimezone = (dateStr: Date | null, tz: string) => {
    if (!dateStr || !tz) return '---';
    try {
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: tz,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'shortOffset'
      });
      return formatter.format(dateStr);
    } catch {
      return '---';
    }
  };

  const tsUnitMode = tsInput && parseInt(tsInput, 10) > 100000000000 ? 'MILLISECONDS' : 'SECONDS';

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 font-sans text-slate-800 dark:text-slate-200">
      <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-orange-200/90 font-lightish">Unix Timestamp Converter</h1>
      
      {/* Current Epoch Panels */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6 relative flex flex-col items-center shadow-md">
          <div className="absolute top-0 left-6 -translate-y-1/2 bg-blue-50 dark:bg-slate-900 px-3 py-0.5 rounded-full border border-blue-200 dark:border-blue-900 text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase">
            Current Epoch (Seconds)
          </div>
          <div className="text-4xl text-slate-900 dark:text-white font-mono mt-4 mb-4 tracking-wider">{mounted ? currentSec : '...'}</div>
          <button onClick={() => copyToClipboard(currentSec)} className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium rounded-md transition-colors text-slate-700 dark:text-slate-300">
            Copy
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6 relative flex flex-col items-center shadow-md">
          <div className="absolute top-0 left-6 -translate-y-1/2 bg-blue-50 dark:bg-slate-900 px-3 py-0.5 rounded-full border border-blue-200 dark:border-blue-900 text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase">
            Current Epoch (Milliseconds)
          </div>
          <div className="text-4xl text-slate-900 dark:text-white font-mono mt-4 mb-4 tracking-wider">{mounted ? currentMs : '...'}</div>
          <button onClick={() => copyToClipboard(currentMs)} className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium rounded-md transition-colors text-slate-700 dark:text-slate-300">
            Copy
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Timestamp to Date */}
        <section className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5" /> Timestamp to Date
            </h2>

            <div className="flex flex-wrap gap-4 items-start max-w-md mb-6">
              <div className="flex-1 min-w-[240px]">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Enter Unix Timestamp</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={tsInput} onChange={(e) => setTsInput(e.target.value)}
                    className="w-full font-mono bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg py-2.5 px-4 outline-none focus:border-blue-500 dark:focus:border-blue-500"
                  />
                  <button className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium px-4 rounded-lg border border-slate-300 dark:border-slate-600 transition-colors whitespace-nowrap">
                    Share URL
                  </button>
                </div>
                {tsInput && <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold tracking-widest mt-2 uppercase">DETECTED UNIT: {tsUnitMode}</p>}
              </div>
            </div>

            <div className="max-w-[240px]">
               <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Timezone</label>
               <select 
                 value={timezone} 
                 onChange={(e) => setTimezone(e.target.value)}
                 className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg py-2.5 px-4 outline-none focus:border-blue-500 dark:focus:border-blue-500 cursor-pointer"
               >
                 {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
               </select>
            </div>
            
            <div className="mt-8 grid md:grid-cols-2 gap-x-8 gap-y-8">
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-orange-200/90 mb-2">GMT / UTC:</p>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-800 dark:text-slate-200 text-lg">{tsDate ? tsDate.toUTCString() : '---'}</span>
                  {tsDate && <button onClick={() => copyToClipboard(tsDate.toUTCString())}>
                    <Copy className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" />
                  </button>}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-orange-200/90 mb-2">Your Local Time:</p>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-800 dark:text-slate-200 text-lg">{tsDate ? tsDate.toLocaleString() : '---'}</span>
                  {tsDate && <button onClick={() => copyToClipboard(tsDate.toLocaleString())}>
                    <Copy className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" />
                  </button>}
                </div>
              </div>
              
              {timezone && (
                <div>
                  <p className="text-sm font-bold text-slate-700 dark:text-orange-200/90 mb-2">{timezone}:</p>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-800 dark:text-slate-200 text-lg">{formatWithTimezone(tsDate, timezone)}</span>
                    {tsDate && <button onClick={() => copyToClipboard(formatWithTimezone(tsDate, timezone))}>
                      <Copy className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" />
                    </button>}
                  </div>
                </div>
              )}
              
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-orange-200/90 mb-2">ISO 8601:</p>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-800 dark:text-slate-200 text-lg">{tsDate ? tsDate.toISOString() : '---'}</span>
                  {tsDate && <button onClick={() => copyToClipboard(tsDate.toISOString())}>
                    <Copy className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" />
                  </button>}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-orange-200/90 mb-2">SQL / MySQL (UTC):</p>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-800 dark:text-slate-200 text-lg">{tsDate ? tsDate.toISOString().replace('T', ' ').slice(0, 19) : '---'}</span>
                  {tsDate && <button onClick={() => copyToClipboard(tsDate.toISOString().replace('T', ' ').slice(0, 19))}>
                    <Copy className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" />
                  </button>}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-orange-200/90 mb-2">Relative:</p>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-600 dark:text-slate-400 italic text-lg">{tsDate ? formatDistanceToNow(tsDate, { addSuffix: true }) : '---'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Date to Timestamp */}
        <section className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
              <CalendarDays className="w-5 h-5" /> Date to Timestamp
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-8">
              <div className="flex-1 min-w-[70px]">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-widest">YEAR</label>
                <input type="number" value={dtYear} onChange={e => setDtYear(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded text-center py-2.5 text-sm focus:border-blue-500 outline-none" />
              </div>
              <div className="flex-1 min-w-[60px]">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-widest">MONTH</label>
                <input type="number" value={dtMonth} onChange={e => setDtMonth(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded text-center py-2.5 text-sm focus:border-blue-500 outline-none" />
              </div>
              <div className="flex-1 min-w-[60px]">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-widest">DAY</label>
                <input type="number" value={dtDay} onChange={e => setDtDay(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded text-center py-2.5 text-sm focus:border-blue-500 outline-none" />
              </div>
              <div className="flex-1 min-w-[60px]">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-widest">HR</label>
                <input type="number" value={dtHour} onChange={e => setDtHour(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded text-center py-2.5 text-sm focus:border-blue-500 outline-none" />
              </div>
              <div className="flex-1 min-w-[60px]">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-widest">MIN</label>
                <input type="number" value={dtMin} onChange={e => setDtMin(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded text-center py-2.5 text-sm focus:border-blue-500 outline-none" />
              </div>
              <div className="flex-1 min-w-[60px]">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-widest">SEC</label>
                <input type="number" value={dtSec} onChange={e => setDtSec(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded text-center py-2.5 text-sm focus:border-blue-500 outline-none" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-orange-200/90 mb-2">Unix Timestamp (s):</p>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-emerald-600 dark:text-[#34d399] tracking-wider text-xl">{dtResultSec || '---'}</span>
                  {dtResultSec && <button onClick={() => copyToClipboard(dtResultSec)}>
                    <Copy className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" />
                  </button>}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-orange-200/90 mb-2">Unix Timestamp (ms):</p>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-emerald-600 dark:text-[#34d399] tracking-wider text-xl">{dtResultMs || '---'}</span>
                  {dtResultMs && <button onClick={() => copyToClipboard(dtResultMs)}>
                    <Copy className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" />
                  </button>}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timestamp Calculator */}
        <section className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <Calculator className="w-5 h-5" /> Timestamp Calculator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Add or subtract time from any timestamp. Use negative values to go back in time.</p>
            
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-widest">Base Timestamp</label>
              <div className="flex flex-wrap gap-2">
                <input 
                  type="text" value={calcBase} onChange={(e) => setCalcBase(e.target.value)}
                  className="w-full max-w-md bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg py-2.5 px-4 outline-none focus:border-blue-500 font-mono"
                />
                <button onClick={() => setCalcBase(Math.floor(Date.now() / 1000).toString())} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 rounded-lg transition-colors whitespace-nowrap">
                  Use Now
                </button>
              </div>
              {calcBase && <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold tracking-widest mt-2 uppercase">DETECTED UNIT: {calcBaseMode === 'sec' ? 'SECONDS' : 'MILLISECONDS'}</p>}
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              <div className="flex-1 min-w-[70px]">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-widest">DAY</label>
                <input type="number" value={calcDay} onChange={e => setCalcDay(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded text-center py-2.5 text-sm outline-none focus:border-blue-500" />
              </div>
              <div className="flex-1 min-w-[60px]">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-widest">HR</label>
                <input type="number" value={calcHr} onChange={e => setCalcHr(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded text-center py-2.5 text-sm outline-none focus:border-blue-500" />
              </div>
              <div className="flex-1 min-w-[60px]">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-widest">MIN</label>
                <input type="number" value={calcMin} onChange={e => setCalcMin(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded text-center py-2.5 text-sm outline-none focus:border-blue-500" />
              </div>
              <div className="flex-1 min-w-[60px]">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-widest">SEC</label>
                <input type="number" value={calcSec} onChange={e => setCalcSec(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded text-center py-2.5 text-sm outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-orange-200/90 mb-2">Unix Timestamp (s):</p>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-purple-600 dark:text-[#a78bfa] tracking-wider text-xl">{calcResultMs ? Math.floor(calcResultMs / 1000) : '---'}</span>
                  {calcResultMs && <button onClick={() => copyToClipboard(Math.floor(calcResultMs / 1000))}>
                    <Copy className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" />
                  </button>}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-orange-200/90 mb-2">Unix Timestamp (ms):</p>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-purple-600 dark:text-[#a78bfa] tracking-wider text-xl">{calcResultMs || '---'}</span>
                  {calcResultMs && <button onClick={() => copyToClipboard(calcResultMs)}>
                    <Copy className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" />
                  </button>}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-orange-200/90 mb-2">GMT / UTC:</p>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-800 dark:text-slate-200 text-lg">{calcResultMs ? new Date(calcResultMs).toUTCString() : '---'}</span>
                  {calcResultMs && <button onClick={() => copyToClipboard(new Date(calcResultMs).toUTCString())}>
                    <Copy className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" />
                  </button>}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-orange-200/90 mb-2">ISO 8601:</p>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-800 dark:text-slate-200 text-lg">{calcResultMs ? new Date(calcResultMs).toISOString() : '---'}</span>
                  {calcResultMs && <button onClick={() => copyToClipboard(new Date(calcResultMs).toISOString())}>
                    <Copy className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" />
                  </button>}
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
