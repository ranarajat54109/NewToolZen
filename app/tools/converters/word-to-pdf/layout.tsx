import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Word to PDF Converter – Convert DOCX to PDF Online Free",
  description:
    "Convert Word to PDF online for free. Easily transform DOCX files into high-quality PDF documents with fast and secure processing in your browser.",
  keywords: [
    "word to pdf",
    "docx to pdf",
    "word to pdf converter",
    "convert word to pdf online",
    "docx to pdf free",
    "word file to pdf converter",
    "online word to pdf tool",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
