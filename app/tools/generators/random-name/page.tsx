'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const FIRST_NAMES = ['Aiden', 'Emma', 'Jackson', 'Sophia', 'Lucas', 'Oliver', 'Isabella', 'Mia', 'Elijah', 'Charlotte', 'Harper', 'Amelia', 'Evelyn', 'Abigail', 'Emily', 'Elizabeth', 'Mila', 'Ella', 'Avery', 'Sofia', 'Camila', 'Aria', 'Scarlett', 'Victoria', 'Madison', 'Luna', 'Grace', 'Chloe', 'Penelope', 'Layla', 'Riley', 'Zoey', 'Nora', 'Lily', 'Eleanor', 'Hannah', 'Lillian', 'Addison', 'Aubrey', 'Ellie', 'Stella', 'Natalie', 'Zoe', 'Leah', 'Hazel', 'Violet', 'Aurora', 'Savannah', 'Audrey', 'Brooklyn', 'Bella', 'Claire', 'Skylar', 'Lucy', 'Paisley', 'Everly', 'Anna', 'Caroline', 'Nova', 'Genesis', 'Emilia', 'Kennedy', 'Samantha', 'Maya', 'Willow', 'Kinsley', 'Naomi', 'Aaliyah', 'Elena', 'Sarah', 'Ariana', 'Allison', 'Gabriella', 'Alice', 'Madelyn', 'Cora', 'Ruby', 'Eva', 'Serenity', 'Autumn', 'Adeline', 'Hailey', 'Gianna', 'Valentina', 'Isla', 'Eliana', 'Quinn', 'Nevaeh', 'Ivy', 'Sadie', 'Piper', 'Lydia', 'Alexa', 'Josephine', 'Emery', 'Julia', 'Delilah', 'Arianna', 'Vivian', 'Kaylee', 'Sophie', 'Brielle', 'Madeline'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez'];

export default function RandomNameGenerator() {
  const [count, setCount] = useState(5);
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const newResults = Array.from({ length: count }, () => {
      const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      return `${first} ${last}`;
    });
    setResults(newResults);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (results.length === 0) return;
    navigator.clipboard.writeText(results.join('\n'));
    setCopied(true);
    toast.success('Copied names to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Random Name Generator</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Generate random realistic full names for testing or mock data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm h-fit">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">How many names?</label>
              <input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white"
              />
            </div>

            <button
              onClick={generate}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              <RefreshCw className="h-5 w-5" />
              Generate Names
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
                {results.map((name, i) => (
                  <motion.li 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={i} 
                    className="px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow-sm flex items-center justify-between group"
                  >
                    <span>{name}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(name);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                      title="Copy this name"
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
          Random Name Generator – Create Realistic Names Instantly
        </h2>

        <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Looking for a quick and reliable way to generate random names? Our free 
          <strong> random name generator</strong> helps you create realistic full names 
          instantly for testing, mock data, gaming profiles, or creative writing. 
          Whether you're a developer, designer, or writer, this tool saves time and 
          generates high-quality names with just one click.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Why Use Our Random Name Generator?
        </h3>

        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-2">
          <li>Generate unlimited random full names instantly</li>
          <li>Perfect for dummy data, testing, and databases</li>
          <li>Useful for story writing, character creation, and gaming</li>
          <li>Simple, fast, and completely free to use</li>
          <li>No signup required – generate names in one click</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Common Use Cases
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          This <strong>random name generator tool</strong> is widely used by developers 
          for creating sample data, by writers for generating character names, and by 
          marketers for testing user flows. It is also helpful for students and anyone 
          needing fake names for practice or demo purposes.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          How It Works
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Simply enter the number of names you want to generate and click the 
          <strong> "Generate Names"</strong> button. The tool will instantly display a 
          list of random, realistic names that you can copy and use anywhere.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Start Generating Names Now
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Try our free random name generator today and simplify your workflow. 
          Whether you need names for testing, content creation, or fun, this tool is 
          designed to deliver fast and accurate results every time.
        </p>
      </section>
    </>
  );
}
