import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const broken = [
  "docs/app/docs/api-reference/components/image/page.tsx",
  "docs/app/docs/api-reference/components/pdf/page.tsx",
  "docs/app/docs/api-reference/components/video/page.tsx",
];

function escapeJsx(s) {
  return s
    .replace(/<(\/?[a-zA-Z][\w-]*)/g, '{`<$1`}')
    .replace(/>/g, "{`>`}")
    .replace(/&lt;/g, "{`<`}")
    .replace(/&gt;/g, "{`>`}");
}

for (const file of broken) {
  const text = readFileSync(file, "utf8");
  const fm = text.match(/^---\ntitle: (.+?)\n---\n([\s\S]*)$/);
  if (!fm) {
    console.log("skip", file);
    continue;
  }
  const title = fm[1];
  const body = fm[2].trim();

  const lines = body.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const h3 = line.match(/^### (.+)$/);
    if (h3) {
      out.push(`      <h3>${escapeJsx(h3[1])}</h3>`);
      continue;
    }
    const h2 = line.match(/^## (.+)$/);
    if (h2) {
      out.push(`      <h2>${escapeJsx(h2[1])}</h2>`);
      continue;
    }
    const h1 = line.match(/^# (.+)$/);
    if (h1) {
      out.push(`      <h1>${escapeJsx(h1[1])}</h1>`);
      continue;
    }
    if (/^```/.test(line)) {
      const lang = line.replace(/^```/, "").trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      const joined = codeLines.join("\n").replace(/`/g, "\\`").replace(/\$/g, "\\$");
      out.push(`      <pre><code${lang ? ` className="language-${lang}"` : ""}>{\`${joined}\`}</code></pre>`);
      continue;
    }
    if (line.trim() === "") {
      continue;
    }
    out.push(`      <p>${escapeJsx(line)}</p>`);
  }

  const pageName = basename(file.replace("/page.tsx", "")).replace(/[^a-zA-Z0-9]/g, "");
  const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1) + "RefPage";
  const header = `export const metadata = { title: ${JSON.stringify(title)} };

export default function ${componentName}() {
  return (
    <article className="prose">
`;
  const footer = `    </article>
  );
}
`;
  const jsx = out.join("\n") + "\n";
  writeFileSync(file, header + jsx + footer);
  console.log("converted", file);
}
