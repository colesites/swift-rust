import { describe, expect, test } from "bun:test";
import { searchUiDocs } from "./search";

describe("UI documentation search", () => {
  test("ranks exact component titles first", () => {
    const results = searchUiDocs("button");
    expect(results[0]?.title).toBe("Button");
    expect(results[0]?.href).toBe("/docs/components/button");
  });

  test("finds guides by their content", () => {
    expect(searchUiDocs("tokens")[0]?.href).toBe("/docs/theming");
    expect(searchUiDocs("dependencies")[0]?.href).toBe("/docs/installation");
  });
});
