"use client";
import { type ChangeEvent, useState } from "react";
import type { Metadata } from "swift-rust";
import { Video } from "swift-rust";

export const metadata: Metadata = { title: "Videos" };

const YOUTUBE_URL = "https://youtu.be/rTJzsHwpZko?si=dyq6s5btq7MnASdS";
const YOUTUBE_ID = "rTJzsHwpZko";

const DETECTION_URLS = [
  YOUTUBE_URL,
  "https://www.youtube.com/watch?v=rTJzsHwpZko",
  "https://www.youtube.com/embed/rTJzsHwpZko",
  "https://www.youtube.com/shorts/rTJzsHwpZko",
  "https://example.com/clip.mp4",
  "https://vimeo.com/76979871",
  "not-a-url",
];

const SAMPLE_CODE = `import { Video, isYouTubeUrl, getYouTubeId } from "swift-rust";

const url = "https://youtu.be/rTJzsHwpZko?si=dyq6s5btq7MnASdS";

<Video
  src={url}
  width={960}
  height={540}
  className="w-full overflow-hidden rounded-xl"
/>

isYouTubeUrl(url);   // → true
getYouTubeId(url);   // → "rTJzsHwpZko"`;

export default function VideosPage() {
  const [input, setInput] = useState(YOUTUBE_URL);
  const [detected, setDetected] = useState(true);

  return (
    <div className="container-page py-16 sm:py-20">
      <p className="text-[0.75rem] font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
        Showcase
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Video</h1>
      <p className="mt-4 max-w-2xl text-[var(--color-fg-muted)]">
        Drop a YouTube URL, get an embed. Auto-detected, privacy-preserving, zero JavaScript
        required from your bundle.
      </p>

      <div className="mt-12 grid items-start gap-12 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <Video
            src={YOUTUBE_URL}
            width={960}
            height={540}
            className="w-full overflow-hidden rounded-xl"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight">YouTube embed, auto-detected</h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--color-fg-muted)]">
            The component inspects the URL, extracts the video ID, and switches to a
            privacy-preserving <code>youtube-nocookie</code> embed automatically. No provider config
            needed — paste, render, ship.
          </p>

          <div className="mt-6 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2 font-mono text-[0.7rem] text-[var(--color-fg-subtle)]">
              example.tsx
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-[0.75rem] leading-relaxed text-[var(--color-fg)]">
              <code>{SAMPLE_CODE}</code>
            </pre>
          </div>
        </div>
      </div>

      <section className="mt-24">
        <h2 className="text-2xl font-semibold tracking-tight">Auto-detection in action</h2>
        <p className="mt-2 max-w-2xl text-[var(--color-fg-muted)]">
          The same <code>isYouTubeUrl</code> helper that powers the <code>Video</code> component is
          exported from <code>swift-rust</code>. Try a few URLs against the live detector:
        </p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <label className="block text-[0.7rem] font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
            URL
          </label>
          <input
            type="text"
            value={input}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setInput(e.target.value);
              try {
                new URL(e.target.value);
                setDetected(/youtu\.?be/.test(new URL(e.target.value).hostname));
              } catch {
                setDetected(false);
              }
            }}
            className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-mono text-[0.85rem] text-[var(--color-fg)] focus:border-[var(--color-accent)] focus:outline-none"
            spellCheck={false}
          />
          <div className="mt-3 flex items-center gap-2 text-[0.85rem]">
            <span
              className={
                detected
                  ? "rounded-full bg-[var(--color-accent)] px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider text-white"
                  : "rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider text-[var(--color-fg-muted)]"
              }
            >
              {detected ? "YouTube" : "Not YouTube"}
            </span>
            <code className="font-mono text-[0.7rem] text-[var(--color-fg-subtle)]">
              isYouTubeUrl("{input}") → {String(detected)}
            </code>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {DETECTION_URLS.map((url) => {
            let yt = false;
            try {
              const u = new URL(url);
              yt = u.hostname === "youtu.be" || u.hostname.endsWith("youtube.com");
            } catch {
              yt = false;
            }
            return (
              <div
                key={url}
                className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
              >
                <code className="flex-1 truncate font-mono text-[0.8rem] text-[var(--color-fg)]">
                  {url}
                </code>
                {yt ? (
                  <span className="shrink-0 rounded-full bg-[var(--color-accent)] px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider text-white">
                    YouTube
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider text-[var(--color-fg-muted)]">
                    —
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-24">
        <h2 className="text-2xl font-semibold tracking-tight">Helper functions</h2>
        <p className="mt-2 max-w-2xl text-[var(--color-fg-muted)]">
          Need to know what kind of URL you have, or build an embed URL yourself? These utilities
          are exported from <code>swift-rust</code>.
        </p>
        <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2 font-mono text-[0.7rem] text-[var(--color-fg-subtle)]">
            helpers.ts
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-[0.78rem] leading-relaxed text-[var(--color-fg)]">
            <code>{`import {
  isYouTubeUrl,
  getYouTubeId,
  detectProvider,
  getYouTubeEmbedUrl,
} from "swift-rust";

const url = "https://youtu.be/${YOUTUBE_ID}?si=dyq6s5btq7MnASdS";

isYouTubeUrl(url);                       // → true
getYouTubeId(url);                       // → "${YOUTUBE_ID}"
detectProvider(url);                     // → "youtube"
getYouTubeEmbedUrl("${YOUTUBE_ID}", { autoPlay: true, mute: true });
// → "https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&mute=1"`}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}
