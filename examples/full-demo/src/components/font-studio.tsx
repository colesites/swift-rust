"use client";

import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  BebasNeue,
  BricolageGrotesque,
  Caveat,
  Cinzel,
  DmSans,
  DmSerifDisplay,
  Figtree,
  FiraCode,
  Geist,
  GeistMono,
  IbmPlexMono,
  IbmPlexSans,
  IbmPlexSerif,
  Inter,
  JetbrainsMono,
  Lora,
  Manrope,
  Outfit,
  PlayfairDisplay,
  PlusJakartaSans,
  Poppins,
  Roboto,
  Sora,
  SourceCodePro,
  SpaceGrotesk,
} from "swift-rust/font/google";

type Factory = (opts?: { variable?: boolean }) => {
  className: string;
  style: Record<string, string>;
  variable?: string;
};

type StudioFont = {
  name: string;
  importName: string;
  factory: Factory;
  blurb: string;
};

const STUDIO_FONTS: StudioFont[] = [
  { name: "Geist", importName: "Geist", factory: Geist as Factory, blurb: "Default UI font" },
  { name: "Geist Mono", importName: "GeistMono", factory: GeistMono as Factory, blurb: "Default monospace" },
  { name: "Inter", importName: "Inter", factory: Inter as Factory, blurb: "Designed for screens" },
  { name: "Roboto", importName: "Roboto", factory: Roboto as Factory, blurb: "Modern, friendly" },
  { name: "Poppins", importName: "Poppins", factory: Poppins as Factory, blurb: "Geometric, warm" },
  { name: "Manrope", importName: "Manrope", factory: Manrope as Factory, blurb: "Clean sans for editorial" },
  { name: "IBM Plex Sans", importName: "IbmPlexSans", factory: IbmPlexSans as Factory, blurb: "Corporate sans" },
  { name: "Space Grotesk", importName: "SpaceGrotesk", factory: SpaceGrotesk as Factory, blurb: "Quirky display" },
  { name: "Plus Jakarta Sans", importName: "PlusJakartaSans", factory: PlusJakartaSans as Factory, blurb: "Elegant, modern" },
  { name: "Outfit", importName: "Outfit", factory: Outfit as Factory, blurb: "Geometric for branding" },
  { name: "Figtree", importName: "Figtree", factory: Figtree as Factory, blurb: "Friendly, approachable" },
  { name: "Sora", importName: "Sora", factory: Sora as Factory, blurb: "Clean, made for UI" },
  { name: "DM Sans", importName: "DmSans", factory: DmSans as Factory, blurb: "Low-contrast geometric" },
  { name: "Playfair Display", importName: "PlayfairDisplay", factory: PlayfairDisplay as Factory, blurb: "Editorial elegance" },
  { name: "Lora", importName: "Lora", factory: Lora as Factory, blurb: "Balanced serif" },
  { name: "DM Serif Display", importName: "DmSerifDisplay", factory: DmSerifDisplay as Factory, blurb: "Editorial display" },
  { name: "IBM Plex Serif", importName: "IbmPlexSerif", factory: IbmPlexSerif as Factory, blurb: "Corporate serif" },
  { name: "JetBrains Mono", importName: "JetbrainsMono", factory: JetbrainsMono as Factory, blurb: "Code editor" },
  { name: "Fira Code", importName: "FiraCode", factory: FiraCode as Factory, blurb: "Monospace ligatures" },
  { name: "Source Code Pro", importName: "SourceCodePro", factory: SourceCodePro as Factory, blurb: "Adobe monospace" },
  { name: "IBM Plex Mono", importName: "IbmPlexMono", factory: IbmPlexMono as Factory, blurb: "Corporate mono" },
  { name: "Bricolage Grotesque", importName: "BricolageGrotesque", factory: BricolageGrotesque as Factory, blurb: "Bold display sans" },
  { name: "Bebas Neue", importName: "BebasNeue", factory: BebasNeue as Factory, blurb: "All-caps display" },
  { name: "Cinzel", importName: "Cinzel", factory: Cinzel as Factory, blurb: "Roman capitals" },
  { name: "Caveat", importName: "Caveat", factory: Caveat as Factory, blurb: "Casual handwriting" },
];

const WEIGHTS = [
  { value: 100, label: "Thin", abbr: "100" },
  { value: 200, label: "ExtraLight", abbr: "200" },
  { value: 300, label: "Light", abbr: "300" },
  { value: 400, label: "Regular", abbr: "400" },
  { value: 500, label: "Medium", abbr: "500" },
  { value: 600, label: "SemiBold", abbr: "600" },
  { value: 700, label: "Bold", abbr: "700" },
  { value: 800, label: "ExtraBold", abbr: "800" },
  { value: 900, label: "Black", abbr: "900" },
] as const;

const SAMPLES = [
  "Beautiful type",
  "The quick brown fox jumps over the lazy dog",
  "AaBbCc 1234567890",
  "Ship fast, sleep well",
] as const;

function toImportName(name: string): string {
  return name.replace(/[\s-]+/g, "");
}

export function FontStudio() {
  const [fontName, setFontName] = useState("Geist");
  const [weight, setWeight] = useState(600);
  const [italic, setItalic] = useState(false);
  const [size, setSize] = useState(96);
  const [tracking, setTracking] = useState(-3);
  const [leading, setLeading] = useState(1.1);
  const [sample, setSample] = useState("Beautiful type");
  const [customFont, setCustomFont] = useState("");

  useEffect(() => {
    const trimmed = customFont.trim();
    if (!trimmed) return;
    const family = trimmed.replace(/\s+/g, "+");
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
    link.dataset.swiftRustDynamicFont = trimmed;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [customFont]);

  const entry = useMemo(
    () => STUDIO_FONTS.find((f) => f.name === fontName) ?? STUDIO_FONTS[0]!,
    [fontName],
  );
  const loadedFont = entry.factory();

  const activeFontFamily = customFont.trim()
    ? `'${customFont}', system-ui, sans-serif`
    : (loadedFont.style.fontFamily ?? `'${entry.name}', system-ui, sans-serif`);
  const activeImportName = customFont.trim() ? toImportName(customFont) : entry.importName;

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-sm">
      <div className="flex items-center justify-between border-b border-border bg-surface-2 px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="text-xs font-medium uppercase tracking-wider text-fg-muted">
            Typography studio
          </span>
        </div>
        <span className="font-mono text-xs text-fg-subtle">
          {entry.name} · {weight} · {italic ? "italic" : "roman"}
        </span>
      </div>

      <div className="grid gap-0 lg:grid-cols-[20rem_1fr]">
        <div className="border-b border-border p-6 lg:border-b-0 lg:border-r">
          <div className="space-y-5">
            <div>
              <label
                htmlFor="studio-font"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-fg-subtle"
              >
                Font
              </label>
              <select
                id="studio-font"
                value={fontName}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  setFontName(e.target.value);
                  setCustomFont("");
                }}
                className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft"
              >
                {STUDIO_FONTS.map((f) => (
                  <option key={f.name} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="studio-weight"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-fg-subtle"
              >
                Weight
              </label>
              <select
                id="studio-weight"
                value={weight}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setWeight(Number(e.target.value))
                }
                className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft"
              >
                {WEIGHTS.map((w) => (
                  <option key={w.value} value={w.value}>
                    {w.value} — {w.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-fg-subtle">
                Style
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setItalic(false)}
                  className={`flex-1 h-10 rounded-md text-sm font-medium transition-colors ${
                    !italic
                      ? "bg-fg text-bg"
                      : "border border-border bg-surface text-fg-muted hover:text-fg"
                  }`}
                >
                  Regular
                </button>
                <button
                  type="button"
                  onClick={() => setItalic(true)}
                  className={`flex-1 h-10 rounded-md text-sm font-medium transition-colors ${
                    italic
                      ? "bg-fg text-bg"
                      : "border border-border bg-surface text-fg-muted hover:text-fg"
                  }`}
                >
                  Italic
                </button>
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-baseline justify-between">
                <label
                  htmlFor="studio-size"
                  className="text-xs font-medium uppercase tracking-wider text-fg-subtle"
                >
                  Size
                </label>
                <span className="font-mono text-xs text-fg-muted">{size}px</span>
              </div>
              <input
                id="studio-size"
                type="range"
                min={16}
                max={160}
                value={size}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSize(Number(e.target.value))
                }
                className="w-full accent-accent"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-baseline justify-between">
                <label
                  htmlFor="studio-tracking"
                  className="text-xs font-medium uppercase tracking-wider text-fg-subtle"
                >
                  Tracking
                </label>
                <span className="font-mono text-xs text-fg-muted">
                  {tracking >= 0 ? "+" : ""}
                  {tracking}
                </span>
              </div>
              <input
                id="studio-tracking"
                type="range"
                min={-10}
                max={20}
                value={tracking}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setTracking(Number(e.target.value))
                }
                className="w-full accent-accent"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-baseline justify-between">
                <label
                  htmlFor="studio-leading"
                  className="text-xs font-medium uppercase tracking-wider text-fg-subtle"
                >
                  Line height
                </label>
                <span className="font-mono text-xs text-fg-muted">
                  {leading.toFixed(2)}
                </span>
              </div>
              <input
                id="studio-leading"
                type="range"
                min={0.8}
                max={2}
                step={0.05}
                value={leading}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setLeading(Number(e.target.value))
                }
                className="w-full accent-accent"
              />
            </div>

            <div>
              <label
                htmlFor="studio-custom"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-fg-subtle"
              >
                Any of 2,071 Google fonts
              </label>
              <input
                id="studio-custom"
                type="search"
                value={customFont}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomFont(e.target.value)}
                placeholder="e.g. Fraunces, IBM Plex Sans KR, Anton"
                className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div
            className="flex-1 overflow-auto px-8 py-12 sm:px-12 sm:py-16"
            style={{
              fontFamily: activeFontFamily,
              fontSize: `${size}px`,
              fontWeight: weight,
              fontStyle: italic ? "italic" : "normal",
              letterSpacing: `${tracking / 100}em`,
              lineHeight: leading,
              color: "var(--color-fg)",
              wordBreak: "break-word",
            }}
          >
            {sample}
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border bg-surface-2 px-6 py-3">
            <span className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
              Sample
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSample(s)}
                  className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                    sample === s
                      ? "bg-fg text-bg"
                      : "border border-border bg-surface text-fg-muted hover:text-fg"
                  }`}
                >
                  {s.length > 24 ? `${s.slice(0, 22)}…` : s}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={sample}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSample(e.target.value)}
              className="ml-auto h-8 min-w-0 max-w-xs flex-1 rounded-md border border-border bg-surface px-3 text-xs text-fg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft"
              placeholder="Type to preview…"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-bg px-6 py-4 font-mono text-xs">
        <span className="text-accent">import</span>
        {" { "}
        <span className="text-fg">{activeImportName}</span>
        {" } "}
        <span className="text-accent">from</span>
        <span className="text-success">{" "}&quot;swift-rust/font/google&quot;</span>
        <span className="text-fg-muted">;</span>
      </div>
    </div>
  );
}
