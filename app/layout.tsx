'use client';
// import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import ConvexClientProvider from './providers/ConvexClientProvider';

// export const metadata: Metadata = {
//   title: 'XD Store',
//   description: 'XD Store',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ConvexClientProvider>{children}</ConvexClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
