import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Barcode Generator Online - Create Custom Barcodes | ToolZen",
  description:
    "Generate custom barcodes online instantly with ToolZen. Create CODE128, EAN, UPC, and other barcode formats with customizable size, colors, and settings.",
  keywords: [
    "barcode generator",
    "free barcode generator",
    "create barcode online",
    "CODE128 barcode generator",
    "UPC barcode maker",
    "EAN barcode generator",
    "barcode creator tool",
    "downloadable barcode image",
  ],
  alternates: {
    canonical: "https://yourdomain.com/tools/image/barcode",
  },
  openGraph: {
    title: "Free Barcode Generator Online | ToolZen",
    description: "Create professional barcodes instantly online with customizable formats, sizes, and colors. Fast, secure, and easy-to-use barcode generator.",
    url: "https://yourdomain.com/tools/image/barcode",
    type: "website",
    images: [
      {
        url: "https://yourdomain.com/images/barcode-generator-preview.png",
        width: 1200,
        height: 630,
        alt: "Free Barcode Generator Online | ToolZen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Barcode Generator Online | ToolZen",
    description: "Generate high-quality customizable barcodes online instantly for retail, inventory, packaging, and business use.",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
