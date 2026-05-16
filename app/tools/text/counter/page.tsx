'use client';

import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function TextCounter() {
  const [text, setText] = useState('');

  const charCount = text.length;
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const sentenceCount = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphCount = text.trim() === '' ? 0 : text.split(/\n+/).filter(p => p.trim().length > 0).length;
  const charWithoutSpaces = text.replace(/\s/g, '').length;
  
  // Avg reading speed 200 wpm
  const readingTimeCalc = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center">
        <Calculator className="mr-3" /> Text Counter
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">Detailed statistics for your text.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
          <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">{wordCount}</div>
          <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Words</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">{charCount}</div>
          <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Characters</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
          <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">{sentenceCount}</div>
          <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Sentences</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
          <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1">{paragraphCount}</div>
          <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Paragraphs</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
         <div className="flex-1">
            <textarea
              rows={12}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here to see statistics..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-base focus:ring-2 focus:ring-indigo-500 outline-none resize-none shadow-sm"
            />
         </div>
         <div className="w-full md:w-64 space-y-4">
             <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Extra Details</h3>
                <div className="space-y-3">
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Chars (no spaces)</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{charWithoutSpaces}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Reading Time</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">~{readingTimeCalc} min</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Speaking Time</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">~{Math.max(1, Math.ceil(wordCount / 130))} min</span>
                   </div>
                </div>
             </div>
             
             <button 
               onClick={() => setText('')}
               disabled={!text}
               className="w-full py-2 px-4 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
             >
               Clear Text
             </button>
         </div>
      </div>
    </div>
  );
}
