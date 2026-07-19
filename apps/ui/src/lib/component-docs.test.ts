import { describe, expect, test } from "bun:test";
import { COMPONENT_DOCS } from "./component-docs";
import { COMPONENTS } from "./components";

describe("component docs", () => {
  test("every catalog component has authored documentation", () => {
    for (const component of COMPONENTS) {
      expect(COMPONENT_DOCS[component.slug]?.description).toBeTruthy();
    }
  });

  test("every installable component has a usage example", () => {
    for (const component of COMPONENTS.filter((entry) => entry.status !== "soon")) {
      expect(COMPONENT_DOCS[component.slug]?.usage).toContain("@/components/ui/");
    }
  });
});
