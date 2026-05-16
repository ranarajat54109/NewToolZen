'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import type { EmojiClickData, Theme as ThemeType } from 'emoji-picker-react';

// emoji-picker-react is large; load it only when this tool is open.
const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
  ssr: false,
  loading: () => (
    <div className="h-[450px] flex items-center justify-center text-slate-400">
      Loading emoji picker…
    </div>
  ),
});
import { useTheme } from 'next-themes';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function EmojiPickerTool() {
  const { theme } = useTheme();
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setSelectedEmoji(emojiData.emoji);
    navigator.clipboard.writeText(emojiData.emoji);
    setCopied(true);
    toast.success(`Copied ${emojiData.emoji} to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Tool Section */}
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
            Free Online Emoji Picker <span>😜</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Easily browse, search, and copy emojis with our fast and user-friendly tool.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-16">
          <div className="flex-1">
            <div className="shadow-2xl rounded-2xl overflow-hidden p-1 bg-white dark:bg-[#222222] inline-block border border-slate-200 dark:border-slate-800">
              <EmojiPicker 
                onEmojiClick={onEmojiClick}
                theme={(theme === 'dark' ? 'dark' : 'light') as ThemeType}
                width="100%"
                height={500}
              />
            </div>
          </div>
          
          <div className="w-full md:w-64 space-y-4">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-8 text-center shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="text-7xl mb-6 h-24 flex items-center justify-center animate-bounce">
                {selectedEmoji || '👋'}
              </div>
              <div className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-6">
                {selectedEmoji ? 'Emoji Selected!' : 'Pick an emoji'}
              </div>
              <button 
                onClick={() => {
                  if (selectedEmoji) {
                    navigator.clipboard.writeText(selectedEmoji);
                    setCopied(true);
                    toast.success('Copied!');
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                disabled={!selectedEmoji}
                className={`w-full py-3 px-6 rounded-xl flex items-center justify-center transition-all duration-200 font-medium ${
                  !selectedEmoji 
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                    : copied
                      ? 'bg-green-500 hover:bg-green-600 text-white scale-105'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                }`}
              >
                {copied ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                {copied ? 'Copied' : 'Copy Emoji'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              The Ultimate Free Online Emoji Picker
            </h2>
            <div className="h-1.5 w-24 bg-indigo-600 rounded-full mx-auto mb-8" />
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Enhance your digital presence with our fast and responsive <strong>emoji tool online</strong>. 
              Whether you're crafting the perfect social media post or adding personality to your 
              blog, our picker makes it incredibly simple to <strong>copy paste emoji</strong> symbols in a single click.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all duration-300">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Copy & Paste Instantly</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                No more manual searching through device menus. Our <strong>emoji keyboard online</strong> 
                gives you instant access to thousands of smileys, icons, and symbols. Just click to 
                copy and paste anywhere—from Instagram and Discord to professional emails.
              </p>
            </div>

            <div className="group bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all duration-300">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Optimized for All Platforms</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Our collection uses the latest Unicode standards, ensuring your emojis look great 
                on iOS, Android, Windows, and macOS. Use this <strong>free emoji picker</strong> 
                to ensure your messages always carry the right emotion, regardless of the recipient's device.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-8">Main Features & Benefits</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                {[
                  "One-click emoji copy feature",
                  "Thousands of Unicode emojis",
                  "Works on mobile and desktop",
                  "Fast and responsive interface",
                  "No registration required",
                  "Perfect for chats and social media",
                  "Simple and modern design",
                  "Privacy-focused browser tool"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Why Use an Online Emoji Copy Tool?</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Emojis have become the universal language of the internet. They add context, 
              emotion, and visual appeal to otherwise plain text. Our <strong>emoji copy tool</strong> 
              is designed for efficiency, allowing you to find the perfect smiley without 
              interrupting your workflow.
            </p>
            
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8">Perfect for Content Creators & Marketers</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Captions with emojis are proven to have higher click-through and engagement rates. 
              Whether you're managing a brand or building a personal blog, our <strong>free online 
              emoji picker</strong> is the professional choice for quick and easy access to 
              expressive icons.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
