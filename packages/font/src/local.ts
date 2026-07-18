import type { FontOptions, LoadedFont } from "./index.js";
import { normalizeClassName } from "./index.js";

export interface LocalFontSource {
  path: string;
  weight?: string | number;
  style?: "normal" | "italic";
  format?: "woff2" | "woff" | "truetype" | "opentype" | "embedded-opentype";
}

export interface LocalFontOptions extends FontOptions {
  src: string | LocalFontSource | Array<string | LocalFontSource>;
  declarations?: Array<{ prop: string; value: string }>;
  family?: string;
}

type BrowserStyleElement = {
  textContent?: string | null;
  setAttribute(name: string, value: string): void;
};

type BrowserDocument = {
  head?: { appendChild(node: BrowserStyleElement): void };
  createElement(tagName: string): BrowserStyleElement;
  querySelector(selector: string): BrowserStyleElement | null;
};

function toSource(input: string | LocalFontSource): LocalFontSource {
  if (typeof input === "string") {
    const format = inferFormat(input);
    return { path: input, format, weight: 400, style: "normal" };
  }
  return { format: "woff2", weight: 400, style: "normal", ...input };
}

function inferFormat(path: string): LocalFontSource["format"] {
  const ext = path.split(".").pop()?.toLowerCase();
  if (ext === "woff2") return "woff2";
  if (ext === "woff") return "woff";
  if (ext === "ttf") return "truetype";
  if (ext === "otf") return "opentype";
  if (ext === "eot") return "embedded-opentype";
  return "woff2";
}

function _buildFaceDecl(source: LocalFontSource): string {
  const format = source.format ?? inferFormat(source.path);
  return `url("${source.path}") format("${format}")`;
}

function localFamilyCss(
  family: string,
  className: string,
  sources: ReadonlyArray<LocalFontSource>,
  display: FontOptions["display"] = "swap",
  declarations: LocalFontOptions["declarations"] = [],
): string {
  const faces = sources
    .map(
      (source) => `@font-face {
  font-family: "${family}";
  src: ${_buildFaceDecl(source)};
  font-weight: ${source.weight ?? 400};
  font-style: ${source.style ?? "normal"};
  font-display: ${display};
${declarations.map(({ prop, value }) => `  ${prop}: ${value};`).join("\n")}
}`,
    )
    .join("\n");
  const value = `'${family}', system-ui, sans-serif`;
  return `${faces}
.${className}{font-family:${value}}.${className}_variable{--font-${className
    .replace(/^__swift_rust_font_/, "")
    .replace(/_/g, "-")}:${value}}`;
}

function registerLocalFontCss(key: string, css: string): void {
  const globals = globalThis as unknown as {
    __SR_LOCAL_FONT_CSS__?: Set<string>;
    document?: BrowserDocument;
  };
  if (!globals.__SR_LOCAL_FONT_CSS__) globals.__SR_LOCAL_FONT_CSS__ = new Set<string>();
  globals.__SR_LOCAL_FONT_CSS__.add(css);
  const doc = globals.document;
  if (!doc?.head || doc.querySelector(`style[data-swift-rust-local-font="${key}"]`)) return;
  const style = doc.createElement("style");
  style.textContent = css;
  style.setAttribute("data-swift-rust-local-font", key);
  doc.head.appendChild(style);
}

export function localFont(options: LocalFontOptions): LoadedFont {
  const sources = Array.isArray(options.src) ? options.src : [options.src];
  const parsed = sources.map(toSource);
  const first = parsed[0];
  if (!first) throw new Error("localFont: at least one src is required");
  const family =
    options.family ??
    first.path
      .split("/")
      .pop()
      ?.replace(/\.[^.]+$/, "")
      ?.replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) ??
    "LocalFont";

  const className = normalizeClassName(family);
  registerLocalFontCss(
    className,
    localFamilyCss(family, className, parsed, options.display, options.declarations),
  );

  return {
    className,
    style: { fontFamily: `'${family}'` },
    variable: options.variable ? `${className}_variable` : undefined,
  };
}

export const LAUSANNE_PATHS = {
  regular: "/_swift-rust/fonts/Lausanne.otf",
} as const;

export const DX_SLIGHT_PATHS = {
  mediumultra: "/_swift-rust/fonts/dx-slight-font/dxslight-mediumultra-free-personal-use.otf",
  extbdultraslant:
    "/_swift-rust/fonts/dx-slight-font/dxslight-extbdultraslant-free-personal-use.otf",
} as const;

export const VARENT_PATHS = {
  bold: "/_swift-rust/fonts/varent-font-family/VarentGrotesk-Bold.otf",
  extLtIta: "/_swift-rust/fonts/varent-font-family/VarentGrotesk-ExtLtIta.otf",
} as const;

export const ZIMULA_PATHS = {
  "100": "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialThin-BF668e04625c90d.otf",
  "200": "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialExtraLight-BF668e045fcee5d.otf",
  "300": "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialLight-BF668e04604745c.otf",
  "400": "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialRegular-BF668e0461647e9.otf",
  "500": "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialMedium-BF668e0461113f6.otf",
  "600": "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialSemBdInkTrap-BF668e04622d6c8.otf",
  "700": "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialBold-BF668e045c58270.otf",
  "800": "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialExtraBold-BF668e045eba841.otf",
  "900": "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialBlack-BF668e045b2a9b6.otf",
  "100-ink-trap":
    "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialThinInkTrap-BF668e046255f82.otf",
  "200-ink-trap":
    "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialExtLtInkTrap-BF668e04600d505.otf",
  "300-ink-trap":
    "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialLightInkTrap-BF668e046080861.otf",
  "400-ink-trap":
    "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialRegInkTrap-BF668e0461cc57b.otf",
  "500-ink-trap":
    "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialMedInkTrap-BF668e04616fa54.otf",
  "600-ink-trap":
    "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialSemBdInkTrap-BF668e04622d6c8.otf",
  "700-ink-trap":
    "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialBoldInkTrap-BF668e045d3b87d.otf",
  "800-ink-trap":
    "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialExtBdInkTrap-BF668e045f586a1.otf",
  "900-ink-trap":
    "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialBlackInkTrap-BF668e045be0cd8.otf",
  "100-ink-spot":
    "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialThinInkSpot-BF668e046255f82.otf",
  "300-ink-spot":
    "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialLightInkSpot-BF668e046080861.otf",
  "400-ink-spot":
    "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialRegInkSpot-BF668e0461db401.otf",
  "600-ink-spot":
    "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialSemBdInkSpot-BF668e0462392d9.otf",
  "700-ink-spot":
    "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialBoldInkSpot-BF668e045cb42cf.otf",
  "800-ink-spot":
    "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialExtBdInkSpot-BF668e045ec2d36.otf",
  "900-ink-spot":
    "/_swift-rust/fonts/zimula-font-family/ZimulaTrial-TrialBlackInkSpot-BF668e045bb7998.otf",
} as const;

function buildLocalFamily(
  family: string,
  sources: ReadonlyArray<{ path: string; weight: number; style: "normal" | "italic" }>,
  variable: boolean,
  cssFamily = family,
): LoadedFont {
  const fallback = ["system-ui", "sans-serif"];
  const first = sources[0];
  const className = normalizeClassName(family);
  registerLocalFontCss(className, localFamilyCss(cssFamily, className, sources));
  return {
    className,
    style: {
      fontFamily: `'${cssFamily}', ${fallback.join(", ")}`,
      ...(sources.length === 1 && first
        ? { fontWeight: String(first.weight), fontStyle: first.style }
        : {}),
    },
    variable: variable ? `${normalizeClassName(family)}_variable` : undefined,
  };
}

export const Lausanne = (options: FontOptions = {}): LoadedFont =>
  buildLocalFamily(
    "Lausanne",
    [{ path: LAUSANNE_PATHS.regular, weight: 400, style: "normal" }],
    options.variable ?? false,
  );

export const DxSlight = (options: FontOptions = {}): LoadedFont =>
  buildLocalFamily(
    "DxSlight",
    [
      { path: DX_SLIGHT_PATHS.mediumultra, weight: 500, style: "normal" },
      { path: DX_SLIGHT_PATHS.extbdultraslant, weight: 800, style: "italic" },
    ],
    options.variable ?? false,
  );

export const DxSlightMediumUltra = (options: FontOptions = {}): LoadedFont =>
  buildLocalFamily(
    "DxSlight Medium Ultra",
    [{ path: DX_SLIGHT_PATHS.mediumultra, weight: 500, style: "normal" }],
    options.variable ?? false,
    "DxSlight",
  );

export const DxSlightExtBdUltraSlant = (options: FontOptions = {}): LoadedFont =>
  buildLocalFamily(
    "DxSlight ExtBd UltraSlant",
    [{ path: DX_SLIGHT_PATHS.extbdultraslant, weight: 800, style: "italic" }],
    options.variable ?? false,
    "DxSlight",
  );

export const VarentGrotesk = (options: FontOptions = {}): LoadedFont =>
  buildLocalFamily(
    "Varent Grotesk",
    [
      { path: VARENT_PATHS.bold, weight: 700, style: "normal" },
      { path: VARENT_PATHS.extLtIta, weight: 200, style: "italic" },
    ],
    options.variable ?? false,
  );

export const VarentGroteskBold = (options: FontOptions = {}): LoadedFont =>
  buildLocalFamily(
    "Varent Grotesk Bold",
    [{ path: VARENT_PATHS.bold, weight: 700, style: "normal" }],
    options.variable ?? false,
    "Varent Grotesk",
  );

export const VarentGroteskExtLtIta = (options: FontOptions = {}): LoadedFont =>
  buildLocalFamily(
    "Varent Grotesk ExtLtIta",
    [{ path: VARENT_PATHS.extLtIta, weight: 200, style: "italic" }],
    options.variable ?? false,
    "Varent Grotesk",
  );

export const Zimula = (options: FontOptions = {}): LoadedFont =>
  buildLocalFamily(
    "Zimula",
    Object.entries(ZIMULA_PATHS).map(([key, path]) => {
      const match = key.match(/^(\d+)(-(ink-trap|ink-spot))?$/);
      const weight = match?.[1] ? Number.parseInt(match[1], 10) : 400;
      const style: "normal" | "italic" = "normal";
      void style;
      return { path, weight, style };
    }),
    options.variable ?? false,
  );

export const ALL_LOCAL_FONTS = {
  Lausanne,
  DxSlight,
  DxSlightMediumUltra,
  DxSlightExtBdUltraSlant,
  VarentGrotesk,
  VarentGroteskBold,
  VarentGroteskExtLtIta,
  Zimula,
} as const;

export const ALL_LOCAL_FONT_PATHS = {
  ...LAUSANNE_PATHS,
  ...DX_SLIGHT_PATHS,
  ...VARENT_PATHS,
  ...ZIMULA_PATHS,
} as const;

export function localFontCss(): string {
  const decls: string[] = [];

  decls.push(`
@font-face {
  font-family: "Lausanne";
  src: url("${LAUSANNE_PATHS.regular}") format("opentype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}`);

  decls.push(`
@font-face {
  font-family: "DxSlight";
  src: url("${DX_SLIGHT_PATHS.mediumultra}") format("opentype");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "DxSlight";
  src: url("${DX_SLIGHT_PATHS.extbdultraslant}") format("opentype");
  font-weight: 800;
  font-style: italic;
  font-display: swap;
}`);

  decls.push(`
@font-face {
  font-family: "Varent Grotesk";
  src: url("${VARENT_PATHS.bold}") format("opentype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Varent Grotesk";
  src: url("${VARENT_PATHS.extLtIta}") format("opentype");
  font-weight: 200;
  font-style: italic;
  font-display: swap;
}`);

  const zimulaDecls = Object.entries(ZIMULA_PATHS)
    .map(([key, path]) => {
      const match = key.match(/^(\d+)(-(ink-(trap|spot)))?$/);
      const weight = match?.[1] ? match[1] : "400";
      const variant = match?.[4] ?? null;
      const variantLabel = variant === "trap" ? " Ink Trap" : variant === "spot" ? " Ink Spot" : "";
      return `
@font-face {
  font-family: "Zimula${variantLabel.replace(/\s/g, "")}";
  src: url("${path}") format("opentype");
  font-weight: ${weight};
  font-style: normal;
  font-display: swap;
}`;
    })
    .join("\n");
  decls.push(zimulaDecls);

  const families = [
    ["Lausanne", "Lausanne"],
    ["DxSlight", "DxSlight"],
    ["DxSlight Medium Ultra", "DxSlight"],
    ["DxSlight ExtBd UltraSlant", "DxSlight"],
    ["Varent Grotesk", "Varent Grotesk"],
    ["Varent Grotesk Bold", "Varent Grotesk"],
    ["Varent Grotesk ExtLtIta", "Varent Grotesk"],
    ["Zimula", "Zimula"],
  ] as const;
  decls.push(
    families
      .map(([name, cssFamily]) => {
        const className = normalizeClassName(name);
        const value = `'${cssFamily}', system-ui, sans-serif`;
        return `.${className}{font-family:${value}}.${className}_variable{--font-${name
          .toLowerCase()
          .replace(/\s+/g, "-")}:${value}}`;
      })
      .join("\n"),
  );

  return decls.join("\n\n");
}
