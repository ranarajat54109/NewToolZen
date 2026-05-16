'use client';

import Link from 'next/link';
import { PaintBucket, Pipette, Palette, SwatchBook } from 'lucide-react';
import { motion } from '@/lib/motion';

const colorTools = [
  { name: 'Random Colors', href: '/tools/colors/random', icon: PaintBucket, borderClass: 'hover:border-cyan-500' },
  { name: 'Image Colors', href: '/tools/colors/image', icon: Pipette, borderClass: 'hover:border-purple-500' },
  { name: 'Color Converter', href: '/tools/colors/converter', icon: Palette, borderClass: 'hover:border-blue-500' },
  { name: 'Color Combination', href: '/tools/colors/combination', icon: SwatchBook, borderClass: 'hover:border-pink-500' },
];

export default function ColorToolsDashboard() {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Color Tools
        </h1>
      </div>

      <div className="flex flex-wrap gap-6">
        {colorTools.map((tool) => (
          <Link key={tool.name} href={tool.href}>
            <motion.div
              whileHover={{ y: -2 }}
              className={`group flex flex-col items-center justify-center p-6 w-48 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 ${tool.borderClass}`}
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 group-hover:scale-110 transition-transform duration-300 mb-4">
                <tool.icon className="h-6 w-6" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white group-hover:opacity-80 transition-opacity text-center">{tool.name}</span>
            </motion.div>
          </Link>
        ))}
      </div>

      <section id="toolzen-description" aria-labelledby="toolzen-description-title" className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl space-y-8">
          <div className="space-y-4">
            <h2 id="toolzen-description-title" className="text-2xl font-bold text-slate-900 dark:text-white">✨ Private Color Tools for Fast Workflow</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong className="text-slate-900 dark:text-slate-200">Toolzen helps you work with color faster, right in your browser.</strong> Generate random palettes, extract colors from images, convert formats, and build harmonious combinations without sending files elsewhere. Everything runs locally, so your images and data stay private. <strong className="text-slate-900 dark:text-slate-200">Secure, instant, and no installation required.</strong>
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">What this page includes</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
              <li><strong className="text-slate-900 dark:text-slate-200">Random palette generation</strong> for quick creative starts.</li>
              <li><strong className="text-slate-900 dark:text-slate-200">Image color extraction</strong> to pull usable colors from visuals.</li>
              <li><strong className="text-slate-900 dark:text-slate-200">Format conversion</strong> for flexible design workflows.</li>
              <li><strong className="text-slate-900 dark:text-slate-200">Harmony tools</strong> to create balanced combinations.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Why it is private</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              All processing happens locally in your browser, which keeps your uploads and color data on your device. That makes the experience fast, lightweight, and better for privacy.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">FAQ</h3>
            <div className="faq space-y-6" itemScope itemType="https://schema.org/FAQPage">
              <div className="faq-item p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800" itemProp="mainEntity" itemScope itemType="https://schema.org/Question">
                <h4 itemProp="name" className="text-lg font-medium text-slate-900 dark:text-white">What can Toolzen do?</h4>
                <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                  <div itemProp="text" className="mt-3 text-slate-600 dark:text-slate-400">
                    <p>Toolzen can generate random color palettes, extract colors from images, convert color formats, and create harmonious combinations.</p>
                  </div>
                </div>
              </div>

              <div className="faq-item p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800" itemProp="mainEntity" itemScope itemType="https://schema.org/Question">
                <h4 itemProp="name" className="text-lg font-medium text-slate-900 dark:text-white">Does it upload my images?</h4>
                <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                  <div itemProp="text" className="mt-3 text-slate-600 dark:text-slate-400">
                    <p>No. Processing happens locally in your browser, so your images and data stay private.</p>
                  </div>
                </div>
              </div>

              <div className="faq-item p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800" itemProp="mainEntity" itemScope itemType="https://schema.org/Question">
                <h4 itemProp="name" className="text-lg font-medium text-slate-900 dark:text-white">Do I need to install anything?</h4>
                <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                  <div itemProp="text" className="mt-3 text-slate-600 dark:text-slate-400">
                    <p>No installation is required. The tools run instantly in your browser.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
