'use client';

import { useState, useRef, useEffect } from 'react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { FileUp, FileDown, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

// Worker will be configured dynamically in useEffect

export default function PdfToWordConverter() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);

  useEffect(() => {
    import('pdfjs-dist').then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      setPdfjsLib(pdfjs);
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFile(e.target.files[0]);
    }
  };

  const convertToWord = async () => {
    if (!pdfFile || !pdfjsLib) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      const paragraphs = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const textItems = textContent.items.map((item: any) => item.str);
        
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun(`--- Page ${i} ---`),
            ],
          })
        );
        
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: textItems.join(' '),
              }),
            ],
          })
        );
      }

      const doc = new Document({
        sections: [{ properties: {}, children: paragraphs }],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfFile.name.replace(/\.pdf$/i, '.docx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Word document created successfully!');
    } catch (error) {
      console.error('Error creating Word DOCX:', error);
      toast.error('Failed to parse PDF and create Word doc.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">PDF to Word</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Extract text from your PDF document and download it as an editable DOCX file, all client-side.</p>
        </div>

        <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm text-center">
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
              className="w-full max-w-sm mx-auto flex flex-col items-center justify-center p-12 border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl bg-indigo-50 dark:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/10 transition-colors"
            >
              <FileUp className="h-12 w-12 mb-4 opacity-80" />
              <span className="font-semibold text-lg">Upload PDF</span>
            </button>
          ) : (
            <div className="max-w-sm mx-auto space-y-6">
              <div className="p-4 border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium truncate pr-4">{pdfFile.name}</span>
                <button onClick={() => setPdfFile(null)} className="text-xs text-red-500 hover:underline">Change</button>
              </div>
              <button
                onClick={convertToWord}
                disabled={isProcessing || !pdfjsLib}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500"
              >
                {isProcessing ? <RefreshCw className="h-5 w-5 animate-spin" /> : <FileDown className="h-5 w-5" />}
                {isProcessing ? 'Converting...' : (!pdfjsLib ? 'Loading engine...' : 'Extract to Word')}
              </button>
            </div>
          )}
        </div>
      </div>

      <section className="mt-16 max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-4 text-slate-900 dark:text-white">
          PDF to Word Converter – Convert PDF to Editable DOCX Online
        </h2>

        <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Struggling to edit content inside a PDF file? Our free 
          <strong> PDF to Word converter</strong> helps you quickly turn 
          static PDF documents into fully editable Word (DOCX) files. 
          Whether you need to update text, reuse content, or modify layouts, 
          this tool gives you a simple and efficient solution—right in your browser.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Why Convert PDF to Word?
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          PDFs are great for sharing, but not for editing. Converting your PDF 
          into a Word document allows you to easily edit text, adjust formatting, 
          and reuse content without starting from scratch.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Key Features
        </h3>

        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-2">
          <li>Convert PDF files into editable Word (DOCX) documents</li>
          <li>Extract text quickly with clean formatting</li>
          <li>No uploads – files are processed securely in your browser</li>
          <li>Fast conversion with instant download</li>
          <li>Simple interface for all users</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          How to Convert PDF to Word
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Upload your PDF file and the tool will automatically extract the text 
          and convert it into a Word document. Once the process is complete, 
          download your editable DOCX file and start making changes instantly.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Best Use Cases
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          This <strong>PDF to DOCX converter</strong> is ideal for editing reports, 
          resumes, contracts, and study materials. It is widely used by students, 
          professionals, and businesses who need quick access to editable content.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white">
          Start Converting Your PDF Now
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Try our free PDF to Word converter and make your documents editable in 
          seconds. No installation required—just upload, convert, and download.
        </p>
      </section>
    </>
  );
}
