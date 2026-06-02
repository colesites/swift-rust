"use client";
import { useMemo, useState } from "react";
import { localFontCss } from "swift-rust/font";
import {
  DxSlight,
  DxSlightExtBdUltraSlant,
  DxSlightMediumUltra,
  Lausanne,
  VarentGrotesk,
  VarentGroteskBold,
  VarentGroteskExtLtIta,
  Zimula,
} from "swift-rust/font";
import * as googleFonts from "swift-rust/font/google";

type FontFactory = (opts?: { variable?: boolean }) => {
  className: string;
  style: React.CSSProperties;
  variable?: string;
};

type GoogleEntry = { name: string; factory: FontFactory };
type LocalEntry = { name: string; factory: FontFactory; weights?: string };

const GOOGLE_ENTRIES: GoogleEntry[] = (Object.entries(googleFonts) as Array<[string, unknown]>)
  .filter(
    ([key]) =>
      key !== "ALL_GOOGLE_FONTS" &&
      key !== "googleFontsUrl" &&
      key !== "preloadLink" &&
      key !== "default",
  )
  .map(([name, factory]) => ({ name, factory: factory as FontFactory }));

const LOCAL_ENTRIES: LocalEntry[] = [
  { name: "Lausanne", factory: Lausanne as FontFactory, weights: "400" },
  { name: "DxSlight", factory: DxSlight as FontFactory, weights: "500, 800 italic" },
  { name: "DxSlight Medium Ultra", factory: DxSlightMediumUltra as FontFactory, weights: "500" },
  {
    name: "DxSlight ExtBd UltraSlant",
    factory: DxSlightExtBdUltraSlant as FontFactory,
    weights: "800 italic",
  },
  { name: "Varent Grotesk", factory: VarentGrotesk as FontFactory, weights: "700, 200 italic" },
  { name: "Varent Grotesk Bold", factory: VarentGroteskBold as FontFactory, weights: "700" },
  {
    name: "Varent Grotesk ExtLtIta",
    factory: VarentGroteskExtLtIta as FontFactory,
    weights: "200 italic",
  },
  { name: "Zimula", factory: Zimula as FontFactory, weights: "100-900 + ink trap + ink spot" },
];

const HEADLINE = "Beautiful typography";

export default function FontsPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"google" | "local">("google");

  const localFontCssText = useMemo(() => localFontCss(), []);

  const filteredGoogle = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GOOGLE_ENTRIES;
    return GOOGLE_ENTRIES.filter((e) => e.name.toLowerCase().includes(q));
  }, [query]);

  const filteredLocal = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LOCAL_ENTRIES;
    return LOCAL_ENTRIES.filter((e) => e.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <div className="badge" style={{ marginBottom: "1rem" }}>
          Fonts
        </div>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Every font, live</h1>
        <p style={{ fontSize: "1.125rem", color: "var(--fg-muted)", maxWidth: "44rem" }}>
          Browse 2,071 Google fonts and all bundled local fonts. Search for a font by name, then
          copy the import statement into your project.
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <button
          type="button"
          onClick={() => setTab("google")}
          className={tab === "google" ? "primary" : "outline"}
        >
          Google ({GOOGLE_ENTRIES.length.toLocaleString()})
        </button>
        <button
          type="button"
          onClick={() => setTab("local")}
          className={tab === "local" ? "primary" : "outline"}
        >
          Local ({LOCAL_ENTRIES.length})
        </button>
      </div>

      <input
        type="search"
        placeholder={`Search ${tab === "google" ? `${GOOGLE_ENTRIES.length.toLocaleString()} Google` : "local"} fonts…`}
        value={query}
        onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
        style={{
          width: "100%",
          padding: "0.75rem 1rem",
          border: "1px solid var(--border-strong)",
          borderRadius: "0.5rem",
          background: "var(--bg-elevated)",
          color: "var(--fg)",
          fontSize: "1rem",
          marginBottom: "2rem",
          fontFamily: "inherit",
        }}
      />

      {tab === "local" && <style>{localFontCssText}</style>}

      {tab === "google" && (
        <div>
          {filteredGoogle.length === 0 ? (
            <p style={{ color: "var(--fg-muted)" }}>No fonts match "{query}".</p>
          ) : (
            <p style={{ fontSize: "0.875rem", color: "var(--fg-subtle)", marginBottom: "1rem" }}>
              Showing {filteredGoogle.length} of {GOOGLE_ENTRIES.length.toLocaleString()} fonts
            </p>
          )}
          <div className="font-preview-grid">
            {filteredGoogle.map((entry) => {
              const font = entry.factory();
              return (
                <div key={entry.name} className="font-preview-item">
                  <div className="font-preview-name">{entry.name}</div>
                  <div className="font-preview-sample" style={font.style}>
                    {HEADLINE}
                  </div>
                  <div className="font-preview-weight">
                    <code style={{ fontSize: "0.7rem" }}>{entry.name.replace(/ /g, "")}</code>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "local" && (
        <div>
          {filteredLocal.length === 0 ? (
            <p style={{ color: "var(--fg-muted)" }}>No local fonts match "{query}".</p>
          ) : (
            <p style={{ fontSize: "0.875rem", color: "var(--fg-subtle)", marginBottom: "1rem" }}>
              {filteredLocal.length} local font{LOCAL_ENTRIES.length === 1 ? "" : "s"}
            </p>
          )}
          <div className="font-preview-grid">
            {filteredLocal.map((entry) => {
              const font = entry.factory();
              return (
                <div key={entry.name} className="font-preview-item">
                  <div className="font-preview-name">{entry.name}</div>
                  <div className="font-preview-sample" style={font.style}>
                    {HEADLINE}
                  </div>
                  <div className="font-preview-weight">
                    <code style={{ fontSize: "0.7rem" }}>{entry.weights}</code>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: "4rem",
          padding: "2rem",
          background: "var(--surface)",
          borderRadius: "0.75rem",
          border: "1px solid var(--border)",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>Using these fonts</h2>
        <p style={{ marginBottom: "1rem" }}>
          Each Google font can be imported by name and called as a function:
        </p>
        <div className="code-block">
          <div className="code-block-header">
            <span>app/layout.tsx</span>
          </div>
          <pre>
            <code>{`import { Inter, Roboto_Mono } from "swift-rust/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: true });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html className={inter.variable}><body>{children}</body></html>;
}`}</code>
          </pre>
        </div>
        <p style={{ marginTop: "1rem" }}>
          Local fonts are loaded with <code>localFont</code>:
        </p>
        <div className="code-block">
          <div className="code-block-header">
            <span>app/fonts.ts</span>
          </div>
          <pre>
            <code>{`import { localFont } from "swift-rust/font/local";

const myFont = localFont({
  src: "./fonts/MyFont.woff2",
  weight: "400 700",
  display: "swap",
});`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
