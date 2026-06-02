import { expect, test } from "bun:test";
import * as mod from "./index";
import { PdfError } from "./viewer";

test("package exports a default or named module", () => {
  expect(mod).toBeDefined();
  expect(mod.Pdf).toBeDefined();
  expect(mod.Document).toBeDefined();
  expect(mod.Page).toBeDefined();
});

test("PdfError has stable SR codes", () => {
  const loadErr = new PdfError("load", "boom");
  expect(loadErr.code).toBe("SR0152");
  expect(loadErr.kind).toBe("load");

  const renderErr = new PdfError("render", "boom");
  expect(renderErr.code).toBe("SR0153");
  expect(renderErr.kind).toBe("render");

  const networkErr = new PdfError("network", "boom");
  expect(networkErr.code).toBe("SR0152");
  expect(networkErr.kind).toBe("network");

  const invalidErr = new PdfError("invalid", "boom");
  expect(invalidErr.code).toBe("SR0152");
  expect(invalidErr.kind).toBe("invalid");
});

test("PdfError preserves cause and url", () => {
  const cause = new Error("inner");
  const e = new PdfError("load", "outer", { cause, url: "https://example.com/x.pdf" });
  expect(e.cause).toBe(cause);
  expect(e.url).toBe("https://example.com/x.pdf");
});
