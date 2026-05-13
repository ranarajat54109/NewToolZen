import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Random Name Generator – Generate Realistic Names Instantly",
  description:
    "Free random name generator tool to create realistic full names instantly. Perfect for testing, mock data, gaming, and character creation.",
  keywords: [
    "random name generator",
    "fake name generator",
    "generate random names",
    "full name generator",
    "dummy data name generator",
    "random person name generator",
    "name generator tool",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
