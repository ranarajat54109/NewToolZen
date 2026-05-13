'use client';

import Link from 'next/link';
import { ArrowRight, Type, FileType, AlignLeft, Calculator, FileEdit, GitCompare, LayoutTemplate } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useDeferredValue, useMemo } from 'react';

const textTools = [
  { name: 'Different Letters', href: '/tools/text/different-letters', icon: Type, description: 'Transform text into stylish and fancy fonts.' },
  { name: 'ASCII Letter', href: '/tools/text/ascii-letter', icon: FileType, description: 'Create beautiful ASCII text art.' },
  { name: 'Text Converter', href: '/tools/text/converter', icon: AlignLeft, description: 'Convert text between different casing styles.' },
  { name: 'Text Comparator', href: '/tools/utilities/text-compare', icon: GitCompare, description: 'Compare two texts to find differences.' },
  { name: 'Text Counter', href: '/tools/text/counter', icon: Calculator, description: 'Count characters, words, and paragraphs.' },
  { name: 'Text Generator', href: '/tools/text/generator', icon: LayoutTemplate, description: 'Generate Lorem Ipsum dummy text.' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export default function TextToolsPage() {
  const { searchQuery } = useStore();
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredTools = useMemo(() => {
    if (!deferredSearchQuery.trim()) return textTools;
    const query = deferredSearchQuery.toLowerCase();
    
    return textTools.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query)
    );
  }, [deferredSearchQuery]);

  return (
    <div className="space-y-12 pb-10">
      <section className="mt-8 mb-12">
        <div className="flex items-center gap-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl mb-4">
          <div className="flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <Type className="h-8 w-8 sm:h-9 sm:w-9 text-white" />
          </div>
          <h1>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Text</span> Tools
          </h1>
        </div>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          With these tools, you can transform, analyze, compare and generate text with ease. All processing happens locally in your browser - your data never leaves your device. 100% private, secure and no installation required.
        </p>
      </section>

      <section>
        {filteredTools.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredTools.map((tool) => (
              <motion.div key={tool.name} variants={itemVariants}>
                <Link href={tool.href} className="group flex flex-col h-full bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                      <tool.icon className="h-6 w-6" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-300 dark:text-slate-700 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-indigo-500 transition-all duration-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-auto leading-relaxed">
                    {tool.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-slate-500 dark:text-slate-400">No text tools found matching "{deferredSearchQuery}".</p>
          </div>
        )}
      </section>
    </div>
  );
}
