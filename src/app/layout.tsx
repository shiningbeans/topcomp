import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'TopComp — Compare Laptop Prices Across Every Retailer',
    template: '%s | TopComp',
  },
  description: 'Find the best laptop deals by comparing prices from 16+ retailers. Real-time price tracking, deal ratings, and side-by-side specs.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://topcomp.dev',
    siteName: 'TopComp',
    title: 'TopComp — Compare Laptop Prices Across Every Retailer',
    description: 'Find the best laptop deals by comparing prices from 16+ retailers.',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'TopComp' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TopComp — Compare Laptop Prices',
    description: 'Find the best laptop deals by comparing prices from 16+ retailers.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
