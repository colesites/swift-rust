import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const broken = [
  "docs/app/docs/api-reference/components/image/page.tsx",
  "docs/app/docs/api-reference/components/pdf/page.tsx",
  "docs/app/docs/api-reference/components/video/page.tsx",
];

for (const file of broken) {
  const text = readFileSync(file, "utf8");
  const titleMatch = text.match(/title: "([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : "Untitled";

  const body = text
    .replace(/^export const metadata = \{ title: "[^"]+" \};\n+/m, "")
    .replace(/^export default function \w+\(\) \{\n/m, "")
    .replace(/\n\s*\}\n*$/m, "")
    .replace(/<article className="prose">\n/, "")
    .replace(/<\/article>/, "")
    .replace(/<h1>([\s\S]*?)<\/h1>/g, "# $1")
    .replace(/<h2>([\s\S]*?)<\/h2>/g, "## $1")
    .replace(/<h3>([\s\S]*?)<\/h3>/g, "### $1")
    .replace(/<p>([\s\S]*?)<\/p>/g, "$1")
    .replace(/<pre><code(?:\s+className="language-(\w+)")?>([\s\S]*?)<\/code><\/pre>/g, (_, lang, code) => {
      const decoded = code
        .replace(/&#x60;/g, "`")
        .replace(/&#x24;/g, "$")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");
      return "```" + (lang || "") + "\n" + decoded + "\n```";
    })
    .replace(/<\/?article[^>]*>/g, "")
    .replace(/<\/?code[^>]*>/g, "")
    .replace(/<code>/g, "`")
    .replace(/<\/code>/g, "`")
    .replace(/^\s+/gm, "")
    .replace(/^\s*\n/gm, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const md = `---\ntitle: ${title}\n---\n\n${body}\n`;
  writeFileSync(file, md);
  console.log("reverted", file);
}
