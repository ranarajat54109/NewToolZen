'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function TextCaseConverter() {
  const [text, setText] = useState('');
  const [activeTab, setActiveTab] = useState<'case' | 'cleanup' | 'programming'>('case');
  const [copied, setCopied] = useState(false);

  const charCount = text.length;
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const transform = (fn: (t: string) => string) => {
    if (!text) return;
    setText(fn(text));
  };

  // --- Case Conversion Logic ---
  const toCapitalize = (str: string) => str.replace(/\b\w/g, c => c.toUpperCase());
  const toTitleCase = (str: string) => {
    // Simple title case for demo purposes
    const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i;
    return str.toLowerCase().replace(/([^\W_]+[^\s-]*) */g, (txt, idx) => {
      if (idx > 0 && idx + txt.length !== str.length && txt.search(smallWords) > -1 && str.charAt(idx - 2) !== ":" && (str.charAt(idx + txt.length) !== '-' || str.charAt(idx - 1) === '-') && str.charAt(idx - 1).search(/[^\s-]/) < 0) {
        return txt.toLowerCase();
      }
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };
  const toSentenceCase = (str: string) => str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
  const toAlternateCase = (str: string) => str.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
  const toToggleCase = (str: string) => str.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
  const toReverse = (str: string) => str.split('').reverse().join('');

  // --- Text Cleanup Logic ---
  const removeAccents = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const removeExtraSpaces = (str: string) => str.replace(/\s+/g, ' ').trim();
  const removeLineBreaks = (str: string) => str.replace(/\r?\n|\r/g, ' ');
  const removeBlankLines = (str: string) => str.replace(/^\s*[\r\n]/gm, '');
  const removeNumbers = (str: string) => str.replace(/\d+/g, '');
  const removePunctuation = (str: string) => str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

  // --- Programming Logic ---
  const extractWords = (str: string) => {
    return str.replace(/[^a-zA-Z0-9$]/g, ' ').split(/\s+/).filter(Boolean);
  };
  
  const toCamelCase = (str: string) => {
    const words = extractWords(str);
    return words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
  };
  const toPascalCase = (str: string) => {
    return extractWords(str).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
  };
  const toSnakeCase = (str: string) => extractWords(str).join('_').toLowerCase();
  const toKebabCase = (str: string) => extractWords(str).join('-').toLowerCase();
  const toUrlSlug = (str: string) => str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  const toDotCase = (str: string) => extractWords(str).join('.').toLowerCase();

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 font-sans">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Text Case Converter</h1>
      
      <div className="mb-4 relative">
        <textarea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here to convert..."
          className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-t-lg p-4 text-base focus:ring-1 focus:ring-slate-500 outline-none resize-y"
          style={{ minHeight: '200px' }}
        />
        <div className="w-full flex items-center justify-between bg-[#131b2c] border border-t-0 border-slate-700 rounded-b-lg p-3 text-sm text-slate-400">
           <div>{charCount} characters | {wordCount} words</div>
           <button 
             onClick={handleCopy}
             className="flex items-center hover:text-white transition-colors gap-1.5 px-3 py-1.5 rounded-md hover:bg-slate-800"
           >
             {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
             Copy
           </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex border-b border-slate-700/50 mb-4 bg-transparent overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('case')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === 'case' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
          >
            Case Conversion
          </button>
          <button
            onClick={() => setActiveTab('cleanup')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === 'cleanup' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
          >
            Text Cleanup
          </button>
          <button
            onClick={() => setActiveTab('programming')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === 'programming' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
          >
            Programming
          </button>
        </div>

        <div className="bg-[#131b2c] border border-slate-700/50 rounded-lg overflow-hidden">
          {activeTab === 'case' && (
            <div className="grid grid-cols-2 md:grid-cols-2 text-slate-300 text-sm">
              <button onClick={() => transform(t => t.toUpperCase())} className="p-4 border-r border-b border-slate-700/50 hover:bg-slate-800 transition-colors">UPPERCASE</button>
              <button onClick={() => transform(t => t.toLowerCase())} className="p-4 border-b border-slate-700/50 hover:bg-slate-800 transition-colors">lowercase</button>
              <button onClick={() => transform(toCapitalize)} className="p-4 border-r border-b border-slate-700/50 hover:bg-slate-800 transition-colors">Capitalize</button>
              <button onClick={() => transform(toTitleCase)} className="p-4 border-b border-slate-700/50 hover:bg-slate-800 transition-colors">Title Case</button>
              <button onClick={() => transform(toSentenceCase)} className="p-4 border-r border-b border-slate-700/50 hover:bg-slate-800 transition-colors">Sentence case</button>
              <button onClick={() => transform(toAlternateCase)} className="p-4 border-b border-slate-700/50 hover:bg-slate-800 transition-colors">aLtErNaTe</button>
              <button onClick={() => transform(toToggleCase)} className="p-4 border-r border-slate-700/50 hover:bg-slate-800 transition-colors">tOGGLE cASE</button>
              <button onClick={() => transform(toReverse)} className="p-4 border-slate-700/50 hover:bg-slate-800 transition-colors">Reverse</button>
            </div>
          )}

          {activeTab === 'cleanup' && (
            <div className="grid grid-cols-2 text-slate-300 text-sm">
              <button onClick={() => transform(removeAccents)} className="p-4 border-r border-b border-slate-700/50 hover:bg-slate-800 transition-colors">Remove Accents</button>
              <button onClick={() => transform(removeExtraSpaces)} className="p-4 border-b border-slate-700/50 hover:bg-slate-800 transition-colors">Remove Extra Spaces</button>
              <button onClick={() => transform(removeLineBreaks)} className="p-4 border-r border-b border-slate-700/50 hover:bg-slate-800 transition-colors">Remove Line Breaks</button>
              <button onClick={() => transform(removeBlankLines)} className="p-4 border-b border-slate-700/50 hover:bg-slate-800 transition-colors">Remove Blank Lines</button>
              <button onClick={() => transform(removeNumbers)} className="p-4 border-r border-slate-700/50 hover:bg-slate-800 transition-colors">Remove Numbers</button>
              <button onClick={() => transform(removePunctuation)} className="p-4 border-slate-700/50 hover:bg-slate-800 transition-colors">Remove Punctuation</button>
            </div>
          )}

          {activeTab === 'programming' && (
            <div className="grid grid-cols-2 text-slate-300 text-sm">
              <button onClick={() => transform(toCamelCase)} className="p-4 border-r border-b border-slate-700/50 hover:bg-slate-800 transition-colors">camelCase</button>
              <button onClick={() => transform(toPascalCase)} className="p-4 border-b border-slate-700/50 hover:bg-slate-800 transition-colors">PascalCase</button>
              <button onClick={() => transform(toSnakeCase)} className="p-4 border-r border-b border-slate-700/50 hover:bg-slate-800 transition-colors">snake_case</button>
              <button onClick={() => transform(toKebabCase)} className="p-4 border-b border-slate-700/50 hover:bg-slate-800 transition-colors">kebab-case</button>
              <button onClick={() => transform(toUrlSlug)} className="p-4 border-r border-slate-700/50 hover:bg-slate-800 transition-colors">URL Slug</button>
              <button onClick={() => transform(toDotCase)} className="p-4 border-slate-700/50 hover:bg-slate-800 transition-colors">dot.case</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
