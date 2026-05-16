'use client';

import { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { motion } from '@/lib/motion';
import { toast } from 'sonner';

export default function CreditCardGenerator() {
  const [ccInfo, setCcInfo] = useState<{ number: string; expiry: string; cvv: string } | null>(null);
  const [brand, setBrand] = useState('Visa');
  const [copied, setCopied] = useState(false);

  const generateCC = () => {
    // Mock CC info generation based on brand pattern
    const year = new Date().getFullYear();
    const expM = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const expY = String(year + Math.floor(Math.random() * 5)).slice(2);
    const expiry = `${expM}/${expY}`;
    const cvv = String(Math.floor(Math.random() * 900) + 100);

    let prefix = '';
    if (brand === 'Visa') prefix = '4';
    else if (brand === 'MasterCard') prefix = '51';
    else if (brand === 'Amex') prefix = '34';

    const remainingLength = brand === 'Amex' ? 15 - prefix.length : 16 - prefix.length;
    let numberRaw = prefix;
    for (let i = 0; i < remainingLength; i++) {
        numberRaw += Math.floor(Math.random() * 10);
    }
    
    // Formatting with spaces
    let number = '';
    if (brand === 'Amex') {
        number = `${numberRaw.slice(0, 4)} ${numberRaw.slice(4, 10)} ${numberRaw.slice(10, 15)}`;
    } else {
        number = `${numberRaw.slice(0, 4)} ${numberRaw.slice(4, 8)} ${numberRaw.slice(8, 12)} ${numberRaw.slice(12, 16)}`;
    }

    setCcInfo({ number, expiry, cvv });
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (!ccInfo) return;
    navigator.clipboard.writeText(`Number: ${ccInfo.number}\nExpiry: ${ccInfo.expiry}\nCVV: ${ccInfo.cvv}`);
    setCopied(true);
    toast.success('Credit card details copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Credit Card Generator</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Generate fictitious credit card numbers for testing payments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Brand:</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="Visa">Visa</option>
                <option value="MasterCard">MasterCard</option>
                <option value="Amex">American Express</option>
              </select>
            </div>

            <button
              onClick={generateCC}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500 mt-4"
            >
              <RefreshCw className="h-5 w-5" />
              Generate Credit Card
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Generated Card</h3>
            {ccInfo && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          
          <div className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center space-y-4">
             {ccInfo ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full p-6 sm:p-8 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-950 border border-slate-700 shadow-xl overflow-hidden relative"
                >
                  <div className="absolute right-6 top-6 text-2xl font-bold italic opacity-30 text-white">{brand}</div>
                  <div className="text-xl sm:text-2xl font-mono tracking-widest text-slate-100 mt-8 mb-6">{ccInfo.number}</div>
                  <div className="flex justify-between mt-4 text-sm font-mono text-slate-300">
                    <div>
                      <div className="text-xs opacity-50 uppercase tracking-widest mb-1">Valid Thru</div>
                      {ccInfo.expiry}
                    </div>
                    <div>
                      <div className="text-xs opacity-50 uppercase tracking-widest mb-1">CVV</div>
                      {ccInfo.cvv}
                    </div>
                  </div>
                </motion.div>
             ) : (
                <div className="text-slate-400 dark:text-slate-500">
                  Click generate to see credit card
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
