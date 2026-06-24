import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const REGISTRY = join(import.meta.dir, "..", "registry", "components");

// The style dimension ("design" prop — React reserves `style`) shipped first on
// these components; each must offer the full design set.
const DESIGN_COMPONENTS = ["accordion", "alert", "avatar", "button", "card", "input"] as const;
const DESIGNS = ["flat", "soft", "3d", "glass", "neo", "brutal", "gradient"] as const;

// Purely presentational components must NOT carry 'use client'. Under swift-rust's
// SSR + islands model, a 'use client' component used directly in a server page is
// wrapped as an island and its children don't cross the boundary — hydration then
// wipes the children (an Alert rendered empty). Static SSR keeps children and ships
// zero JS. Only genuinely stateful components (accordion: useState/context) opt in.
const PRESENTATIONAL = ["button", "card", "input", "label", "avatar", "alert"] as const;
const STATEFUL = ["accordion"] as const;

describe("registry components", () => {
  const files = readdirSync(REGISTRY).filter((f) => f.endsWith(".tsx"));
  const firstLine = (slug: string) =>
    readFileSync(join(REGISTRY, `${slug}.tsx`), "utf8")
      .split("\n")[0]
      ?.trim();

  test("presentational components are server-renderable (no 'use client')", () => {
    for (const slug of PRESENTATIONAL) {
      expect({ slug, directive: firstLine(slug) }).not.toEqual({
        slug,
        directive: '"use client";',
      });
    }
  });

  test("stateful components declare 'use client'", () => {
    for (const slug of STATEFUL) {
      expect(firstLine(slug)).toBe('"use client";');
    }
  });

  test("every component transpiles as TSX", () => {
    const transpiler = new Bun.Transpiler({ loader: "tsx" });
    for (const file of files) {
      const src = readFileSync(join(REGISTRY, file), "utf8");
      expect(() => transpiler.transformSync(src)).not.toThrow();
    }
  });

  test("no Tailwind v3-only classnames (renamed or removed in v4)", () => {
    // Utilities that v4 removed or renamed; using them warns or silently breaks.
    const banned = [
      /\boutline-none\b/, // → outline-hidden (v4's outline-none means something else)
      /\bbg-gradient-to-/, // → bg-linear-to-*
      /\bflex-shrink-/, // → shrink-*
      /\bflex-grow\b/, // → grow
      /\b(?:bg|text|border|ring|divide|placeholder)-opacity-\d/, // → color/NN syntax
      /\boverflow-ellipsis\b/, // → text-ellipsis
      /\bdecoration-(?:slice|clone)\b/, // → box-decoration-*
    ];
    for (const file of files) {
      const src = readFileSync(join(REGISTRY, file), "utf8");
      for (const re of banned) {
        expect({ file, matches: re.test(src) ? re.source : null }).toEqual({
          file,
          matches: null,
        });
      }
    }
  });

  test("design-dimension components expose every design style", () => {
    for (const name of DESIGN_COMPONENTS) {
      const src = readFileSync(join(REGISTRY, `${name}.tsx`), "utf8");
      for (const design of DESIGNS) {
        expect({ name, design, present: src.includes(`"${design}"`) }).toEqual({
          name,
          design,
          present: true,
        });
      }
    }
  });

  test("button exposes the full variant and size matrix", () => {
    const src = readFileSync(join(REGISTRY, "button.tsx"), "utf8");
    for (const v of ["default", "outline", "secondary", "ghost", "destructive", "link"]) {
      expect(src).toContain(`${v}:`);
    }
    for (const s of ["xs", "sm", "md", "lg", "icon", "icon-xs", "icon-sm", "icon-md", "icon-lg"]) {
      expect(src).toContain(`"${s}"`);
    }
  });
});
