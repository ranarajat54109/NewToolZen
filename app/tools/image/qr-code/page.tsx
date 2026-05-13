'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Download } from 'lucide-react';

export default function QRCodeGenerator() {
  const [data, setData] = useState('https://example.com');
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);
  const [dotsColor, setDotsColor] = useState('#000000');
  const [dotsType, setDotsType] = useState('square');
  const [cornersSquareColor, setCornersSquareColor] = useState('#000000');
  const [cornersSquareType, setCornersSquareType] = useState('square');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<any>(null);

  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: width,
      height: height,
      data: data,
      margin: 10,
      dotsOptions: { color: dotsColor, type: dotsType as any },
      cornersSquareOptions: { color: cornersSquareColor, type: cornersSquareType as any },
      backgroundOptions: { color: backgroundColor }
    });
    
    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.current.append(qrRef.current);
    }
  }, []);

  useEffect(() => {
    if (!qrCode.current) return;
    qrCode.current.update({
      width: width,
      height: height,
      data: data,
      dotsOptions: { color: dotsColor, type: dotsType as any },
      cornersSquareOptions: { color: cornersSquareColor, type: cornersSquareType as any },
      backgroundOptions: { color: backgroundColor }
    });
  }, [width, height, data, dotsColor, dotsType, cornersSquareColor, cornersSquareType, backgroundColor]);

  const onDownload = () => {
    if (qrCode.current) {
      qrCode.current.download({ name: 'qr-code', extension: 'png' });
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 font-sans">QR Code Generator</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 space-y-4">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200">Data</h2>
              <div className="mb-4">
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">URL:</label>
                <input 
                  type="text" 
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
            
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200">Dots and Background</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Dots Type:</label>
                  <select 
                    value={dotsType}
                    onChange={(e) => setDotsType(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none text-slate-800 dark:text-slate-200"
                  >
                    <option value="square">Square</option>
                    <option value="dots">Dots</option>
                    <option value="rounded">Rounded</option>
                    <option value="classy">Classy</option>
                    <option value="classy-rounded">Classy Rounded</option>
                    <option value="extra-rounded">Extra Rounded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Dots Color:</label>
                  <input 
                    type="color" 
                    value={dotsColor}
                    onChange={(e) => setDotsColor(e.target.value)}
                    className="w-full h-10 p-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Background:</label>
                  <input 
                    type="color" 
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-full h-10 p-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200">Corners Square</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Corner Type:</label>
                  <select 
                    value={cornersSquareType}
                    onChange={(e) => setCornersSquareType(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none text-slate-800 dark:text-slate-200"
                  >
                    <option value="square">Square</option>
                    <option value="dot">Dot</option>
                    <option value="extra-rounded">Extra Rounded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Corner Color:</label>
                  <input 
                    type="color" 
                    value={cornersSquareColor}
                    onChange={(e) => setCornersSquareColor(e.target.value)}
                    className="w-full h-10 p-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-3 self-start text-slate-800 dark:text-slate-200">Preview</h2>
            <div className="bg-white p-4 rounded-xl shadow-inner mb-6">
              <div ref={qrRef} className="rounded-lg overflow-hidden flex items-center justify-center bg-white" />
            </div>
            <button 
              onClick={onDownload}
              className="w-full max-w-sm py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Download
            </button>
          </div>
        </div>
      </div>

      <section className="mt-16 max-w-5xl mx-auto px-4 mb-16">
        <h2 className="text-3xl font-semibold mb-6 text-slate-800 dark:text-slate-200">
          Free QR Code Generator Online
        </h2>

        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          Create custom QR codes instantly with ToolZen’s <strong>free QR Code Generator</strong>. 
          Generate high-quality QR codes for websites, text, WiFi, contact details, emails, 
          phone numbers, business cards, and social profiles directly in your browser. 
          Our tool is designed to be fast, secure, and completely free to use.
        </p>

        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          Customize your QR code design with different dot styles, colors, backgrounds, and 
          corner shapes to match your brand or personal style. The generated QR codes are 
          downloadable in high resolution, making them perfect for both print and digital use.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-800 dark:text-slate-200">
          Key Features of Our QR Code Maker
        </h3>

        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-3">
          <li><strong>Instant Generation:</strong> Create QR codes in real-time as you type.</li>
          <li><strong>Fully Customizable:</strong> Adjust colors, dot styles, and corner shapes.</li>
          <li><strong>Multiple Formats:</strong> Support for URLs, text, WiFi, email, and more.</li>
          <li><strong>High Quality:</strong> Download clear, high-resolution QR images for any project.</li>
          <li><strong>Privacy First:</strong> Secure browser-based processing with no data stored on servers.</li>
          <li><strong>No Watermarks:</strong> Generate clean QR codes without any branding or registration.</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-800 dark:text-slate-200">
          How to Create a QR Code Online
        </h3>

        <ol className="list-decimal pl-6 text-slate-600 dark:text-slate-400 space-y-3">
          <li><strong>Enter Data:</strong> Type your URL, text, or other information into the data field.</li>
          <li><strong>Style It:</strong> Use the customization options to change colors and shapes.</li>
          <li><strong>Preview:</strong> See the changes instantly in the live preview window.</li>
          <li><strong>Download:</strong> Click the download button to save your QR code as a PNG file.</li>
        </ol>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-800 dark:text-slate-200">
          Why Use ToolZen QR Code Generator?
        </h3>

        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          ToolZen provides a professional and reliable solution for creating QR codes quickly 
          without complicated settings. Whether you need a <strong>customizable QR code</strong> for 
          marketing materials, business cards, restaurant menus, product packaging, or social media, 
          our tool delivers high-quality results every time.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-800 dark:text-slate-200">
          Secure and Private QR Generation
        </h3>

        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          Your privacy is our priority. Unlike other tools, ToolZen processes everything 
          <strong>client-side in your browser</strong>. This means your data never leaves your 
          device, ensuring maximum security and speed. It is mobile-friendly and requires 
          no signup or software installation.
        </p>
      </section>
    </>
  );

}
