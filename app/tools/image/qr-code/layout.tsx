import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free QR Code Generator Online - Custom QR Codes | ToolZen",
  description:
    "Generate custom QR codes online for URLs, text, WiFi, email, phone numbers, and more. Customize colors, styles, and download high-quality QR codes instantly with ToolZen.",
  keywords: [
    "QR code generator",
    "free QR code generator",
    "custom QR code maker",
    "create QR code online",
    "QR code for URL",
    "WiFi QR code generator",
    "QR creator",
    "downloadable QR code",
    "QR code tool",
  ],
  alternates: {
    canonical: "https://yourdomain.com/tools/image/qr-code",
  },
  openGraph: {
    title: "Free QR Code Generator Online | ToolZen",
    description: "Create customizable QR codes instantly for links, text, WiFi, contacts, and more. Free, fast, secure, and browser-based QR code generator.",
    url: "https://yourdomain.com/tools/image/qr-code",
    type: "website",
    images: [
      {
        url: "https://yourdomain.com/images/qr-code-generator-preview.png",
        width: 1200,
        height: 630,
        alt: "Free QR Code Generator Online | ToolZen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free QR Code Generator Online | ToolZen",
    description: "Generate and customize QR codes online instantly with ToolZen. Download high-quality QR codes for business and personal use.",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
