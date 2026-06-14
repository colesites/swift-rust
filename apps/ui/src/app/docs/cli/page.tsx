import type { Metadata } from "swift-rust";
import { Code, DocH2, DocHeader, DocP, DocPager, InlineCode } from "@/components/site/doc";

export const metadata: Metadata = {
  title: "CLI",
  description: "Use the @swift-rust/ui CLI to init, add, and list components.",
};

export default function CliPage() {
  return (
    <article className="max-w-3xl">
      <DocHeader
        eyebrow="Docs"
        title="CLI"
        lead="The @swift-rust/ui CLI scaffolds the cn() helper and copies component source into your project."
      />

      <DocH2>init</DocH2>
      <DocP>
        Adds <InlineCode>lib/utils.ts</InlineCode> (the <InlineCode>cn()</InlineCode> helper) and its
        dependencies. Run once per project.
      </DocP>
      <Code>bunx @swift-rust/ui init</Code>

      <DocH2>add</DocH2>
      <DocP>Copy one or more components into your project.</DocP>
      <Code>{`bunx @swift-rust/ui add button card input
bunx @swift-rust/ui add --all          # everything
bunx @swift-rust/ui add dialog --overwrite`}</Code>
      <DocP>
        Paths are detected from your project: a <InlineCode>src/</InlineCode> layout writes to{" "}
        <InlineCode>src/components/ui</InlineCode>, otherwise <InlineCode>components/ui</InlineCode>.
      </DocP>

      <DocH2>list</DocH2>
      <DocP>Browse everything available in the registry.</DocP>
      <Code>bunx @swift-rust/ui list</Code>

      <DocPager prev={{ href: "/docs/theming", label: "Theming" }} next={{ href: "/docs/components", label: "Components" }} />
    </article>
  );
}
