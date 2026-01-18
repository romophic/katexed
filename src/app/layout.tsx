import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://romophic.github.io/katexed/'),
  alternates: {
    canonical: '/',
  },
  title: "Katexed - Online LaTeX Equation Editor",
  description: "A fast, lightweight, and real-time online LaTeX equation editor. Render, preview, and export your mathematical formulas as high-quality PNG or SVG images instantly.",
  keywords: ["LaTeX", "Editor", "Equation", "Math", "Formula", "KaTeX", "Online", "Generator", "PNG", "SVG", "Export"],
  authors: [{ name: "romophic", url: "https://romophic.com" }],
  creator: "romophic",
  openGraph: {
    title: "Katexed - Online LaTeX Equation Editor",
    description: "Write, preview, and export LaTeX equations instantly. The fastest way to create math formulas for your documents and web.",
    url: "https://romophic.github.io/katexed/",
    siteName: "Katexed",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Katexed - Online LaTeX Equation Editor",
    description: "Real-time LaTeX editing and high-quality image export.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png", // Assuming user might add this later, or we can use default
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
