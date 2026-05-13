'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

function generateRandomCpf(format: boolean) {
  const randomDigit = () => Math.floor(Math.random() * 9);
  const n = Array.from({ length: 9 }, randomDigit);

  let d1 = n[0] * 10 + n[1] * 9 + n[2] * 8 + n[3] * 7 + n[4] * 6 + n[5] * 5 + n[6] * 4 + n[7] * 3 + n[8] * 2;
  d1 = 11 - (d1 % 11);
  if (d1 >= 10) d1 = 0;
  n.push(d1);

  let d2 = n[0] * 11 + n[1] * 10 + n[2] * 9 + n[3] * 8 + n[4] * 7 + n[5] * 6 + n[6] * 5 + n[7] * 4 + n[8] * 3 + n[9] * 2;
  d2 = 11 - (d2 % 11);
  if (d2 >= 10) d2 = 0;
  n.push(d2);

  const raw = n.join('');
  if (!format) return raw;
  return `${raw.substring(0, 3)}.${raw.substring(3, 6)}.${raw.substring(6, 9)}-${raw.substring(9, 11)}`;
}

export default function CpfGenerator() {
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState(true);
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const minCount = Math.max(1, count);
    const safeCount = Math.min(100, minCount);
    
    const newResults = Array.from({ length: safeCount }, () => generateRandomCpf(format));
    setResults(newResults);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (results.length === 0) return;
    navigator.clipboard.writeText(results.join('\n'));
    setCopied(true);
    toast.success('Copied CPFs to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">CPF Generator</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Generate valid Brazilian CPF numbers for testing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm h-fit">
          <div className="space-y-6">
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

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="format-toggle"
                checked={format}
                onChange={(e) => setFormat(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-900"
              />
              <label htmlFor="format-toggle" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Apply formatting (XXX.XXX.XXX-XX)
              </label>
            </div>

            <button
              onClick={generate}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              <RefreshCw className="h-5 w-5" />
              Generate CPF
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
                <AnimatePresence>
                  {results.map((cpf, i) => (
                    <motion.li 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={`${cpf}-${i}`} 
                      className="px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow-sm flex items-center justify-between group font-mono"
                    >
                      <span>{cpf}</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(cpf);
                          toast.success('Copied!');
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Copy CPF"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            ) : (
              <div className="h-full min-h-[200px] flex items-center justify-center text-slate-400 dark:text-slate-500">
                Click generate to see results
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="mt-16 max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-4 text-slate-900 dark:text-white">
          CPF Generator – Generate Valid Brazilian CPF Numbers
        </h2>
      
        <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Looking for a quick way to generate valid Brazilian CPF numbers? Our free 
          <strong> CPF generator</strong> helps you instantly create realistic and 
          properly formatted CPF numbers for testing and development purposes. 
          This tool is ideal for developers, QA engineers, and designers who need 
          reliable sample data.
        </p>
      
        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Why Use This CPF Generator?
        </h3>
      
        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-2">
          <li>Generate valid CPF numbers with correct check digits</li>
          <li>Supports formatted and unformatted output</li>
          <li>Perfect for testing forms and validation systems</li>
          <li>Fast, simple, and completely free to use</li>
          <li>No signup or registration required</li>
        </ul>
      
        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Common Use Cases
        </h3>
      
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          This <strong>random CPF generator</strong> is commonly used by developers 
          building Brazilian applications, QA teams testing input validation, and 
          designers creating realistic UI mockups. It is especially helpful when 
          working with systems that require valid CPF numbers.
        </p>
      
        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          How It Works
        </h3>
      
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Enter the number of CPF values you want to generate and click the 
          <strong>&quot;Generate CPF&quot;</strong> button. The tool instantly creates valid 
          CPF numbers following official rules, including proper check digit 
          calculations.
        </p>
      
        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Important Note
        </h3>
      
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          The generated CPF numbers are for testing and development purposes only. 
          They do not belong to real individuals and should not be used for any 
          legal or official activities.
        </p>
      
        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Start Generating CPF Numbers Now
        </h3>
      
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Use this free CPF generator to create valid numbers instantly and improve 
          your testing workflow. It&apos;s fast, accurate, and designed for real-world 
          development needs.
        </p>
      </section>
    </div>
  );
}
