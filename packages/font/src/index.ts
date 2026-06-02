export type FontDisplay = "auto" | "block" | "swap" | "fallback" | "optional";

export type FontSubset =
  | "latin"
  | "latin-ext"
  | "cyrillic"
  | "cyrillic-ext"
  | "greek"
  | "greek-ext"
  | "vietnamese"
  | "arabic"
  | "hebrew";

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | "variable";

export type FontStyle = "italic" | "normal";

export interface FontOptions {
  subsets?: FontSubset[];
  display?: FontDisplay;
  weight?: FontWeight | FontWeight[];
  style?: FontStyle | FontStyle[];
  variable?: boolean;
  preload?: boolean;
  adjustFontFallback?: boolean;
  fallback?: string[];
}

export interface LoadedFont {
  className: string;
  style: Record<string, string>;
  variable?: string;
}

export function normalizeClassName(family: string): string {
  return `__swift_rust_font_${family.toLowerCase().replace(/\s+/g, "_")}`;
}

export function buildCssVariable(name: string): string {
  return `--font-${name.toLowerCase().replace(/\s+/g, "-")}`;
}

export * from "./google.js";
export * from "./local.js";
