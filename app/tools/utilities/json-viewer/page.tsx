'use client';

import { useState } from 'react';
import { Copy, Check, FileJson, AlertCircle } from 'lucide-react';
import { motion } from '@/lib/motion';
import { toast } from 'sonner';

// Lightweight regex syntax highlighter for JSON
function syntaxHighlight(json: string) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'text-green-600 dark:text-green-400'; // number
      if (/^"/.test(match)) {
          if (/:$/.test(match)) {
              cls = 'text-indigo-600 dark:text-indigo-400 font-medium'; // key
          } else {
              cls = 'text-orange-500 dark:text-orange-300'; // string
          }
      } else if (/true|false/.test(match)) {
          cls = 'text-blue-600 dark:text-blue-400 font-semibold'; // boolean
      } else if (/null/.test(match)) {
          cls = 'text-slate-500 dark:text-slate-400 italic'; // null
      }
      return '<span class="' + cls + '">' + match + '</span>';
  });
}

export default function JsonViewer() {
  const [inputObj, setInputObj] = useState('');
  const [outputHtml, setOutputHtml] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [copied, setCopied] = useState(false);
  const [formattedText, setFormattedText] = useState('');

  const handleProcess = () => {
    if (!inputObj.trim()) {
       setErrorDetails('');
       setOutputHtml('');
       setFormattedText('');
       return;
    }

    try {
      const parsed = JSON.parse(inputObj);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedText(formatted);
      setOutputHtml(syntaxHighlight(formatted));
      setErrorDetails('');
    } catch (err: any) {
      setErrorDetails(err.message || 'Invalid JSON format.');
      setOutputHtml('');
      setFormattedText('');
    }
  };

  const copyToClipboard = () => {
    if (!formattedText) return;
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    toast.success('Copied formatted JSON to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">JSON Viewer</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Validate, format, and syntax-highlight your raw JSON.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col h-[600px]">
            <div className="flex items-center justify-between mb-4">
              <label className="text-lg font-semibold text-slate-900 dark:text-white">Raw JSON Input</label>
              <button
                 onClick={handleProcess}
                 className="py-1.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm text-sm"
              >
                 Format JSON
              </button>
            </div>
            <textarea
              value={inputObj}
              onChange={(e) => {
                setInputObj(e.target.value);
                // Auto-process if they clear it
                if (!e.target.value) {
                  setOutputHtml('');
                  setErrorDetails('');
                }
              }}
              placeholder="Paste your unformatted JSON here..."
              className="flex-1 w-full p-4 rounded-xl font-mono text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white resize-none scrollbar-thin"
            />
          </div>

          <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col h-[600px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Formatted Output</h3>
              {formattedText && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy JSON'}
                </button>
              )}
            </div>
            
            <div className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-4 overflow-y-auto scrollbar-thin overflow-x-auto relative">
              {errorDetails ? (
                <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-500/30 flex gap-3 text-sm"
                >
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span className="font-mono break-all">{errorDetails}</span>
                </motion.div>
              ) : outputHtml ? (
                <pre className="font-mono text-sm leading-relaxed whitespace-pre" dangerouslySetInnerHTML={{ __html: outputHtml }} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-3">
                  <FileJson className="h-12 w-12 opacity-20" />
                  <p>Output will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="mt-16 max-w-5xl mx-auto px-4 pb-12">
        <h2 className="text-3xl font-semibold mb-4 text-slate-900 dark:text-white">
          JSON Viewer – Format, Validate, and Beautify JSON Online
        </h2>

        <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          Easily read, validate, and format raw JSON data with our free 
          <strong> JSON Viewer</strong>. This tool helps developers and testers 
          instantly beautify messy JSON, detect syntax errors, and improve 
          readability with clean formatting and syntax highlighting—all directly 
          in your browser.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Why Use This JSON Viewer?
        </h3>

        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
          <li>Format and beautify unformatted JSON instantly</li>
          <li>Validate JSON structure and detect syntax errors</li>
          <li>Improve readability with proper indentation</li>
          <li>Fast and lightweight browser-based processing</li>
          <li>No installation or signup required</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Perfect for Developers and API Testing
        </h3>

        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          This <strong>online JSON formatter</strong> is ideal for developers 
          working with APIs, configuration files, and application data. Whether 
          you are debugging responses, testing endpoints, or reviewing structured 
          data, this tool makes JSON easier to understand and manage.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          How to Format JSON Online
        </h3>

        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          Paste your raw or minified JSON into the input box and click the 
          <strong>"Format JSON"</strong> button. The tool will instantly validate 
          and beautify your JSON with proper indentation and clean formatting.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Key Benefits
        </h3>

        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
          <li>Quickly identify invalid JSON syntax</li>
          <li>Improve debugging efficiency</li>
          <li>Make API responses easier to read</li>
          <li>Useful for frontend and backend development</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Start Formatting JSON Now
        </h3>

        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          Use our free JSON Viewer to validate, format, and beautify your JSON 
          data instantly. It’s fast, secure, and designed to simplify your 
          development workflow.
        </p>
      </section>
    </>
  );
}
