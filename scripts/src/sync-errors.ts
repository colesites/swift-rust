import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const DOCS_DIR = join(ROOT, "errors", "docs");
const RUST_FILE = join(ROOT, "crates", "errors", "src", "lib.rs");

interface DocEntry {
  file: string;
  code: string;
  title: string;
  summary: string;
  category?: string;
}

export function loadDocs(dir: string = DOCS_DIR): DocEntry[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const content = readFileSync(join(dir, f), "utf8");
      const match = content.match(/^---\n([\s\S]*?)\n---/);
      const body = match?.[1] ?? "";
      const fm: Record<string, string> = {};
      for (const line of body.split("\n")) {
        const i = line.indexOf(":");
        if (i < 0) continue;
        fm[line.slice(0, i).trim()] = line.slice(i + 1).trim();
      }
      if (!fm.code || !fm.title) throw new Error(`missing frontmatter in ${f}`);
      return {
        file: f,
        code: fm.code,
        title: fm.title,
        summary: fm.summary ?? "",
        category: fm.category,
      };
    });
}

export function loadRustVariants(file: string = RUST_FILE): string[] {
  if (!existsSync(file)) return [];
  const rust = readFileSync(file, "utf8");
  return Array.from(rust.matchAll(/Self::(\w+)\s*\{\s*\.\.\s*\}/g))
    .map((m) => m[1])
    .filter((v): v is string => typeof v === "string");
}

export function syncErrors(): void {
  const docs = loadDocs();
  const variants = loadRustVariants();
  const docCodes = new Set(docs.map((d) => d.code));
  console.log(`docs: ${docCodes.size}, rust variants: ${variants.length}`);

  for (const d of docs) {
    if (!/^SR\d{4}$/.test(d.code)) {
      throw new Error(`invalid code in ${d.file}: ${d.code}`);
    }
  }

  if (variants.length && variants.length !== docs.length) {
    console.warn(
      `mismatch: ${docs.length} docs vs ${variants.length} rust variants. Re-run after updating crates/errors/src/lib.rs.`,
    );
  }
}

if (import.meta.main) syncErrors();
