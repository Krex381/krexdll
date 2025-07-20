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
  title: {
    default: "Krex38 - krex.dll | Portfolio & Development",
    template: "%s | Krex38 - krex.dll"
  },
  description: "Krex38 official portfolio - Everyone heard about me but no one knows me. Professional web developer specializing in React, Next.js, and modern web technologies. krex.dll developer portfolio.",
  keywords: [
    "krex38", 
    "krex.dll", 
    "krex", 
    "krex38 portfolio", 
    "krex38 developer", 
    "krex38 web developer",
    "portfolio", 
    "web developer", 
    "frontend developer", 
    "fullstack developer",
    "React developer", 
    "Next.js developer", 
    "TypeScript developer", 
    "JavaScript developer",
    "modern web development",
    "responsive design",
    "UI/UX developer",
    "werzy",
    "krex38.xyz"
  ].join(", "),
  authors: [{ name: "Krex38", url: "https://krex38.xyz" }],
  creator: "Krex38",
  publisher: "Krex38",
  
  openGraph: {
    title: "Krex38 - krex.dll | Official Portfolio",
    description: "Krex38 official portfolio - Everyone heard about me but no one knows me. Professional web developer and krex.dll creator.",
    url: "https://krex38.xyz",
    siteName: "Krex38 Portfolio",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Krex38 - krex.dll Portfolio | Professional Web Developer",
        type: "image/png",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Krex38 - krex.dll | Portfolio",
    description: "Krex38 official portfolio - Professional web developer and krex.dll creator.",
    images: ["/assets/og-image.png"],
    creator: "@krex38",
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
  
  alternates: {
    canonical: "https://krex38.xyz",
  },
  
  category: "technology",
  
  other: {
    "google-site-verification": "your-google-verification-code-here",
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Krex38",
    "alternateName": "krex.dll",
    "url": "https://krex38.xyz",
    "image": "https://krex38.xyz/assets/main_pp.jpg",
    "sameAs": [
      "https://github.com/Krex381/krexdll",
      "https://krex38.xyz"
    ],
    "jobTitle": "Web Developer",
    "description": "Professional web developer specializing in React, Next.js, and modern web technologies. Creator of krex.dll portfolio.",
    "knowsAbout": [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Web Development",
      "Frontend Development",
      "UI/UX Design"
    ],
    "brand": {
      "@type": "Brand",
      "name": "krex.dll"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/assets/main_pp.jpg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
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