import type { Metadata } from "swift-rust";
import { DocH2, DocHeader, DocP, DocPager, InlineCode } from "@/components/site/doc";

export const metadata: Metadata = {
  title: "Introduction",
  description: "swift-rust ui — an open-code component registry with a third style axis.",
};

export default function IntroductionPage() {
  return (
    <article className="max-w-3xl">
      <DocHeader
        eyebrow="Docs"
        title="Introduction"
        lead="swift-rust ui is an open-code component registry — a better shadcn with a third style axis. You don't install a black-box package; the CLI copies the source into your project, so you own and edit every line."
      />

      <DocP>
        It's built for the <InlineCode>swift-rust</InlineCode> framework and Tailwind v4. Components
        are server-renderable by default and ship zero JavaScript until you make them interactive.
      </DocP>

      <DocH2>Three axes</DocH2>
      <DocP>Every featured component composes three independent dimensions:</DocP>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["variant", "What it means — default, outline, secondary, ghost, destructive, link."],
          ["size", "How dense it is — xs through lg, plus five icon sizes."],
          ["design", "How it looks — flat, 3d, glass, neo, brutal, gradient. The axis shadcn doesn't have."],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-border bg-surface p-4">
            <code className="font-mono text-sm text-accent">{k}</code>
            <p className="mt-1 text-sm text-fg-muted">{v}</p>
          </div>
        ))}
      </div>

      <DocH2>Open code</DocH2>
      <DocP>
        There's no opaque dependency to upgrade and fight. The component source lands in your repo
        under <InlineCode>components/ui</InlineCode>; change a class, a token, or the whole API — it's
        yours.
      </DocP>

      <DocPager next={{ href: "/docs/installation", label: "Installation" }} />
    </article>
  );
}
