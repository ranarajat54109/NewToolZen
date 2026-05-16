'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';
import { motion } from '@/lib/motion';
import { toast } from 'sonner';

export default function BirthdayGenerator() {
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(65);
  const [count, setCount] = useState(5);
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const minHDate = new Date();
    const maxHDate = new Date();
    
    // minAge means max year, maxAge means min year
    minHDate.setFullYear(minHDate.getFullYear() - maxAge);
    maxHDate.setFullYear(maxHDate.getFullYear() - minAge);

    const minTime = minHDate.getTime();
    const maxTime = maxHDate.getTime();

    if (minTime > maxTime) return;

    const newResults = Array.from({ length: count }, () => {
      const randomTime = Math.random() * (maxTime - minTime) + minTime;
      const date = new Date(randomTime);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    });
    setResults(newResults);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (results.length === 0) return;
    navigator.clipboard.writeText(results.join('\n'));
    setCopied(true);
    toast.success('Copied birth dates to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Birthday Generator</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Generate random birth dates within a specific age range.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm h-fit">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Min Age (Years)</label>
                <input
                  type="number"
                  value={minAge}
                  onChange={(e) => setMinAge(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Max Age (Years)</label>
                <input
                  type="number"
                  value={maxAge}
                  onChange={(e) => setMaxAge(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount to generate</label>
              <input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white"
              />
            </div>

            <button
              onClick={generate}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              <RefreshCw className="h-5 w-5" />
              Generate Dates
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Results</h3>
            {results.length > 0 && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy all'}
              </button>
            )}
          </div>
          
          <div className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-4 overflow-y-auto max-h-[500px] scrollbar-thin">
            {results.length > 0 ? (
              <motion.ul 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                {results.map((date, i) => (
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={i} 
                    className="px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow-sm flex items-center justify-between group"
                  >
                    <span>{date}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(date)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <div className="h-full min-h-[200px] flex items-center justify-center text-slate-400 dark:text-slate-500">
                Click generate to see results
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

      <section className="mt-16 max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-4 text-slate-900 dark:text-white">
          Birthday Generator – Generate Random Dates of Birth by Age
        </h2>

        <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Need to generate random birth dates quickly? Our free{" "}
          <strong> birthday generator</strong> helps you create realistic dates of birth 
          based on a selected age range. This tool is perfect for developers, testers, 
          designers, and anyone who needs accurate sample data for projects or testing.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Why Use This Birthday Generator?
        </h3>

        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-2">
          <li>Generate random dates of birth within a specific age range</li>
          <li>Ideal for testing applications and generating dummy data</li>
          <li>Fast, simple, and completely free to use</li>
          <li>No signup or login required</li>
          <li>Instant results with accurate age calculation</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Common Use Cases
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          This <strong>random birthday generator</strong> is widely used by developers 
          for creating test users, by QA teams for validating age-based features, and 
          by designers for mock UI data. It is also useful for students and researchers 
          who need sample datasets for projects.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          How It Works
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Simply enter the minimum and maximum age, choose how many dates you want 
          to generate, and click the <strong>&quot;Generate Dates&quot;</strong> button. The tool 
          will instantly create random and realistic birth dates that match your 
          selected age range.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Start Generating Birth Dates Now
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Use this free tool to generate random dates of birth for testing, 
          development, or creative purposes. It’s designed to be fast, accurate, 
          and easy to use for everyone.
        </p>
      </section>
    </>
  );
}
