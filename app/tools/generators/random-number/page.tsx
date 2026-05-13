'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function RandomNumberGenerator() {
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(60);
  const [count, setCount] = useState<number>(6);
  const [sorting, setSorting] = useState<'Random' | 'Ascending' | 'Descending'>('Random');
  const [allowRepetition, setAllowRepetition] = useState<boolean>(false);
  const [results, setResults] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const minVal = Math.ceil(min);
    const maxVal = Math.floor(max);
    if (minVal > maxVal) {
      toast.error('Minimum value cannot be greater than maximum value.');
      return;
    }

    if (!allowRepetition && count > (maxVal - minVal + 1)) {
      toast.error('Cannot generate that many unique numbers in this range.');
      return;
    }

    let generatedNumbers: number[] = [];

    if (!allowRepetition) {
      const candidates = Array.from({ length: maxVal - minVal + 1 }, (_, i) => i + minVal);
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * candidates.length);
        generatedNumbers.push(candidates[randomIndex]);
        candidates.splice(randomIndex, 1);
      }
    } else {
      for (let i = 0; i < count; i++) {
        generatedNumbers.push(Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal);
      }
    }

    if (sorting === 'Ascending') {
      generatedNumbers.sort((a, b) => a - b);
    } else if (sorting === 'Descending') {
      generatedNumbers.sort((a, b) => b - a);
    }

    setResults(generatedNumbers);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (results.length === 0) return;
    navigator.clipboard.writeText(results.join(', '));
    setCopied(true);
    toast.success('Copied numbers to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Random Number Generator</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Generate multiple random numbers within a customized range.</p>
      </div>

      <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 lg:p-8 shadow-sm">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Minimum Value:</label>
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Maximum Value:</label>
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Quantity to Generate:</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Sorting:</label>
              <select
                value={sorting}
                onChange={(e) => setSorting(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="Random">Random</option>
                <option value="Ascending">Ascending</option>
                <option value="Descending">Descending</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={allowRepetition} onChange={(e) => setAllowRepetition(e.target.checked)} className="peer sr-only" />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 relative"></div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Allow Number Repetition</span>
            </label>
          </div>

          <button
            onClick={generate}
            className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500 flex items-center justify-center gap-2 mt-4"
          >
            <RefreshCw className="h-5 w-5" />
            Generate Numbers
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Results</h3>
          {results.length > 0 && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy all'}
            </button>
          )}
        </div>

        <div className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 min-h-[150px] overflow-y-auto max-h-[400px] scrollbar-thin">
          {results.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap gap-3"
            >
              {results.map((num, i) => (
                <span key={i} className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-lg font-mono shadow-sm">
                  {num}
                </span>
              ))}
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
              Click generate to see results
            </div>
          )}
        </div>
      </div>

      <section className="mt-12 space-y-8">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            Random Number Generator
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Random Number Generator Online
          </h2>
          <p className="max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
            Generate random numbers instantly with a simple, flexible tool made
            for everyday use. Set your minimum and maximum values, choose how
            many numbers you want, and control whether repeated numbers are
            allowed. It is a fast way to create random integers for games,
            classroom activities, testing, sample data, and quick decisions.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Why use this random number generator?
            </h3>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
              This online random number generator is built for users who want a
              clean, reliable, and easy-to-use number picker without installing
              anything. It helps you generate one value or multiple values at
              once, making it useful for teachers, students, developers,
              organizers, and anyone who needs a quick random number generator
              online.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              What you can do
            </h3>
            <ul className="mt-3 space-y-3 leading-7 text-slate-600 dark:text-slate-400">
              <li>• Generate random numbers within any custom range.</li>
              <li>• Choose the quantity of numbers to create.</li>
              <li>• Allow or block repeated values.</li>
              <li>• Sort results randomly or in ascending order.</li>
              <li>• Use it instantly in your browser with no signup.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            Perfect for everyday use
          </h3>
          <p className="mt-3 max-w-4xl leading-7 text-slate-600 dark:text-slate-400">
            Use this random number tool for classroom exercises, team selection,
            game setup, coding tests, practice problems, and sample data
            generation. If you need a simple random integer generator with
            custom range options, this tool gives you a fast and accurate
            experience in a clean interface.
          </p>

          <div className="mt-6 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 p-4">

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {['random number generator', 'random number generator online', 'generate random numbers', 'random integer generator', 'number picker', 'custom range random numbers', 'online number generator'].join(', ')}.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
