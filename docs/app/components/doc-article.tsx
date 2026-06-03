import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { TableOfContents, type TocItem } from "./toc";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function nodeText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (isValidElement(node)) {
    return nodeText((node.props as { children?: ReactNode }).children);
  }
  return "";
}

/**
 * Walk the page's JSX, collect h2/h3 for the "On this page" list, and inject a
 * stable `id` on each heading so the TOC anchors resolve. Runs on the server —
 * these docs ship no client JS, so the list must be in the HTML.
 */
function collectHeadings(node: ReactNode, headings: TocItem[], used: Set<string>): ReactNode {
  if (Array.isArray(node)) {
    return node.map((child) => collectHeadings(child, headings, used));
  }
  if (!isValidElement(node)) return node;

  const el = node as React.ReactElement<{ id?: string; children?: ReactNode }>;
  if (el.type === "h2" || el.type === "h3") {
    const text = nodeText(el.props.children);
    let id = el.props.id ?? slugify(text);
    while (used.has(id)) id = `${id}-1`;
    used.add(id);
    headings.push({ id, text, level: el.type === "h3" ? 3 : 2 });
    return cloneElement(el, { id });
  }

  if (el.props.children != null) {
    return cloneElement(el, undefined, collectHeadings(el.props.children, headings, used));
  }
  return node;
}

/**
 * Documentation content wrapper: renders the page's content as a centered
 * article with an "On this page" rail on the right. Replaces the bare
 * `<article className="prose">` each doc page used to render.
 */
export function DocArticle({ children }: { children: ReactNode }) {
  const headings: TocItem[] = [];
  const content = collectHeadings(Children.toArray(children), headings, new Set());

  return (
    <div className="doc-article">
      <article className="prose">{content}</article>
      <TableOfContents items={headings} />
    </div>
  );
}
