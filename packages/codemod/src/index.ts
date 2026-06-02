import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

export interface CodemodResult {
  changed: number;
  files: string[];
}

export interface Codemod {
  name: string;
  description: string;
  apply: (file: string, source: string) => string | null;
}

export function walk(dir: string, exts: string[] = [".tsx", ".ts", ".jsx", ".js"]): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      out.push(...walk(full, exts));
    } else if (exts.includes(extname(full))) {
      out.push(full);
    }
  }
  return out;
}

export function runCodemod(codemod: Codemod, root: string): CodemodResult {
  const files = walk(root);
  const changed: string[] = [];
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    const next = codemod.apply(file, source);
    if (next !== null && next !== source) {
      writeFileSync(file, next);
      changed.push(file);
    }
  }
  return { changed: changed.length, files: changed };
}

export const imgToImage: Codemod = {
  name: "img-to-image",
  description: "Replace raw <img> tags with the <Image> component.",
  apply: (_file, source) => {
    const replaced = source.replace(/<img\b([^>]*)\/?>/g, (_m, attrs) => {
      return `<Image${attrs} />`;
    });
    if (replaced !== source) {
      return `${replaced}\nimport { Image } from "swift-rust/image";\n`;
    }
    return null;
  },
};
