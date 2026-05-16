import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "PIN Code Generator – Generate Secure Random PINs Online",
  description:
    "Free PIN code generator to create secure random PINs of any length. Ideal for OTP testing, authentication systems, and temporary passwords.",
  keywords: [
    "pin code generator",
    "random pin generator",
    "secure pin generator",
    "generate pin online",
    "otp generator test",
    "numeric pin generator",
    "random number pin generator",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
