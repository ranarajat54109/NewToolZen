import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "PDF to JPG Converter – Convert PDF to Image Online Free",
  description:
    "Convert PDF to JPG online for free. Extract high-quality images from PDF pages instantly with our secure and fast PDF to JPG converter.",
  keywords: [
    "pdf to jpg",
    "pdf to jpg converter",
    "convert pdf to image",
    "pdf to jpeg online",
    "pdf to image converter free",
    "extract images from pdf",
    "pdf to jpg online free",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
