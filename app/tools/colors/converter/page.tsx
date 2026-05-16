'use client';

import { useState, useEffect } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { motion } from '@/lib/motion';
import { toast } from 'sonner';

export default function ColorConverter() {
  const [inputColor, setInputColor] = useState('#3b82f6');
  
  const [hex, setHex] = useState('');
  const [rgb, setRgb] = useState('');
  const [hsl, setHsl] = useState('');
  const [cmyk, setCmyk] = useState('');
  
  const [isValid, setIsValid] = useState(true);

  // Parse any generic CSS color loosely (HEX, RGB, HSL)
  useEffect(() => {
    const processColor = () => {
      let r, g, b;
      let valid = false;
      const str = inputColor.trim().toLowerCase();

      // HEX
      if (/^#?([0-9a-f]{3}|[0-9a-f]{6})$/.test(str)) {
        let hexClean = str.replace('#', '');
        if (hexClean.length === 3) {
          hexClean = hexClean.split('').map(char => char + char).join('');
        }
        r = parseInt(hexClean.substring(0, 2), 16);
        g = parseInt(hexClean.substring(2, 4), 16);
        b = parseInt(hexClean.substring(4, 6), 16);
        valid = true;
      }
      // RGB
      else if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(str)) {
        const matches = str.match(/\d+/g);
        if (matches && matches.length >= 3) {
           r = parseInt(matches[0]);
           g = parseInt(matches[1]);
           b = parseInt(matches[2]);
           if (r <= 255 && g <= 255 && b <= 255) valid = true;
        }
      }
      // HSL
      else if (/^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/.test(str)) {
        const matches = str.match(/\d+/g);
        if (matches && matches.length >= 3) {
           const h = parseInt(matches[0]) % 360;
           const s = Math.min(100, parseInt(matches[1])) / 100;
           const l = Math.min(100, parseInt(matches[2])) / 100;
           [r, g, b] = hslToRgbHelper(h/360, s, l);
           valid = true;
        }
      }

      setIsValid(valid);

      if (valid && r !== undefined && g !== undefined && b !== undefined) {
         setHex(rgbToHexHelper(r, g, b));
         setRgb(`rgb(${r}, ${g}, ${b})`);
         setHsl(rgbToHslHelper(r, g, b));
         setCmyk(rgbToCmykHelper(r, g, b));
      } else {
         setHex('-');
         setRgb('-');
         setHsl('-');
         setCmyk('-');
      }
    };
    
    // Add small debounce
    const t = setTimeout(processColor, 150);
    return () => clearTimeout(t);
  }, [inputColor]);

  const copyToClipboard = (text: string, label: string) => {
    if (text === '-' || !isValid) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-orange-200/90 font-lightish">Color Converter</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Instantly convert color codes between HEX, RGB, HSL, and CMYK formats.</p>
      </div>

      <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Input Color (HEX, RGB, or HSL)</label>
            <div className="flex flex-col sm:flex-row gap-4">
               <div className="relative flex-1">
                 <input
                   type="text"
                   value={inputColor}
                   onChange={(e) => setInputColor(e.target.value)}
                   placeholder="e.g. #FF5733 or rgb(255, 87, 51)"
                   className={`w-full px-4 py-3 sm:py-4 rounded-xl bg-slate-50 dark:bg-slate-950 border ${!isValid && inputColor.length > 0 ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} focus:ring-2 focus:ring-indigo-500 font-mono text-slate-900 dark:text-white outline-none transition-all`}
                 />
                 {!isValid && inputColor.length > 0 && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-red-500 font-medium bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded">Invalid format</span>
                 )}
               </div>
               {isValid && hex !== '-' && (
                  <div className="w-full sm:w-24 h-14 sm:h-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0" style={{ backgroundColor: hex }} />
               )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ConversionCard label="HEX" value={hex} onCopy={() => copyToClipboard(hex, 'HEX')} isValid={isValid} />
          <ConversionCard label="RGB" value={rgb} onCopy={() => copyToClipboard(rgb, 'RGB')} isValid={isValid} />
          <ConversionCard label="HSL" value={hsl} onCopy={() => copyToClipboard(hsl, 'HSL')} isValid={isValid} />
          <ConversionCard label="CMYK" value={cmyk} onCopy={() => copyToClipboard(cmyk, 'CMYK')} isValid={isValid} />
        </div>
      </div>
    </div>
  );
}

function ConversionCard({ label, value, onCopy, isValid }: { label: string; value: string; onCopy: () => void; isValid: boolean }) {
  return (
    <motion.div 
      whileHover={isValid ? { y: -2 } : {}}
      className={`relative p-5 rounded-xl border ${isValid ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500' : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 opacity-60'} flex flex-col justify-center transition-all group`}
      onClick={isValid ? onCopy : undefined}
    >
      <span className="text-xs font-semibold text-slate-500 tracking-wider mb-2">{label}</span>
      <span className="font-mono text-lg text-slate-900 dark:text-slate-100 break-all">{value}</span>
      
      {isValid && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
           <Copy className="h-5 w-5 text-indigo-500" />
        </div>
      )}
    </motion.div>
  );
}

// Helpers
function hslToRgbHelper(h: number, s: number, l: number) {
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

function rgbToHexHelper(r: number, g: number, b: number) {
  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function rgbToHslHelper(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
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
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function rgbToCmykHelper(r: number, g: number, b: number) {
  let c = 1 - (r / 255);
  let m = 1 - (g / 255);
  let y = 1 - (b / 255);
  let k = Math.min(c, Math.min(m, y));
  
  if (k === 1) return 'cmyk(0%, 0%, 0%, 100%)';
  
  c = Math.round(((c - k) / (1 - k)) * 100);
  m = Math.round(((m - k) / (1 - k)) * 100);
  y = Math.round(((y - k) / (1 - k)) * 100);
  k = Math.round(k * 100);
  
  return `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`;
}
