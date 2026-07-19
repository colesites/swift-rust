export interface ComponentDoc {
  description: string;
  usage?: string;
  composition?: string;
}

function example(slug: string, imports: string, markup: string) {
  return `import { ${imports} } from "@/components/ui/${slug}";

${markup}`;
}

export const COMPONENT_DOCS: Record<string, ComponentDoc> = {
  accordion: {
    description:
      "A vertically stacked set of interactive headings. Set type, variant, size, and design once on the root.",
    usage: example(
      "accordion",
      "Accordion, AccordionContent, AccordionItem, AccordionTrigger",
      `<Accordion type="single" defaultValue="shipping">
  <AccordionItem value="shipping">
    <AccordionTrigger value="shipping">When will it arrive?</AccordionTrigger>
    <AccordionContent value="shipping">Usually within three business days.</AccordionContent>
  </AccordionItem>
</Accordion>`,
    ),
    composition: `Accordion
└── AccordionItem
    ├── AccordionTrigger
    └── AccordionContent`,
  },
  alert: {
    description:
      "A callout for contextual feedback with semantic variants for information, success, warnings, and errors.",
    usage: example(
      "alert",
      "Alert, AlertDescription, AlertTitle",
      `<Alert variant="info">
  <AlertTitle>Heads up</AlertTitle>
  <AlertDescription>Your changes were saved.</AlertDescription>
</Alert>`,
    ),
    composition: `Alert
├── Icon
├── AlertTitle
├── AlertDescription
└── AlertAction`,
  },
  "alert-dialog": {
    description:
      "A modal confirmation that interrupts a flow for an important decision and keeps focus on the required response.",
    usage: example(
      "alert-dialog",
      "AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger",
      `<AlertDialog>
  <AlertDialogTrigger>Delete account</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
    ),
    composition: `AlertDialog
├── AlertDialogTrigger
└── AlertDialogContent
    ├── AlertDialogHeader
    │   ├── AlertDialogTitle
    │   └── AlertDialogDescription
    └── AlertDialogFooter
        ├── AlertDialogCancel
        └── AlertDialogAction`,
  },
  "aspect-ratio": {
    description: "Keeps media or other content inside a predictable width-to-height ratio.",
    usage: example(
      "aspect-ratio",
      "AspectRatio",
      `<AspectRatio ratio={16 / 9}>
  <img src="/cover.jpg" alt="Project cover" className="size-full object-cover" />
</AspectRatio>`,
    ),
  },
  avatar: {
    description:
      "Represents a person or entity with an image and a reliable text fallback across five sizes and seven designs.",
    usage: example(
      "avatar",
      "Avatar, AvatarFallback, AvatarImage",
      `<Avatar size="lg" design="gradient">
  <AvatarImage src="/avatar.jpg" alt="Ada Lovelace" />
  <AvatarFallback>AL</AvatarFallback>
</Avatar>`,
    ),
    composition: `Avatar
├── AvatarImage
└── AvatarFallback`,
  },
  badge: {
    description: "A compact label for statuses, categories, counts, and short pieces of metadata.",
    usage: example(
      "badge",
      "Badge",
      `<Badge variant="success">Active</Badge>
<Badge variant="outline" size="sm">Beta</Badge>`,
    ),
  },
  breadcrumb: {
    description: "Shows the current page's place within a hierarchy of navigable links.",
    usage: example(
      "breadcrumb",
      "Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator",
      `<Breadcrumb>
  <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem><BreadcrumbLink href="/docs">Docs</BreadcrumbLink></BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
</Breadcrumb>`,
    ),
    composition: `Breadcrumb
├── BreadcrumbItem
│   └── BreadcrumbLink
├── BreadcrumbSeparator
└── BreadcrumbItem
    └── BreadcrumbPage`,
  },
  button: {
    description:
      "An action control with six variants, ten sizes, and seven visual designs. Use asChild to style a link as a button.",
    usage: example(
      "button",
      "Button",
      `<Button design="3d">Get started</Button>
<Button variant="outline" design="glass">Browse</Button>
<Button asChild><a href="/docs">Docs</a></Button>`,
    ),
  },
  "button-group": {
    description:
      "Visually joins related buttons into one compact control while preserving each action.",
    usage: example(
      "button-group",
      "ButtonGroup",
      `import { Button } from "@/components/ui/button";

<ButtonGroup>
  <Button variant="outline">Day</Button>
  <Button variant="outline">Week</Button>
  <Button variant="outline">Month</Button>
</ButtonGroup>`,
    ),
    composition: `ButtonGroup
├── Button
├── Button
└── Button`,
  },
  calendar: {
    description:
      "A single-date calendar with month navigation and controlled or uncontrolled selection.",
    usage: example(
      "calendar",
      "Calendar",
      `<Calendar
  defaultValue={new Date()}
  onChange={(date) => console.log(date)}
/>`,
    ),
  },
  card: {
    description:
      "A flexible surface for grouping related content, actions, and supporting copy with interchangeable designs.",
    usage: example(
      "card",
      "Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle",
      `<Card design="glass">
  <CardHeader>
    <CardTitle>Team plan</CardTitle>
    <CardDescription>For growing product teams.</CardDescription>
  </CardHeader>
  <CardContent>Unlimited projects and shared workspaces.</CardContent>
  <CardFooter>Manage plan</CardFooter>
</Card>`,
    ),
    composition: `Card
├── CardHeader
│   ├── CardTitle
│   ├── CardDescription
│   └── CardAction
├── CardContent
└── CardFooter`,
  },
  carousel: {
    description:
      "A horizontally scrollable, snap-aligned collection with previous and next controls.",
    usage: example(
      "carousel",
      "Carousel, CarouselItem",
      `<Carousel>
  {[1, 2, 3].map((item) => (
    <CarouselItem key={item}>Slide {item}</CarouselItem>
  ))}
</Carousel>`,
    ),
    composition: `Carousel
├── CarouselItem
├── CarouselItem
└── CarouselItem`,
  },
  chart: {
    description: "A dependency-free SVG bar chart for compact categorical comparisons.",
    usage: example(
      "chart",
      "BarChart",
      `<BarChart
  data={[
    { label: "Mon", value: 12 },
    { label: "Tue", value: 19 },
    { label: "Wed", value: 8 },
  ]}
/>`,
    ),
  },
  checkbox: {
    description: "A native checkbox styled for consistent selected, focused, and disabled states.",
    usage: example(
      "checkbox",
      "Checkbox",
      `<label className="flex items-center gap-2">
  <Checkbox defaultChecked />
  Accept the terms
</label>`,
    ),
  },
  "code-block": {
    description:
      "Displays source code with optional syntax highlighting, filename, line numbers, and copying.",
    usage: example(
      "code-block",
      "CodeBlock",
      `<CodeBlock
  filename="button.tsx"
  language="tsx"
  code={'<Button>Save</Button>'}
/>`,
    ),
  },
  collapsible: {
    description: "Reveals or hides a content region from a compact interactive trigger.",
    usage: example(
      "collapsible",
      "Collapsible, CollapsibleContent, CollapsibleTrigger",
      `<Collapsible defaultOpen>
  <CollapsibleTrigger>Recent activity</CollapsibleTrigger>
  <CollapsibleContent>Three commits pushed today.</CollapsibleContent>
</Collapsible>`,
    ),
    composition: `Collapsible
├── CollapsibleTrigger
└── CollapsibleContent`,
  },
  combobox: {
    description: "A searchable option picker for longer lists where a native select is not enough.",
    usage: example(
      "combobox",
      "Combobox",
      `<Combobox
  options={[
    { value: "next", label: "Next.js" },
    { value: "swift-rust", label: "swift-rust" },
  ]}
  placeholder="Choose a framework"
/>`,
    ),
  },
  command: {
    description:
      "A keyboard-friendly command palette with filtering, shortcuts, and selection callbacks.",
    usage: example(
      "command",
      "Command",
      `<Command
  items={[
    { id: "docs", label: "Open docs", shortcut: "⌘D" },
    { id: "theme", label: "Toggle theme" },
  ]}
  onSelect={(item) => console.log(item.id)}
/>`,
    ),
  },
  "context-menu": {
    description: "Presents actions at the pointer when a user opens the context menu on a target.",
    usage: example(
      "context-menu",
      "ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger",
      `<ContextMenu>
  <ContextMenuTrigger>Right-click this area</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Copy</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem>Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
    ),
    composition: `ContextMenu
├── ContextMenuTrigger
└── ContextMenuContent
    ├── ContextMenuLabel
    ├── ContextMenuItem
    └── ContextMenuSeparator`,
  },
  "data-table": {
    description:
      "Renders typed row data through configurable columns with optional client-side sorting.",
    usage: example(
      "data-table",
      "DataTable",
      `const columns = [
  { key: "name", header: "Name", sortable: true },
  { key: "role", header: "Role" },
];

<DataTable
  columns={columns}
  data={[{ name: "Ada", role: "Owner" }, { name: "Grace", role: "Admin" }]}
/>`,
    ),
  },
  "date-picker": {
    description:
      "Combines a calendar with a compact trigger for controlled or uncontrolled date selection.",
    usage: example(
      "date-picker",
      "DatePicker",
      `<DatePicker
  placeholder="Choose a launch date"
  onChange={(date) => console.log(date)}
/>`,
    ),
  },
  dialog: {
    description: "Opens focused content above the page for forms, details, and short task flows.",
    usage: example(
      "dialog",
      "Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger",
      `<Dialog>
  <DialogTrigger>Edit profile</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>Update your public details.</DialogDescription>
    </DialogHeader>
    <DialogFooter><DialogClose>Done</DialogClose></DialogFooter>
  </DialogContent>
</Dialog>`,
    ),
    composition: `Dialog
├── DialogTrigger
└── DialogContent
    ├── DialogHeader
    │   ├── DialogTitle
    │   └── DialogDescription
    └── DialogFooter
        └── DialogClose`,
  },
  direction: {
    description: "Shares left-to-right or right-to-left direction with components through context.",
    usage: example(
      "direction",
      "DirectionProvider",
      `<DirectionProvider dir="rtl">
  <App />
</DirectionProvider>`,
    ),
  },
  drawer: {
    description:
      "Slides task-focused content from the viewport edge, with structured header and footer regions.",
    usage: example(
      "drawer",
      "Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger",
      `<Drawer>
  <DrawerTrigger>Open drawer</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Move goal</DrawerTitle>
      <DrawerDescription>Choose the new target.</DrawerDescription>
    </DrawerHeader>
    <DrawerFooter><DrawerClose>Cancel</DrawerClose></DrawerFooter>
  </DrawerContent>
</Drawer>`,
    ),
    composition: `Drawer
├── DrawerTrigger
└── DrawerContent
    ├── DrawerHeader
    │   ├── DrawerTitle
    │   └── DrawerDescription
    └── DrawerFooter
        └── DrawerClose`,
  },
  "dropdown-menu": {
    description: "Places a compact list of actions and supporting labels next to a trigger.",
    usage: example(
      "dropdown-menu",
      "DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger",
      `<DropdownMenu>
  <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Account</DropdownMenuLabel>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
    ),
    composition: `DropdownMenu
├── DropdownMenuTrigger
└── DropdownMenuContent
    ├── DropdownMenuLabel
    ├── DropdownMenuItem
    └── DropdownMenuSeparator`,
  },
  empty: {
    description:
      "A composed empty state for explaining missing content and suggesting the next action.",
    usage: example(
      "empty",
      "Empty, EmptyDescription, EmptyMedia, EmptyTitle",
      `<Empty>
  <EmptyMedia>⌕</EmptyMedia>
  <EmptyTitle>No results</EmptyTitle>
  <EmptyDescription>Try changing your filters.</EmptyDescription>
</Empty>`,
    ),
    composition: `Empty
├── EmptyMedia
├── EmptyTitle
└── EmptyDescription`,
  },
  field: {
    description:
      "Groups a form control with its label, supporting description, and validation message.",
    usage: example(
      "field",
      "Field, FieldDescription, FieldError, FieldLabel",
      `import { Input } from "@/components/ui/input";

<Field>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" type="email" />
  <FieldDescription>We will only use this for receipts.</FieldDescription>
  <FieldError>Please enter a valid email.</FieldError>
</Field>`,
    ),
    composition: `FieldGroup
└── Field
    ├── FieldLabel
    ├── Control
    ├── FieldDescription
    └── FieldError`,
  },
  "file-upload": {
    description:
      "A drag-and-drop file picker with selection feedback, progress, validation, and multiple-file support.",
    usage: example(
      "file-upload",
      "FileUpload",
      `<FileUpload
  accept="image/*"
  multiple
  onFiles={(files) => console.log(files)}
/>`,
    ),
  },
  "hover-card": {
    description: "Shows contextual details when a pointer pauses over a link or other trigger.",
    usage: example(
      "hover-card",
      "HoverCard, HoverCardContent, HoverCardTrigger",
      `<HoverCard>
  <HoverCardTrigger>@swift-rust</HoverCardTrigger>
  <HoverCardContent>Rust-powered React tooling.</HoverCardContent>
</HoverCard>`,
    ),
    composition: `HoverCard
├── HoverCardTrigger
└── HoverCardContent`,
  },
  input: {
    description:
      "A text field with shared variant, size, and design controls for consistent forms.",
    usage: example(
      "input",
      "Input",
      `<Input type="email" placeholder="you@example.com" />
<Input design="soft" variant="destructive" aria-invalid />`,
    ),
  },
  "input-group": {
    description:
      "Wraps an input with leading or trailing icons, text, buttons, and keyboard hints.",
    usage: example(
      "input-group",
      "InputGroup, InputGroupAddon",
      `<InputGroup>
  <InputGroupAddon>https://</InputGroupAddon>
  <input placeholder="example.com" />
  <InputGroupAddon align="end">⌘K</InputGroupAddon>
</InputGroup>`,
    ),
    composition: `InputGroup
├── InputGroupAddon
├── input
└── InputGroupAddon`,
  },
  "input-otp": {
    description: "A segmented numeric input for verification codes with automatic focus movement.",
    usage: example(
      "input-otp",
      "InputOTP",
      `<InputOTP
  length={6}
  onChange={(code) => console.log(code)}
/>`,
    ),
  },
  item: {
    description:
      "A flexible row primitive for pairing media, primary content, metadata, and actions.",
    usage: example(
      "item",
      "Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle",
      `<Item>
  <ItemMedia>✓</ItemMedia>
  <ItemContent>
    <ItemTitle>Deploy succeeded</ItemTitle>
    <ItemDescription>main · 12 seconds ago</ItemDescription>
  </ItemContent>
  <ItemActions>View</ItemActions>
</Item>`,
    ),
    composition: `Item
├── ItemMedia
├── ItemContent
│   ├── ItemTitle
│   └── ItemDescription
└── ItemActions`,
  },
  kanban: {
    description: "A planned board for arranging draggable cards across workflow columns.",
  },
  kbd: {
    description: "Displays a keyboard key or shortcut with compact, readable styling.",
    usage: example("kbd", "Kbd", `Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search.`),
  },
  label: {
    description: "An accessible label for form controls with muted and destructive emphasis.",
    usage: example(
      "label",
      "Label",
      `<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />`,
    ),
  },
  menubar: {
    description: "A persistent horizontal menu for grouped application commands and shortcuts.",
    usage: example(
      "menubar",
      "Menubar, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut",
      `<Menubar>
  <MenubarMenu value="file" label="File">
    <MenubarItem>New tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
    <MenubarSeparator />
    <MenubarItem>Close</MenubarItem>
  </MenubarMenu>
</Menubar>`,
    ),
    composition: `Menubar
└── MenubarMenu
    ├── MenubarItem
    │   └── MenubarShortcut
    └── MenubarSeparator`,
  },
  "native-select": {
    description:
      "A styled native select that keeps platform behavior, performance, and accessibility.",
    usage: example(
      "native-select",
      "NativeSelect",
      `<NativeSelect defaultValue="swift-rust">
  <option value="swift-rust">swift-rust</option>
  <option value="next">Next.js</option>
</NativeSelect>`,
    ),
  },
  "navigation-menu": {
    description: "A responsive collection of top-level links with optional flyout content.",
    usage: example(
      "navigation-menu",
      "NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger",
      `<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem value="docs">
      <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
      <NavigationMenuContent value="docs">
        <NavigationMenuLink href="/docs">Introduction</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`,
    ),
    composition: `NavigationMenu
└── NavigationMenuList
    └── NavigationMenuItem
        ├── NavigationMenuTrigger
        └── NavigationMenuContent
            └── NavigationMenuLink`,
  },
  pagination: {
    description:
      "Moves through a known number of pages with compact previous, next, and page controls.",
    usage: example(
      "pagination",
      "Pagination",
      `<Pagination
  page={page}
  total={12}
  onChange={setPage}
/>`,
    ),
  },
  popover: {
    description:
      "Displays compact interactive content in a floating surface anchored to a trigger.",
    usage: example(
      "popover",
      "Popover, PopoverContent, PopoverTrigger",
      `<Popover>
  <PopoverTrigger>Open settings</PopoverTrigger>
  <PopoverContent>Choose your preferred dimensions.</PopoverContent>
</Popover>`,
    ),
    composition: `Popover
├── PopoverTrigger
└── PopoverContent`,
  },
  progress: {
    description: "Communicates the completion of a task or process along a horizontal track.",
    usage: example("progress", "Progress", `<Progress value={66} />`),
  },
  "radio-group": {
    description: "Lets a user choose exactly one value from a clearly labelled group of options.",
    usage: example(
      "radio-group",
      "RadioGroup, RadioGroupItem",
      `<RadioGroup defaultValue="comfortable">
  <RadioGroupItem value="compact" label="Compact" />
  <RadioGroupItem value="comfortable" label="Comfortable" />
</RadioGroup>`,
    ),
    composition: `RadioGroup
├── RadioGroupItem
└── RadioGroupItem`,
  },
  resizable: {
    description:
      "Creates adjacent panels whose boundary can be dragged to redistribute available space.",
    usage: example(
      "resizable",
      "ResizableHandle, ResizablePanel, ResizablePanelGroup",
      `<ResizablePanelGroup defaultSize={40}>
  <ResizablePanel index={0}>Sidebar</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel index={1}>Content</ResizablePanel>
</ResizablePanelGroup>`,
    ),
    composition: `ResizablePanelGroup
├── ResizablePanel
├── ResizableHandle
└── ResizablePanel`,
  },
  "rich-text-editor": {
    description:
      "A planned rich text editing surface with a formatting toolbar and structured output.",
  },
  "scroll-area": {
    description: "Provides a bounded, consistently styled region for overflowing content.",
    usage: example(
      "scroll-area",
      "ScrollArea",
      `<ScrollArea className="h-72 w-56">
  {items.map((item) => <div key={item.id}>{item.name}</div>)}
</ScrollArea>`,
    ),
  },
  select: {
    description: "A lightweight styled native select for choosing one value from a short list.",
    usage: example(
      "select",
      "Select",
      `<Select defaultValue="swift-rust">
  <option value="swift-rust">swift-rust</option>
  <option value="next">Next.js</option>
</Select>`,
    ),
  },
  separator: {
    description:
      "Visually divides content horizontally or vertically while exposing semantic orientation.",
    usage: example(
      "separator",
      "Separator",
      `<div>Account</div>
<Separator className="my-4" />
<div>Billing</div>`,
    ),
  },
  sheet: {
    description:
      "Slides supplementary content from any viewport edge without leaving the current page.",
    usage: example(
      "sheet",
      "Sheet, SheetClose, SheetContent, SheetTrigger",
      `<Sheet side="right">
  <SheetTrigger>Open filters</SheetTrigger>
  <SheetContent>
    Filter controls
    <SheetClose>Done</SheetClose>
  </SheetContent>
</Sheet>`,
    ),
    composition: `Sheet
├── SheetTrigger
└── SheetContent
    └── SheetClose`,
  },
  sidebar: {
    description:
      "A collapsible application sidebar with structured header, content, labels, and items.",
    usage: example(
      "sidebar",
      "Sidebar, SidebarContent, SidebarGroupLabel, SidebarHeader, SidebarItem, SidebarProvider, SidebarTrigger",
      `<SidebarProvider>
  <Sidebar>
    <SidebarHeader>Workspace</SidebarHeader>
    <SidebarContent>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarItem active>Overview</SidebarItem>
    </SidebarContent>
  </Sidebar>
  <SidebarTrigger />
</SidebarProvider>`,
    ),
    composition: `SidebarProvider
├── Sidebar
│   ├── SidebarHeader
│   └── SidebarContent
│       ├── SidebarGroupLabel
│       └── SidebarItem
└── SidebarTrigger`,
  },
  skeleton: {
    description: "A placeholder surface that preserves layout while content is loading.",
    usage: example(
      "skeleton",
      "Skeleton",
      `<div className="flex items-center gap-3">
  <Skeleton className="size-10 rounded-full" />
  <Skeleton className="h-4 w-40" />
</div>`,
    ),
  },
  slider: {
    description: "A native range control for choosing a numeric value along a track.",
    usage: example(
      "slider",
      "Slider",
      `<Slider min={0} max={100} defaultValue={40} aria-label="Volume" />`,
    ),
  },
  sonner: {
    description: "Queues lightweight toast notifications with optional detail and semantic tones.",
    usage: example(
      "sonner",
      "Toaster, toast",
      `import { Button } from "@/components/ui/button";

<Button onClick={() => toast("Saved", { tone: "success" })}>Save</Button>
<Toaster />`,
    ),
    composition: `Application
├── Trigger calling toast()
└── Toaster`,
  },
  spinner: {
    description: "An accessible animated indicator for indeterminate loading states.",
    usage: example("spinner", "Spinner", `<Spinner size="lg" aria-label="Loading" />`),
  },
  stepper: {
    description: "Shows progress through a multi-step flow in horizontal or vertical orientation.",
    usage: example(
      "stepper",
      "Stepper",
      `<Stepper
  current={1}
  steps={[
    { title: "Account", description: "Your details" },
    { title: "Profile", description: "Set up" },
    { title: "Done", description: "Review" },
  ]}
/>`,
    ),
  },
  switch: {
    description: "A compact native control for immediately toggling a setting on or off.",
    usage: example(
      "switch",
      "Switch",
      `<label className="flex items-center gap-2">
  <Switch defaultChecked />
  Email notifications
</label>`,
    ),
  },
  table: {
    description:
      "Semantic table primitives for presenting structured rows and columns with consistent styling.",
    usage: example(
      "table",
      "Table, TableBody, TableCell, TableHead, TableHeader, TableRow",
      `<Table>
  <TableHeader>
    <TableRow><TableHead>Name</TableHead><TableHead>Role</TableHead></TableRow>
  </TableHeader>
  <TableBody>
    <TableRow><TableCell>Ada</TableCell><TableCell>Owner</TableCell></TableRow>
  </TableBody>
</Table>`,
    ),
    composition: `Table
├── TableHeader
│   └── TableRow
│       └── TableHead
└── TableBody
    └── TableRow
        └── TableCell`,
  },
  tabs: {
    description: "Organizes related content into panels that share one compact row of triggers.",
    usage: example(
      "tabs",
      "Tabs, TabsContent, TabsList, TabsTrigger",
      `<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account settings</TabsContent>
  <TabsContent value="security">Security settings</TabsContent>
</Tabs>`,
    ),
    composition: `Tabs
├── TabsList
│   ├── TabsTrigger
│   └── TabsTrigger
├── TabsContent
└── TabsContent`,
  },
  textarea: {
    description: "A multi-line text control with the shared variant and design system.",
    usage: example(
      "textarea",
      "Textarea",
      `<Textarea placeholder="Tell us about your project" rows={5} />`,
    ),
  },
  toggle: {
    description:
      "A two-state button for formatting controls, filters, and other pressable options.",
    usage: example(
      "toggle",
      "Toggle",
      `<Toggle pressed={bold} onClick={() => setBold((value) => !value)}>
  Bold
</Toggle>`,
    ),
  },
  "toggle-group": {
    description: "Coordinates a set of toggle items with single or multiple selection behavior.",
    usage: example(
      "toggle-group",
      "ToggleGroup, ToggleGroupItem",
      `<ToggleGroup type="single" defaultValue="center">
  <ToggleGroupItem value="left">Left</ToggleGroupItem>
  <ToggleGroupItem value="center">Center</ToggleGroupItem>
  <ToggleGroupItem value="right">Right</ToggleGroupItem>
</ToggleGroup>`,
    ),
    composition: `ToggleGroup
├── ToggleGroupItem
├── ToggleGroupItem
└── ToggleGroupItem`,
  },
  tooltip: {
    description:
      "Provides a short, non-interactive explanation when a user hovers or focuses a control.",
    usage: example(
      "tooltip",
      "Tooltip, TooltipProvider",
      `import { Button } from "@/components/ui/button";

<TooltipProvider>
  <Tooltip label="Add to library">
    <Button variant="outline">Add</Button>
  </Tooltip>
</TooltipProvider>`,
    ),
    composition: `TooltipProvider
└── Tooltip
    └── Trigger element`,
  },
};
