import type { Metadata } from "swift-rust";
import { Code, DocH2, DocHeader, DocP, DocPager, InlineCode } from "@/components/site/doc";

export const metadata: Metadata = {
  title: "Theming",
  description: "Theme swift-rust ui with CSS variables and Tailwind v4 @theme inline.",
};

export default function ThemingPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <DocHeader
        eyebrow="Docs"
        title="Theming"
        lead="Components read standard token utilities. Map them onto CSS variables once, then retheme by editing the variables for light and dark."
      />

      <DocH2>Tokens</DocH2>
      <DocP>
        Components use utilities like <InlineCode>bg-primary</InlineCode>,{" "}
        <InlineCode>text-muted-foreground</InlineCode>, and <InlineCode>border-border</InlineCode>.
        Wire those to <InlineCode>--ui-*</InlineCode> custom properties with{" "}
        <InlineCode>@theme inline</InlineCode>:
      </DocP>
      <Code>{`@theme inline {
  --color-primary: var(--ui-primary);
  --color-primary-foreground: var(--ui-primary-fg);
  --color-border: var(--ui-border);
  --color-muted-foreground: var(--ui-muted-fg);
  /* … */
}`}</Code>

      <DocH2>Light & dark</DocH2>
      <DocP>
        Define the variables on <InlineCode>:root</InlineCode> for light and{" "}
        <InlineCode>.dark</InlineCode> for dark. Toggling the <InlineCode>dark</InlineCode> class on{" "}
        <InlineCode>&lt;html&gt;</InlineCode> flips the whole UI.
      </DocP>
      <Code>{`:root {
  --ui-primary: #18181b;
  --ui-border: #e4e4e7;
}
.dark {
  --ui-primary: #fafafa;
  --ui-border: #27272a;
}`}</Code>
      <DocP>
        Because the design treatments (glass, neo, …) include their own{" "}
        <InlineCode>dark:</InlineCode> variants, they adapt automatically under the{" "}
        <InlineCode>.dark</InlineCode> class.
      </DocP>

      <DocPager
        prev={{ href: "/docs/installation", label: "Installation" }}
        next={{ href: "/docs/cli", label: "CLI" }}
      />
    </article>
  );
}
