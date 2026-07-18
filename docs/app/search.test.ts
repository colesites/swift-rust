import { describe, expect, test } from "bun:test";
import { searchFrameworkDocs } from "./search";

describe("framework documentation search", () => {
  test("finds routes by title and content", () => {
    expect(searchFrameworkDocs("authentication")[0]?.href).toBe("/docs/guides/auth");
    expect(searchFrameworkDocs("Open Graph")[0]?.href).toBe("/docs/guides/metadata");
  });

  test("includes component showcases", () => {
    expect(searchFrameworkDocs("typography gallery")[0]?.href).toBe("/fonts");
  });
});
