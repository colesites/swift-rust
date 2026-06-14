# @swift-rust/ui

A shadcn-style component registry for swift-rust — components are copied into
your project, you own the code. Built for **Tailwind CSS v4** (it uses
v4-native utilities like `outline-hidden`, `shadow-xs`, `bg-linear-to-br`,
`size-*`, and `p-(--var)`; Tailwind v3 is not supported).

## What's different from shadcn

Every surfaced component has **three independent style dimensions** instead of two:

| Dimension | Prop      | Values |
| --------- | --------- | ------ |
| Variant   | `variant` | `default`, `outline`, `secondary`, `ghost`, `destructive`, `link` |
| Size      | `size`    | `default`, `xs`, `sm`, `md`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-md`, `icon-lg` |
| Design    | `design`  | `flat`, `soft`, `3d`, `glass`, `neo`, `brutal`, `gradient` |

> The design dimension is exposed as the `design` prop (not `style`) because
> React reserves `style` for inline styles.

```tsx
import { Button } from "@/components/ui/button";

<Button>Default</Button>
<Button design="3d">Raised</Button>
<Button design="glass" variant="outline">Frosted</Button>
<Button design="brutal" variant="destructive" size="lg">Delete</Button>
<Button design="gradient" size="icon"><SparklesIcon /></Button>
```

### Design styles

- **flat** — the default; the clean shadcn look.
- **soft** — pastel, larger radius, borderless.
- **3d** — raised with a hard bottom edge; presses down on click.
- **glass** — translucent, frosted backdrop blur.
- **neo** — neumorphic soft-extruded surfaces; presses inset.
- **brutal** — neo-brutalism: thick borders, hard offset shadows, square corners.
- **gradient** — vivid violet→fuchsia→orange fills (buttons) or gradient borders (cards, inputs).

Variants apply where they make sense per component (an `Alert` adds `success`,
`warning`, `info`; an `Avatar` has only `size` + `design`; `Label` has only
`variant` + `size`).

## Usage

```bash
# initialize lib/utils.ts (cn helper) + dependencies
bunx @swift-rust/ui init

# add components
bunx @swift-rust/ui add button card input

# list everything
bunx @swift-rust/ui list
```

Components land in `components/ui/` and import `cn` from `@/lib/utils`.

## Theming

Components use the standard shadcn token names through Tailwind v4 theme
utilities (`bg-primary`, `text-muted-foreground`, `border-border`, …). Projects
scaffolded with `create-swift-rust` define these in `globals.css` via
`@theme inline` mapped onto `--ui-*` custom properties — override the `--ui-*`
values (light + `.dark`) to retheme everything.
