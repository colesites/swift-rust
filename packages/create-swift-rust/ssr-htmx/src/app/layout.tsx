import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "swift-rust/font/google";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], display: "swap", variable: true });
const geistMono = Geist_Mono({ subsets: ["latin"], display: "swap", variable: true });

export const metadata = {
  title: {
    template: "%s | ssr-htmx",
    default: "ssr-htmx",
  },
  description: "Built with swift-rust — the Next.js alternative powered by Rust.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
