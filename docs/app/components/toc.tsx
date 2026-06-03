"use client";
import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

/**
 * "On this page" navigation, shadcn-style. Scans the rendered article for
 * h2/h3 headings, assigns ids where missing, and highlights the section
 * currently in view as the reader scrolls.
 */
export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const main = document.querySelector(".docs-main");
    if (!main) return;
    const nodes = Array.from(main.querySelectorAll<HTMLElement>("h2, h3"));
    const collected: Heading[] = nodes.map((node) => {
      if (!node.id) node.id = slugify(node.textContent ?? "");
      return {
        id: node.id,
        text: node.textContent ?? "",
        level: node.tagName === "H3" ? 3 : 2,
      };
    });
    setHeadings(collected);

    if (collected.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "0px 0px -75% 0px", threshold: 1.0 },
    );
    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return <aside className="docs-toc" aria-hidden="true" />;

  return (
    <aside className="docs-toc">
      <div className="docs-toc-inner">
        <p className="docs-toc-title">On this page</p>
        <ul>
          {headings.map((h) => (
            <li key={h.id} data-level={h.level}>
              <a
                href={`#${h.id}`}
                className={activeId === h.id ? "is-active" : undefined}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
