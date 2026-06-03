export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * "On this page" navigation, rendered on the server from the headings the
 * layout extracts out of each page. No client JS — these docs are static SSR,
 * so the list must exist in the HTML itself.
 */
export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return <aside className="docs-toc" aria-hidden="true" />;
  return (
    <aside className="docs-toc">
      <div className="docs-toc-inner">
        <p className="docs-toc-title">On this page</p>
        <ul>
          {items.map((h) => (
            <li key={h.id} data-level={h.level}>
              <a href={`#${h.id}`}>{h.text}</a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
