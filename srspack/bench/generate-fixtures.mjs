#!/usr/bin/env bun
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const FIXTURES = join(ROOT, "bench", "fixtures");

const FIXTURE_SIZES = {
  small: { pages: 48, layouts: 1, cssModules: 1, publicImages: 5, publicText: 3 },
  medium: { pages: 440, layouts: 10, cssModules: 50, publicImages: 25, publicText: 10 },
  large: { pages: 4400, layouts: 100, cssModules: 500, publicImages: 100, publicText: 30 },
};

const APP_DIR = "app";
const PUBLIC_DIR = "public";

function pad(n, width) {
  return n.toString().padStart(width, "0");
}

function tsxForPage(index, cssModuleName) {
  return `import styles from "./${cssModuleName}.module.css";

export default function Page${pad(index, 4)}() {
  return (
    <main className={styles.root}>
      <h1>Page ${pad(index, 4)}</h1>
      <p>This is page number ${index} of the benchmark fixture.</p>
      <p>The text below is filler to give the bundler something to do.</p>
      <ul>
        ${Array.from({ length: 8 }, (_, i) => `<li>Item ${i + 1} on page ${index}</li>`).join("\n        ")}
      </ul>
    </main>
  );
}
`;
}

function tsxForLayout(index) {
  return `import "./layout-${pad(index, 4)}.css";

export default function Layout${pad(index, 4)}({ children }) {
  return (
    <div className="layout-${pad(index, 4)}">
      <header>Layout ${pad(index, 4)}</header>
      <main>{children}</main>
      <footer>End of layout ${pad(index, 4)}</footer>
    </div>
  );
}
`;
}

function cssModule(index) {
  return `.root {
  max-width: 720px;
  margin: 0 auto;
  padding: 4rem 1rem;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

.root h1 {
  font-size: 2.25rem;
  margin-bottom: 1rem;
  color: rgb(${index * 7 % 256}, ${index * 13 % 256}, ${index * 19 % 256});
}

.root p {
  line-height: 1.6;
  margin-bottom: 1rem;
}

.root ul {
  padding-left: 1.5rem;
}

.root li {
  margin-bottom: 0.25rem;
}
`;
}

function cssLayout(index) {
  return `.layout-${pad(index, 4)} {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: rgba(${index * 11 % 256}, ${index * 17 % 256}, ${index * 23 % 256}, 0.05);
}

.layout-${pad(index, 4)} header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

.layout-${pad(index, 4)} main {
  flex: 1;
}

.layout-${pad(index, 4)} footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  color: rgb(115, 115, 115);
  font-size: 0.875rem;
}
`;
}

function packageJson(name) {
  return JSON.stringify(
    {
      name,
      version: "0.1.0",
      private: true,
      type: "module",
      scripts: { build: "srspack build" },
    },
    null,
    2,
  ) + "\n";
}

function srspackConfig() {
  return `import { defineSrspackConfig } from "@swift-rust/srspack/plugin";

export default defineSrspackConfig({
  mode: "production",
  outDir: "dist",
  sourcemap: true,
  minify: true,
  target: { bun: ">=1.3.0" },
  externals: [],
  loaders: [
    { test: /\\.tsx?$/, use: "tsx" },
    { test: /\\.module\\.css$/, use: "css" },
    { test: /\\.css$/, use: "css" },
  ],
  plugins: [],
});
`;
}

function gitkeep() {
  return "";
}

function smallPng(w, h, seed) {
  const bytes = [];
  bytes.push(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  bytes.push(...chunk("IHDR", ihdr));
  const raw = Buffer.alloc((w * 3 + 1) * h);
  let p = 0;
  for (let y = 0; y < h; y++) {
    raw[p++] = 0;
    for (let x = 0; x < w; x++) {
      raw[p++] = (x * 7 + seed) & 0xff;
      raw[p++] = (y * 11 + seed * 3) & 0xff;
      raw[p++] = ((x + y) * 5 + seed) & 0xff;
    }
  }
  const zlib = require("node:zlib");
  const compressed = zlib.deflateSync(raw);
  bytes.push(...chunk("IDAT", compressed));
  bytes.push(...chunk("IEND", Buffer.alloc(0)));
  return Buffer.from(bytes);
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  const crcInput = Buffer.concat([t, data]);
  crc.writeUInt32BE(crc32(crcInput) >>> 0, 0);
  return [...len, ...t, ...data, ...crc];
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

async function generateFixture(name, opts) {
  const root = join(FIXTURES, name);
  const appDir = join(root, APP_DIR);
  const publicDir = join(root, PUBLIC_DIR);

  console.log(`\n>> generating ${name} (${opts.pages} pages, ${opts.layouts} layouts, ${opts.cssModules} css modules, ${opts.publicImages} images, ${opts.publicText} text)`);
  console.log(`   root: ${root}`);

  const t0 = performance.now();

  await mkdir(appDir, { recursive: true });
  await mkdir(publicDir, { recursive: true });
  await mkdir(join(publicDir, "images"), { recursive: true });

  await writeFile(join(root, "package.json"), packageJson(`${name}-fixture`));
  await writeFile(join(root, "srspack.config.ts"), srspackConfig());

  for (let i = 1; i <= opts.layouts; i++) {
    await writeFile(join(appDir, `layout-${pad(i, 4)}.tsx`), tsxForLayout(i));
    await writeFile(join(appDir, `layout-${pad(i, 4)}.css`), cssLayout(i));
  }

  for (let i = 1; i <= opts.cssModules; i++) {
    await writeFile(join(appDir, `styles-${pad(i, 4)}.module.css`), cssModule(i));
  }

  for (let i = 1; i <= opts.pages; i++) {
    const cssModuleIndex = ((i - 1) % opts.cssModules) + 1;
    const cssModuleName = `styles-${pad(cssModuleIndex, 4)}`;
    await writeFile(join(appDir, `page-${pad(i, 4)}.tsx`), tsxForPage(i, cssModuleName));
  }

  for (let i = 1; i <= opts.publicImages; i++) {
    const w = 64 + (i % 4) * 32;
    const h = 64 + ((i + 1) % 4) * 32;
    const png = smallPng(w, h, i);
    await writeFile(join(publicDir, "images", `photo-${pad(i, 4)}.png`), png);
  }

  for (let i = 1; i <= opts.publicText; i++) {
    const body = "/* css */\n" + ".x".repeat(500).split("").map((c, j) => `${c}{color:#${((i * j * 17) & 0xffffff).toString(16).padStart(6, "0")};}\n`).join("");
    await writeFile(join(publicDir, `style-${pad(i, 4)}.css`), body);
  }

  const elapsed = performance.now() - t0;
  const total = opts.pages + opts.layouts * 2 + opts.cssModules + opts.publicImages + opts.publicText;
  console.log(`   wrote ${total} files in ${elapsed.toFixed(0)} ms`);
}

const only = process.argv[2];

if (only && !(only in FIXTURE_SIZES)) {
  console.error(`unknown fixture: ${only}. choose one of: ${Object.keys(FIXTURE_SIZES).join(", ")}`);
  process.exit(1);
}

for (const [name, opts] of Object.entries(FIXTURE_SIZES)) {
  if (only && only !== name) continue;
  await generateFixture(name, opts);
}

console.log("\nfixtures generated.");
