import { expect, test } from "bun:test";
import { Image, ImageMissingBlurError } from "./index";

const VALID_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/wA//Z";

const baseProps = {
  src: "/photo.jpg",
  width: 1200,
  height: 800,
  alt: "Test image",
  placeholder: "blur" as const,
  blurDataURL: VALID_BLUR,
};

test("image throws when placeholder is missing", () => {
  expect(() => Image({ ...baseProps, placeholder: undefined as unknown as "blur" })).toThrow(
    ImageMissingBlurError,
  );
});

test("image throws when blurDataURL is missing", () => {
  expect(() => Image({ ...baseProps, blurDataURL: undefined as unknown as string })).toThrow(
    ImageMissingBlurError,
  );
});

test("image throws when blurDataURL is not a data URL", () => {
  expect(() => Image({ ...baseProps, blurDataURL: "https://example.com/blur.jpg" })).toThrow(
    ImageMissingBlurError,
  );
});

test("image throws when blurDataURL is empty", () => {
  expect(() => Image({ ...baseProps, blurDataURL: "" })).toThrow(ImageMissingBlurError);
});

test("image renders a blur placeholder when given valid props", () => {
  const element = Image({ ...baseProps, placeholder: "blur" });
  const props = element.props as Record<string, unknown>;
  expect(props.alt).toBe("Test image");
  expect(props.width).toBe(1200);
  expect(props.height).toBe(800);
  expect(props.placeholder).toBe("blur");
  expect((props.style as Record<string, string>).backgroundImage).toContain(
    "data:image/jpeg;base64",
  );
});

test("ImageMissingBlurError code is SR0151", () => {
  const err = new ImageMissingBlurError("placeholder");
  expect(err.code).toBe("SR0151");
  expect(err.name).toBe("ImageMissingBlurError");
});
