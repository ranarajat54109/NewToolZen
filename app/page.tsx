'use client';

import { TOOLS } from '@/lib/tools-data';
import { useDeferredValue, useMemo } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';

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

export default function Home() {
  const { searchQuery, setSearchQuery } = useStore();
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredTools = useMemo(() => {
    const dashboardSections = TOOLS.filter(section => section.showOnDashboard !== false);
    
    if (!deferredSearchQuery.trim()) return dashboardSections;
    const query = deferredSearchQuery.toLowerCase();

    return dashboardSections.map(section => ({
      ...section,
      items: section.items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      )
    })).filter(section => section.items.length > 0);
  }, [deferredSearchQuery]);

  return (
    <>
      <title>ToolZen | Generators, Converters & Utilities</title>
      <meta name="description" content="ToolZen is your all-in-one dashboard for generators, converters, and utilities. Open fast, browser-based tools for data, files, images, text, and colors." />
      
      <div className="space-y-12 pb-10">
        <section className="mt-8 mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl text-center md:text-left">
            Welcome to <span className="text-indigo-600 dark:text-indigo-400">ToolZen</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl text-center md:text-left mx-auto md:mx-0">
            Your centralized platform for all essential utility tools. Fast, secure, and running entirely in your browser.
          </p>
        </section>

        {filteredTools.length > 0 ? (
          filteredTools.map((section) => (
            <section key={section.category} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 mb-8">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                   <section.icon className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white capitalize">
                  {section.category}
                </h2>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800 ml-4"></div>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {section.items.map((tool) => (
                  <motion.div key={tool.name} variants={itemVariants}>
                    <Link href={tool.href} className="group flex flex-col h-full bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                            <ArrowRight className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                         </div>
                      </div>
                      
                      <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:group-hover:bg-indigo-500/10 dark:group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-300 mb-6">
                        <tool.icon className="h-6 w-6" />
                      </div>
                      
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {tool.description}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </section>
          ))
        ) : (
          <div className="py-24 text-center bg-white dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="flex flex-col items-center max-w-sm mx-auto">
              <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No tools found</h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400">We couldn't find any tools matching "{deferredSearchQuery}". Try a different keyword.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        <section id="toolgen-dashboard-description" aria-labelledby="toolgen-dashboard-title" className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl space-y-8">
            <div className="space-y-4">
              <h2 id="toolgen-dashboard-title" className="text-2xl font-bold text-slate-900 dark:text-white">⚡ ToolZen Dashboard</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong className="text-slate-900 dark:text-slate-200">ToolZen keeps your most useful generators and utilities in one easy place.</strong>
                {" "}Quickly open tools for numbers, names, dates, files, images, text, and colors with a clean browser-based workflow.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Popular Generators</h3>
              <ul className="list-disc pl-5 space-y-3 text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/tools/generators/random-number" className="text-indigo-600 dark:text-indigo-400 hover:underline">Random Number</Link>,{" "}
                  <Link href="/tools/generators/random-name" className="text-indigo-600 dark:text-indigo-400 hover:underline">Random Name</Link>,{" "}
                  <Link href="/tools/generators/birthday" className="text-indigo-600 dark:text-indigo-400 hover:underline">Birthday Generator</Link>,{" "}
                  <Link href="/tools/generators/cnpj" className="text-indigo-600 dark:text-indigo-400 hover:underline">CNPJ Generator</Link>,{" "}
                  <Link href="/tools/generators/cpf" className="text-indigo-600 dark:text-indigo-400 hover:underline">CPF Generator</Link>, and{" "}
                  <Link href="/tools/generators/pin" className="text-indigo-600 dark:text-indigo-400 hover:underline">PIN Code</Link>.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Why this layout works</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                The section stays short, readable, and mobile-friendly while supporting SEO with clear headings and internal links.
                It also keeps the dashboard focused on quick tool discovery instead of long marketing copy.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
