'use client';

import { useState, useRef } from 'react';
import { FileUp, Image as ImageIcon, Trash2, Download, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from '@/lib/motion';
import { toast } from 'sonner';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

export default function JpgToPdfConverter() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files)
        .filter(f => f.type.startsWith('image/'))
        .map(f => ({
          id: Math.random().toString(36).substring(7),
          file: f,
          preview: URL.createObjectURL(f)
        }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (id: string, preview: string) => {
    URL.revokeObjectURL(preview);
    setImages(images.filter(img => img.id !== id));
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      // Lazy-load pdf-lib only when a conversion actually runs.
      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.create();

      for (const imgWrapper of images) {
        const imgBuffer = await imgWrapper.file.arrayBuffer();
        let pdfImage;
        try {
          if (imgWrapper.file.type === 'image/jpeg' || imgWrapper.file.type === 'image/jpg') {
            pdfImage = await pdfDoc.embedJpg(imgBuffer);
          } else if (imgWrapper.file.type === 'image/png') {
            pdfImage = await pdfDoc.embedPng(imgBuffer);
          } else {
            // Unrecognized MIME try jpg
            pdfImage = await pdfDoc.embedJpg(imgBuffer);
          }
        } catch (e) {
          try {
            pdfImage = await pdfDoc.embedPng(imgBuffer);
          } catch(err2) {
             console.error('Failed to parse image', err2);
             continue; // skip if completely unparseable
          }
        }

        const { width, height } = pdfImage.scale(1);
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(pdfImage, {
          x: 0,
          y: 0,
          width,
          height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'converted.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('PDF generated successfully!');
    } catch (error) {
      console.error('Error creating PDF:', error);
      toast.error('Failed to generate PDF. Make sure your images are valid JPG/PNG files.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">JPG to PDF</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Convert and combine multiple images (JPG/PNG) into a single PDF document. Processing happens securely in your browser.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/jpeg, image/png, image/jpg" 
              multiple 
              className="hidden" 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-xl bg-indigo-50 dark:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/10 transition-colors"
            >
              <FileUp className="h-10 w-10 mb-2 opacity-80" />
              <span className="font-medium text-sm">Upload Images</span>
              <span className="text-xs opacity-70 mt-1">JPG, PNG</span>
            </button>
            
            {images.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={convertToPdf}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                >
                  {isProcessing ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                  {isProcessing ? 'Converting...' : 'Generate PDF'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm min-h-[400px]">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
            <span>Selected Images ({images.length})</span>
            {images.length > 0 && (
              <button 
                onClick={() => {
                  images.forEach(img => URL.revokeObjectURL(img.preview));
                  setImages([]);
                }}
                className="text-sm text-red-500 hover:text-red-600 transition-colors"
                title="Clear all"
              >
                Clear all
              </button>
            )}
          </h3>

          {images.length > 0 ? (
            <div className="bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-4 max-h-[500px] overflow-y-auto scrollbar-thin">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <AnimatePresence>
                  {images.map((img) => (
                    <motion.div
                      key={img.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="group relative aspect-[3/4] bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm flex items-center justify-center"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={img.preview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => removeImage(img.id, img.preview)}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-white text-xs truncate drop-shadow-md">{img.file.name}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
              <ImageIcon className="h-16 w-16 mb-4 opacity-20" />
              <p>No images selected</p>
              <p className="text-sm mt-1">Upload images to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="mt-16 max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-4 text-slate-900 dark:text-white">
          JPG to PDF Converter – Convert Images to PDF in Seconds
        </h2>

        <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Convert your images into a single, high-quality PDF with our fast and free 
          <strong> JPG to PDF converter</strong>. Whether you want to merge multiple 
          JPG or PNG files into one document or create a clean, shareable PDF, this 
          tool makes the process simple and efficient—right in your browser.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          What Makes This Tool Useful?
        </h3>

        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-2">
          <li>Combine multiple JPG or PNG images into one PDF file</li>
          <li>Maintain original image quality and clarity</li>
          <li>No uploads – your files stay secure in your browser</li>
          <li>Fast conversion with instant download</li>
          <li>Easy drag-and-drop style workflow</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          When Should You Use JPG to PDF?
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          This <strong>image to PDF converter</strong> is perfect when you need to 
          share multiple images as a single document, submit scanned documents, or 
          organize photos into a printable format. It’s commonly used by students, 
          office professionals, and freelancers.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          How to Convert JPG to PDF Online
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Upload your images (JPG or PNG), arrange them if needed, and click the 
          convert button. The tool will instantly merge your images into a single 
          PDF file, ready to download and share.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Tips for Better PDF Output
        </h3>

        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-2">
          <li>Use high-resolution images for best quality results</li>
          <li>Arrange images in the correct order before converting</li>
          <li>Avoid overly large images to keep file size manageable</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Convert Images to PDF Now
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed pb-8">
          Start using our free JPG to PDF converter and turn your images into 
          professional PDF documents in just a few clicks. No installation, no 
          signup—just quick and reliable results.
        </p>
      </section>
    </div>
  );
}
