import type { ReactNode } from "react";
import "./globals.css";
import { BricolageGrotesque, Geist, GeistMono } from "swift-rust/font/google";
import { SiteHeader } from "@/components/site/header";
import { Analytics } from "@vercel/analytics/next";

const geist = Geist({ variable: true, subsets: ["latin"] });
const geistMono = GeistMono({ variable: true, subsets: ["latin"] });
const bricolage = BricolageGrotesque({ variable: true, subsets: ["latin"] });

export const metadata = {
  title: {
    template: "%s — swift-rust ui",
    default: "swift-rust ui — open-code components for swift-rust",
  },
  description:
    "A professional open-code component registry for swift-rust, built for Tailwind v4.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${geist.variable ?? ""} ${geistMono.variable ?? ""} ${bricolage.variable ?? ""} ${geist.className ?? ""}`.trim()}
      style={{
        ["--font-sans" as string]: "'Geist', system-ui, sans-serif",
        ["--font-mono" as string]: "'Geist Mono', ui-monospace, monospace",
        ["--font-display" as string]:
          "'Bricolage Grotesque', 'Geist', sans-serif",
      }}
    >
      <body className="min-h-screen bg-bg font-sans text-fg antialiased">
        <SiteHeader />
        <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
