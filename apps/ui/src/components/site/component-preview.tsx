"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button, type ButtonDesign } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Code, Pre } from "@/components/ui/code";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle, ToggleGroup } from "@/components/ui/toggle";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import { Carousel, CarouselItem } from "@/components/ui/carousel";
import { BarChart } from "@/components/ui/chart";
import { CodeBlock } from "@/components/ui/code-block";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Combobox } from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/date-picker";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { FileUpload } from "@/components/ui/file-upload";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { InputOTP } from "@/components/ui/input-otp";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { NativeSelect } from "@/components/ui/native-select";
import { Stepper } from "@/components/ui/stepper";
import { ToggleGroup as TGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const DESIGNS: ButtonDesign[] = ["flat", "soft", "3d", "glass", "neo", "brutal", "gradient"];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-[0.7rem] uppercase tracking-widest text-fg-subtle">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function DesignRow({ render }: { render: (d: ButtonDesign) => React.ReactNode }) {
  return (
    <Row label="design">
      <div className="dark force-dark flex w-full flex-wrap items-center gap-3 rounded-xl border border-border bg-[#0b0a10] p-5">
        {DESIGNS.map((d) => (
          <React.Fragment key={d}>{render(d)}</React.Fragment>
        ))}
      </div>
    </Row>
  );
}

// Sub-entries for the right-rail "On this page", for slugs whose Examples
// section is a set of titled examples. Ids match each ExamplePreview's slug.
export const EXAMPLE_TOC: Record<string, { id: string; label: string }[]> = {
  accordion: [
    { id: "basic", label: "Basic" },
    { id: "multiple", label: "Multiple" },
    { id: "disabled", label: "Disabled" },
    { id: "borders", label: "Borders" },
    { id: "card", label: "Card" },
    { id: "rtl", label: "RTL" },
  ],
  alert: [
    { id: "basic", label: "Basic" },
    { id: "destructive", label: "Destructive" },
    { id: "action", label: "Action" },
    { id: "custom-colors", label: "Custom Colors" },
    { id: "rtl", label: "RTL" },
  ],
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** A standalone example: heading + description, a preview surface, and toggleable code. */
function ExamplePreview({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description: React.ReactNode;
  code: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <section id={slugify(title)} className="scroll-mt-24">
      <h3 className="font-display text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-fg-muted">{description}</p>
      {/* Transparent preview surface — border only, no fill. */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-border">
        <div className="flex min-h-56 items-center justify-center p-4 sm:p-8">{children}</div>
        {/* Code: a faded teaser with a centered "View Code" button; expands on click. */}
        <div className="relative border-t border-border">
          <div className={cn("overflow-hidden", !open && "max-h-32")}>
            <CodeBlock code={code} language="tsx" />
          </div>
          {!open && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="absolute inset-0 grid place-items-center bg-bg/40"
            >
              <span className="rounded-lg border border-border bg-bg px-4 py-2 text-sm font-medium text-fg shadow-sm transition-colors hover:bg-surface">
                View Code
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

const ACCORDION_IMPORT = `import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";`;

const ACCORDION_BASIC_CODE = `${ACCORDION_IMPORT}

<Accordion type="single" defaultValue="reset">
  <AccordionItem value="reset">
    <AccordionTrigger value="reset">How do I reset my password?</AccordionTrigger>
    <AccordionContent value="reset">
      Click "Forgot password" on the login page, enter your email, and we'll
      send a reset link. The link expires in 24 hours.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="plan">
    <AccordionTrigger value="plan">Can I change my subscription plan?</AccordionTrigger>
    <AccordionContent value="plan">
      Yes — upgrade or downgrade anytime from Billing.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="pay">
    <AccordionTrigger value="pay">What payment methods do you accept?</AccordionTrigger>
    <AccordionContent value="pay">
      All major cards, plus PayPal and Apple Pay on supported devices.
    </AccordionContent>
  </AccordionItem>
</Accordion>`;

const ACCORDION_MULTIPLE_CODE = `${ACCORDION_IMPORT}

<Accordion type="multiple" defaultValue={["notif"]}>
  <AccordionItem value="notif">
    <AccordionTrigger value="notif">Notification settings</AccordionTrigger>
    <AccordionContent value="notif">
      Manage how you receive notifications.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="privacy">
    <AccordionTrigger value="privacy">Privacy & security</AccordionTrigger>
    <AccordionContent value="privacy">
      Enable two-factor authentication and review signed-in devices.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="billing">
    <AccordionTrigger value="billing">Billing & subscription</AccordionTrigger>
    <AccordionContent value="billing">
      View invoices and manage your plan.
    </AccordionContent>
  </AccordionItem>
</Accordion>`;

const ACCORDION_DISABLED_CODE = `${ACCORDION_IMPORT}

<Accordion type="single" defaultValue="history">
  <AccordionItem value="history">
    <AccordionTrigger value="history">Can I access my account history?</AccordionTrigger>
    <AccordionContent value="history">
      Yes — the last 12 months of activity is available under Account → History.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="premium" disabled>
    <AccordionTrigger value="premium" disabled>
      Premium feature information
    </AccordionTrigger>
    <AccordionContent value="premium">Upgrade to unlock this section.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="email">
    <AccordionTrigger value="email">How do I update my email address?</AccordionTrigger>
    <AccordionContent value="email">
      Open Account → Profile, edit your email, and confirm.
    </AccordionContent>
  </AccordionItem>
</Accordion>`;

const ACCORDION_BORDERS_CODE = `${ACCORDION_IMPORT}

{/* Default (divided) variant, framed with a border on the Accordion */}
<Accordion type="single" defaultValue="how" className="rounded-lg border border-border px-4">
  <AccordionItem value="how">
    <AccordionTrigger value="how">How does billing work?</AccordionTrigger>
    <AccordionContent value="how">
      Monthly and annual plans, billed at the start of each cycle.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="secure">
    <AccordionTrigger value="secure">Is my data secure?</AccordionTrigger>
    <AccordionContent value="secure">
      Encrypted in transit and at rest, with daily backups.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="integrations">
    <AccordionTrigger value="integrations">What integrations do you support?</AccordionTrigger>
    <AccordionContent value="integrations">
      Slack, GitHub, Linear, and a REST API.
    </AccordionContent>
  </AccordionItem>
</Accordion>`;

const ACCORDION_CARD_CODE = `import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Subscription & billing</CardTitle>
    <CardDescription>Common questions about plans and payments.</CardDescription>
  </CardHeader>
  <CardContent>
    <Accordion type="single" defaultValue="plans">
      <AccordionItem value="plans">
        <AccordionTrigger value="plans">What subscription plans do you offer?</AccordionTrigger>
        <AccordionContent value="plans">
          Starter, Professional and Enterprise.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="cancel">
        <AccordionTrigger value="cancel">How do I cancel?</AccordionTrigger>
        <AccordionContent value="cancel">
          Cancel anytime from Billing.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </CardContent>
</Card>`;

const ACCORDION_RTL_CODE = `${ACCORDION_IMPORT}

<div dir="rtl">
  <Accordion type="single" defaultValue="reset">
    <AccordionItem value="reset">
      <AccordionTrigger value="reset">كيف يمكنني إعادة تعيين كلمة المرور؟</AccordionTrigger>
      <AccordionContent value="reset">
        انقر على «نسيت كلمة المرور» في صفحة تسجيل الدخول.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="plan">
      <AccordionTrigger value="plan">هل يمكنني تغيير خطة الاشتراك؟</AccordionTrigger>
      <AccordionContent value="plan">نعم — في أي وقت من صفحة الفوترة.</AccordionContent>
    </AccordionItem>
  </Accordion>
</div>`;

function AccordionExamples() {
  return (
    <div className="flex flex-col gap-12">
      <ExamplePreview
        title="Basic"
        description="A basic accordion that shows one item at a time. The first item is open by default."
        code={ACCORDION_BASIC_CODE}
      >
        <div className="w-full max-w-lg">
          <Accordion type="single" defaultValue="reset">
            <AccordionItem value="reset">
              <AccordionTrigger value="reset">How do I reset my password?</AccordionTrigger>
              <AccordionContent value="reset">
                Click “Forgot password” on the login page, enter your email, and we&apos;ll send a reset
                link. The link expires in 24 hours.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="plan">
              <AccordionTrigger value="plan">Can I change my subscription plan?</AccordionTrigger>
              <AccordionContent value="plan">
                Yes — upgrade or downgrade anytime from Billing. Changes are prorated to your current
                cycle.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="pay">
              <AccordionTrigger value="pay">What payment methods do you accept?</AccordionTrigger>
              <AccordionContent value="pay">
                All major cards, plus PayPal and Apple Pay on supported devices.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ExamplePreview>

      <ExamplePreview
        title="Multiple"
        description={
          <>
            Use <code className="rounded bg-bg-subtle px-1 py-0.5 text-sm">type=&quot;multiple&quot;</code>{" "}
            to allow multiple items to be open at the same time.
          </>
        }
        code={ACCORDION_MULTIPLE_CODE}
      >
        <div className="w-full max-w-lg">
          <Accordion type="multiple" defaultValue={["notif"]}>
            <AccordionItem value="notif">
              <AccordionTrigger value="notif">Notification settings</AccordionTrigger>
              <AccordionContent value="notif">
                Manage how you receive notifications — email alerts for updates or push notifications on
                mobile.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="privacy">
              <AccordionTrigger value="privacy">Privacy &amp; security</AccordionTrigger>
              <AccordionContent value="privacy">
                Enable two-factor authentication and review the devices signed in to your account.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="billing">
              <AccordionTrigger value="billing">Billing &amp; subscription</AccordionTrigger>
              <AccordionContent value="billing">
                View invoices, update your payment method, and manage your plan.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ExamplePreview>

      <ExamplePreview
        title="Disabled"
        description={
          <>
            Use the <code className="rounded bg-bg-subtle px-1 py-0.5 text-sm">disabled</code> prop on
            an item to lock it.
          </>
        }
        code={ACCORDION_DISABLED_CODE}
      >
        <div className="w-full max-w-lg">
          <Accordion type="single" defaultValue="history">
            <AccordionItem value="history">
              <AccordionTrigger value="history">Can I access my account history?</AccordionTrigger>
              <AccordionContent value="history">
                Yes — the last 12 months of activity is available under Account → History.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="premium" disabled>
              <AccordionTrigger value="premium" disabled>
                Premium feature information
              </AccordionTrigger>
              <AccordionContent value="premium">Upgrade to unlock this section.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="email">
              <AccordionTrigger value="email">How do I update my email address?</AccordionTrigger>
              <AccordionContent value="email">
                Open Account → Profile, edit your email, and confirm via the link we send you.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ExamplePreview>

      <ExamplePreview
        title="Borders"
        description={
          <>
            Add a <code className="rounded bg-bg-subtle px-1 py-0.5 text-sm">border</code> to the{" "}
            <code className="rounded bg-bg-subtle px-1 py-0.5 text-sm">Accordion</code> to frame the
            divided items.
          </>
        }
        code={ACCORDION_BORDERS_CODE}
      >
        <div className="w-full max-w-lg">
          <Accordion type="single" defaultValue="how" className="rounded-lg border border-border px-4">
            <AccordionItem value="how">
              <AccordionTrigger value="how">How does billing work?</AccordionTrigger>
              <AccordionContent value="how">
                We offer monthly and annual plans. Billing runs at the start of each cycle and you can
                cancel anytime.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="secure">
              <AccordionTrigger value="secure">Is my data secure?</AccordionTrigger>
              <AccordionContent value="secure">
                All data is encrypted in transit and at rest, with automatic daily backups.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="integrations">
              <AccordionTrigger value="integrations">What integrations do you support?</AccordionTrigger>
              <AccordionContent value="integrations">
                Slack, GitHub, Linear, and a REST API for everything else.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ExamplePreview>

      <ExamplePreview
        title="Card"
        description="Wrap the Accordion in a Card."
        code={ACCORDION_CARD_CODE}
      >
        <div className="w-full max-w-lg">
          <Card>
            <CardHeader>
              <CardTitle>Subscription &amp; billing</CardTitle>
              <CardDescription>Common questions about plans, payments and cancellations.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" defaultValue="plans">
                <AccordionItem value="plans">
                  <AccordionTrigger value="plans">What subscription plans do you offer?</AccordionTrigger>
                  <AccordionContent value="plans">
                    Three tiers: Starter ($9/mo), Professional ($29/mo) and Enterprise ($99/mo), each
                    with increasing storage, API access and support.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="cardbilling">
                  <AccordionTrigger value="cardbilling">How does billing work?</AccordionTrigger>
                  <AccordionContent value="cardbilling">
                    Billing runs at the start of each cycle. Annual plans save two months.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="cancel">
                  <AccordionTrigger value="cancel">How do I cancel my subscription?</AccordionTrigger>
                  <AccordionContent value="cancel">
                    Cancel anytime from Billing — you keep access until the end of the paid period.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </ExamplePreview>

      <ExamplePreview
        title="RTL"
        description={
          <>
            Wrap in <code className="rounded bg-bg-subtle px-1 py-0.5 text-sm">dir=&quot;rtl&quot;</code> —
            layout and chevron mirror automatically.
          </>
        }
        code={ACCORDION_RTL_CODE}
      >
        <div className="w-full max-w-lg" dir="rtl">
          <Accordion type="single" defaultValue="rtl-reset">
            <AccordionItem value="rtl-reset">
              <AccordionTrigger value="rtl-reset">كيف يمكنني إعادة تعيين كلمة المرور؟</AccordionTrigger>
              <AccordionContent value="rtl-reset">
                انقر على «نسيت كلمة المرور» في صفحة تسجيل الدخول، وأدخل بريدك الإلكتروني وسنرسل لك رابطًا
                لإعادة التعيين. تنتهي صلاحية الرابط خلال 24 ساعة.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="rtl-plan">
              <AccordionTrigger value="rtl-plan">هل يمكنني تغيير خطة الاشتراك الخاصة بي؟</AccordionTrigger>
              <AccordionContent value="rtl-plan">
                نعم — يمكنك الترقية أو التخفيض في أي وقت من صفحة الفوترة.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ExamplePreview>
    </div>
  );
}

// Small inline icons so the examples don't pull in an icon dependency.
function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function AlertCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" strokeLinecap="round" />
      <path d="M12 16.5v.5" strokeLinecap="round" />
    </svg>
  );
}
function AlertTriangleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinejoin="round" />
      <path d="M12 9v4" strokeLinecap="round" />
      <path d="M12 16.5v.5" strokeLinecap="round" />
    </svg>
  );
}

const ALERT_BASIC_CODE = `import { CheckCircleIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

<Alert>
  <CheckCircleIcon />
  <AlertTitle>Account updated successfully</AlertTitle>
  <AlertDescription>
    Your profile information has been saved. Changes will be reflected immediately.
  </AlertDescription>
</Alert>`;

const ALERT_DESTRUCTIVE_CODE = `import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

<Alert variant="destructive">
  <AlertCircleIcon />
  <AlertTitle>Payment failed</AlertTitle>
  <AlertDescription>
    Your payment could not be processed. Please check your payment method and try again.
  </AlertDescription>
</Alert>`;

const ALERT_ACTION_CODE = `import {
  Alert,
  AlertAction,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

<Alert>
  <AlertTitle>Dark mode is now available</AlertTitle>
  <AlertDescription>Enable it under your profile settings to get started.</AlertDescription>
  <AlertAction>
    <Button size="xs" variant="secondary">Enable</Button>
  </AlertAction>
</Alert>`;

const ALERT_CUSTOM_CODE = `import { AlertTriangleIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

{/* Override colors with utility classes on the Alert */}
<Alert className="border-amber-600/40 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100">
  <AlertTriangleIcon />
  <AlertTitle>Your subscription will expire in 3 days.</AlertTitle>
  <AlertDescription className="text-amber-800 dark:text-amber-200/90">
    Renew now to avoid service interruption or upgrade to a paid plan to continue.
  </AlertDescription>
</Alert>`;

const ALERT_RTL_CODE = `import { CheckCircleIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

<div dir="rtl">
  <Alert>
    <CheckCircleIcon />
    <AlertTitle>تم تحديث الحساب بنجاح</AlertTitle>
    <AlertDescription>تم حفظ معلومات ملفك الشخصي وستظهر التغييرات فورًا.</AlertDescription>
  </Alert>
</div>`;

function AlertExamples() {
  return (
    <div className="flex flex-col gap-12">
      <ExamplePreview
        title="Basic"
        description="A basic alert with an icon, title and description."
        code={ALERT_BASIC_CODE}
      >
        <div className="w-full max-w-lg">
          <Alert>
            <CheckCircleIcon />
            <AlertTitle>Account updated successfully</AlertTitle>
            <AlertDescription>
              Your profile information has been saved. Changes will be reflected immediately.
            </AlertDescription>
          </Alert>
        </div>
      </ExamplePreview>

      <ExamplePreview
        title="Destructive"
        description={
          <>
            Use <code className="rounded bg-bg-subtle px-1 py-0.5 text-sm">variant=&quot;destructive&quot;</code>{" "}
            to create a destructive alert.
          </>
        }
        code={ALERT_DESTRUCTIVE_CODE}
      >
        <div className="w-full max-w-lg">
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Payment failed</AlertTitle>
            <AlertDescription>
              Your payment could not be processed. Please check your payment method and try again.
            </AlertDescription>
          </Alert>
        </div>
      </ExamplePreview>

      <ExamplePreview
        title="Action"
        description={
          <>
            Use <code className="rounded bg-bg-subtle px-1 py-0.5 text-sm">AlertAction</code> to add a
            button or other action element to the alert.
          </>
        }
        code={ALERT_ACTION_CODE}
      >
        <div className="w-full max-w-lg">
          <Alert>
            <AlertTitle>Dark mode is now available</AlertTitle>
            <AlertDescription>Enable it under your profile settings to get started.</AlertDescription>
            <AlertAction>
              <Button size="xs" variant="secondary">
                Enable
              </Button>
            </AlertAction>
          </Alert>
        </div>
      </ExamplePreview>

      <ExamplePreview
        title="Custom Colors"
        description={
          <>
            Customize the alert colors by adding utility classes such as{" "}
            <code className="rounded bg-bg-subtle px-1 py-0.5 text-sm">bg-amber-50 dark:bg-amber-950</code>{" "}
            to the <code className="rounded bg-bg-subtle px-1 py-0.5 text-sm">Alert</code>.
          </>
        }
        code={ALERT_CUSTOM_CODE}
      >
        <div className="w-full max-w-lg">
          <Alert className="border-amber-600/40 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100">
            <AlertTriangleIcon />
            <AlertTitle>Your subscription will expire in 3 days.</AlertTitle>
            <AlertDescription className="text-amber-800 dark:text-amber-200/90">
              Renew now to avoid service interruption or upgrade to a paid plan to continue using the
              service.
            </AlertDescription>
          </Alert>
        </div>
      </ExamplePreview>

      <ExamplePreview
        title="RTL"
        description={
          <>
            Wrap in <code className="rounded bg-bg-subtle px-1 py-0.5 text-sm">dir=&quot;rtl&quot;</code> —
            the icon and layout mirror automatically.
          </>
        }
        code={ALERT_RTL_CODE}
      >
        <div className="w-full max-w-lg" dir="rtl">
          <Alert>
            <CheckCircleIcon />
            <AlertTitle>تم تحديث الحساب بنجاح</AlertTitle>
            <AlertDescription>تم حفظ معلومات ملفك الشخصي وستظهر التغييرات فورًا.</AlertDescription>
          </Alert>
        </div>
      </ExamplePreview>
    </div>
  );
}

function PaginationDemo() {
  const [page, setPage] = React.useState(2);
  return <Pagination page={page} total={8} onChange={setPage} />;
}

function ToggleGroupDemo() {
  const [v, setV] = React.useState("center");
  return (
    <ToggleGroup value={v} onValueChange={setV}>
      <Toggle value="left">Left</Toggle>
      <Toggle value="center">Center</Toggle>
      <Toggle value="right">Right</Toggle>
    </ToggleGroup>
  );
}

const SAMPLE_CODE = `import { Button } from "@/components/ui/button";

export function Cta() {
  return <Button design="3d">Get started</Button>;
}`;

const STEPS = [
  { title: "Account", description: "Your details" },
  { title: "Profile", description: "Set up" },
  { title: "Done", description: "Review" },
];

const PREVIEWS: Record<string, React.ReactNode> = {
  button: (
    <div className="flex flex-col gap-7">
      <Row label="variant">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </Row>
      <Row label="size">
        <Button size="xs">xs</Button>
        <Button size="sm">sm</Button>
        <Button size="default">default</Button>
        <Button size="lg">lg</Button>
      </Row>
      <DesignRow
        render={(d) => (
          <Button design={d} variant={d === "glass" || d === "brutal" ? "outline" : "default"}>
            {d}
          </Button>
        )}
      />
    </div>
  ),
  card: (
    <div className="dark force-dark grid w-full gap-4 rounded-xl border border-border bg-[#0b0a10] p-6 sm:grid-cols-3">
      {DESIGNS.slice(0, 6).map((d) => (
        <Card key={d} design={d}>
          <CardHeader>
            <CardTitle className="capitalize">{d}</CardTitle>
            <CardDescription>design=&quot;{d}&quot;</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  ),
  alert: <AlertExamples />,
  avatar: (
    <Row label="size">
      <Avatar size="xs"><AvatarFallback>XS</AvatarFallback></Avatar>
      <Avatar size="sm"><AvatarFallback>SM</AvatarFallback></Avatar>
      <Avatar><AvatarFallback>MD</AvatarFallback></Avatar>
      <Avatar size="lg"><AvatarFallback>LG</AvatarFallback></Avatar>
    </Row>
  ),
  input: (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="p-email">Email</Label>
        <Input id="p-email" type="email" placeholder="ada@swift-rust.dev" />
      </div>
      <Input placeholder="design=soft" design="soft" />
      <Input placeholder="destructive" variant="destructive" />
    </div>
  ),
  label: (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Label>Default label</Label>
      <Label variant="secondary" size="sm">Secondary, small</Label>
      <Label variant="destructive">Destructive</Label>
    </div>
  ),
  accordion: <AccordionExamples />,
  badge: (
    <div className="flex flex-col gap-6">
      <Row label="variant">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
      </Row>
      <Row label="size">
        <Badge size="sm">sm</Badge>
        <Badge size="default">default</Badge>
        <Badge size="lg">lg</Badge>
      </Row>
    </div>
  ),
  badge_extra: null,
  separator: (
    <div className="flex w-full max-w-sm flex-col gap-3 text-sm">
      <span>Above</span>
      <Separator />
      <div className="flex h-8 items-center gap-3">
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Right</span>
      </div>
    </div>
  ),
  skeleton: (
    <div className="flex w-full max-w-sm items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  ),
  spinner: (
    <Row label="size">
      <Spinner size="sm" />
      <Spinner />
      <Spinner size="lg" />
    </Row>
  ),
  kbd: (
    <div className="flex items-center gap-2 text-sm text-fg-muted">
      Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search
    </div>
  ),
  progress: (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress value={30} />
      <Progress value={66} />
    </div>
  ),
  code: (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <p>
        Inline <Code>npm install</Code> code.
      </p>
      <Pre>bunx @swift-rust/ui add button</Pre>
    </div>
  ),
  callout: (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Callout tone="info">An informational callout.</Callout>
      <Callout tone="success">Saved successfully.</Callout>
      <Callout tone="destructive">Something went wrong.</Callout>
    </div>
  ),
  breadcrumb: (
    <Breadcrumb>
      <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem><BreadcrumbLink href="#">Components</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem><BreadcrumbPage>Button</BreadcrumbPage></BreadcrumbItem>
    </Breadcrumb>
  ),
  checkbox: (
    <div className="flex flex-col gap-3 text-sm">
      <label className="flex items-center gap-2"><Checkbox defaultChecked /> Accept terms</label>
      <label className="flex items-center gap-2"><Checkbox /> Subscribe</label>
      <label className="flex items-center gap-2 opacity-60"><Checkbox disabled /> Disabled</label>
    </div>
  ),
  switch: (
    <div className="flex items-center gap-6 text-sm">
      <label className="flex items-center gap-2"><Switch defaultChecked /> On</label>
      <label className="flex items-center gap-2"><Switch /> Off</label>
    </div>
  ),
  "radio-group": (
    <RadioGroup defaultValue="comfortable" className="text-sm">
      <RadioGroupItem value="default" label="Default" />
      <RadioGroupItem value="comfortable" label="Comfortable" />
      <RadioGroupItem value="compact" label="Compact" />
    </RadioGroup>
  ),
  slider: (
    <div className="w-full max-w-sm">
      <Slider defaultValue={40} />
    </div>
  ),
  textarea: (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Textarea placeholder="Type your message…" />
      <Textarea placeholder="design=soft" design="soft" />
    </div>
  ),
  toggle: (
    <div className="flex flex-col gap-6">
      <Row label="single">
        <Toggle pressed>Bold</Toggle>
        <Toggle>Italic</Toggle>
        <Toggle variant="outline">Underline</Toggle>
      </Row>
      <Row label="group">
        <ToggleGroupDemo />
      </Row>
    </div>
  ),
  select: (
    <div className="w-full max-w-sm">
      <Select defaultValue="next">
        <option value="next">Next.js</option>
        <option value="vite">Vite</option>
        <option value="astro">Astro</option>
      </Select>
    </div>
  ),
  table: (
    <div className="w-full max-w-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Ada</TableCell>
            <TableCell><Badge variant="success">Active</Badge></TableCell>
            <TableCell>Owner</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Grace</TableCell>
            <TableCell><Badge variant="secondary">Invited</Badge></TableCell>
            <TableCell>Admin</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
  pagination: <PaginationDemo />,
  dialog: (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose><Button variant="ghost">Cancel</Button></DialogClose>
          <DialogClose><Button variant="destructive">Delete</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  popover: (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-sm font-medium">Dimensions</p>
        <p className="mt-1 text-sm text-muted-foreground">Set the layout dimensions here.</p>
      </PopoverContent>
    </Popover>
  ),
  "dropdown-menu": (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  tooltip: (
    <TooltipProvider>
      <Tooltip label="Add to library">
        <Button variant="outline">Hover me</Button>
      </Tooltip>
    </TooltipProvider>
  ),
  tabs: (
    <div className="w-full max-w-md">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <p className="pt-3 text-sm text-muted-foreground">Make changes to your account here.</p>
        </TabsContent>
        <TabsContent value="password">
          <p className="pt-3 text-sm text-muted-foreground">Change your password here.</p>
        </TabsContent>
      </Tabs>
    </div>
  ),

  // ── Newly added parity + originals ──────────────────────────────────────
  "code-block": (
    <div className="w-full max-w-lg">
      <CodeBlock code={SAMPLE_CODE} filename="cta.tsx" language="tsx" />
    </div>
  ),
  stepper: (
    <div className="w-full max-w-lg">
      <Stepper steps={STEPS} current={1} />
    </div>
  ),
  "file-upload": <FileUpload />,
  "aspect-ratio": (
    <div className="w-full max-w-sm">
      <AspectRatio ratio={16 / 9} className="rounded-lg bg-muted">
        <div className="flex size-full items-center justify-center text-sm text-muted-foreground">16 / 9</div>
      </AspectRatio>
    </div>
  ),
  "button-group": (
    <ButtonGroup>
      <Button variant="outline">Day</Button>
      <Button variant="outline">Week</Button>
      <Button variant="outline">Month</Button>
    </ButtonGroup>
  ),
  empty: (
    <Empty className="w-full max-w-sm">
      <EmptyMedia>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="round" /></svg>
      </EmptyMedia>
      <EmptyTitle>No results</EmptyTitle>
      <EmptyDescription>Try adjusting your filters or search terms.</EmptyDescription>
    </Empty>
  ),
  item: (
    <div className="w-full max-w-sm">
      <Item>
        <ItemMedia>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Deploy succeeded</ItemTitle>
          <ItemDescription>main@a1b2c3 · 12s ago</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  ),
  "input-group": (
    <div className="w-full max-w-sm">
      <InputGroup>
        <InputGroupAddon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" /></svg>
        </InputGroupAddon>
        <input placeholder="Search…" />
        <InputGroupAddon align="end">
          <kbd className="rounded border border-border px-1 text-[0.65rem]">⌘K</kbd>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
  "native-select": (
    <div className="w-full max-w-xs">
      <NativeSelect defaultValue="next">
        <option value="next">Next.js</option>
        <option value="vite">Vite</option>
        <option value="astro">Astro</option>
      </NativeSelect>
    </div>
  ),
  collapsible: (
    <div className="w-full max-w-sm">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-sm font-medium">
          Recent activity
          <span className="text-muted-foreground">▾</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-1 px-3 text-sm text-muted-foreground">
          <p>Pushed 3 commits</p>
          <p>Opened a pull request</p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
  "alert-dialog": (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Delete account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This permanently deletes your account.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  "toggle-group": (
    <TGroup type="single" defaultValue="bold">
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
    </TGroup>
  ),
  drawer: (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move goal</DrawerTitle>
          <DrawerDescription>Set your daily activity goal.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  "hover-card": (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@swift-rust</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <p className="text-sm font-medium">swift-rust</p>
        <p className="mt-1 text-sm text-muted-foreground">The React framework powered with Rust + Bun.</p>
      </HoverCardContent>
    </HoverCard>
  ),
  combobox: (
    <Combobox
      options={[
        { value: "next", label: "Next.js" },
        { value: "vite", label: "Vite" },
        { value: "astro", label: "Astro" },
        { value: "remix", label: "Remix" },
      ]}
      placeholder="Framework…"
    />
  ),
  "input-otp": <InputOTP length={6} defaultValue="12" />,
  calendar: <Calendar defaultValue={new Date()} />,
  "date-picker": <DatePicker />,
  carousel: (
    <div className="w-full max-w-lg px-6">
      <Carousel>
        {[1, 2, 3, 4].map((n) => (
          <CarouselItem key={n}>
            <div className="flex h-28 items-center justify-center rounded-lg bg-muted text-2xl font-semibold text-muted-foreground">
              {n}
            </div>
          </CarouselItem>
        ))}
      </Carousel>
    </div>
  ),
  chart: (
    <div className="w-full max-w-md">
      <BarChart
        data={[
          { label: "Mon", value: 12 },
          { label: "Tue", value: 19 },
          { label: "Wed", value: 8 },
          { label: "Thu", value: 22 },
          { label: "Fri", value: 16 },
        ]}
      />
    </div>
  ),
};

// Slugs whose preview is a multi-example set that brings its own surfaces —
// rendered full-bleed instead of inside the single shared preview box.
const FULL_BLEED = new Set(["accordion", "alert"]);

export function ComponentPreview({ slug }: { slug: string }) {
  const preview = PREVIEWS[slug];
  if (!preview) return null;
  if (FULL_BLEED.has(slug)) return <>{preview}</>;
  return (
    <div className="flex min-h-48 items-center justify-center rounded-2xl border border-border bg-surface p-4 sm:p-8">
      {preview}
    </div>
  );
}

export function hasPreview(slug: string): boolean {
  return Boolean(PREVIEWS[slug]);
}
