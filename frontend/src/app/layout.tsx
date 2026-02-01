import React from 'react';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import '../styles/globals.css';
import { Providers } from '@/app/providers';
import { Toaster } from 'react-hot-toast';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// Font configurations
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

// Metadata
export const metadata: Metadata = {
  title: {
    default: 'Shreejyot Fashion - Premium Clothing Sale & Rental',
    template: '%s | Shreejyot Fashion',
  },
  description:
    'Shop and rent premium mens, womens, and kids clothing at Shreejyot Fashion. Best prices and quality guaranteed.',
  keywords: [
    'clothing',
    'fashion',
    'rental',
    'mens wear',
    'womens wear',
    'kids wear',
    'designer clothing',
    'wedding wear',
    'party wear',
  ],
  authors: [{ name: 'Shreejyot Fashion' }],
  creator: 'Shreejyot Fashion',
  publisher: 'Shreejyot Fashion',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title: 'Shreejyot Fashion - Premium Clothing Sale & Rental',
    description: 'Shop and rent premium clothing for all occasions',
    siteName: 'Shreejyot Fashion',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Shreejyot Fashion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shreejyot Fashion',
    description: 'Shop and rent premium clothing',
    images: ['/og-image.jpg'],
    creator: '@shreejyotfashion',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-neutral-50 antialiased">
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#171717',
                padding: '16px',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 8px rgba(107, 70, 193, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
