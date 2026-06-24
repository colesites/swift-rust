import { afterAll, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { add } from "./cli";

const tmps: string[] = [];
afterAll(() => {
  for (const d of tmps) rmSync(d, { recursive: true, force: true });
});

function project(withSrc: boolean): string {
  const dir = mkdtempSync(join(tmpdir(), "srui-cli-"));
  tmps.push(dir);
  if (withSrc) mkdirSync(join(dir, "src", "app"), { recursive: true });
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({ name: "t", dependencies: { "@swift-rust/ui": "latest" } }),
  );
  writeFileSync(
    join(dir, "tsconfig.json"),
    JSON.stringify({ compilerOptions: { baseUrl: ".", paths: { "@/*": ["./src/*"] } } }),
  );
  return dir;
}

// Regression guard: detectSrcDir used the file-only pathExists() (readFile),
// which throws on a directory, so it always reported "no src" and wrote to
// top-level lib/ + components/. A src/ project must land under src/.
test("add targets src/ when the project uses a src directory", async () => {
  const dir = project(true);
  await add({ cwd: dir, names: ["button"], yes: true, overwrite: true });
  expect(existsSync(join(dir, "src", "components", "ui", "button.tsx"))).toBe(true);
  expect(existsSync(join(dir, "src", "lib", "utils.ts"))).toBe(true);
  expect(existsSync(join(dir, "components", "ui", "button.tsx"))).toBe(false);
});

test("add targets top-level dirs when there is no src directory", async () => {
  const dir = project(false);
  await add({ cwd: dir, names: ["card"], yes: true, overwrite: true });
  expect(existsSync(join(dir, "components", "ui", "card.tsx"))).toBe(true);
  expect(existsSync(join(dir, "lib", "utils.ts"))).toBe(true);
});
