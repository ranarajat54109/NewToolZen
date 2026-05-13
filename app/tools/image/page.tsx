'use client';

import Link from 'next/link';
import { ArrowRight, Smile, Sigma, QrCode, Barcode, Crop, Maximize, FileImage } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useDeferredValue, useMemo } from 'react';

const imageTools = [
  { name: 'Emoji Picker', href: '/tools/image/emoji-picker', icon: Smile, description: 'Browse and copy your favorite emojis.' },
  { name: 'Symbol Picker', href: '/tools/image/symbol-picker', icon: Sigma, description: 'Find and copy special symbols and characters.' },
  { name: 'QR Code Generator', href: '/tools/image/qr-code', icon: QrCode, description: 'Create customizable QR codes for links.' },
  { name: 'Barcode Generator', href: '/tools/image/barcode', icon: Barcode, description: 'Generate high-quality barcodes instantly.' },
  { name: 'Image Cropper', href: '/tools/image/cropper', icon: Crop, description: 'Crop your images to exact dimensions.' },
  { name: 'Image Resizer', href: '/tools/image/resizer', icon: Maximize, description: 'Resize images while keeping aspect ratio.' },
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

export default function ImageToolsPage() {
  const { searchQuery } = useStore();
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredTools = useMemo(() => {
    if (!deferredSearchQuery.trim()) return imageTools;
    const query = deferredSearchQuery.toLowerCase();
    
    return imageTools.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query)
    );
  }, [deferredSearchQuery]);

  return (
    <div className="space-y-12 pb-10">
      <section className="mt-8 mb-12">
        <div className="flex items-center gap-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl mb-4">
          <div className="flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <FileImage className="h-8 w-8 sm:h-9 sm:w-9 text-white" />
          </div>
          <h1>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Image</span> Tools
          </h1>
        </div>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Everything you need to edit, crop, resize and generate image formats like QR Codes and Barcodes right in your browser.
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
            <p className="text-lg text-slate-500 dark:text-slate-400">No image tools found matching "{deferredSearchQuery}".</p>
          </div>
        )}
      </section>

      {/* SEO Content Section */}
      <section className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
            Free Online Image Tools
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Access a complete collection of powerful image utilities designed for everyday tasks. 
            Easily crop, resize, and optimize images, generate QR codes and barcodes, and explore 
            emojis or symbols — all in one fast and secure browser-based toolkit.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                All-in-One Image Utilities
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                ToolZen provides a smart collection of image tools that help users edit, resize, 
                crop, and generate visual content without downloading heavy software. Everything 
                works directly inside your browser for better speed, privacy, and convenience.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Crop Images with Precision
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Easily remove unwanted portions of images while keeping high quality. Perfect for 
                profile pictures, social media posts, banners, thumbnails, product photos, and 
                custom image dimensions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Resize Images Online
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Quickly resize images for websites, blogs, presentations, online forms, and social 
                media platforms. Maintain aspect ratio and optimize file sizes without losing image clarity.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                QR Code & Barcode Generator
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Generate professional QR codes and barcodes instantly for links, products, business 
                labels, inventory systems, and digital sharing. Download and share high-quality 
                outputs directly from your browser.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Emoji & Symbol Picker
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Browse and copy emojis, mathematical symbols, arrows, currency symbols, special 
                characters, and decorative text elements for websites, chats, documents, and social media.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Secure & Browser-Based
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Your images and generated files are processed directly in your browser whenever 
                possible, helping improve privacy and speed without requiring software installation 
                or account registration.
              </p>
            </div>
          </div>

          <div className="mt-12 p-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
              Main Features
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0">
              {[
                "Free online image tools",
                "Crop and resize images instantly",
                "QR code and barcode generator",
                "Emoji and symbol picker",
                "Fast browser-based processing",
                "Mobile-friendly interface",
                "No signup required",
                "Simple and modern UI"
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
