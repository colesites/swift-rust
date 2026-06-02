export interface ComponentInfo {
  name: string;
  files: string[];
  dependencies?: string[];
}

const COMPONENTS: Record<string, ComponentInfo> = {
  accordion: { name: "accordion", files: ["accordion.tsx"] },
  alert: { name: "alert", files: ["alert.tsx"] },
  avatar: { name: "avatar", files: ["avatar.tsx"] },
  badge: { name: "badge", files: ["badge.tsx"] },
  breadcrumb: { name: "breadcrumb", files: ["breadcrumb.tsx"] },
  button: { name: "button", files: ["button.tsx"] },
  callout: { name: "callout", files: ["callout.tsx"] },
  card: { name: "card", files: ["card.tsx"] },
  checkbox: { name: "checkbox", files: ["checkbox.tsx"] },
  code: { name: "code", files: ["code.tsx"] },
  command: { name: "command", files: ["command.tsx"] },
  dialog: { name: "dialog", files: ["dialog.tsx"] },
  "dropdown-menu": { name: "dropdown-menu", files: ["dropdown-menu.tsx"] },
  form: { name: "form", files: ["form.tsx"] },
  input: { name: "input", files: ["input.tsx"] },
  kbd: { name: "kbd", files: ["kbd.tsx"] },
  label: { name: "label", files: ["label.tsx"] },
  "navigation-menu": { name: "navigation-menu", files: ["navigation-menu.tsx"] },
  pagination: { name: "pagination", files: ["pagination.tsx"] },
  popover: { name: "popover", files: ["popover.tsx"] },
  progress: { name: "progress", files: ["progress.tsx"] },
  "radio-group": { name: "radio-group", files: ["radio-group.tsx"] },
  select: { name: "select", files: ["select.tsx"] },
  separator: { name: "separator", files: ["separator.tsx"] },
  sheet: { name: "sheet", files: ["sheet.tsx"] },
  skeleton: { name: "skeleton", files: ["skeleton.tsx"] },
  slider: { name: "slider", files: ["slider.tsx"] },
  spinner: { name: "spinner", files: ["spinner.tsx"] },
  switch: { name: "switch", files: ["switch.tsx"] },
  table: { name: "table", files: ["table.tsx"] },
  tabs: { name: "tabs", files: ["tabs.tsx"] },
  textarea: { name: "textarea", files: ["textarea.tsx"] },
  toast: { name: "toast", files: ["toast.tsx"] },
  toggle: { name: "toggle", files: ["toggle.tsx"] },
  tooltip: { name: "tooltip", files: ["tooltip.tsx"] },
};

export default COMPONENTS;
