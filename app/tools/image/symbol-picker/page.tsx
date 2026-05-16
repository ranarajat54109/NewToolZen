'use client';

import React, { useState } from 'react';
import { Copy, Check, Star } from 'lucide-react';
import { toast } from 'sonner';

const SYMBOL_CATEGORIES = [
  {
    name: 'Arrows',
    symbols: ['←', '→', '↑', '↓', '↔', '↕', '↖', '↗', '↘', '↙', '↚', '↛', '↜', '↝', '↞', '↠', '↢', '↣', '↤', '↦', '↧', '↩', '↪', '↫', '↬', '↭', '↮', '↯', '↰', '↱', '↲', '↳', '↴', '↵', '↶', '↷', '↸', '↹', '↺', '↻', '↼', '↽', '↾', '↿', '⇀', '⇁', '⇂', '⇃', '⇄', '⇅', '⇆', '⇇', '⇈', '⇉', '⇊', '⇋', '⇌', '⇍', '⇎', '⇏', '⇐', '⇑', '⇒', '⇓', '⇔', '⇕', '⇖', '⇗', '⇘', '⇙', '⇚', '⇛', '⇜', '⇝', '⇞', '⇟', '⇠', '⇡', '⇢', '⇣', '⇤', '⇥', '⇦', '⇧', '⇨', '⇩', '⇪', '⇫', '⇬', '⇭', '⇮', '⇯', '⇰', '⇱', '⇲', '⇳', '⇴', '⇵', '⇶', '⇷', '⇸', '⇹', '⇺', '⇻', '⇼', '⇽', '⇾', '⇿']
  },
  {
    name: 'Geometric Shapes',
    symbols: ['■', '□', '▢', '▣', '▤', '▥', '▦', '▧', '▨', '▩', '▪', '▫', '▬', '▭', '▮', '▯', '▰', '▱', '▲', '△', '▴', 'delta;', '▶', '▷', '▸', '▹', '►', '▻', '▼', '▽', '▾', '▿', '◀', '◁', '◂', '◃', '◄', '◅', '◆', '◇', '◈', '◉', '◊', '○', '◌', '◍', '◎', '●', '◐', '◑', '◒', '◓', '◔', '◕', '◖', '◗', '◘', '◙', '◚', '◛', '◜', '◝', '◞', '◟', '◠', '◡', '◢', '◣', '◤', '◥', '◦', '◧', '◨', '◩', '◪', '◫', '◬', '◭', '◮', '◯', '◰', '◱', '◲', '◳', '◴', '◵', '◶', '◷', '◸', '◹', '◺', '◻', '◼', '◽', '◾', '◿']
  },
  {
    name: 'Stars & Decorative',
    symbols: ['★', '☆', '✡', '✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯', '✰', '⁂', '⁎', '⁑', '✢', '✣', '✤', '✥', '✱', '✲', '✳', '✴', '✵', '✶', '✷', '✸', '✹', '✺', '✻', '✼', '✽', '✾', '✿', '❀', '❁', '❂', '❃', '❄', '❅', '❆', '❇', '❈', '❉', '❊', '❋', '❌', '⭕', '❣', '❤', '❥', '❦', '❧']
  },
  {
    name: 'Mathematics',
    symbols: ['∀', '∁', '∂', '∃', '∄', '∅', '∆', '∇', '∈', '∉', '∊', '∋', '∌', '∍', '∎', '∏', '∐', '∑', '−', '∓', '∔', '∕', '∖', '∗', '∘', '∙', '√', '∛', '∜', '∝', '∞', '∟', '∠', '∡', '∢', '∣', '∤', '∥', '∦', '∧', '∨', '∩', '∪', '∫', '∬', '∭', '∮', '∯', '∰', '∱', '∲', '∳', '∴', '∵', '∶', '∷', '∸', '∹', '∺', '∻', '∼', '∽', '∾', '∿', '≀', '≁', '≂', '≃', '≄', '≅', '≆', '≇', '≈', '≉', '≊', '≋', '≌', '≍', '≎', '≏', '≐', '≑', '≒', '≓', '≔', '≕', '≖', '≗', '≘', '≙', '≚', '≛', '≜', '≝', '≞', '≟', '≠', '≡', '≢', '≣', '≤', '≥', '≦', '≧', '≨', '≩', '≪', '≫', '≬', '≭', '≮', '≯', '≰', '≱', '≲', '≳']
  }
];

export default function SymbolPicker() {
  const [activeCategory, setActiveCategory] = useState(SYMBOL_CATEGORIES[0].name);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [copied, setCopied] = useState(false);

  const activeSymbols = SYMBOL_CATEGORIES.find(c => c.name === activeCategory)?.symbols || [];

  const handleSymbolClick = (symbol: string) => {
    setSelectedSymbol(symbol);
    navigator.clipboard.writeText(symbol);
    setCopied(true);
    toast.success(`Copied ${symbol} to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
            Symbol Picker <Star className="text-orange-400 fill-orange-400" size={24}/>
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Click any symbol to copy • Paste anywhere
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Categories:</label>
              <select 
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2 w-64 text-sm focus:ring-2 focus:ring-indigo-500"
              >
                {SYMBOL_CATEGORIES.map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="bg-slate-100 dark:bg-[#1a1c23] p-6 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[400px]">
              <div className="flex flex-wrap gap-2">
                {activeSymbols.map((sym, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSymbolClick(sym)}
                    className="w-12 h-12 flex items-center justify-center text-xl bg-white dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 text-slate-800 dark:text-slate-200"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full md:w-64 space-y-4">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 text-center shadow-sm">
              <div className="text-6xl mb-4 h-20 flex items-center justify-center text-slate-800 dark:text-slate-200">
                {selectedSymbol || '✦'}
              </div>
              <div className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-4">
                {selectedSymbol ? 'Selected Symbol' : 'Pick a symbol'}
              </div>
              <button 
                onClick={() => {
                  if (selectedSymbol) {
                    navigator.clipboard.writeText(selectedSymbol);
                    setCopied(true);
                    toast.success('Copied!');
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                disabled={!selectedSymbol}
                className={`w-full py-2 px-4 rounded-lg flex items-center justify-center transition-colors ${
                  !selectedSymbol 
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                    : copied
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied' : 'Copy Symbol'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-16 max-w-5xl mx-auto px-4 mb-16">
        <h2 className="text-3xl font-semibold mb-6 text-slate-800 dark:text-slate-200">
          Free Online Symbol Picker
        </h2>

        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          Quickly browse, search, and copy symbols with our easy-to-use <strong>Symbol Picker</strong> tool. 
          Instantly copy and paste <strong>Unicode symbols</strong>, <strong>special characters</strong>, 
          mathematical signs, arrows, currency symbols, and decorative text symbols for websites, documents, 
          coding, chats, and social media platforms.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-800 dark:text-slate-200">
          Copy & Paste Symbols Instantly
        </h3>

        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          Simply click any symbol to copy it automatically and paste it anywhere. 
          Whether you are creating stylish usernames, writing documents, coding, 
          designing content, or posting on social media, this <strong>symbol tool online</strong> helps 
          you access symbols quickly and efficiently.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-800 dark:text-slate-200">
          Huge Collection of Unicode Symbols
        </h3>

        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          Explore thousands of symbols including arrows, stars, geometric shapes, 
          <strong>mathematical symbols</strong>, <strong>currency symbols</strong>, check marks, 
          punctuation marks, technical symbols, and decorative text characters in one convenient place.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-800 dark:text-slate-200">
          Perfect for Multiple Use Cases
        </h3>

        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          This online <strong>Symbol Picker</strong> is useful for developers, designers, students, 
          writers, and content creators who need quick access to <strong>special characters</strong> and 
          Unicode symbols for projects, presentations, documents, websites, and online communication.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-800 dark:text-slate-200">
          Fast, Responsive & Easy to Use
        </h3>

        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          The Symbol Picker works directly in your browser with a clean and responsive interface. 
          No software installation or registration is required, making it fast and accessible across 
          desktop and mobile devices.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-800 dark:text-slate-200">
          Main Features
        </h3>

        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-3">
          <li><strong>Free online symbol picker</strong> for instant access</li>
          <li>One-click <strong>copy paste symbols</strong> functionality</li>
          <li>Thousands of <strong>Unicode symbols</strong> and characters</li>
          <li><strong>Mathematical symbols</strong> and currency signs</li>
          <li>Arrow and decorative text symbols</li>
          <li>Works perfectly on desktop and mobile devices</li>
          <li>Fast, lightweight, and responsive interface</li>
          <li>No signup or registration required</li>
        </ul>
      </section>
    </>
  );
}
