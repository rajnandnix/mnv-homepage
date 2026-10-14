import type { Metadata } from "next";
import localFont from "next/font/local";
import { brand, meta, skipLink } from "@/lib/content";
import "./globals.css";

const urbanist = localFont({
  src: [
    { path: "./fonts/urbanist-300.woff2", weight: "300", style: "normal" },
    { path: "./fonts/urbanist-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/urbanist-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/urbanist-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-urbanist",
  display: "swap",
});

const cormorant = localFont({
  src: [{ path: "./fonts/cormorant-garamond-italic-400.woff2", weight: "400", style: "italic" }],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
  fallback: ["Georgia", "serif"],
});

const siteUrl =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/" },
  icons: { icon: "/images/favicon.png" },
  openGraph: {
    type: "website",
    siteName: brand.name,
    locale: "en_GB",
    url: "/",
    title: meta.title,
    description: meta.description,
    images: [
      {
        url: meta.ogImage.src,
        width: meta.ogImage.width,
        height: meta.ogImage.height,
        alt: meta.ogImage.alt,
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${urbanist.variable} ${cormorant.variable} antialiased`}>
      <body>
        <a className="skip-link" href="#main">
          {skipLink}
        </a>
        {children}
      </body>
    </html>
  );
}
