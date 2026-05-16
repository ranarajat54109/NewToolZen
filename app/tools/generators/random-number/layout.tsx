import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Random Number Generator Online | Fast Custom Range Tool',
  description:
    'Generate random numbers online with custom min and max values, quantity, sorting, and repetition options. A fast, free random number generator for games, coding, and daily use.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
