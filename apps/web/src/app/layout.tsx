import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage-grotesque",
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
        url: "https://tracemark.fun/og.png",
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
    description:
      "A Chrome extension that lets you markup/annotate any webpage and copy/export the result as an image.",
    card: "summary_large_image",
    images: ["https://tracemark.fun/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${bricolageGrotesque.variable}`}
    >
      <body className="flex min-h-screen flex-col antialiased">
        <Navbar />
        {children}
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
