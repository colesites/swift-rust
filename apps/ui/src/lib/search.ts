import { COMPONENT_DOCS } from "./component-docs";
import { COMPONENTS } from "./components";

export interface SearchItem {
  title: string;
  href: string;
  section: string;
  description: string;
  keywords: string;
}

const GUIDE_ITEMS: SearchItem[] = [
  {
    title: "Introduction",
    href: "/docs",
    section: "Get started",
    description: "Learn how the open-code component registry works.",
    keywords: "overview start registry tailwind",
  },
  {
    title: "Installation",
    href: "/docs/installation",
    section: "Get started",
    description: "Install swift-rust ui in a new or existing project.",
    keywords: "setup add bun cli dependencies",
  },
  {
    title: "Theming",
    href: "/docs/theming",
    section: "Get started",
    description: "Configure tokens, light mode, dark mode, and CSS variables.",
    keywords: "colors css theme tokens dark light",
  },
  {
    title: "CLI",
    href: "/docs/cli",
    section: "Get started",
    description: "Initialize the registry and add components from the command line.",
    keywords: "bunx init add list command terminal",
  },
  {
    title: "Components",
    href: "/docs/components",
    section: "Components",
    description: "Browse every component available in the registry.",
    keywords: "catalog registry all",
  },
];

const COMPONENT_ITEMS: SearchItem[] = COMPONENTS.map((component) => ({
  title: component.name,
  href: `/docs/components/${component.slug}`,
  section: "Components",
  description:
    COMPONENT_DOCS[component.slug]?.description ??
    `${component.name} component documentation, installation, usage, and examples.`,
  keywords: `${component.slug.replace(/-/g, " ")} ${component.status} ${
    component.original ? "original new" : ""
  }`,
}));

export const UI_SEARCH_ITEMS = [...GUIDE_ITEMS, ...COMPONENT_ITEMS];

function matchScore(item: SearchItem, query: string): number {
  const title = item.title.toLowerCase();
  const section = item.section.toLowerCase();
  const description = item.description.toLowerCase();
  const keywords = item.keywords.toLowerCase();
  if (title === query) return 0;
  if (title.startsWith(query)) return 1;
  if (title.includes(query)) return 2;
  if (section.includes(query)) return 3;
  if (keywords.includes(query)) return 4;
  if (description.includes(query)) return 5;
  return Number.POSITIVE_INFINITY;
}

export function searchUiDocs(query: string): SearchItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return UI_SEARCH_ITEMS.slice(0, 8);
  return UI_SEARCH_ITEMS.map((item) => ({ item, score: matchScore(item, normalized) }))
    .filter(({ score }) => Number.isFinite(score))
    .sort((a, b) => a.score - b.score || a.item.title.localeCompare(b.item.title))
    .map(({ item }) => item);
}
