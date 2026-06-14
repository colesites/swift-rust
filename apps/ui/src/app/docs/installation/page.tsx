import type { Metadata } from "swift-rust";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Code, DocH2, DocHeader, DocP, DocPager, InlineCode } from "@/components/site/doc";

export const metadata: Metadata = {
  title: "Installation",
  description: "Install dependencies and add your first swift-rust ui components.",
};

export default function InstallationPage() {
  return (
    <article className="max-w-3xl">
      <DocHeader
        eyebrow="Docs"
        title="Installation"
        lead="Add swift-rust ui to a new or existing project. Components are copied in via the CLI — no runtime dependency."
      />

      <DocH2>New project</DocH2>
      <DocP>
        Scaffold a swift-rust app and choose <strong className="text-fg">swift-rust ui</strong> when
        asked which component library to use:
      </DocP>
      <Code>bun create swift-rust@latest my-app</Code>
      <DocP>
        The starter set (button, card, input, label, alert, avatar, accordion) is added
        automatically, with the <InlineCode>cn()</InlineCode> helper and design tokens wired up.
      </DocP>

      <DocH2>Existing project</DocH2>
      <DocP>Initialize once, then add components as you need them:</DocP>
      <Code>{`bunx @swift-rust/ui init
bunx @swift-rust/ui add button card input`}</Code>
      <DocP>
        The CLI detects a <InlineCode>src/</InlineCode> layout and writes to{" "}
        <InlineCode>src/components/ui</InlineCode>, adding <InlineCode>clsx</InlineCode> and{" "}
        <InlineCode>tailwind-merge</InlineCode> for you.
      </DocP>

      <Alert variant="info" className="mt-8">
        <AlertTitle>Tailwind v4 required</AlertTitle>
        <AlertDescription>
          Components use v4-native utilities (size-*, outline-hidden, bg-linear-to-*). Tailwind v3
          will emit warnings.
        </AlertDescription>
      </Alert>

      <DocPager
        prev={{ href: "/docs", label: "Introduction" }}
        next={{ href: "/docs/theming", label: "Theming" }}
      />
    </article>
  );
}
