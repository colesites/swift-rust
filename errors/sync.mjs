#!/usr/bin/env bun
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const DOCS_DIR = join(ROOT, "errors", "docs");
const RUST_FILE = join(ROOT, "crates", "errors", "src", "lib.rs");
const SCHEMA_FILE = join(ROOT, "errors", "schema.json");
const MAPPING_FILE = join(ROOT, "errors", "_mapping.json");

const ALLOWED_CATEGORIES = new Set([
  "config",
  "routing",
  "compilation",
  "bundling",
  "build",
  "server",
  "image",
  "font",
  "pdf",
  "video",
  "style",
  "hydration",
  "runtime",
  "tooling",
]);
const ALLOWED_SEVERITIES = new Set(["error", "warning", "deprecation", "info"]);

const docs = readdirSync(DOCS_DIR)
  .filter((f) => f.endsWith(".md"))
  .sort();

let ok = true;
const errors = [];
const seenCodes = new Set();
const frontmatterByCode = new Map();

for (const file of docs) {
  const content = readFileSync(join(DOCS_DIR, file), "utf8");
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    errors.push(`${file}: missing frontmatter`);
    ok = false;
    continue;
  }

  const fm = {};
  for (const line of match[1].split("\n")) {
    const i = line.indexOf(":");
    if (i < 0) continue;
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    fm[key] = value;
  }

  const filenameCode = file.replace(/\.md$/, "");
  if (fm.code !== filenameCode) {
    errors.push(`${file}: frontmatter code "${fm.code}" does not match filename "${filenameCode}"`);
    ok = false;
  }

  if (!/^SR[0-9]{4}$/.test(fm.code ?? "")) {
    errors.push(`${file}: code "${fm.code}" is not a valid SR#### identifier`);
    ok = false;
  }

  if (seenCodes.has(fm.code)) {
    errors.push(`${file}: duplicate code "${fm.code}"`);
    ok = false;
  }
  seenCodes.add(fm.code);
  frontmatterByCode.set(fm.code, fm);

  for (const required of ["code", "title", "summary"]) {
    if (!fm[required]) {
      errors.push(`${file}: missing required frontmatter field "${required}"`);
      ok = false;
    }
  }

  if (fm.category && !ALLOWED_CATEGORIES.has(fm.category)) {
    errors.push(`${file}: invalid category "${fm.category}"`);
    ok = false;
  }

  if (fm.severity && !ALLOWED_SEVERITIES.has(fm.severity)) {
    errors.push(`${file}: invalid severity "${fm.severity}"`);
    ok = false;
  }

  if (fm.since && !/^[0-9]+\.[0-9]+\.[0-9]+$/.test(fm.since)) {
    errors.push(`${file}: invalid since "${fm.since}"`);
    ok = false;
  }

  if (fm.related) {
    const related = String(fm.related).split(",").map((s) => s.trim()).filter(Boolean);
    for (const r of related) {
      if (!/^SR[0-9]{4}$/.test(r)) {
        errors.push(`${file}: invalid related code "${r}"`);
        ok = false;
      }
    }
  }

  const requiredSections = [
    "Why this error occurred",
    "Reproducing the error",
    "Error output",
    "How to fix it",
    "Diagnosis",
    "Common pitfalls",
    "See also",
  ];
  for (const section of requiredSections) {
    if (!content.includes(`## ${section}`)) {
      errors.push(`${file}: missing required body section "## ${section}"`);
      ok = false;
    }
  }
}

if (existsSync(RUST_FILE)) {
  const rust = readFileSync(RUST_FILE, "utf8");
  const variants = Array.from(rust.matchAll(/Self::(\w+)\s*\{\s*\.\.\s*\}/g)).map((m) => m[1]);
  console.log(`rust enum: ${variants.length} variants`);
}

if (existsSync(MAPPING_FILE)) {
  const mapping = JSON.parse(readFileSync(MAPPING_FILE, "utf8"));
  const mappedCodes = mapping.entries
    .filter((e) => e.include)
    .map((e) => e.code)
    .filter(Boolean);
  const missing = mappedCodes.filter((c) => !frontmatterByCode.has(c));
  if (missing.length) {
    errors.push(`mapping references ${missing.length} codes without docs: ${missing.slice(0, 5).join(", ")}...`);
    ok = false;
  }
}

if (existsSync(SCHEMA_FILE)) {
  const schema = JSON.parse(readFileSync(SCHEMA_FILE, "utf8"));
  const schemaCategories = new Set(schema.properties.category.enum);
  for (const cat of ALLOWED_CATEGORIES) {
    if (!schemaCategories.has(cat)) {
      errors.push(`schema.json: missing category enum value "${cat}"`);
      ok = false;
    }
  }
}

console.log(`docs: ${docs.length} files, ${seenCodes.size} unique codes`);

if (!ok) {
  console.error("\nerrors found:");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log("error docs are in sync");
