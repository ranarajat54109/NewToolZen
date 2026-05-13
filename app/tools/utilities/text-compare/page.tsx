'use client';

import { useState } from 'react';
import { diffWordsWithSpace, diffLines, Change } from 'diff';
import { ArrowDownUp, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TextComparePage() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [diffMode, setDiffMode] = useState<'words' | 'lines'>('words');
  const [computedDiff, setComputedDiff] = useState<Change[]>([]);

  const computeDiff = () => {
    if (!textA && !textB) {
      toast.error('Both inputs are empty!');
      return;
    }

    // Lazy load the computation to avoid blocking initial render too much
    let diffResults;
    if (diffMode === 'words') {
      diffResults = diffWordsWithSpace(textA, textB);
    } else {
      diffResults = diffLines(textA, textB);
    }
    setComputedDiff(diffResults);
    toast.success('Comparison complete!');
  };


  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>, targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollTop = e.currentTarget.scrollTop;
      target.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  return (
    <div className="absolute left-0 right-0 top-16 bottom-0 z-30 bg-slate-50 dark:bg-slate-950 flex flex-col pt-4 px-4 pb-2 overflow-y-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 shrink-0 mx-auto w-full max-w-7xl px-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Text Compare</h1>
          <p className="text-sm text-slate-500">Live side-by-side text comparison</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={diffMode}
            onChange={(e) => setDiffMode(e.target.value as 'words' | 'lines')}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="words">Word-by-word</option>
            <option value="lines">Line-by-line</option>
          </select>

          <button
            onClick={() => { setTextA(''); setTextB(''); setComputedDiff([]); }}
            className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
            title="Clear all"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <button
            onClick={computeDiff}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm focus:ring-2 focus:ring-indigo-500"
          >
            <ArrowDownUp className="h-4 w-4" />
            Compare
          </button>
        </div>
      </div>

      {!computedDiff.length ? (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 min-h-[500px] max-w-7xl mx-auto w-full">
          <div className="flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
            <div className="p-3 bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 font-medium text-sm text-slate-700 dark:text-slate-300">
              Original Text (A)
            </div>
            <textarea
              id="paneA"
              onScroll={(e) => handleScroll(e, 'paneB')}
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              className="flex-1 w-full p-4 resize-none outline-none bg-transparent font-mono text-sm leading-relaxed whitespace-pre"
              placeholder="Paste original text here..."
            />
          </div>
          <div className="flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
            <div className="p-3 bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 font-medium text-sm text-slate-700 dark:text-slate-300">
              Changed Text (B)
            </div>
            <textarea
              id="paneB"
              onScroll={(e) => handleScroll(e, 'paneA')}
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              className="flex-1 w-full p-4 resize-none outline-none bg-transparent font-mono text-sm leading-relaxed whitespace-pre"
              placeholder="Paste changed text here..."
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-4 min-h-[500px] max-w-7xl mx-auto w-full">
          <div className="p-3 bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
            <span className="font-medium text-sm text-slate-700 dark:text-slate-300">Comparison Result</span>
            <button
              onClick={() => setComputedDiff([])}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Edit Inputs
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {computedDiff.map((part, index) => {
              const colorClass = part.added
                ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 py-0.5'
                : part.removed
                  ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 line-through py-0.5'
                  : 'text-slate-700 dark:text-slate-300';
              return (
                <span key={index} className={colorClass}>
                  {part.value}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* SEO Content Section */}
      <section className="mt-16 max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-3xl font-semibold mb-4 text-slate-900 dark:text-white">
          Text Compare Tool – Compare Text Online Instantly
        </h2>

        <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          Quickly identify differences between two pieces of text with our free 
          <strong> Text Compare Tool</strong>. Whether you are comparing code, 
          documents, articles, contracts, or edited content, this tool helps you 
          detect changes line-by-line or word-by-word in real time.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Why Use a Text Comparison Tool?
        </h3>

        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          Manually checking changes between two texts can be time-consuming and 
          error-prone. This online text diff checker automatically highlights 
          additions, deletions, and modifications so you can review updates faster 
          and more accurately.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Main Features
        </h3>

        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
          <li>Compare two texts side-by-side instantly</li>
          <li>Word-by-word and line-by-line comparison modes</li>
          <li>Highlight added, removed, and changed content</li>
          <li>Fast browser-based processing with no uploads</li>
          <li>Useful for developers, writers, students, and editors</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Perfect for Multiple Use Cases
        </h3>

        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          This <strong>online text compare tool</strong> is ideal for checking code 
          changes, reviewing document revisions, comparing copied content, and 
          validating edited text before publishing or sharing.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          How to Compare Text
        </h3>

        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          Paste your original text into the first input box and the updated text 
          into the second box. Click the compare button to instantly highlight the 
          differences between both versions.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Benefits of Using This Tool
        </h3>

        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
          <li>Save time reviewing text changes</li>
          <li>Reduce manual comparison errors</li>
          <li>Improve editing and proofreading workflows</li>
          <li>Helpful for coding and document verification</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Start Comparing Text Online
        </h3>

        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          Use this free text comparison tool to detect differences instantly and 
          simplify your editing, coding, and document review process.
        </p>
      </section>
    </div>

  );
}

