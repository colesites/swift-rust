"use client";
import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, type ButtonDesign } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DESIGNS: { id: ButtonDesign; label: string }[] = [
  { id: "flat", label: "Flat" },
  { id: "soft", label: "Soft" },
  { id: "3d", label: "3D" },
  { id: "glass", label: "Glass" },
  { id: "neo", label: "Neo" },
  { id: "brutal", label: "Brutal" },
  { id: "gradient", label: "Gradient" },
];

// glass/brutal read better with an outline button (a filled surface fights the
// frosted / hard-edge treatment).
const outlineish = (d: ButtonDesign) => d === "glass" || d === "brutal";

export function DesignMorph() {
  const [design, setDesign] = React.useState<ButtonDesign>("glass");

  return (
    // The showcase always sits on a vivid dark backdrop, so force a dark scope
    // regardless of the site theme — otherwise light-mode surfaces (white cards)
    // would swallow the white cluster text.
    <div className="dark force-dark relative overflow-hidden rounded-3xl border border-border">
      {/* vivid backdrop so glass + gradient read against something */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(40rem 26rem at 12% 8%, color-mix(in oklab, #f97316 38%, transparent), transparent 60%)," +
            "radial-gradient(34rem 26rem at 88% 12%, color-mix(in oklab, #8b5cf6 34%, transparent), transparent 60%)," +
            "radial-gradient(32rem 28rem at 70% 100%, color-mix(in oklab, #ec4899 26%, transparent), transparent 60%)," +
            "linear-gradient(135deg, #0b0a14, #120d08)",
        }}
      />
      <div className="absolute inset-0 -z-10 opacity-[0.06] bg-grid" />

      <div className="flex flex-col gap-8 p-6 sm:p-10">
        {/* design switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-xs uppercase tracking-widest text-white/55">
            design=
          </span>
          {DESIGNS.map((d) => {
            const active = d.id === design;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setDesign(d.id)}
                className={
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium backdrop-blur-md transition-all " +
                  (active
                    ? "border-white/0 bg-white text-black shadow-lg"
                    : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10")
                }
              >
                {d.label}
              </button>
            );
          })}
        </div>

        {/* the cluster — one design prop drives every surface */}
        <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          <Card design={design} className="border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Create your account</CardTitle>
              <CardDescription className="text-white/65">
                One <code className="text-white/80">design</code> prop, every surface.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-white/80">Email</Label>
                <Input design={design} placeholder="ada@swift-rust.dev" className="text-white placeholder:text-white/40" />
              </div>
              <div className="flex gap-2">
                <Button design={design} variant={outlineish(design) ? "outline" : "default"} className="flex-1">
                  Continue
                </Button>
                <Button design={design} variant="ghost" className="text-white">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-5">
            <Alert design={design} variant="info" className="text-white [&_*]:text-white/85">
              <AlertTitle className="text-white">Shipped in seconds</AlertTitle>
              <AlertDescription>Server-rendered, island-hydrated, single binary.</AlertDescription>
            </Alert>

            <div className="flex items-center gap-3">
              {(["A", "B", "C"] as const).map((c) => (
                <Avatar key={c} design={design}>
                  <AvatarFallback className="bg-white/15 text-white">{c}</AvatarFallback>
                </Avatar>
              ))}
              <div className="flex gap-2">
                <Button design={design} size="icon" variant={outlineish(design) ? "outline" : "default"} aria-label="Add">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M5 12h14M12 5v14" strokeLinecap="round" />
                  </svg>
                </Button>
              </div>
            </div>

            <Accordion type="single" defaultValue="q" variant="outline" design={design} className="[&_*]:text-white">
              <AccordionItem value="q" className="border-white/15">
                <AccordionTrigger value="q">What's the design dimension?</AccordionTrigger>
                <AccordionContent value="q">
                  A third axis on top of variant and size — flip the surface treatment without
                  rewriting a thing.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
