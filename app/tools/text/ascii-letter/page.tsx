'use client';

import React, { useState, useEffect } from 'react';
import { generateAscii, getAsciiFonts } from '@/app/actions/figletAction';
import { Copy, Check, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function AsciiLetter() {
  const [text, setText] = useState('ToolZen');
  const [font, setFont] = useState('Standard');
  const [fonts, setFonts] = useState<string[]>(['Standard', 'Ghost', 'Graffiti', 'Slant']);
  const [ascii, setAscii] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAsciiFonts().then(f => setFonts(f));
  }, []);

  useEffect(() => {
    const fetchAscii = async () => {
      setLoading(true);
      try {
        const res = await generateAscii(text, font);
        setAscii(res);
      } catch (error) {
        setAscii('Error generating ASCII.');
      }
      setLoading(false);
    };

    const delayDebounceFn = setTimeout(() => {
      fetchAscii();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [text, font]);

  const handleCopy = () => {
    navigator.clipboard.writeText(ascii);
    setCopied(true);
    toast.success('ASCII copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([ascii], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ascii-${text.replace(/\s+/g, '-').toLowerCase() || 'text'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">ASCII Letter Generator</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">Create beautiful vintage ASCII art from text.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="space-y-4 bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Input Text</label>
              <input 
                type="text" 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text..."
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Font Style</label>
              <select 
                value={font}
                onChange={(e) => setFont(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {fonts.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
             <button
               onClick={handleCopy}
               disabled={!ascii || loading}
               className="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
             >
               {copied ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
               {copied ? 'Copied' : 'Copy'}
             </button>
             <button
               onClick={handleDownload}
               disabled={!ascii || loading}
               className="w-full flex items-center justify-center py-3 px-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-medium transition-colors disabled:opacity-50"
             >
               <Download className="w-5 h-5 mr-2" />
               Download .txt
             </button>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <div className="bg-[#1e1e1e] rounded-xl p-4 min-h-[400px] border border-slate-200 dark:border-slate-800 shadow-inner overflow-auto relative">
             {loading && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-xl z-10 backdrop-blur-[1px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
             )}
             <pre className="font-mono text-green-400 text-sm whitespace-pre leading-tight">
               {ascii || 'Please enter some text.'}
             </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
