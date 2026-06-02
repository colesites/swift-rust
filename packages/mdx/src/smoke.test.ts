import { expect, test } from "bun:test";
import * as mod from "./index";

test("package exports a default or named module", () => {
  expect(mod).toBeDefined();
});
