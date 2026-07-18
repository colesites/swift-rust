import type { ReactNode } from "react";
import { Lausanne } from "swift-rust/font";
import { Geist, Roboto } from "swift-rust/font/google";
const geist = Geist({ subsets: ["latin"], variable: true });
const roboto = Roboto({ subsets: ["latin"], variable: true });
const lausanne = Lausanne({ variable: true });
export const metadata = { title: { default: "Fixture", template: "%s · Fixture" }, description: "test", openGraph: { title: "Fixture", images: [{ url: "https://ex.com/og.png", width: 1200, height: 630 }] } };
export default function RootLayout({ children }: { children: ReactNode }) {
  return (<html lang="en" className={`${geist.variable} ${roboto.variable} ${lausanne.variable}`}><body>{children}</body></html>);
}
