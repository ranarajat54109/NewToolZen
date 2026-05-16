'use client';

import { useState, useRef } from 'react';
import { UploadCloud, Copy, RefreshCw } from 'lucide-react';
import { motion } from '@/lib/motion';
import { toast } from 'sonner';

export default function ImageColorsExtractor() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (e.g. JPG, PNG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        setImageSrc(e.target.result);
        extractColors(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const extractColors = (src: string) => {
    setIsProcessing(true);
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Draw image to a small canvas to average out colors easily
      canvas.width = Math.min(img.width, 300);
      canvas.height = Math.min(img.height, Math.round(300 * (img.height / img.width)));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Extremely basic extraction logic: sample random pixels or just grid
      const extracted: Set<string> = new Set();
      const rgbToHex = (r: number, g: number, b: number) => '#' + [r,g,b].map(x => x.toString(16).padStart(2, '0')).join('');
      
      for (let i = 0; i < 200; i++) {
         const x = Math.floor(Math.random() * canvas.width);
         const y = Math.floor(Math.random() * canvas.height);
         const pixel = ctx.getImageData(x, y, 1, 1).data;
         // ignore transparency fully
         if(pixel[3] > 128) {
            extracted.add(rgbToHex(pixel[0], pixel[1], pixel[2]));
            if(extracted.size >= 12) break;
         }
      }
      
      setColors(Array.from(extracted));
      setIsProcessing(false);
      toast.success('Colors extracted successfully!');
    };
    img.onerror = () => {
      setIsProcessing(false);
      toast.error('Failed to process image colors.');
    }
  };

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success(`Copied ${color} to clipboard!`);
  };

  const reset = () => {
    setImageSrc(null);
    setColors([]);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-orange-200/90 font-lightish">Image Colors</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Extract the dominant color palette directly from your images. Fully processed locally.</p>
      </div>

      <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        
        {/* Hidden Canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />

        {!imageSrc ? (
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-slate-50 dark:bg-slate-800/40"
          >
            <UploadCloud className="h-10 w-10 text-slate-400 dark:text-slate-500 mb-3" />
            <p className="text-slate-600 dark:text-slate-300 font-medium">Click to upload <span className="font-normal text-slate-500">or drag and drop</span></p>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 min-h-[300px]">
                <img src={imageSrc} alt="Preview" className="max-w-full max-h-[400px] object-contain rounded" />
              </div>
              
              <div className="md:w-1/2 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Extracted Palette</h3>
                  <button onClick={reset} className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                    <RefreshCw className="h-4 w-4" /> Reset
                  </button>
                </div>
                
                {isProcessing ? (
                  <div className="flex-1 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                    <RefreshCw className="h-5 w-5 animate-spin" /> Processing...
                  </div>
                ) : (
                  <div className="flex-1 grid grid-cols-3 sm:grid-cols-4 gap-3 content-start">
                    {colors.map((color, idx) => (
                      <motion.div
                        key={`${idx}-${color}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => copyToClipboard(color.toUpperCase())}
                        className="group relative h-20 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer overflow-hidden flex flex-col justify-end p-2 transition-transform hover:scale-105"
                        style={{ backgroundColor: color }}
                      >
                         <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 bg-black/60 flex items-center justify-center">
                           <Copy className="h-5 w-5 text-white" />
                         </div>
                         <div className="opacity-0 group-hover:opacity-100 absolute bottom-0 left-0 right-0 bg-black/80 text-center text-white text-xs py-1 font-mono uppercase tracking-wider backdrop-blur-sm transition-opacity">
                           {color}
                         </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
