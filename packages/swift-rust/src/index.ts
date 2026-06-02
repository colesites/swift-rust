export type RenderingMode = "ssr" | "ssr-wasm" | "ssr-htmx" | "wasm";

export interface ImageConfig {
  domains?: string[];
  formats?: string[];
  deviceSizes?: number[];
  imageSizes?: number[];
  minimumCacheTTL?: number;
}

export interface FontConfig {
  subsets?: string[];
  display?: "auto" | "block" | "swap" | "fallback" | "optional";
  preload?: boolean;
  adjustFontFallback?: boolean;
  fallback?: string[];
}

export interface PdfConfig {
  defaultPageSize?: "A4" | "A3" | "Letter" | "Legal" | "Tabloid";
  defaultOrientation?: "portrait" | "landscape";
  compress?: boolean;
}

export interface SwiftRustConfig {
  rendering?: RenderingMode;
  image?: ImageConfig;
  font?: FontConfig;
  pdf?: PdfConfig;
}

export function defineConfig(config: SwiftRustConfig): SwiftRustConfig {
  return config;
}

export type Metadata = {
  title?: string | { template: string; default: string };
  description?: string;
  openGraph?: {
    title?: string;
    description?: string;
    type?: string;
    url?: string;
    images?: Array<{ url: string; width?: number; height?: number; alt?: string }>;
  };
  twitter?: {
    card?: "summary" | "summary_large_image";
    title?: string;
    description?: string;
    images?: string[];
  };
  robots?: { index?: boolean; follow?: boolean };
  alternates?: { canonical?: string };
  icons?: { icon?: string; apple?: string };
};

export type { ImageProps, ImageFormat } from "@swift-rust/image";
export { Image } from "@swift-rust/image";
export type {
  FontOptions,
  FontSubset,
  FontDisplay,
  FontWeight,
  FontStyle,
  LoadedFont,
  LocalFontOptions,
  LocalFontSource,
} from "@swift-rust/font";
export {
  localFont,
  Lausanne,
  DxSlight,
  DxSlightMediumUltra,
  DxSlightExtBdUltraSlant,
  VarentGrotesk,
  VarentGroteskBold,
  VarentGroteskExtLtIta,
  Zimula,
  ALL_LOCAL_FONTS,
  ALL_LOCAL_FONT_PATHS,
  localFontCss,
  LAUSANNE_PATHS,
  DX_SLIGHT_PATHS,
  VARENT_PATHS,
  ZIMULA_PATHS,
} from "@swift-rust/font";
export type {
  DocumentProps,
  PageProps as PdfPageProps,
  TextProps,
  ViewProps,
  PageSize,
  Orientation,
} from "@swift-rust/pdf";
export { Document, Page, Text, View } from "@swift-rust/pdf";
export type { LayoutProps, PageProps, RouteHandler, RouteHandlerContext } from "./router";
export type { HeadProps as MetaHeadProps } from "./head";
export type { LinkProps as LinkComponentProps } from "./link";
export { Link } from "./link";
export { Head, Title, Meta, Style } from "./head";
export { notFound, redirect, permanentRedirect } from "./router";
export { NotFoundError, RedirectError } from "./router";
export {
  Video,
  BackgroundVideo,
  VideoLightbox,
  isYouTubeUrl,
  isVimeoUrl,
  getYouTubeId,
  getVimeoId,
  detectProvider,
  getYouTubeEmbedUrl,
  getVimeoEmbedUrl,
} from "./video";
export type {
  VideoProps,
  VideoSource,
  VideoCaption,
  VideoPreload,
  VideoProvider,
  BackgroundVideoProps,
  VideoLightboxProps,
} from "./video";
