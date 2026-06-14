// The component catalog that drives the Components index and the docs sidebar.
//
//   featured  — rebuilt with the variant × size × design dimensions.
//   available — shipping in the @swift-rust/ui registry (installable via the CLI).
//   soon      — planned; not in the registry yet.
//
// `original: true` marks a swift-rust ui original (beyond shadcn parity). They
// live in the same alphabetical list as everything else, with a small badge.

export type ComponentStatus = "featured" | "available" | "soon";

export interface ComponentEntry {
  name: string;
  slug: string;
  status: ComponentStatus;
  original?: boolean;
}

export const COMPONENTS: ComponentEntry[] = [
  { name: "Accordion", slug: "accordion", status: "featured" },
  { name: "Alert", slug: "alert", status: "featured" },
  { name: "Alert Dialog", slug: "alert-dialog", status: "available" },
  { name: "Aspect Ratio", slug: "aspect-ratio", status: "available" },
  { name: "Avatar", slug: "avatar", status: "featured" },
  { name: "Badge", slug: "badge", status: "available" },
  { name: "Breadcrumb", slug: "breadcrumb", status: "available" },
  { name: "Button", slug: "button", status: "featured" },
  { name: "Button Group", slug: "button-group", status: "available" },
  { name: "Calendar", slug: "calendar", status: "available" },
  { name: "Card", slug: "card", status: "featured" },
  { name: "Carousel", slug: "carousel", status: "available" },
  { name: "Chart", slug: "chart", status: "available" },
  { name: "Checkbox", slug: "checkbox", status: "available" },
  { name: "Code Block", slug: "code-block", status: "available", original: true },
  { name: "Collapsible", slug: "collapsible", status: "available" },
  { name: "Combobox", slug: "combobox", status: "available" },
  { name: "Command", slug: "command", status: "available" },
  { name: "Context Menu", slug: "context-menu", status: "available" },
  { name: "Data Table", slug: "data-table", status: "available" },
  { name: "Date Picker", slug: "date-picker", status: "available" },
  { name: "Dialog", slug: "dialog", status: "available" },
  { name: "Direction", slug: "direction", status: "available" },
  { name: "Drawer", slug: "drawer", status: "available" },
  { name: "Dropdown Menu", slug: "dropdown-menu", status: "available" },
  { name: "Empty", slug: "empty", status: "available" },
  { name: "Field", slug: "field", status: "available" },
  { name: "File Upload", slug: "file-upload", status: "available", original: true },
  { name: "Hover Card", slug: "hover-card", status: "available" },
  { name: "Input", slug: "input", status: "featured" },
  { name: "Input Group", slug: "input-group", status: "available" },
  { name: "Input OTP", slug: "input-otp", status: "available" },
  { name: "Item", slug: "item", status: "available" },
  { name: "Kanban", slug: "kanban", status: "soon", original: true },
  { name: "Kbd", slug: "kbd", status: "available" },
  { name: "Label", slug: "label", status: "featured" },
  { name: "Menubar", slug: "menubar", status: "available" },
  { name: "Native Select", slug: "native-select", status: "available" },
  { name: "Navigation Menu", slug: "navigation-menu", status: "available" },
  { name: "Pagination", slug: "pagination", status: "available" },
  { name: "Popover", slug: "popover", status: "available" },
  { name: "Progress", slug: "progress", status: "available" },
  { name: "Radio Group", slug: "radio-group", status: "available" },
  { name: "Resizable", slug: "resizable", status: "available" },
  { name: "Rich Text Editor", slug: "rich-text-editor", status: "soon", original: true },
  { name: "Scroll Area", slug: "scroll-area", status: "available" },
  { name: "Select", slug: "select", status: "available" },
  { name: "Separator", slug: "separator", status: "available" },
  { name: "Sheet", slug: "sheet", status: "available" },
  { name: "Sidebar", slug: "sidebar", status: "available" },
  { name: "Skeleton", slug: "skeleton", status: "available" },
  { name: "Slider", slug: "slider", status: "available" },
  { name: "Sonner", slug: "sonner", status: "available" },
  { name: "Spinner", slug: "spinner", status: "available" },
  { name: "Stepper", slug: "stepper", status: "available", original: true },
  { name: "Switch", slug: "switch", status: "available" },
  { name: "Table", slug: "table", status: "available" },
  { name: "Tabs", slug: "tabs", status: "available" },
  { name: "Textarea", slug: "textarea", status: "available" },
  { name: "Toggle", slug: "toggle", status: "available" },
  { name: "Toggle Group", slug: "toggle-group", status: "available" },
  { name: "Tooltip", slug: "tooltip", status: "available" },
];

export const ALL_COMPONENTS = COMPONENTS;

export const FEATURED_COMPONENTS = COMPONENTS.filter((c) => c.status === "featured");

export const COMPONENT_COUNTS = {
  total: COMPONENTS.length,
  featured: COMPONENTS.filter((c) => c.status === "featured").length,
  available: COMPONENTS.filter((c) => c.status !== "soon").length,
};
