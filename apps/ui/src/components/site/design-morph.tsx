"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const ACTIVITY = [38, 68, 52, 84, 61, 92, 74];

export function DesignMorph() {
  return (
    <div className="dark force-dark grid overflow-hidden rounded-xl border border-border bg-bg lg:grid-cols-[1.1fr_0.9fr_1fr]">
      <div className="border-b border-border p-5 lg:border-r lg:border-b-0">
        <div className="mb-8 flex flex-wrap gap-2">
          <Button size="sm">Button</Button>
          <Button size="sm" variant="secondary">
            Secondary
          </Button>
          <Button size="sm" variant="outline">
            Outline
          </Button>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="showcase-name">Name</Label>
            <Input id="showcase-name" placeholder="Your name" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="showcase-email">Email</Label>
            <Input id="showcase-email" placeholder="you@example.com" />
          </div>
          <Button className="w-full">Create account</Button>
        </div>
      </div>

      <div className="border-b border-border p-5 lg:border-r lg:border-b-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium">Weekly activity</p>
            <p className="mt-1 text-sm text-fg-muted">Last seven days</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
            <span className="size-1.5 rounded-full bg-accent" />
            Live
          </span>
        </div>
        <div className="mt-8 flex h-36 items-end gap-2">
          {ACTIVITY.map((height, index) => (
            <div
              key={`${height}-${index}`}
              className="flex-1 rounded-sm bg-fg"
              style={{ height: `${height}%`, opacity: 0.28 + index * 0.09 }}
            />
          ))}
        </div>
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-fg-muted">Components installed</span>
            <span>42 / 62</span>
          </div>
          <Progress value={42} max={62} />
        </div>
      </div>

      <div className="grid gap-px bg-border">
        <Card className="rounded-none border-0 bg-surface shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>Team workspace</CardTitle>
                <CardDescription>Invite collaborators to your project.</CardDescription>
              </div>
              <div className="flex -space-x-2">
                {["AS", "MK", "JR"].map((initials) => (
                  <Avatar key={initials} className="border-2 border-surface">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Manage team
            </Button>
          </CardContent>
        </Card>

        <div className="bg-surface p-5">
          <Alert>
            <AlertTitle>Ready to ship</AlertTitle>
            <AlertDescription>All checks passed. Your release can be deployed.</AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
