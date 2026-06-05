import type { Metadata } from "swift-rust";
import { Link } from "swift-rust";

export const metadata: Metadata = { title: "Team" };

const TEAM = [
  {
    name: "Alex Chen",
    role: "Founding Engineer",
    bio: "Previously: framework team at a cloud company you've heard of. Rust since 2017.",
  },
  {
    name: "Priya Singh",
    role: "Runtime Engineer",
    bio: "Spent five years on the React server renderer. Now she does the same thing in Rust, but faster.",
  },
  {
    name: "Jordan Kim",
    role: "Compiler Engineer",
    bio: "SWC contributor. Believes that everything that can be a compiler pass, should be.",
  },
  {
    name: "Maria Lopez",
    role: "Design Systems",
    bio: "Designs the components you will use every day. Wrote the type scale. Picky about kerning.",
  },
  {
    name: "Sam Rivera",
    role: "Infrastructure",
    bio: "Deploys the binary to the edge. Has strong opinions about Linux distros.",
  },
];

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/about"
        className="inline-flex items-center gap-1.5 text-[0.875rem] text-fg-muted hover:text-fg"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        About
      </Link>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">Team</h1>
      <p className="mt-4 text-fg-muted">Five engineers, one framework.</p>

      <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
        {TEAM.map((person) => (
          <li key={person.name} className="bg-surface p-6">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full font-mono text-[0.875rem] font-semibold text-white"
                style={{ background: hashColor(person.name) }}
              >
                {person.name
                  .split(" ")
                  .map((s) => s[0])
                  .join("")}
              </div>
              <div>
                <p className="font-semibold">{person.name}</p>
                <p className="text-[0.8125rem] text-fg-muted">{person.role}</p>
              </div>
            </div>
            <p className="mt-4 text-[0.875rem] leading-relaxed text-fg-muted">
              {person.bio}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function hashColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  const hue = Math.abs(h) % 360;
  return `hsl(${hue}, 65%, 45%)`;
}
