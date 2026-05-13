'use client';

import { useState, useRef, useEffect } from 'react';
import { FileUp, FileImage, Download, Trash2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// We will configure the worker dynamically based on the exact version inside the useEffect

interface ExportedImage {
  id: string;
  blobUrl: string;
  pageNumber: number;
}

export default function PdfToJpgConverter() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [images, setImages] = useState<ExportedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues with canvas and window
    import('pdfjs-dist').then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      setPdfjsLib(pdfjs);
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (pdfFile) URL.revokeObjectURL(pdfFile.name); // Not really a URL, but cleanup if needed
      setPdfFile(e.target.files[0]);
      setImages([]); // clear previous
    }
  };

  const convertToImages = async () => {
    if (!pdfFile || !pdfjsLib) return;
    setIsProcessing(true);
    setImages([]);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      const convertedImages: ExportedImage[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // 2.0 for better quality
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        // Convert canvas to blob -> object URL
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
        if (blob) {
          convertedImages.push({
            id: Math.random().toString(36).substring(7),
            blobUrl: URL.createObjectURL(blob),
            pageNumber: i
          });
        }
      }

      setImages(convertedImages);
      toast.success(`Successfully extracted ${convertedImages.length} images!`);
    } catch (error) {
      console.error('Error rendering PDF:', error);
      toast.error('Failed to parse PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (blobUrl: string, pageNumber: number) => {
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `page-${pageNumber}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    images.forEach(img => URL.revokeObjectURL(img.blobUrl));
    setImages([]);
    setPdfFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">PDF to JPG</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Extract high-quality JPG images from your PDF pages. Processing stays entirely in your browser.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="application/pdf" 
              className="hidden" 
            />
            
            {!pdfFile ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-xl bg-indigo-50 dark:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/10 transition-colors"
              >
                <FileUp className="h-10 w-10 mb-2 opacity-80" />
                <span className="font-medium text-sm">Upload PDF</span>
              </button>
            ) : (
              <div className="flex items-center justify-between p-4 border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                <div className="truncate flex-1">
                  <span className="text-sm font-medium text-slate-900 dark:text-white truncate block">{pdfFile.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <button 
                  onClick={reset}
                  className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
            
            {pdfFile && images.length === 0 && (
              <div className="mt-6">
                <button
                  onClick={convertToImages}
                  disabled={isProcessing || !pdfjsLib}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                >
                  {isProcessing ? <RefreshCw className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
                  {isProcessing ? 'Extracting Images...' : (!pdfjsLib ? 'Loading Engine...' : 'Extract to JPG')}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm min-h-[400px]">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Extracted Pages {images.length > 0 && `(${images.length})`}
          </h3>

          {images.length > 0 ? (
            <div className="bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-4 max-h-[600px] overflow-y-auto scrollbar-thin">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <AnimatePresence>
                  {images.map((img) => (
                    <motion.div
                      key={img.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group flex flex-col bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
                    >
                      <div className="relative aspect-[3/4] bg-slate-100 dark:bg-slate-900 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={img.blobUrl} 
                          alt={`Page ${img.pageNumber}`} 
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={() => downloadImage(img.blobUrl, img.pageNumber)}
                            className="p-3 bg-white text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors shadow-lg"
                            title="Download JPG"
                          >
                            <Download className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 text-center">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Page {img.pageNumber}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
              <FileImage className="h-16 w-16 mb-4 opacity-20" />
              <p>{isProcessing ? 'Parsing PDF documents...' : 'No images extracted'}</p>
              {!isProcessing && <p className="text-sm mt-1">Upload a PDF to view and download pages</p>}
            </div>
          )}
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="mt-16 max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-4 text-slate-900 dark:text-white">
          PDF to JPG Converter – Convert PDF Pages to High-Quality Images
        </h2>

        <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Easily convert your PDF files into high-quality JPG images with our free 
          <strong> PDF to JPG converter</strong>. This tool allows you to extract 
          each page of a PDF as a separate image, making it perfect for sharing, 
          editing, or presentation purposes. Best of all, everything runs directly 
          in your browser—no uploads, no waiting, and complete privacy.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Key Features of Our PDF to JPG Tool
        </h3>

        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-2">
          <li>Convert PDF pages to JPG images instantly</li>
          <li>High-quality image output with clear resolution</li>
          <li>No file upload – 100% secure and private processing</li>
          <li>Supports multi-page PDF conversion</li>
          <li>Fast, lightweight, and easy to use</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Why Convert PDF to JPG?
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Converting PDF to JPG makes it easier to share documents as images, 
          use them in presentations, or upload them to platforms that don’t 
          support PDF files. JPG images are widely compatible and can be opened 
          on any device without special software.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          How to Convert PDF to JPG Online
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Simply upload your PDF file using the upload button. The tool will 
          instantly process your file and extract each page as a high-quality 
          JPG image. You can then preview and download the images individually 
          or all at once.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Who Can Use This Tool?
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          This <strong>PDF to image converter</strong> is ideal for students, 
          professionals, designers, and developers. Whether you need to convert 
          documents for presentations, extract images for editing, or share files 
          quickly, this tool provides a simple and efficient solution.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Convert Your PDF Now
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Try our free PDF to JPG converter and turn your documents into images 
          in seconds. No installation required—just upload, convert, and download 
          instantly.
        </p>
      </section>
    </div>
  );
}
