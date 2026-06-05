import type { Metadata } from "swift-rust";
import Image from "swift-rust/image";
import { BLUR } from "@/lib/blur";

export const metadata: Metadata = { title: "Images" };

const IMAGES = [
  { src: "/samples/axelborg-towers-modern-architecture.jpg", alt: "Modern architecture towers", w: 3456, h: 2635, label: "4:3" },
  { src: "/samples/full-shot-woman-taking-selfie.jpg", alt: "Woman taking a selfie", w: 5327, h: 7990, label: "2:3" },
  { src: "/samples/metaverse-concept-collage-design.jpg", alt: "Metaverse concept collage", w: 6000, h: 4000, label: "3:2" },
  { src: "/samples/happy-black-parents-with-kids-making-video-call-smart-phone-home.jpg", alt: "Family on a video call at home", w: 6000, h: 4000, label: "3:2" },
  { src: "/samples/brown-high-skyscrapers.jpg", alt: "Tall brown skyscrapers", w: 4000, h: 5000, label: "4:5" },
  { src: "/samples/close-up-portrait-gorgeous-young-woman.jpg", alt: "Close-up portrait of a young woman", w: 8494, h: 5663, label: "3:2" },
];

export default function ImagesPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <p className="text-[0.75rem] font-semibold uppercase tracking-wider text-fg-subtle">
        Showcase
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Images</h1>
      <p className="mt-4 max-w-2xl text-fg-muted">
        The Image component handles sizing, format negotiation, and lazy loading. These are local
        sample photos — replace with your own.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {IMAGES.map((img) => (
          <figure
            key={img.src}
            className="group overflow-hidden rounded-2xl border border-border bg-surface"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
              <Image
                src={img.src}
                alt={img.alt}
                width={img.w}
                height={img.h}
                placeholder="blur"
                blurDataURL={BLUR}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <figcaption className="flex items-center justify-between border-t border-border px-4 py-3 text-[0.8125rem]">
              <span className="font-mono text-fg-muted">
                {img.src.split("/").pop()}
              </span>
              <span className="badge">{img.label}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
