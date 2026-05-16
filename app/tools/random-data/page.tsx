'use client';

import Link from 'next/link';
import { Shuffle, Lock, Building, CreditCard, Fingerprint, Hash, UserCircle } from 'lucide-react';
import { motion } from '@/lib/motion';

const mainTools = [
  { name: 'Random Number', href: '/tools/generators/random-number', icon: Shuffle },
  { name: 'Password Generator', href: '/tools/random-data/password-generator', icon: Lock },
];

const devTools = [
  { name: 'CPF BR', href: '/tools/generators/cpf', icon: UserCircle },
  { name: 'CNPJ BR', href: '/tools/generators/cnpj', icon: Building },
  { name: 'RG BR', href: '/tools/random-data/rg', icon: Fingerprint },
  { name: 'Credit Card', href: '/tools/random-data/credit-card', icon: CreditCard },
  { name: 'ID UUID', href: '/tools/random-data/uuid', icon: Hash },
];

export default function RandomDataDashboard() {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Random Data Tools
        </h1>
      </div>

      <div className="flex flex-wrap gap-6">
        {mainTools.map((tool) => (
          <Link key={tool.name} href={tool.href}>
            <motion.div
              whileHover={{ y: -2 }}
              className="group flex flex-col items-center justify-center p-6 w-48 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300 mb-4">
                <tool.icon className="h-6 w-6" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-center">{tool.name}</span>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">Devs</h2>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
        </div>

        <div className="flex flex-wrap gap-4">
          {devTools.map((tool) => (
            <Link key={tool.name} href={tool.href}>
              <motion.div
                whileHover={{ y: -2 }}
                className="group flex flex-col items-center justify-center p-4 w-32 h-32 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300 mb-3">
                  <tool.icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-sm text-center text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{tool.name}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 border-l-4 border-l-indigo-500 shadow-sm">
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl text-sm">
          With these tools, you can generate random numbers, secure passwords, and fictitious data for testing and development. Perfect for developers and testers. Instant and no installation required.
        </p>
      </div>
    </div>
  );
}
