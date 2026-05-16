import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Tools – Crop, Resize, QR Code & Barcode Generator Online Free",
  description:
    "Use free online image tools to crop, resize, edit, and optimize images instantly. Generate QR codes, barcodes, symbols, and emojis directly in your browser with no uploads required.",
  keywords: [
    "image tools online",
    "free image editor",
    "crop image online",
    "resize image online",
    "qr code generator free",
    "barcode generator online",
    "emoji picker tool",
    "symbol picker online",
    "image resizer free",
    "image cropper tool",
    "browser image tools",
    "online image utilities",
  ],
  openGraph: {
    title: "Free Online Image Tools – Crop, Resize & Generate QR Codes",
    description:
      "Use powerful online image tools to crop, resize, edit images, and generate QR codes or barcodes instantly in your browser.",
    type: "website",
    siteName: "ToolZen",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Tools – Online Crop, Resize & QR Code Generator",
    description:
      "Free browser-based image tools for resizing, cropping, QR code generation, barcode creation, and more.",
  },
  alternates: {
    canonical: "https://yourwebsite.com/image-tools",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
