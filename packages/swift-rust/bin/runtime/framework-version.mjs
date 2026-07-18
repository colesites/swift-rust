import { readFileSync } from "node:fs";
import { join } from "node:path";

export const FRAMEWORK_VERSION = (() => {
  try {
    const packageJson = JSON.parse(
      readFileSync(join(import.meta.dirname, "..", "..", "package.json"), "utf8"),
    );
    return packageJson.version || "unknown";
  } catch {
    return "unknown";
  }
})();
