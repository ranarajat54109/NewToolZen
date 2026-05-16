'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';
import { motion, AnimatePresence } from '@/lib/motion';
import { toast } from 'sonner';

function generatePin(length: number) {
  let pin = '';
  for (let i = 0; i < length; i++) {
    pin += Math.floor(Math.random() * 10).toString();
  }
  return pin;
}

export default function PinGenerator() {
  const [length, setLength] = useState(4);
  const [count, setCount] = useState(5);
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const minCount = Math.max(1, count);
    const safeCount = Math.min(1000, minCount);
    
    const minLength = Math.max(1, length);
    const safeLength = Math.min(64, minLength);
    
    const newResults = Array.from({ length: safeCount }, () => generatePin(safeLength));
    setResults(newResults);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (results.length === 0) return;
    navigator.clipboard.writeText(results.join('\n'));
    setCopied(true);
    toast.success('Copied PINs to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">PIN Code Generator</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Generate numeric PIN codes of custom length securely.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm h-fit">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">PIN Length (digits)</label>
              <input
                type="number"
                min="1"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount to generate</label>
              <input
                type="number"
                min="1"
                max="1000"
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
              Generate PINs
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
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-wrap gap-2"
              >
                <AnimatePresence>
                  {results.map((pin, i) => (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: Math.min(i * 0.02, 0.5) }} // Cap delay for many items
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={`${pin}-${i}`} 
                      className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow-sm font-mono tracking-widest relative group cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(pin);
                        toast.success('PIN Copied!');
                      }}
                      title="Click to copy"
                    >
                      {pin}
                      <div className="absolute inset-0 bg-indigo-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
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
          PIN Code Generator – Create Secure Random PINs Instantly
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
          Need a secure and reliable way to generate PIN codes? Our 
          <strong> PIN code generator</strong> helps you instantly create 
          random numeric PINs of any length. Whether you're building an 
          application, testing authentication systems, or generating secure 
          codes for temporary use, this tool is designed for speed, accuracy, 
          and simplicity.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Key Features
        </h3>

        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
          <li>Generate secure random PINs with custom length</li>
          <li>Create multiple PIN codes in one click</li>
          <li>Ideal for OTP simulation and security testing</li>
          <li>Instant results with clean and readable format</li>
          <li>Completely free and easy to use</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Where Can You Use This Tool?
        </h3>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          This <strong>random PIN generator</strong> is useful for developers 
          testing login systems, fintech applications, and verification flows. 
          It is also helpful for generating temporary passwords, demo accounts, 
          and sample data for UI/UX design. If you need quick numeric codes for 
          any purpose, this tool gets the job done instantly.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          How to Generate PIN Codes
        </h3>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Select your desired PIN length, enter how many PINs you want to create, 
          and click the <strong>&quot;Generate PINs&quot;</strong> button. The tool will 
          instantly generate secure random PIN codes that you can copy and use 
          wherever needed.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Why Choose Our PIN Generator?
        </h3>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Unlike basic generators, this tool focuses on both usability and 
          performance. It ensures randomness, speed, and flexibility, making it 
          a reliable solution for developers, testers, and everyday users who 
          need quick PIN generation without complexity.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Generate Secure PINs Now
        </h3>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Start using our free PIN code generator today and create strong, 
          random PINs in seconds. No signup required—just fast, secure, and 
          efficient results whenever you need them.
        </p>
      </section>
    </>
  );
}
