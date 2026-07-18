import { NAV } from "../navigation";

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
