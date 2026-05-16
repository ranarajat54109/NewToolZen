'use client';

import { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';
import { motion, AnimatePresence } from '@/lib/motion';
import { toast } from 'sonner';

type PaletteType = 'Analogous' | 'Monochromatic' | 'Split Complementary' | 'Triadic' | 'Tetradic' | 'Complementary';

export default function ColorCombination() {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [format, setFormat] = useState('HEX');
  
  const [selections, setSelections] = useState<Record<PaletteType, boolean>>({
    'Analogous': true,
    'Monochromatic': true,
    'Split Complementary': true,
    'Triadic': true,
    'Tetradic': true,
    'Complementary': true,
  });

  const toggleSelection = (type: PaletteType) => {
    setSelections(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success(`Copied ${color} to clipboard!`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-orange-200/90 font-lightish">Color Combination</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Generate beautiful harmonic color palettes based on a base color.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-72 space-y-6">
          <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Base Color:</label>
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-10 rounded-lg shadow-sm border border-slate-300 dark:border-slate-700 overflow-hidden shrink-0 cursor-pointer">
                  <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={baseColor.toUpperCase()}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) setBaseColor(val);
                  }}
                  maxLength={7}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white font-mono uppercase"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Format:</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white cursor-pointer"
              >
                <option value="HEX">HEX</option>
                <option value="RGB">RGB</option>
                <option value="HSL">HSL</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Select Color Combinations:</h3>
            {(Object.keys(selections) as PaletteType[]).map(type => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selections[type]}
                  onChange={() => toggleSelection(type)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-900"
                />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {type} {type !== 'Complementary' ? 'Palette' : ''}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-8">
          <AnimatePresence>
            {(Object.keys(selections) as PaletteType[]).map(type => {
              if (!selections[type]) return null;
              
              const palette = generatePalette(baseColor, type, format);
              
              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  className="space-y-3"
                >
                  <h3 className="text-sm font-bold text-slate-900 dark:text-orange-200 tracking-wide">
                    {type} {type !== 'Complementary' ? 'Palette' : ''}:
                  </h3>
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {palette.map((color, idx) => (
                      <motion.div
                        key={`${type}-${idx}`}
                        whileHover={{ y: -4, scale: 1.02 }}
                        onClick={() => copyToClipboard(color.display)}
                        className="group relative h-20 w-24 sm:w-28 sm:h-24 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/50 cursor-pointer flex-shrink-0"
                        style={{ backgroundColor: color.hex }}
                      >
                         <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl backdrop-blur-[2px]">
                           <span className="text-white font-mono text-xs sm:text-sm font-medium tracking-wider flex items-center gap-1.5 px-2 text-center">
                              {color.display}
                           </span>
                         </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Color utility to calculate combinations
function generatePalette(baseHex: string, type: PaletteType, format: string) {
  // Safe hex parser
  const hex = baseHex.length === 7 ? baseHex : '#000000';
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  const getHues = (): number[] => {
    switch (type) {
      case 'Analogous': return [h - 60, h - 30, h, h + 30, h + 60];
      case 'Monochromatic': return [h, h, h, h, h]; // varied by luminosity below
      case 'Split Complementary': return [h, h + 150, h + 210];
      case 'Triadic': return [h, h + 120, h + 240];
      case 'Tetradic': return [h, h + 90, h + 180, h + 270];
      case 'Complementary': return [h, h + 180];
      default: return [h];
    }
  };

  const hues = getHues().map(hue => (hue + 360) % 360);

  return hues.map((hueVal, i) => {
    let lum = l;
    if (type === 'Monochromatic') {
      lum = Math.max(10, Math.min(90, l + (i - 2) * 20)); // spread lightness across 5 shades
    }
    
    // convert back to hex and requested format
    const rgb = hslToRgbRaw(hueVal / 360, s / 100, lum / 100);
    const hexColor = rgbToHexRaw(rgb[0], rgb[1], rgb[2]);
    
    let display = hexColor;
    if (format === 'RGB') display = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    if (format === 'HSL') display = `hsl(${Math.round(hueVal)}, ${s}%, ${Math.round(lum)}%)`;

    return { hex: hexColor, display };
  });
}

function hslToRgbRaw(h: number, s: number, l: number) {
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

function rgbToHexRaw(r: number, g: number, b: number) {
  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
