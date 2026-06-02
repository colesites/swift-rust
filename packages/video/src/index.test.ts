import { expect, test } from "bun:test";
import { VideoError, describeMediaError } from "./index";

test("VideoError has SR0154 code by default", () => {
  const err = new VideoError("media", "boom");
  expect(err.code).toBe("SR0154");
  expect(err.kind).toBe("media");
});

test("VideoError preserves url and media error code", () => {
  const err = new VideoError("network", "Network error while loading media", {
    mediaErrorCode: 2,
    url: "https://example.com/clip.mp4",
  });
  expect(err.code).toBe("SR0154");
  expect(err.mediaErrorCode).toBe(2);
  expect(err.url).toBe("https://example.com/clip.mp4");
});

test("VideoError supports SR0155 for invalid embed IDs", () => {
  const err = new VideoError("invalid-id", "bad", { code: "SR0155" });
  expect(err.code).toBe("SR0155");
  expect(err.kind).toBe("invalid-id");
});

test("describeMediaError maps MediaError codes", () => {
  expect(describeMediaError(1)).toBe("Playback aborted");
  expect(describeMediaError(2)).toBe("Network error while loading media");
  expect(describeMediaError(3)).toBe("Media decode error");
  expect(describeMediaError(4)).toBe("Source format not supported");
  expect(describeMediaError(99)).toBe("Unknown media error");
});
