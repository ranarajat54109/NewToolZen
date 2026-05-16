'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useStore } from '@/store/useStore';
import { Search, Moon, Sun, Wrench, Menu, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ALL_TOOLS } from '@/lib/tools-data';
import { useRouter } from 'next/navigation';

export function Header() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { searchQuery, setSearchQuery, toggleSidebar } = useStore();
  const [mounted, setMounted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredResults = ALL_TOOLS.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToolClick = (href: string) => {
    router.push(href);
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button 
        type="button" 
        className="-m-2.5 p-2.5 text-slate-700 dark:text-slate-300 md:hidden hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" 
        onClick={toggleSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex items-center gap-2 md:w-48 xl:w-64 shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
          <Wrench className="h-5 w-5 text-white" />
        </div>
        <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
          ToolZen
        </Link>
      </div>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
        <div className="relative flex flex-1 h-10 max-w-2xl mx-auto" ref={searchRef}>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
          </div>
          <input
            id="search-field"
            className="block w-full h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 py-2 pl-10 pr-10 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition-all"
            placeholder="Search tools, categories, descriptions..."
            type="search"
            name="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 group"
            >
              <X className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
            </button>
          )}

          {/* Search Results Dropdown */}
          {showResults && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="py-2">
                {filteredResults.length > 0 ? (
                  <>
                    <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 mb-1">
                      Tools Found
                    </div>
                    {filteredResults.map((tool) => (
                      <button
                        key={tool.href}
                        onClick={() => handleToolClick(tool.href)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                            <tool.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                              {tool.name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                              {tool.description}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                    {ALL_TOOLS.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 8 && (
                      <div className="px-4 py-2 text-xs text-center text-slate-400 dark:text-slate-500 italic">
                        Keep typing for more specific results...
                      </div>
                    )}
                  </>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">No tools found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-x-2">
          <button
            type="button"
            className="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-all focus:outline-none hover:border-indigo-500/20"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          >
            <span className="sr-only">Toggle dark mode</span>
            {mounted ? (
              resolvedTheme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />
            ) : (
              <div className="h-5 w-5 opacity-0" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
