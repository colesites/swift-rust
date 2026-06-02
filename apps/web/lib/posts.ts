export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  author: { name: string; role: string };
  tags: string[];
  body: string;
};

export const posts: Post[] = [
  {
    slug: "introducing-swift-rust",
    title: "Introducing Swift Rust",
    excerpt:
      "A full-stack React framework powered with Rust + Bun, designed to feel as familiar as the one you already use.",
    date: "2026-05-28",
    readingTime: "4 min read",
    author: { name: "The Swift Rust Team", role: "Engineering" },
    tags: ["announcement", "framework"],
    body: `Today we are open-sourcing Swift Rust, a full-stack React framework powered with Rust + Bun that takes the parts of Next.js that everyone copied and reimplements them on top of a Rust runtime.

The pitch is simple: write TSX, get streaming SSR, file-system routing, and a single binary at deploy. 10x faster than Next.js. No more pinning the lockfile to dodge a Node deprecation. No more debugging why your edge function works in one region and not another.

We built it because we wanted to use it. The repo is live, the docs are live, and the demo you are reading is rendered by it. If you have ever thought "I wish this was just a Rust binary", we made it one.`,
  },
  {
    slug: "four-rendering-modes",
    title: "Why we shipped four rendering modes",
    excerpt:
      "SSR + WASM, SSR only, SSR + HTMX, and full WASM. One isn't enough. Here is why.",
    date: "2026-05-20",
    readingTime: "7 min read",
    author: { name: "Alex Chen", role: "Founding Engineer" },
    tags: ["architecture", "ssr", "wasm"],
    body: `The original Next.js had one mode: SSR. Then it added SSG. Then ISR. Then RSC. Then... you get the idea. We did not want to ship a framework with ten modes and a flowchart.

Instead, we picked four and made each one excellent:

- SSR + WASM is the default. Server-rendered HTML, hydrated with a tiny WASM runtime that gives you client-side islands.
- SSR only has no client JavaScript at all. Good for documentation sites, blogs, and anywhere you don't need interactivity.
- SSR + HTMX is for teams that want progressive enhancement without giving up server rendering.
- Full WASM SPA is for when you genuinely need an app. The whole thing runs in the browser.

Pick the one that fits. Change it later in one line of config.`,
  },
  {
    slug: "streaming-ssr-in-rust",
    title: "Streaming SSR in Rust, without the headache",
    excerpt:
      "How we built a streaming SSR pipeline that handles async components and Suspense correctly.",
    date: "2026-05-12",
    readingTime: "9 min read",
    author: { name: "Priya Singh", role: "Runtime Engineer" },
    tags: ["ssr", "rust", "internals"],
    body: `Streaming SSR is one of those features that sounds easy and is, in fact, not. The list of things that can go wrong is long: async components that need to suspend, Suspense boundaries that need to flush, hydration mismatches when the server and client disagree about what to render.

We started from React's renderToReadableStream and built on top of it. The result is a pipeline that:

1. Starts sending HTML within a few milliseconds of the request landing.
2. Streams async segments as they resolve, with no buffer in between.
3. Hydrates the page progressively, so the user can interact with above-the-fold content immediately.

The hardest part was getting the error boundary semantics right. We use Rust-style error codes (SR-E0001, SR-E0401, etc.) that are emitted at compile time by our SWC plugin, and a sleek dark error overlay that shows up in the dev server.`,
  },
  {
    slug: "fonts-without-fout",
    title: "Fonts, without the FOUT",
    excerpt:
      "2,071 Google fonts, automatic subsetting, and zero layout shift.",
    date: "2026-05-04",
    readingTime: "3 min read",
    author: { name: "Maria Lopez", role: "Design Systems" },
    tags: ["fonts", "performance"],
    body: `Fonts are the most common cause of layout shift on the web. Most frameworks let you load a font, but they do not give you a way to make sure it does not cause a flicker when it loads.

Swift Rust's font component downloads the font at build time, subsets it to the characters you actually use, and emits a CSS variable that you can use in your styles. The browser uses the fallback font for the first paint, and swaps in the real font when it loads, with no layout shift.

We support 2,071 Google fonts out of the box, including Geist, Geist Mono, Inter, Manrope, and IBM Plex. Local fonts work too.`,
  },
  {
    slug: "the-swc-plugin",
    title: "Inside the SWC plugin",
    excerpt:
      "How we turned a 200-millisecond build into a 12-millisecond build.",
    date: "2026-04-26",
    readingTime: "11 min read",
    author: { name: "Jordan Kim", role: "Compiler Engineer" },
    tags: ["compiler", "swc", "performance"],
    body: `The single biggest performance win in the framework is the SWC plugin. It runs at build time, and it does three things:

1. Strips "use client" / "use server" directives and replaces them with virtual modules.
2. Collects imports for the bundler, so it knows exactly what to ship.
3. Emits error codes (SR-E0001 through SR-E1404) for common mistakes, so the dev server can show you a friendly error message instead of a stack trace.

The plugin is powered with Rust and uses swc_core. It compiles in about a second, and it runs in about 12 milliseconds per file. That is the difference between a 200-millisecond incremental build and a 12-millisecond one.`,
  },
  {
    slug: "single-binary-deploy",
    title: "Deploy one binary, scale forever",
    excerpt:
      "How compiling your app to a Rust binary changes the way you ship.",
    date: "2026-04-18",
    readingTime: "5 min read",
    author: { name: "Sam Rivera", role: "Infrastructure" },
    tags: ["deployment", "infrastructure"],
    body: `When you build a Swift Rust app, the output is a single binary. No Node, no edge runtime, no package manager at deploy time. You copy the binary to a server, run it, and it serves.

This has three big consequences:

1. Cold starts are measured in microseconds, not seconds.
2. Memory usage is measured in tens of megabytes, not hundreds.
3. There is no "did you forget to install something" at deploy time.

The binary is also a CLI. Run it with no arguments, and it starts a dev server. Run it with --build, and it produces a production binary. Run it with --start, and it serves the production build.`,
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPostsByTag(tag: string): Post[] {
  return posts.filter((p) => p.tags.includes(tag));
}

export function getAllTags(): string[] {
  return Array.from(new Set(posts.flatMap((p) => p.tags))).sort();
}
