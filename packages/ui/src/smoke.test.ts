import { expect, test } from "bun:test";
import * as mod from "./index";

test("package exports core API", () => {
  expect(mod).toBeDefined();
  expect(typeof mod.init).toBe("function");
  expect(typeof mod.add).toBe("function");
  expect(typeof mod.list).toBe("function");
});

test("COMPONENTS map lists all 35 components", () => {
  const components = mod.COMPONENTS as Record<string, { files: string[] }>;
  expect(Object.keys(components).length).toBe(35);
  const button = components.button;
  expect(button).toBeDefined();
  expect(button?.files).toContain("button.tsx");
  expect(components["dropdown-menu"]).toBeDefined();
  expect(components["navigation-menu"]).toBeDefined();
});
