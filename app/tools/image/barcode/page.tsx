'use client';

import React, { useState, useRef } from 'react';
import Barcode from 'react-barcode';
import { Download } from 'lucide-react';

export default function BarcodeGenerator() {
  const [value, setValue] = useState('123456789012');
  const [format, setFormat] = useState('CODE128');
  const [lineColor, setLineColor] = useState('#000000');
  const [background, setBackground] = useState('#ffffff');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [displayValue, setDisplayValue] = useState(true);

  const barcodeRef = useRef<HTMLDivElement>(null);

  const formats = [
    "CODE128",
    "CODE39",
    "EAN13",
    "EAN8",
    "UPC",
    "ITF14",
    "MSI",
    "pharmacode"
  ];

  const onDownload = () => {
    if (!barcodeRef.current) return;
    const svg = barcodeRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = "barcode.png";
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 font-sans">Barcode Generator</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 space-y-4">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200">Data</h2>
              <div className="mb-4">
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Value:</label>
                <input 
                  type="text" 
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Format:</label>
                <select 
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                >
                  {formats.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200">Settings</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Bar Color:</label>
                  <input 
                    type="color" 
                    value={lineColor}
                    onChange={(e) => setLineColor(e.target.value)}
                    className="w-full h-10 p-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Background:</label>
                  <input 
                    type="color" 
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="w-full h-10 p-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md cursor-pointer"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Width: {width}</label>
                  <input 
                    type="range" 
                    min="1" max="5" step="1"
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Height: {height}</label>
                  <input 
                    type="range" 
                    min="30" max="250" step="10"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="displayValue"
                  checked={displayValue}
                  onChange={(e) => setDisplayValue(e.target.checked)}
                  className="mr-2 w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="displayValue" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                  Show Value Text
                </label>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-3 self-start text-slate-800 dark:text-slate-200">Preview</h2>
            <div className="bg-white p-6 rounded-xl shadow-inner mb-6 w-full flex justify-center items-center overflow-x-auto min-h-[200px]" ref={barcodeRef}>
              <Barcode 
                value={value || " "}
                format={format as any}
                lineColor={lineColor}
                background={background}
                width={width}
                height={height}
                displayValue={displayValue}
              />
            </div>
            <button 
              onClick={onDownload}
              className="w-full max-w-sm py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center shadow-lg shadow-indigo-500/20"
            >
              <Download className="w-5 h-5 mr-2" />
              Download
            </button>
          </div>
        </div>
      </div>

      <section className="mt-16 max-w-5xl mx-auto px-4 mb-16">
        <h2 className="text-3xl font-semibold mb-6 text-slate-800 dark:text-slate-200">
          Free Barcode Generator Online
        </h2>

        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed text-lg">
          Create high-quality barcodes instantly with ToolZen’s <strong>free Barcode Generator</strong>. 
          Generate professional barcodes for products, inventory systems, retail, packaging, 
          shipping labels, warehouses, and business operations directly in your browser. 
          Our tool is designed to be fast, secure, and completely free to use.
        </p>

        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          Customize barcode formats, colors, width, height, and display settings with an 
          easy-to-use interface. Whether you need barcodes for internal tracking or 
          commercial products, our generator provides clean and accurate results for 
          popular standards including <strong>CODE128, EAN, UPC</strong>, and more.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-800 dark:text-slate-200">
          Key Features of Our Barcode Maker
        </h3>

        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-3">
          <li><strong>Multiple Formats:</strong> Support for CODE128, CODE39, EAN13, EAN8, UPC, and others.</li>
          <li><strong>Full Customization:</strong> Adjust dimensions (width, height), colors, and text display.</li>
          <li><strong>Instant Preview:</strong> See your barcode update in real-time as you modify data and settings.</li>
          <li><strong>High-Quality Downloads:</strong> Save your barcodes as high-resolution PNG images for any project.</li>
          <li><strong>Privacy-Focused:</strong> All processing happens locally in your browser; no data is sent to our servers.</li>
          <li><strong>Free for Everyone:</strong> No software installation, signup, or hidden costs required.</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-800 dark:text-slate-200">
          How to Use the Barcode Generator
        </h3>

        <ol className="list-decimal pl-6 text-slate-600 dark:text-slate-400 space-y-3">
          <li><strong>Enter Value:</strong> Type the barcode number or alphanumeric string into the data field.</li>
          <li><strong>Select Format:</strong> Choose the appropriate barcode standard (e.g., CODE128 for general use).</li>
          <li><strong>Customize Design:</strong> Adjust the bar colors, background, width, and height.</li>
          <li><strong>Preview & Download:</strong> Verify the look in the preview area and click download to save the image.</li>
        </ol>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-800 dark:text-slate-200">
          Why Use ToolZen Barcode Generator?
        </h3>

        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          ToolZen provides a reliable way to create professional barcodes without the need for 
          complex software or graphic design skills. It’s perfect for small business owners, 
          warehouse managers, and developers who need to generate <strong>customizable barcodes</strong> 
          quickly. Our clean, modern interface ensures that you can create scannable, 
          industry-standard barcodes in just a few clicks.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-800 dark:text-slate-200">
          Secure and Private Processing
        </h3>

        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          We value your privacy and security. Unlike many online generators, ToolZen uses 
          <strong>client-side processing</strong>, meaning your barcode data remains strictly 
          on your computer. It’s fast, secure, and works seamlessly across both desktop 
          and mobile devices, giving you the flexibility to generate barcodes whenever 
          and wherever you need them.
        </p>
      </section>
    </>
  );
}
