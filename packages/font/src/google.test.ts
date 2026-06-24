import { afterEach, describe, expect, test } from "bun:test";
import { _42dotSans, Geist, googleFontsUrl } from "./google";

type FakeElement = {
  tagName: string;
  href?: string;
  rel?: string;
  textContent?: string;
  attrs: Record<string, string>;
  setAttribute(name: string, value: string): void;
};

type FakeDocument = {
  head: { appendChild(node: FakeElement): void };
  createElement(tagName: string): FakeElement;
  querySelector(selector: string): FakeElement | null;
  nodes: FakeElement[];
};

const globals = globalThis as unknown as {
  document?: FakeDocument;
  __SR_GOOGLE_FONTS__?: Set<string>;
};

afterEach(() => {
  delete globals.document;
  delete globals.__SR_GOOGLE_FONTS__;
});

function fakeDocument(): FakeDocument {
  const nodes: FakeElement[] = [];
  return {
    nodes,
    head: {
      appendChild(node) {
        nodes.push(node);
      },
    },
    createElement(tagName) {
      return {
        tagName,
        attrs: {},
        setAttribute(name, value) {
          this.attrs[name] = value;
        },
      };
    },
    querySelector(selector) {
      const match = selector.match(/\[data-swift-rust-google-font="([^"]+)"\]/);
      const key = match?.[1];
      const tagName = selector.split("[")[0];
      return (
        nodes.find(
          (node) => node.tagName === tagName && node.attrs["data-swift-rust-google-font"] === key,
        ) ?? null
      );
    },
  };
}

describe("google font helpers", () => {
  test("returns usable class names and CSS variable classes", () => {
    const geist = Geist({ variable: true });
    expect(geist.className).toBe("__swift_rust_font_geist");
    expect(geist.variable).toBe("__swift_rust_font_geist_variable");
    expect(geist.style.fontFamily).toContain("'Geist'");
  });

  test("sanitizes punctuation in generated class names", () => {
    const font = _42dotSans({ variable: true });
    expect(font.className).toBe("__swift_rust_font_42dot_sans");
    expect(font.variable).toBe("__swift_rust_font_42dot_sans_variable");
  });

  test("encodes Google Fonts CSS2 URLs", () => {
    expect(googleFontsUrl(["Geist Mono", "Bricolage Grotesque"])).toBe(
      "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300..900&family=Bricolage+Grotesque:wght@300..900&display=swap",
    );
  });

  test("injects browser stylesheets for client-only font usage", () => {
    const doc = fakeDocument();
    globals.document = doc;
    Geist({ variable: true });
    expect(doc.nodes.some((node) => node.href?.includes("family=Geist:wght@300..900"))).toBe(true);
    expect(
      doc.nodes.some((node) =>
        node.textContent?.includes(".__swift_rust_font_geist_variable{--font-geist:"),
      ),
    ).toBe(true);
  });
});
