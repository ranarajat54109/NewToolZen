import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Birthday Generator – Generate Random Dates of Birth by Age",
  description:
    "Free birthday generator tool to create random dates of birth within any age range. Perfect for testing, dummy data, and development use.",
  keywords: [
    "birthday generator",
    "random birthday generator",
    "date of birth generator",
    "random DOB generator",
    "fake birthday generator",
    "generate random birth dates",
    "age based date generator",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
