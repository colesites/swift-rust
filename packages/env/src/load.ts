import { existsSync } from "node:fs";
import { join } from "node:path";
import { config as dotenvx } from "@dotenvx/dotenvx";

const ENV_FILES = [".env.development.local", ".env.local", ".env.development", ".env"];

export function loadEnvFiles(cwd: string = process.cwd()): void {
  for (const file of ENV_FILES) {
    const path = join(cwd, file);
    if (!existsSync(path)) continue;
    if (process.env.NODE_ENV === "production" && file.includes(".development")) continue;
    dotenvx({ path, quiet: true });
  }
}
