import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CPF Generator – Generate Valid Brazilian CPF Numbers Online',
  description:
    'Free CPF generator tool to create valid Brazilian CPF numbers instantly. Perfect for testing, development, and validating input fields.',
  keywords: [
    'cpf generator',
    'valid cpf generator',
    'random cpf generator',
    'fake cpf generator',
    'generate cpf online',
    'brazil cpf generator',
    'cpf number generator',
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
