import type { Metadata } from "swift-rust";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, type ButtonDesign } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Playground } from "@/components/ui-showcase/playground";

export const metadata: Metadata = {
  title: "swift-rust ui",
  description:
    "swift-rust ui — a shadcn-style component registry with a third style dimension: variant × size × design (3d, glass, neo, brutal, gradient). Built for Tailwind v4.",
};

const DESIGNS: ButtonDesign[] = ["flat", "soft", "3d", "glass", "neo", "brutal", "gradient"];

function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-border py-14">
      <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-accent">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-pretty text-fg-muted">{description}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Swatches({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-6">
      {children}
    </div>
  );
}

export default function UiShowcasePage() {
  return (
    <div className="container-page py-16">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-fg-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Tailwind v4 · copy-paste · you own the code
        </span>
        <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
          swift-rust&nbsp;ui
        </h1>
        <p className="max-w-2xl text-pretty text-lg leading-relaxed text-fg-muted">
          A shadcn-style component registry with a third style dimension. Every component composes{" "}
          <code className="rounded bg-surface-2 px-1.5 py-0.5 text-[0.85em]">variant</code> ×{" "}
          <code className="rounded bg-surface-2 px-1.5 py-0.5 text-[0.85em]">size</code> ×{" "}
          <code className="rounded bg-surface-2 px-1.5 py-0.5 text-[0.85em]">design</code> — so one{" "}
          <code className="rounded bg-surface-2 px-1.5 py-0.5 text-[0.85em]">&lt;Button&gt;</code>{" "}
          spans flat, 3D, glass, neumorphic, brutalist, and gradient looks.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild design="3d">
            <a href="#playground">Try the playground</a>
          </Button>
          <Button asChild variant="outline">
            <a href="https://github.com/swift-rust/swift-rust">View on GitHub</a>
          </Button>
          <code className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg-muted">
            bunx @swift-rust/ui add button
          </code>
        </div>
      </header>

      {/* ── Playground ───────────────────────────────────────────────────── */}
      <section id="playground" className="scroll-mt-20 pt-14">
        <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-accent">Playground</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Mix the three dimensions
        </h2>
        <p className="mt-2 max-w-2xl text-pretty text-fg-muted">
          Pick a variant, size, and design — the preview and the code update live. This panel is a{" "}
          <code className="rounded bg-surface-2 px-1.5 py-0.5 text-[0.85em]">&quot;use client&quot;</code>{" "}
          island hydrated by swift-rust.
        </p>
        <div className="mt-8">
          <Playground />
        </div>
      </section>

      {/* ── Buttons ──────────────────────────────────────────────────────── */}
      <Section
        id="buttons"
        eyebrow="Button"
        title="Variants, sizes, designs"
        description="The six variants carry intent; ten sizes (including five icon sizes) cover density; seven designs change the surface treatment."
      >
        <div className="flex flex-col gap-6">
          <Swatches>
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </Swatches>
          <Swatches>
            <Button size="xs">xs</Button>
            <Button size="sm">sm</Button>
            <Button size="default">default</Button>
            <Button size="lg">lg</Button>
            <Button size="icon" aria-label="Add">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M5 12h14M12 5v14" strokeLinecap="round" />
              </svg>
            </Button>
          </Swatches>
          <Swatches>
            {DESIGNS.map((d) => (
              <Button key={d} design={d} variant={d === "glass" || d === "brutal" ? "outline" : "default"}>
                {d}
              </Button>
            ))}
          </Swatches>
        </div>
      </Section>

      {/* ── Designs as cards ─────────────────────────────────────────────── */}
      <Section
        id="designs"
        eyebrow="Design dimension"
        title="The same Card, seven ways"
        description="design is the dimension shadcn doesn't have. It re-skins the surface — shadows, blur, borders — without touching variant or size."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DESIGNS.map((d) => (
            <Card key={d} design={d}>
              <CardHeader>
                <CardTitle className="capitalize">{d}</CardTitle>
                <CardDescription>design=&quot;{d}&quot;</CardDescription>
              </CardHeader>
              <CardContent>
                <Button design={d} size="sm" variant={d === "glass" || d === "brutal" ? "outline" : "default"}>
                  Action
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Liquid glass reads only over a busy backdrop — show it over a vivid
            mesh gradient so the blur + vibrancy + refractive rim are visible. */}
        <div className="relative mt-6 overflow-hidden rounded-2xl border border-border p-8 sm:p-12">
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(at 18% 22%, #f97316 0px, transparent 55%)," +
                "radial-gradient(at 82% 18%, #8b5cf6 0px, transparent 50%)," +
                "radial-gradient(at 70% 88%, #ec4899 0px, transparent 50%)," +
                "radial-gradient(at 25% 80%, #38bdf8 0px, transparent 55%)," +
                "linear-gradient(120deg, #1e1b4b, #312e81)",
            }}
          />
          <div className="flex flex-col items-start gap-6">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
              design=&quot;glass&quot; · liquid glass
            </span>
            <Card design="glass" className="w-full max-w-sm">
              <CardHeader>
                <CardTitle className="text-white">Frosted by the backdrop</CardTitle>
                <CardDescription className="text-white/70">
                  Real backdrop-blur + saturation, a refractive sheen, and a bright rim.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button design="glass">Glass</Button>
                <Button design="glass" variant="outline">
                  Outline
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* ── Alerts ───────────────────────────────────────────────────────── */}
      <Section
        id="alerts"
        eyebrow="Alert"
        title="Status, at a glance"
        description="Alerts add semantic variants — success, warning, info — on top of the shared design treatments."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Alert variant="info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>This route is server-rendered, then hydrated as islands.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertTitle>Deployed</AlertTitle>
            <AlertDescription>Your single binary is live on the edge.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertTitle>Careful</AlertTitle>
            <AlertDescription>This action can&apos;t be undone.</AlertDescription>
          </Alert>
          <Alert variant="destructive" design="soft">
            <AlertTitle>Build failed</AlertTitle>
            <AlertDescription>Check the logs for the failing module.</AlertDescription>
          </Alert>
        </div>
      </Section>

      {/* ── Form ─────────────────────────────────────────────────────────── */}
      <Section
        id="forms"
        eyebrow="Input · Label · Avatar"
        title="Form building blocks"
        description="Inputs share the variant × size × design system; labels and avatars round out the basics."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="gap-0">
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>Inputs across designs.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@swift-rust.dev" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pw">Password</Label>
                <Input id="pw" type="password" placeholder="••••••••" design="soft" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="team" variant="secondary" size="sm">
                  Team (glass)
                </Label>
                <Input id="team" placeholder="acme" design="glass" />
              </div>
              <Button className="mt-2 w-full" design="3d">
                Continue
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avatars</CardTitle>
              <CardDescription>Sizes and design rings.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Avatar size="xs">
                  <AvatarFallback>XS</AvatarFallback>
                </Avatar>
                <Avatar size="sm">
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>MD</AvatarFallback>
                </Avatar>
                <Avatar size="lg">
                  <AvatarFallback>LG</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex items-center gap-3">
                <Avatar design="gradient">
                  <AvatarImage src="/samples/close-up-portrait-gorgeous-young-woman.jpg" alt="" />
                </Avatar>
                <Avatar design="glass">
                  <AvatarFallback>GL</AvatarFallback>
                </Avatar>
                <Avatar design="neo">
                  <AvatarFallback>NE</AvatarFallback>
                </Avatar>
                <Avatar design="brutal">
                  <AvatarFallback>BR</AvatarFallback>
                </Avatar>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* ── Accordion ────────────────────────────────────────────────────── */}
      <Section
        id="accordion"
        eyebrow="Accordion"
        title="Disclosure, your way"
        description="Set variant / size / design once on <Accordion> and every item follows."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Accordion type="single" defaultValue="a">
            <AccordionItem value="a">
              <AccordionTrigger value="a">What makes this different from shadcn?</AccordionTrigger>
              <AccordionContent value="a">
                The third dimension. Same variants and sizes you know, plus a design prop for the
                surface treatment.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger value="b">Do I install a package?</AccordionTrigger>
              <AccordionContent value="b">
                No runtime dependency — the CLI copies the source into your project. You own and edit it.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="c">
              <AccordionTrigger value="c">Does it need Tailwind v4?</AccordionTrigger>
              <AccordionContent value="c">
                Yes — it uses v4-native utilities like size-*, outline-hidden, and bg-linear-to-*.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="multiple" variant="outline" design="glass" defaultValue={["x"]}>
            <AccordionItem value="x">
              <AccordionTrigger value="x">variant=&quot;outline&quot;</AccordionTrigger>
              <AccordionContent value="x">Separated, surfaced items.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="y">
              <AccordionTrigger value="y">design=&quot;glass&quot;</AccordionTrigger>
              <AccordionContent value="y">Frosted translucent panels.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="z">
              <AccordionTrigger value="z">type=&quot;multiple&quot;</AccordionTrigger>
              <AccordionContent value="z">Open several at once.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Section>

      <footer className="border-t border-border py-10 text-sm text-fg-muted">
        Built with swift-rust ui — server-rendered, island-hydrated, single binary.{" "}
        <a className="text-accent hover:underline" href="https://github.com/swift-rust/swift-rust">
          Star it on GitHub →
        </a>
      </footer>
    </div>
  );
}
