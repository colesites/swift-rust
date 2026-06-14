// Per-component copy + usage snippets for the individual component pages.
// Featured components get a tailored description and a usage example; everything
// else falls back to a generic line on its page.

export interface ComponentDoc {
  description: string;
  usage?: string;
  composition?: string;
}

export const COMPONENT_DOCS: Record<string, ComponentDoc> = {
  button: {
    description:
      "A button with six variants, ten sizes, and seven designs. Use asChild to render a link with button styling.",
    usage: `import { Button } from "@/components/ui/button";

<Button design="3d">Get started</Button>
<Button variant="outline" design="glass">Browse</Button>
<Button asChild><a href="/docs">Docs</a></Button>`,
  },
  card: {
    description:
      "A surface for grouping content. The design prop re-skins it — flat, glass, neo, brutal, gradient — without touching the layout.",
    usage: `import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card design="glass">
  <CardHeader><CardTitle>Title</CardTitle></CardHeader>
  <CardContent>Body</CardContent>
</Card>`,
    composition: `Card
├── CardHeader
│   ├── CardTitle
│   ├── CardDescription
│   └── CardAction
├── CardContent
└── CardFooter`,
  },
  alert: {
    description:
      "A callout for contextual messages. Semantic variants — info, success, warning, destructive — sit on top of the shared designs.",
    usage: `import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";

<Alert variant="info">
  <AlertTitle>Heads up</AlertTitle>
  <AlertDescription>Server-rendered, no JS.</AlertDescription>
</Alert>`,
    composition: `Alert
├── Icon
├── AlertTitle
├── AlertDescription
└── AlertAction`,
  },
  avatar: {
    description: "An image element with a text fallback, across five sizes and the full design set.",
    usage: `import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

<Avatar design="gradient">
  <AvatarImage src="/me.jpg" alt="" />
  <AvatarFallback>SR</AvatarFallback>
</Avatar>`,
    composition: `Avatar
├── AvatarImage
└── AvatarFallback`,
  },
  input: {
    description:
      "A form input sharing the variant × size × design system, so fields match your buttons and cards.",
    usage: `import { Input } from "@/components/ui/input";

<Input placeholder="Email" />
<Input design="soft" variant="secondary" />`,
  },
  label: {
    description: "An accessible label for form controls, with muted and destructive variants.",
    usage: `import { Label } from "@/components/ui/label";

<Label htmlFor="email">Email</Label>
<Input id="email" />`,
  },
  accordion: {
    description:
      "A vertically stacked set of interactive headings. Set type, variant, size, and design once on Accordion.",
    usage: `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

<Accordion type="single" defaultValue="a">
  <AccordionItem value="a">
    <AccordionTrigger value="a">Question</AccordionTrigger>
    <AccordionContent value="a">Answer</AccordionContent>
  </AccordionItem>
</Accordion>`,
    composition: `Accordion
└── AccordionItem
    ├── AccordionTrigger
    └── AccordionContent`,
  },

  // swift-rust ui originals (planned).
  "file-upload": {
    description:
      "Drag & drop file upload with preview, progress, validation, and multiple-file support.",
  },
  stepper: {
    description: "A multi-step wizard / form flow with a progress indicator.",
  },
  "rich-text-editor": {
    description: "A full-featured editor (Tiptap / Slate based) with a formatting toolbar.",
  },
  "code-block": {
    description: "Syntax-highlighted code with a copy button and line numbers.",
  },
  kanban: {
    description: "Drag & drop columns and cards, with multi-board support.",
  },
};
