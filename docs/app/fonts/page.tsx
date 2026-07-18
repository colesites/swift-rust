"use client";
import { useMemo, useState } from "react";
import {
  DxSlight,
  DxSlightExtBdUltraSlant,
  DxSlightMediumUltra,
  Lausanne,
  localFontCss,
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

const GOOGLE_ENTRIES = (Object.entries(googleFonts) as Array<[string, unknown]>).reduce<
  GoogleEntry[]
>((entries, [name, factory]) => {
  if (
    name !== "ALL_GOOGLE_FONTS" &&
    name !== "googleFontsUrl" &&
    name !== "preloadLink" &&
    name !== "default" &&
    typeof factory === "function"
  ) {
    entries.push({ name, factory: factory as FontFactory });
  }
  return entries;
}, []);

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
const GOOGLE_PAGE_SIZE = 24;

export default function FontsPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"google" | "local">("google");
  const [visibleGoogleCount, setVisibleGoogleCount] = useState(GOOGLE_PAGE_SIZE);

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
  const visibleGoogle = filteredGoogle.slice(0, visibleGoogleCount);

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
          onClick={() => {
            setTab("google");
            setVisibleGoogleCount(GOOGLE_PAGE_SIZE);
          }}
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
        className="font-search-input"
        type="search"
        placeholder={`Search ${tab === "google" ? `${GOOGLE_ENTRIES.length.toLocaleString()} Google` : "local"} fonts…`}
        value={query}
        onChange={(e) => {
          setQuery((e.target as HTMLInputElement).value);
          setVisibleGoogleCount(GOOGLE_PAGE_SIZE);
        }}
      />

      {tab === "local" && <style>{localFontCssText}</style>}

      {tab === "google" && (
        <div>
          {filteredGoogle.length === 0 ? (
            <p style={{ color: "var(--fg-muted)" }}>No fonts match "{query}".</p>
          ) : (
            <p style={{ fontSize: "0.875rem", color: "var(--fg-subtle)", marginBottom: "1rem" }}>
              Showing {visibleGoogle.length} of {filteredGoogle.length.toLocaleString()} matching
              fonts
            </p>
          )}
          <div className="font-preview-grid">
            {visibleGoogle.map((entry) => {
              const font = entry.factory();
              return (
                <div key={entry.name} className="font-preview-item" style={font.style}>
                  <div className="font-preview-name">{entry.name}</div>
                  <div className="font-preview-sample" style={font.style}>
                    {HEADLINE}
                  </div>
                  <div className="font-preview-weight">
                    <code style={{ fontSize: "0.75rem" }}>{entry.name.replace(/ /g, "")}</code>
                  </div>
                </div>
              );
            })}
          </div>
          {visibleGoogle.length < filteredGoogle.length && (
            <button
              type="button"
              className="outline"
              style={{ marginTop: "1.5rem" }}
              onClick={() => setVisibleGoogleCount((count) => count + GOOGLE_PAGE_SIZE)}
            >
              Show {Math.min(GOOGLE_PAGE_SIZE, filteredGoogle.length - visibleGoogle.length)} more
            </button>
          )}
        </div>
      )}

      {tab === "local" && (
        <div>
          {filteredLocal.length === 0 ? (
            <p style={{ color: "var(--fg-muted)" }}>No local fonts match "{query}".</p>
          ) : (
            <p style={{ fontSize: "0.875rem", color: "var(--fg-subtle)", marginBottom: "1rem" }}>
              {filteredLocal.length} local font{filteredLocal.length === 1 ? "" : "s"}
            </p>
          )}
          <div className="font-preview-grid">
            {filteredLocal.map((entry) => {
              const font = entry.factory();
              return (
                <div key={entry.name} className="font-preview-item" style={font.style}>
                  <div className="font-preview-name">{entry.name}</div>
                  <div className="font-preview-sample" style={font.style}>
                    {HEADLINE}
                  </div>
                  <div className="font-preview-weight">
                    <code style={{ fontSize: "0.75rem" }}>{entry.weights}</code>
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
