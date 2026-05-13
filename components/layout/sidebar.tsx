'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { LayoutDashboard, Shuffle, Orbit, Type, FileImage, FileText, Settings, PanelLeftClose, PanelLeftOpen, Hash, Key, Wrench, FileJson, GitCompare, Smile, Sigma, QrCode, Barcode, Crop, Maximize, CalendarClock, Database, Palette, Coffee, Timer, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  {
    name: 'Generators',
    icon: Orbit,
    items: [
      { name: 'Random Number', href: '/tools/generators/random-number', icon: Shuffle },
      { name: 'Random Name', href: '/tools/generators/random-name', icon: Type },
      { name: 'Birthday Generator', href: '/tools/generators/birthday', icon: Orbit },
      { name: 'CNPJ Generator', href: '/tools/generators/cnpj', icon: Settings },
      { name: 'CPF Generator', href: '/tools/generators/cpf', icon: Hash },
      { name: 'PIN Code', href: '/tools/generators/pin', icon: Key },
    ],
  },
  {
    name: 'Converters',
    icon: FileText,
    items: [
      { name: 'PDF to JPG', href: '/tools/converters/pdf-to-jpg', icon: FileImage },
      { name: 'JPG to PDF', href: '/tools/converters/jpg-to-pdf', icon: FileText },
      { name: 'Word to PDF', href: '/tools/converters/word-to-pdf', icon: FileText },
      { name: 'PDF to Word', href: '/tools/converters/pdf-to-word', icon: FileText },
    ],
  },
  {
    name: 'Utilities',
    icon: Wrench,
    items: [
      { name: 'JSON Viewer', href: '/tools/utilities/json-viewer', icon: FileJson },
      { name: 'Text Compare', href: '/tools/utilities/text-compare', icon: GitCompare },
    ],
  },
  {
    name: 'Break Timer',
    icon: Coffee,
    items: [
      { name: 'Countdown Timer', href: '/tools/break-timer/timer', icon: Timer },
      { name: 'Fake Update Screen', href: '/tools/break-timer/fake-update', icon: Monitor },
    ],
  },
  {
    name: 'Image Tools',
    icon: FileImage,
    href: '/tools/image'
  },
  {
    name: 'Text Tools',
    icon: Type,
    href: '/tools/text'
  },
  {
    name: 'Random Data Tools',
    icon: Database,
    href: '/tools/random-data'
  },
  {
    name: 'Date & Time Tools',
    icon: CalendarClock,
    href: '/tools/datetime'
  },
  {
    name: 'Indigo',
    icon: Palette,
    href: '/tools/colors'
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  // Set sidebar to collapsed by default on mount
  useEffect(() => {
    setSidebarOpen(false);
  }, [setSidebarOpen]);

  // Sidebar is expanded if pinned (sidebarOpen) or hovered
  const isExpanded = sidebarOpen || isHovered;

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm z-20 transition-all duration-300 ease-in-out shrink-0 overflow-hidden",
        isExpanded ? "w-[260px]" : "w-[68px]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 shrink-0 h-[65px] transition-all duration-300 bg-white dark:bg-slate-900">
        <div className={cn("overflow-hidden transition-all duration-300", isExpanded ? "w-auto opacity-100" : "w-0 opacity-0")}>
          <span className="font-bold text-lg whitespace-nowrap text-slate-800 dark:text-slate-200">
            ToolZen
          </span>
        </div>
        <button
          onClick={toggleSidebar}
          className={cn(
            "p-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm flex-shrink-0 z-10",
            !isExpanded && "mx-auto"
          )}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Pin sidebar'}
          title={sidebarOpen ? 'Collapse Sidebar' : 'Pin Sidebar'}
        >
          {sidebarOpen ? <PanelLeftClose className="h-4 w-4 text-slate-600 dark:text-slate-300" /> : <PanelLeftOpen className="h-4 w-4 text-slate-600 dark:text-slate-300" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-3 scrollbar-transparent hover:scrollbar-thin overflow-x-hidden">
        <nav className="space-y-4">
          {navigation.map((section) => {
            const isSectionActive = section.items
              ? section.items.some(item => pathname === item.href)
              : pathname === section.href;

            return (
              <div key={section.name} className="flex flex-col space-y-1">
                {section.items ? (
                  <>
                    <div 
                      className={cn(
                        "flex items-center h-6 px-1 transition-all duration-200",
                        isExpanded ? "justify-start mt-1" : "justify-center mt-2"
                      )}
                      title={!isExpanded ? section.name : undefined}
                    >
                      {isExpanded ? (
                        <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap flex items-center gap-2">
                          <section.icon className="h-3.5 w-3.5 flex-shrink-0" />
                          {section.name}
                        </h3>
                      ) : (
                        <div className="flex justify-center items-center w-full">
                          <div className={cn("w-4 border-t", isSectionActive ? "border-indigo-400 dark:border-indigo-600" : "border-slate-300 dark:border-slate-700")}></div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            title={!isExpanded ? item.name : undefined}
                            className={cn(
                              'group flex items-center py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap overflow-hidden',
                              isExpanded ? 'px-3' : 'justify-center px-0 w-10 mx-auto',
                              isActive
                                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                            )}
                            aria-label={item.name}
                          >
                            <item.icon
                              className={cn(
                                'flex-shrink-0',
                                isExpanded ? 'mr-3 h-[18px] w-[18px]' : 'h-[20px] w-[20px]',
                                isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                              )}
                            />
                            <div className={cn("transition-all duration-300 overflow-hidden", isExpanded ? "w-auto opacity-100" : "w-0 opacity-0")}>
                              <span>{item.name}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <Link
                    href={section.href}
                    title={!isExpanded ? section.name : undefined}
                    className={cn(
                      'group flex items-center py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap overflow-hidden',
                      isExpanded ? 'px-3 mt-1' : 'justify-center px-0 w-10 mx-auto mt-2',
                      pathname === section.href
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    )}
                    aria-label={section.name}
                  >
                    <section.icon
                      className={cn(
                        'flex-shrink-0',
                        isExpanded ? 'mr-3 h-[18px] w-[18px]' : 'h-[20px] w-[20px]',
                        pathname === section.href ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300'
                      )}
                    />
                    <div className={cn("transition-all duration-300 overflow-hidden", isExpanded ? "w-auto opacity-100" : "w-0 opacity-0")}>
                      <span>{section.name}</span>
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
