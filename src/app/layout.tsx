import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "krex.dll",
  description: "everyone heard about me but no one knows me.",
  keywords: "portfolio, web developer, frontend developer, React, Next.js, TypeScript, krex.dll, werzy",
  authors: [{ name: "Krex" }],
  
  openGraph: {
    title: "krex.dll - Portfolio",
    description: "everyone heard about me but no one knows me.",
    url: "https://krex38.dev",
    siteName: "krex.dll Portfolio",
    images: [
      {
        url: "/assets/og-image.png",
        width: 960,
        height: 540,
        alt: "krex.dll - Portfolio",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) 
{
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white overflow-x-hidden`}
        suppressHydrationWarning={true}
      >
        <div id="root" className="min-h-screen">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}