import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ToolZen - Centralized Utility Platform',
  description: 'A modern, scalable platform providing multiple utility tools in one place.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.className} bg-background text-foreground antialiased h-screen overflow-hidden flex font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-full w-full">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
              <Header />
              <div className="flex-1 overflow-hidden">
                <main className="h-full overflow-y-auto w-full scrollbar-thin">
                  <div className="flex min-h-full">
                    {/* Main content area */}
                    <div className="flex-1 p-4 md:p-6 lg:p-8">
                      <div className="mx-auto max-w-5xl">
                        {children}
                      </div>
                    </div>
                    
                    {/* Reserved blank space for future Ads on large screens */}
                    <div className="hidden xl:block w-[300px] shrink-0 border-l border-transparent" aria-hidden="true" />
                  </div>
                </main>
              </div>
            </div>
          </div>
          <Toaster richColors position="top-center" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
