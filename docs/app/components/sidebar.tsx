export const NAV = [
  {
    title: "Getting Started",
    items: [
      { label: "Introduction", href: "/docs" },
      { label: "Installation", href: "/docs/getting-started/installation" },
      { label: "Project structure", href: "/docs/getting-started/project-structure" },
      { label: "Layouts & pages", href: "/docs/getting-started/layouts-and-pages" },
      { label: "Rendering modes", href: "/docs/getting-started/rendering-modes" },
      { label: "Data fetching", href: "/docs/getting-started/data-fetching" },
      { label: "Styling", href: "/docs/getting-started/styling" },
      { label: "Fonts", href: "/docs/getting-started/fonts" },
      { label: "Images", href: "/docs/getting-started/images" },
      { label: "Videos", href: "/docs/getting-started/videos" },
      { label: "PDFs", href: "/docs/getting-started/pdfs" },
      { label: "Deploying", href: "/docs/getting-started/deploying" },
    ],
  },
  {
    title: "Guides",
    items: [
      { label: "Authentication", href: "/docs/guides/auth" },
      { label: "Forms", href: "/docs/guides/forms" },
      { label: "API routes", href: "/docs/guides/api-routes" },
      { label: "Metadata & SEO", href: "/docs/guides/metadata" },
      { label: "Error handling", href: "/docs/guides/error-handling" },
      { label: "Migrating from Next.js", href: "/docs/guides/migrating-from-nextjs" },
      { label: "Single binary deploy", href: "/docs/guides/single-binary-deploy" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { label: "Image", href: "/docs/api-reference/components/image" },
      { label: "Font", href: "/docs/api-reference/components/font" },
      { label: "Video", href: "/docs/api-reference/components/video" },
      { label: "PDF", href: "/docs/api-reference/components/pdf" },
      { label: "Link", href: "/docs/api-reference/components/link" },
      { label: "Head & Meta", href: "/docs/api-reference/components/head" },
      { label: "Hooks", href: "/docs/api-reference/hooks" },
      { label: "Configuration", href: "/docs/api-reference/config" },
      { label: "Router", href: "/docs/api-reference/router" },
      { label: "Errors", href: "/docs/api-reference/errors" },
      { label: "CLI", href: "/docs/api-reference/cli" },
    ],
  },
];

export function Sidebar() {
  return (
    <aside className="docs-sidebar">
      <nav>
        {NAV.map((section) => (
          <div key={section.title} className="docs-sidebar-section">
            <h3>{section.title}</h3>
            <ul>
              {section.items.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
