import { afterEach, describe, expect, test } from "bun:test";
import {
  DxSlightExtBdUltraSlant,
  DxSlightMediumUltra,
  localFont,
  localFontCss,
  VarentGroteskBold,
} from "./local";

const globals = globalThis as unknown as {
  __SR_LOCAL_FONT_CSS__?: Set<string>;
};

afterEach(() => {
  delete globals.__SR_LOCAL_FONT_CSS__;
});

describe("local font helpers", () => {
  test("returns applicable class names for local font variables", () => {
    const font = localFont({
      src: "/fonts/example.woff2",
      family: "Example Sans",
      variable: true,
    });

    expect(font.className).toBe("__swift_rust_font_example_sans");
    expect(font.variable).toBe("__swift_rust_font_example_sans_variable");
    expect(Array.from(globals.__SR_LOCAL_FONT_CSS__ ?? []).join("\n")).toContain(
      'src: url("/fonts/example.woff2") format("woff2")',
    );
  });

  test("maps named variants onto their registered base families", () => {
    expect(DxSlightMediumUltra().style).toMatchObject({
      fontFamily: "'DxSlight', system-ui, sans-serif",
      fontWeight: "500",
      fontStyle: "normal",
    });
    expect(DxSlightExtBdUltraSlant().style).toMatchObject({
      fontFamily: "'DxSlight', system-ui, sans-serif",
      fontWeight: "800",
      fontStyle: "italic",
    });
    expect(VarentGroteskBold().style.fontFamily).toBe("'Varent Grotesk', system-ui, sans-serif");
  });

  test("emits separate Zimula ink-trap and ink-spot families", () => {
    const css = localFontCss();
    expect(css).toContain('font-family: "ZimulaInkTrap"');
    expect(css).toContain('font-family: "ZimulaInkSpot"');
  });
});
