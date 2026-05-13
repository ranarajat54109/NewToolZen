import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Symbol Picker – Copy & Paste Symbols Online Free",
  description:
    "Free online Symbol Picker tool to browse, search, copy, and paste symbols instantly. Find Unicode symbols, mathematical symbols, arrows, currency signs, and special characters easily.",
  keywords: [
    "symbol picker",
    "copy paste symbols",
    "unicode symbols",
    "special characters",
    "mathematical symbols",
    "currency symbols",
    "arrow symbols",
    "symbol copy tool",
    "text symbols",
    "symbol tool online",
  ],
  alternates: {
    canonical: "https://yourwebsite.com/symbol-picker",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
