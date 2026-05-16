'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, LayoutTemplate } from 'lucide-react';
import { loremIpsum } from 'lorem-ipsum';
import { toast } from 'sonner';

export default function TextGenerator() {
  const [quantity, setQuantity] = useState(1);
  const [addHtmlTags, setAddHtmlTags] = useState(false);
  const [startWithLorem, setStartWithLorem] = useState(false);
  const [unit, setUnit] = useState<'paragraphs' | 'words' | 'sentences' | 'lists'>('paragraphs');
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateText();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity, addHtmlTags, startWithLorem, unit]);

  const generateText = () => {
    let result = '';
    
    // Handle list generation specially as lorem-ipsum doesn't have a native 'list' unit
    if (unit === 'lists') {
       const listItems = loremIpsum({
         count: quantity,
         format: 'plain',
         units: 'sentences'
       }).split('. ').filter(s => s.trim().length > 0).map(s => s.endsWith('.') ? s : s + '.');
       
       if (addHtmlTags) {
         result = '<ul>\n' + listItems.map(item => `  <li>${item}</li>`).join('\n') + '\n</ul>';
       } else {
         result = listItems.map(item => `• ${item}`).join('\n');
       }
    } else {
       result = loremIpsum({
         count: quantity,
         format: addHtmlTags ? 'html' : 'plain',
         units: unit as any
       });
    }

    // Handle 'Start with Lorem ipsum' manually if it's the first paragraph or generic string
    if (startWithLorem && quantity > 0) {
      if (addHtmlTags && unit === 'paragraphs') {
        const pTagMatch = result.match(/^<p>/);
        if (pTagMatch) {
            result = result.replace(/^<p>(.*?)/, "<p>Lorem ipsum dolor sit amet, $1");
        }
      } else if (!addHtmlTags) {
         if (!result.toLowerCase().startsWith('lorem ipsum')) {
             result = 'Lorem ipsum dolor sit amet, ' + result.charAt(0).toLowerCase() + result.slice(1);
         }
      }
    }

    setGeneratedText(result);
  };

  const handleCopy = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    toast.success('Text copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center">
        <LayoutTemplate className="mr-3 text-indigo-500" /> Lorem Ipsum Generator
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3 space-y-6">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
              <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Quantity:</label>
                 <input 
                   type="number" 
                   min="1" max="100"
                   value={quantity}
                   onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                   className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                 />
              </div>

              <div className="space-y-4">
                 <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={addHtmlTags} onChange={() => setAddHtmlTags(!addHtmlTags)} />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${addHtmlTags ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${addHtmlTags ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
                      Add paragraph HTML tags
                    </div>
                 </label>
                 <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={startWithLorem} onChange={() => setStartWithLorem(!startWithLorem)} />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${startWithLorem ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${startWithLorem ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
                      Start with 'Lorem ipsum'
                    </div>
                 </label>
              </div>

              <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Generate:</label>
                 <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                    {['Paragraphs', 'Words', 'Sentences', 'Lists'].map((u) => (
                      <button
                        key={u}
                        onClick={() => setUnit(u.toLowerCase() as any)}
                        className={`flex-1 py-2 text-xs sm:text-sm font-medium transition-colors ${unit === u.toLowerCase() ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                      >
                        {u}
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        <div className="w-full lg:w-2/3">
           <div className="bg-slate-50 dark:bg-[#1e1e24] rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner h-full flex flex-col pl-1 relative">
             <div className="absolute left-0 top-6 bottom-6 w-1 bg-indigo-500 rounded-r-md hidden sm:block"></div>
             
             <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-4">Generated Dummy Text</h3>
                <button 
                 onClick={handleCopy}
                 className="flex items-center text-sm px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 rounded-md transition-colors shadow-sm"
                >
                 {copied ? <Check className="w-4 h-4 mr-1.5 text-green-500" /> : <Copy className="w-4 h-4 mr-1.5" />}
                 {copied ? 'Copied!' : 'Copy'}
                </button>
             </div>
             
             <div className="p-6 overflow-y-auto max-h-[500px] scrollbar-thin">
               {addHtmlTags ? (
                  <pre className="font-mono text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                    {generatedText}
                  </pre>
               ) : (
                  <div className="text-slate-700 dark:text-slate-300 text-base leading-relaxed whitespace-pre-wrap">
                    {generatedText}
                  </div>
               )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
