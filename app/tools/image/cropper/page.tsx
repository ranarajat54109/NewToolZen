'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Lazy-load the cropper widget; it only mounts after an image is chosen.
const ReactCrop = dynamic(() => import('react-image-crop'), { ssr: false });
import { Upload, Download, Image as ImageIcon } from 'lucide-react';

async function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  const { centerCrop, makeAspectCrop } = await import('react-image-crop');
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageCropper() {
  const [imgSrc, setImgSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || '')
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  async function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(await centerAspectCrop(width, height, aspect));
    }
  }

  async function onDownloadCropClick() {
    const image = imgRef.current;
    if (!image || !completedCrop) {
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio;

    canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    const base64Image = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = base64Image;
    link.download = 'cropped-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Image Cropper</h1>
        <p className="text-slate-600 dark:text-slate-400">Crop your images easily and download the result.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4">
        <label className="flex items-center justify-center px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium rounded-lg cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors w-full md:w-auto">
          <Upload className="w-5 h-5 mr-2" />
          Choose Image
          <input type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
        </label>

        {imgSrc && (
          <div className="flex items-center gap-2 w-full md:w-auto">
            <label className="text-sm text-slate-600 dark:text-slate-400">Aspect Ratio: </label>
            <select
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-2 text-sm focus:outline-none"
              value={aspect || 'free'}
              onChange={(e) => {
                if (e.target.value === 'free') {
                  setAspect(undefined);
                } else {
                  const newAspect = Number(e.target.value);
                  setAspect(newAspect);
                  if (imgRef.current) {
                    const { width, height } = imgRef.current;
                    centerAspectCrop(width, height, newAspect).then(setCrop);
                  }
                }
              }}
            >
              <option value="free">Freeform</option>
              <option value={1}>1:1 (Square)</option>
              <option value={16 / 9}>16:9 (Widescreen)</option>
              <option value={4 / 3}>4:3</option>
              <option value={3 / 2}>3:2</option>
            </select>
          </div>
        )}
      </div>

      {imgSrc ? (
        <div className="flex flex-col gap-6 items-center">
          <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-xl max-w-full overflow-hidden flex justify-center border border-slate-200 dark:border-slate-800">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                onLoad={onImageLoad}
                style={{ maxHeight: '60vh' }}
              />
            </ReactCrop>
          </div>
          <button
            onClick={onDownloadCropClick}
            disabled={!completedCrop?.width || !completedCrop?.height}
            className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Cropped Image
          </button>
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
          <ImageIcon className="w-16 h-16 mb-4 text-slate-400 dark:text-slate-600" />
          <p>Please upload an image to start cropping</p>
        </div>
      )}

      {/* SEO Content Section */}
      <div className="mt-16 space-y-12">
        <section className="max-w-4xl">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
            Free Online Image Cropper: Trim and Resize Instantly
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Welcome to ToolZen&apos;s <strong>Image Cropper</strong>, the fastest way to edit your photos without complex software.
            Whether you need to fix a profile picture, prepare social media assets, or trim screenshots, our tool
            provides a seamless, professional experience directly in your web browser.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
              <span className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mr-3 text-sm">01</span>
              Key Features
            </h3>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span><strong>Instant Online Cropping:</strong> No downloads or installations needed. Works on any device.</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span><strong>High-Quality Output:</strong> Maintain the original resolution and clarity of your images.</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span><strong>Predefined Ratios:</strong> Quickly switch between 1:1, 16:9, 4:3, and 3:2.</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span><strong>Zero Watermarks:</strong> Download clean, professional images every time.</span>
              </li>
            </ul>
          </section>

          <section className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
              <span className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mr-3 text-sm">02</span>
              How to Use
            </h3>
            <ol className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start">
                <span className="font-bold text-emerald-500 mr-2">1.</span>
                <span><strong>Upload:</strong> Click &quot;Choose Image&quot; to select a file from your device.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-emerald-500 mr-2">2.</span>
                <span><strong>Adjust:</strong> Use the drag-and-crop interface to select your desired area.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-emerald-500 mr-2">3.</span>
                <span><strong>Refine:</strong> Choose a specific aspect ratio or use freeform mode.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-emerald-500 mr-2">4.</span>
                <span><strong>Download:</strong> Click &quot;Download Cropped Image&quot; to save your result.</span>
              </li>
            </ol>
          </section>
        </div>

        <section className="bg-indigo-600 rounded-2xl p-8 text-white shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Why Choose ToolZen for Image Editing?</h3>
          <p className="text-indigo-100 mb-6 leading-relaxed">
            At ToolZen, we prioritize your <strong>privacy and security</strong>. Unlike other online tools, our image processing happens
            entirely <strong>locally in your browser</strong>. Your photos are never uploaded to our servers,
            ensuring your personal data stays on your machine.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <div className="font-bold text-xl mb-1">Fast</div>
              <div className="text-sm text-indigo-100 text-nowrap">Instant processing</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <div className="font-bold text-xl mb-1">Secure</div>
              <div className="text-sm text-indigo-100 text-nowrap">Local-only editing</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <div className="font-bold text-xl mb-1">Free</div>
              <div className="text-sm text-indigo-100 text-nowrap">No hidden costs</div>
            </div>
          </div>
        </section>
      </div>
    </div>

  );
}
