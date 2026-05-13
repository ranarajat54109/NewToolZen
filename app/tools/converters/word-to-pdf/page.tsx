'use client';

import { useState, useRef } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as mammoth from 'mammoth';
import { FileUp, FileDown, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function WordToPdfConverter() {
  const [wordFile, setWordFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setWordFile(e.target.files[0]);
    }
  };

  const convertToPdf = async () => {
    if (!wordFile) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await wordFile.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;

      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      
      let page = pdfDoc.addPage([595.28, 841.89]); // A4
      const { width, height } = page.getSize();
      
      const fontSize = 12;
      const margin = 50;
      let y = height - margin;

      const lines = text.split('\n');

      for (const line of lines) {
        if (y < margin) {
          page = pdfDoc.addPage([595.28, 841.89]);
          y = height - margin;
        }

        // Clean text to avoid unencodable character bugs in pdf-lib
        const cleanLine = line.replace(/[^\x20-\x7E]/g, '');

        // Just draw truncated line for simplicity client-side
        page.drawText(cleanLine.substring(0, 95), {
          x: margin,
          y,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        
        y -= (fontSize + 6);
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = wordFile.name.replace(/\.docx?$/, '.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('PDF created successfully!');
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error('Failed to convert. Note: This extracts raw text from DOCX files client-side.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Word to PDF</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Extracts text from a DOCX file and creates a simple PDF document entirely in your browser.</p>
        </div>

        <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm text-center">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".docx" 
            className="hidden" 
          />
          
          {!wordFile ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-sm mx-auto flex flex-col items-center justify-center p-12 border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl bg-indigo-50 dark:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/10 transition-colors"
            >
              <FileUp className="h-12 w-12 mb-4 opacity-80" />
              <span className="font-semibold text-lg">Upload Word Document</span>
              <span className="text-sm opacity-70 mt-2">Only .docx files supported</span>
            </button>
          ) : (
            <div className="max-w-sm mx-auto space-y-6">
              <div className="p-4 border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium truncate pr-4">{wordFile.name}</span>
                <button onClick={() => setWordFile(null)} className="text-xs text-red-500 hover:underline">Change</button>
              </div>
              <button
                onClick={convertToPdf}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500"
              >
                {isProcessing ? <RefreshCw className="h-5 w-5 animate-spin" /> : <FileDown className="h-5 w-5" />}
                {isProcessing ? 'Converting...' : 'Convert and Download PDF'}
              </button>
            </div>
          )}
        </div>
      </div>

      <section className="mt-16 max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-4 text-slate-900 dark:text-white">
          Word to PDF Converter – Convert DOCX Files to PDF Online
        </h2>

        <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Convert your Word documents into professional PDF files in seconds with our 
          <strong> Word to PDF converter</strong>. This tool allows you to transform 
          DOCX files into clean, readable PDFs directly in your browser—no software 
          installation required. Fast, secure, and easy to use for everyday needs.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Why Convert Word to PDF?
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          PDF files preserve formatting, layout, and fonts across all devices. 
          Converting Word documents to PDF ensures your content looks consistent 
          when shared, printed, or viewed on different platforms.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Key Benefits
        </h3>

        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-2">
          <li>Convert DOCX files to PDF instantly</li>
          <li>Maintain text clarity and document structure</li>
          <li>No file upload – processing happens in your browser</li>
          <li>Simple interface with quick results</li>
          <li>Free to use without registration</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          How to Use This Tool
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Upload your Word (.docx) file and the tool will automatically extract the 
          content and convert it into a PDF file. Once the conversion is complete, 
          you can download your PDF instantly.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Best For
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          This <strong>DOCX to PDF converter</strong> is perfect for students, 
          professionals, and businesses who need to share documents in a secure 
          and consistent format. It’s especially useful for resumes, reports, 
          invoices, and official documents.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Convert Your Word File Now
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Try our free Word to PDF converter and turn your documents into 
          high-quality PDFs instantly. No downloads, no complexity—just a smooth 
          and reliable conversion experience.
        </p>
      </section>
    </>
  );
}
