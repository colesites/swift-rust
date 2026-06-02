import type { ReactNode } from "react";

import { Pdf, PdfError } from "./viewer";
export { Pdf, PdfError };
export type {
  PdfErrorKind,
  PdfLoadInfo,
  PdfProps,
  PdfScale,
  PdfSource,
} from "./viewer";

export type PageSize = "A4" | "A3" | "Letter" | "Legal" | "Tabloid";
export type Orientation = "portrait" | "landscape";

export interface DocumentProps {
  title?: string;
  author?: string;
  subject?: string;
  children: ReactNode;
}

export function Document({ title, author, subject, children }: DocumentProps) {
  return { type: "document" as const, title, author, subject, children };
}

export interface PageProps {
  size?: PageSize;
  orientation?: Orientation;
  margin?: number;
  children: ReactNode;
}

export function Page({ size = "A4", orientation = "portrait", margin = 50, children }: PageProps) {
  return { type: "page" as const, size, orientation, margin, children };
}

export interface TextProps {
  children: ReactNode;
  x?: number;
  y?: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
}

export function Text({ children, x = 0, y = 0, fontSize = 12, fontFamily, color }: TextProps) {
  return { type: "text" as const, x, y, fontSize, fontFamily, color, text: String(children) };
}

export interface ViewProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  children: ReactNode;
  style?: Record<string, string | number>;
}

export function View({ x = 0, y = 0, width, height, children, style }: ViewProps) {
  return { type: "view" as const, x, y, width, height, style, children };
}

export type PdfNode =
  | ReturnType<typeof Document>
  | ReturnType<typeof Page>
  | ReturnType<typeof Text>
  | ReturnType<typeof View>;

export default { Document, Page, Text, View, Pdf };
