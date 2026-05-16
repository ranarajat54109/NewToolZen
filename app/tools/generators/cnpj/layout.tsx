import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "CNPJ Generator – Generate Valid Brazilian CNPJ Numbers Online",
  description:
    "Free CNPJ generator tool to create valid Brazilian CNPJ numbers instantly. Perfect for testing, development, and validating input fields.",
  keywords: [
    "cnpj generator",
    "valid cnpj generator",
    "random cnpj generator",
    "fake cnpj generator",
    "generate cnpj online",
    "brazil cnpj generator",
    "cnpj number generator",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
