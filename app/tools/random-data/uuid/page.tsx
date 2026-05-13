'use client';

import { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function UUIDGenerator() {
  const [uuid, setUuid] = useState('');
  const [version, setVersion] = useState('v4');
  const [copied, setCopied] = useState(false);

  const generateUUID = () => {
    // Generate UUID v4
    const newUuid = crypto.randomUUID();
    setUuid(newUuid);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (!uuid) return;
    navigator.clipboard.writeText(uuid);
    setCopied(true);
    toast.success('UUID copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">UUID Generator</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Generate universally unique identifiers (UUID).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm h-fit">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Version:</label>
              <select
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="v4">UUID v4 (Random)</option>
              </select>
            </div>

            <button
              onClick={generateUUID}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500 mt-4"
            >
              <RefreshCw className="h-5 w-5" />
              Generate UUID
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Generated UUID</h3>
            {uuid && (
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
             {uuid ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full text-center text-[min(4vw,1.35rem)] md:text-xl font-mono text-slate-900 dark:text-white tracking-wide break-all"
                >
                  {uuid}
                </motion.div>
             ) : (
                <div className="text-slate-400 dark:text-slate-500">
                  Click generate to see UUID
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
