import type { Metadata } from "swift-rust";
import Image from "swift-rust/image";

export const metadata: Metadata = { title: "Images" };

const TRANSPARENT_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

const IMAGES = [
  { src: "/samples/landscape-1.svg", alt: "Mountain landscape at dawn", w: 1600, h: 900, label: "16:9" },
  { src: "/samples/portrait-1.svg", alt: "Forest portrait", w: 800, h: 1200, label: "2:3" },
  { src: "/samples/square-1.svg", alt: "Geometric square composition", w: 1000, h: 1000, label: "1:1" },
  { src: "/samples/landscape-2.svg", alt: "Ocean horizon", w: 1600, h: 900, label: "16:9" },
  { src: "/samples/square-2.svg", alt: "Abstract gradient", w: 1000, h: 1000, label: "1:1" },
  { src: "/samples/portrait-2.svg", alt: "City portrait", w: 800, h: 1200, label: "2:3" },
];

export default function ImagesPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <p className="text-[0.75rem] font-semibold uppercase tracking-wider text-[var(--color-fg-subtle)]">
        Showcase
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Images</h1>
      <p className="mt-4 max-w-2xl text-[var(--color-fg-muted)]">
        The Image component handles sizing, format negotiation, and lazy loading. SVGs are local
        samples — replace with your own.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {IMAGES.map((img) => (
          <figure
            key={img.src}
            className="group overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface-2)]">
              <Image
                src={img.src}
                alt={img.alt}
                width={img.w}
                height={img.h}
                placeholder="blur"
                blurDataURL={TRANSPARENT_PNG}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <figcaption className="flex items-center justify-between border-t border-[var(--color-border)] px-4 py-3 text-[0.8125rem]">
              <span className="font-mono text-[var(--color-fg-muted)]">{img.src.split("/").pop()}</span>
              <span className="badge">{img.label}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
