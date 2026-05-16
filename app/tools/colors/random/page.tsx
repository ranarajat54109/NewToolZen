'use client';

import { useState } from 'react';
import { Copy, Dices } from 'lucide-react';
import { motion, AnimatePresence } from '@/lib/motion';
import { toast } from 'sonner';

export default function RandomColorGenerator() {
  const [hue, setHue] = useState('random');
  const [format, setFormat] = useState('HEX');
  const [luminosity, setLuminosity] = useState('random');
  const [colors, setColors] = useState<string[]>(Array(9).fill(''));

  const generateColors = () => {
    const newColors = Array.from({ length: 9 }, () => generateRandomColor(hue, format, luminosity));
    setColors(newColors);
    toast.success('Generated 9 new colors!');
  };

  const copyToClipboard = (color: string) => {
    if (!color) return;
    navigator.clipboard.writeText(color);
    toast.success(`Copied ${color} to clipboard!`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-orange-200/90 font-lightish">Random Color Generator</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Generate beautiful random color palettes based on hue and luminosity.</p>
      </div>

      <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-wrap items-end gap-6 mb-8">
          <div className="flex-1 min-w-[200px] space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Hue:</label>
            <select
              value={hue}
              onChange={(e) => setHue(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="random">Random</option>
              <option value="red">Red</option>
              <option value="orange">Orange</option>
              <option value="yellow">Yellow</option>
              <option value="green">Green</option>
              <option value="blue">Blue</option>
              <option value="purple">Purple</option>
              <option value="pink">Pink</option>
              <option value="monochrome">Monochrome</option>
            </select>
          </div>

          <div className="flex-1 min-w-[150px] space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Format:</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="HEX">HEX</option>
              <option value="RGB">RGB</option>
              <option value="HSL">HSL</option>
            </select>
          </div>

          <div className="flex-1 min-w-[150px] space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Luminosity:</label>
            <select
              value={luminosity}
              onChange={(e) => setLuminosity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="random">Random</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <button
            onClick={generateColors}
            className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-6 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl font-medium transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            <Dices className="h-5 w-5" />
            Generate Colors
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
           {colors.map((color, idx) => (
             <motion.div
               key={`${idx}-${color}`}
               whileHover={color ? { scale: 1.02 } : {}}
               onClick={() => copyToClipboard(color)}
               className={`relative h-28 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-center justify-center overflow-hidden transition-all ${color ? 'cursor-pointer hover:shadow-lg' : 'bg-slate-50 dark:bg-slate-900/40'}`}
               style={color ? { backgroundColor: color } : {}}
             >
                {color ? (
                  <div className="opacity-0 hover:opacity-100 transition-opacity absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-mono font-medium tracking-wider text-lg flex items-center gap-2">
                       <Copy className="h-4 w-4" /> {color}
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-400 dark:text-slate-600 italic text-sm">Empty</span>
                )}
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
}

// Simple color generation helpers
function generateRandomColor(hueType: string, format: string, lumType: string): string {
  let h = Math.floor(Math.random() * 360);
  let s = Math.floor(Math.random() * 60) + 40; // 40-100%
  let l = Math.floor(Math.random() * 60) + 20; // 20-80%

  if (hueType !== 'random') {
    const hueRanges: Record<string, [number, number]> = {
      red: [0, 20], // or 340-360
      orange: [20, 45],
      yellow: [45, 65],
      green: [65, 160],
      blue: [160, 250],
      purple: [250, 310],
      pink: [310, 340]
    };
    if (hueType === 'red' && Math.random() > 0.5) {
      h = Math.floor(Math.random() * 20) + 340;
    } else if (hueRanges[hueType]) {
      const [min, max] = hueRanges[hueType];
      h = Math.floor(Math.random() * (max - min)) + min;
    } else if (hueType === 'monochrome') {
      s = 0;
    }
  }

  if (lumType === 'light') l = Math.floor(Math.random() * 20) + 75; // 75-95%
  if (lumType === 'dark') l = Math.floor(Math.random() * 20) + 15;  // 15-35%

  if (format === 'HSL') {
    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  // Convert HSL to RGB
  const rgb = hslToRgb(h / 360, s / 100, l / 100);
  if (format === 'RGB') {
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  }

  // HEX
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

function hslToRgb(h: number, s: number, l: number) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l; 
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
