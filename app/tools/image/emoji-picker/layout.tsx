import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Emoji Picker – Copy & Paste Emojis Online Free",
  description:
    "Use the free online Emoji Picker to browse, search, copy, and paste emojis instantly. Perfect for social media, chats, websites, blogs, and messaging apps.",
  keywords: [
    "emoji picker",
    "copy paste emoji",
    "free emoji picker",
    "emoji tool online",
    "emoji keyboard online",
    "emoji copy tool",
    "smiley emojis",
    "emoji finder",
    "emojis for instagram",
    "emoji symbols",
  ],
  openGraph: {
    title: "Free Emoji Picker – Copy & Paste Emojis Instantly",
    description:
      "Browse thousands of emojis and copy them instantly with our fast and easy Emoji Picker tool.",
    type: "website",
    siteName: "ToolZen",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emoji Picker – Free Emoji Copy Tool",
    description:
      "Find, copy, and paste emojis instantly for social media, chats, websites, and online messaging.",
  },
  alternates: {
    canonical: "https://yourwebsite.com/emoji-picker",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
