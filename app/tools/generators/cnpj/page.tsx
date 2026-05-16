'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';
import { motion } from '@/lib/motion';
import { toast } from 'sonner';

function generateRandomCnpj(format: boolean) {
  const randomDigit = () => Math.floor(Math.random() * 9);
  const n = Array.from({ length: 8 }, randomDigit);
  n.push(0, 0, 0, 1);

  let d1 = n[11] * 2 + n[10] * 3 + n[9] * 4 + n[8] * 5 + n[7] * 6 + n[6] * 7 + n[5] * 8 + n[4] * 9 + n[3] * 2 + n[2] * 3 + n[1] * 4 + n[0] * 5;
  d1 = 11 - (d1 % 11);
  if (d1 >= 10) d1 = 0;
  n.push(d1);

  let d2 = n[12] * 2 + n[11] * 3 + n[10] * 4 + n[9] * 5 + n[8] * 6 + n[7] * 7 + n[6] * 8 + n[5] * 9 + n[4] * 2 + n[3] * 3 + n[2] * 4 + n[1] * 5 + n[0] * 6;
  d2 = 11 - (d2 % 11);
  if (d2 >= 10) d2 = 0;
  n.push(d2);

  const raw = n.join('');
  if (!format) return raw;
  return `${raw.substring(0, 2)}.${raw.substring(2, 5)}.${raw.substring(5, 8)}/${raw.substring(8, 12)}-${raw.substring(12, 14)}`;
}

export default function CnpjGenerator() {
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState(true);
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const newResults = Array.from({ length: count }, () => generateRandomCnpj(format));
    setResults(newResults);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (results.length === 0) return;
    navigator.clipboard.writeText(results.join('\n'));
    setCopied(true);
    toast.success('Copied CNPJs to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">CNPJ Generator</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Generate valid Brazilian CNPJ numbers for testing purposes.</p>
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
                Apply formatting (XX.XXX.XXX/0001-XX)
              </label>
            </div>

            <button
              onClick={generate}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              <RefreshCw className="h-5 w-5" />
              Generate CNPJ
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
                {results.map((cnpj, i) => (
                  <motion.li 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    key={i} 
                    className="px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow-sm flex items-center justify-between group font-mono"
                  >
                    <span>{cnpj}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(cnpj)}
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
          CNPJ Generator – Generate Valid Brazilian CNPJ Numbers
        </h2>

        <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Need valid Brazilian company identification numbers for testing? Our free{" "}
          <strong> CNPJ generator</strong> allows you to instantly create realistic and 
          properly formatted CNPJ numbers. This tool is ideal for developers, testers, 
          and businesses that require sample data for applications, databases, or QA 
          processes.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Why Use This CNPJ Generator?
        </h3>

        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-2">
          <li>Generate valid and formatted CNPJ numbers instantly</li>
          <li>Perfect for testing systems and validating input fields</li>
          <li>Supports formatted and unformatted output</li>
          <li>Fast, accurate, and completely free to use</li>
          <li>No registration or login required</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Common Use Cases
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          This <strong>random CNPJ generator</strong> is widely used by developers and QA 
          engineers for testing Brazilian systems, by fintech companies for validating 
          business workflows, and by designers for creating realistic UI mockups. It is 
          especially useful when working with forms that require valid CNPJ input.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          How It Works
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Simply enter the number of CNPJ values you want to generate and click the{" "}
          <strong>&quot;Generate CNPJ&quot;</strong> button. The tool instantly creates valid 
          CNPJ numbers with correct check digits, ensuring they follow official 
          formatting rules.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Important Note
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          The generated CNPJ numbers are intended for testing and development purposes 
          only. They do not correspond to real companies and should not be used for any 
          legal or official activities.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Start Generating CNPJ Numbers Now
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Use this free tool to generate valid CNPJ numbers quickly and efficiently. 
          It helps streamline your development workflow and ensures your systems are 
          properly tested with realistic data.
        </p>
      </section>
    </>
  );
}
