import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { Navbar } from "@/components/navbar";

const regestoGrotesk = localFont({
  src: [
    {
      path: "../../public/fonts/RegestoGrotesk-Light-BF670354791e938.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/RegestoGrotesk-Regular-BF67035479252e2.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/RegestoGrotesk-Medium-BF67035478ba605.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/RegestoGrotesk-Bold-BF67035478bbf99.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/RegestoGrotesk-Black-BF67035478db36b.woff",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-regesto-grotesk",
});

export const metadata: Metadata = {
  title: "Tracemark",
  description:
    "A Chrome extension that lets you markup/annotate any webpage and copy/export the result as an image.",
  keywords: [
    "website annotation tool",
    "markup tool",
    "webpage markup",
    "annotate websites",
    "screenshot annotation",
    "full page screenshot",
    "viewport screenshot",
    "browser annotation tool",
    "chrome extension annotation",
    "web capture tool",
    "developer annotation tool",
    "design feedback tool",
    "UI feedback tool",
    "website review tool",
    "screen markup tool",
    "Tracemark",
  ],
  openGraph: {
    title: "Tracemark",
    description:
      "A Chrome extension that lets you markup/annotate any webpage and copy/export the result as an image.",
    url: "https://tracemark.fun",
    siteName: "Tracemark",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Tracemark",
      },
    ],
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
  twitter: {
    title: "Tracemark",
    card: "summary_large_image",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${regestoGrotesk.variable} antialiased`}>
        <Navbar />
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
