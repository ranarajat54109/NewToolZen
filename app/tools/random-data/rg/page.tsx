'use client';

import { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { motion } from '@/lib/motion';
import { toast } from 'sonner';

export default function RGGenerator() {
  const [rg, setRg] = useState('');
  const [copied, setCopied] = useState(false);
  const [formatted, setFormatted] = useState(true);

  const generateRG = () => {
    // Basic mock logic for RG (Brazilian ID)
    // Format: XX.XXX.XXX-X
    const n = () => Math.floor(Math.random() * 10);
    const raw = `${n()}${n()}${n()}${n()}${n()}${n()}${n()}${n()}${n()}`;
    
    if (formatted) {
      setRg(`${raw.slice(0, 2)}.${raw.slice(2, 5)}.${raw.slice(5, 8)}-${raw.slice(8, 9)}`);
    } else {
      setRg(raw);
    }
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (!rg) return;
    navigator.clipboard.writeText(rg);
    setCopied(true);
    toast.success('RG copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">RG Generator</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Generate fictitious Brazilian RG (Registro Geral) numbers for testing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="space-y-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={formatted} onChange={(e) => setFormatted(e.target.checked)} className="peer sr-only" />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 relative"></div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Apply Punctuation formatting (XX.XXX.XXX-X)</span>
            </label>

            <button
              onClick={generateRG}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500 mt-4"
            >
              <RefreshCw className="h-5 w-5" />
              Generate RG
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Generated RG</h3>
            {rg && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          
          <div className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex items-center justify-center">
             {rg ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full text-center font-mono text-3xl text-slate-900 dark:text-white tracking-wider"
                >
                  {rg}
                </motion.div>
             ) : (
                <div className="text-slate-400 dark:text-slate-500">
                  Click generate to see RG
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
