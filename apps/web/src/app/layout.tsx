import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { siteConfig } from "@/lib/site.config";
import { Geist, GeistMono } from "swift-rust/font/google";

const OG_IMAGE = `${siteConfig.url}/og-image.png`;

const geist = Geist({ variable: true, subsets: ["latin"] });
const geistMono = GeistMono({ variable: true, subsets: ["latin"] });

const fontSansClass = geist.className;
const fontMonoClass = geistMono.className;

export const metadata = {
  title: {
    template: "%s | Swift Rust",
    default: "Swift Rust — The React framework powered with Rust + Bun",
  },
  description:
    "Swift Rust is a Next.js-compatible full-stack React framework powered with Rust + Bun. TSX, streaming SSR, four rendering modes, 10x faster than Next.js, single binary deploy.",
  openGraph: {
    title: "Swift Rust",
    description: "The React framework powered with Rust + Bun.",
    type: "website",
    url: siteConfig.url,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Swift Rust" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Swift Rust",
    description: "The React framework powered with Rust + Bun.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable ?? ""} ${geistMono.variable ?? ""} ${fontSansClass} ${fontMonoClass}`.trim()}
      style={{
        ["--font-sans" as string]: "'Geist', system-ui, sans-serif",
        ["--font-mono" as string]: "'Geist Mono', ui-monospace, monospace",
      }}
    >
      <body className="min-h-screen bg-[var(--color-bg)] font-sans text-[var(--color-fg)] antialiased">
        <Nav />
        <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
