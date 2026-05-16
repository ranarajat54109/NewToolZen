import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Image Cropper Online - Crop JPG and PNG Instantly | ToolZen',
  description: 'Crop images quickly and securely with ToolZen’s free online image cropper. Trim, resize, and download high-quality JPG and PNG files directly in your browser. No registration required.',
  keywords: ['image cropper', 'crop image online', 'free image cropper', 'crop JPG online', 'crop PNG images', 'online photo cropper', 'image editing tool', 'ToolZen image cropper'],
  openGraph: {
    title: 'Free Image Cropper Online | ToolZen',
    description: 'Crop images quickly and securely online. Upload, crop, preview, and download high-quality images instantly with ToolZen.',
    type: 'website',
    url: 'https://yourdomain.com/tools/image/cropper',
    images: [
      {
        url: 'https://yourdomain.com/images/image-cropper-preview.png',
        width: 1200,
        height: 630,
        alt: 'Image Cropper Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Image Cropper Online | ToolZen',
    description: 'Easily crop JPG and PNG images online with ToolZen. Fast, secure, and browser-based image cropping tool.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
