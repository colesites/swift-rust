import { expect, test } from "bun:test";
import { getVimeoId, getYouTubeId, isVimeoUrl, isYouTubeUrl } from "./index";

test("isYouTubeUrl detects youtu.be and youtube.com", () => {
  expect(isYouTubeUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(true);
  expect(isYouTubeUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(true);
  expect(isYouTubeUrl("https://example.com/foo.mp4")).toBe(false);
});

test("isVimeoUrl detects vimeo.com", () => {
  expect(isVimeoUrl("https://vimeo.com/123456789")).toBe(true);
  expect(isVimeoUrl("https://player.vimeo.com/video/123456789")).toBe(true);
  expect(isVimeoUrl("https://example.com/foo.mp4")).toBe(false);
});

test("getYouTubeId extracts id from various URL formats", () => {
  expect(getYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  expect(getYouTubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  expect(getYouTubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  expect(getYouTubeId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  expect(getYouTubeId("https://example.com/foo")).toBeNull();
});

test("getVimeoId extracts id from vimeo URLs", () => {
  expect(getVimeoId("https://vimeo.com/123456789")).toBe("123456789");
  expect(getVimeoId("https://player.vimeo.com/video/987654321")).toBe("987654321");
  expect(getVimeoId("https://example.com/foo")).toBeNull();
});
