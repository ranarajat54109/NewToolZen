'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Image as ImageIcon, Link as LinkIcon, Unlink } from 'lucide-react';

export default function ImageResizer() {
  const [imgSrc, setImgSrc] = useState('');
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [keepAspect, setKeepAspect] = useState(true);
  
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImgSrc(result);
        
        const img = new Image();
        img.onload = () => {
          setOriginalWidth(img.width);
          setOriginalHeight(img.height);
          setWidth(img.width);
          setHeight(img.height);
        };
        img.src = result;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setWidth(val);
    if (keepAspect && originalWidth > 0) {
      setHeight(Math.round(val * (originalHeight / originalWidth)));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setHeight(val);
    if (keepAspect && originalHeight > 0) {
      setWidth(Math.round(val * (originalWidth / originalHeight)));
    }
  };

  const applyResize = async () => {
    if (!imgRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(imgRef.current, 0, 0, width, height);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `resized-${width}x${height}.jpg`;
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Image Resizer</h1>
        <p className="text-slate-600 dark:text-slate-400">Change image dimensions without losing quality.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm mb-6 flex items-center gap-4">
        <label className="flex items-center justify-center px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium rounded-lg cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
          <Upload className="w-5 h-5 mr-2" />
          Upload Image
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
        {originalWidth > 0 && (
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Original: {originalWidth} × {originalHeight} px
          </span>
        )}
      </div>

      {imgSrc ? (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 h-fit">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Dimensions</h2>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Width (px)
                </label>
                <input 
                  type="number" 
                  value={width || ''} 
                  onChange={handleWidthChange}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              
              <button 
                onClick={() => setKeepAspect(!keepAspect)}
                className={`mt-6 p-2 rounded-lg transition-colors ${keepAspect ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}
                title={keepAspect ? "Unlock Aspect Ratio" : "Lock Aspect Ratio"}
              >
                {keepAspect ? <LinkIcon size={20} /> : <Unlink size={20} />}
              </button>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Height (px)
                </label>
                <input 
                  type="number" 
                  value={height || ''} 
                  onChange={handleHeightChange}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={applyResize}
              className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Resized Image
            </button>
          </div>
          
          <div className="flex-1 flex flex-col items-center">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 self-start">Preview</h2>
            <div className="bg-slate-100 dark:bg-[#1a1c23] p-4 rounded-xl border border-slate-200 dark:border-slate-800 max-w-full overflow-hidden flex items-center justify-center">
              <img 
                ref={imgRef}
                src={imgSrc} 
                alt="Original" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '400px', 
                  width: `${(width / originalWidth) * 100}%`,
                  objectFit: 'contain' 
                }} 
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
          <ImageIcon className="w-16 h-16 mb-4 text-slate-400 dark:text-slate-600" />
          <p>Please upload an image to start resizing</p>
        </div>
      )}
    </div>
  );
}
