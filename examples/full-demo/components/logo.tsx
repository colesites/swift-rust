import Image from "swift-rust/image";
import { BLUR_WHITE } from "@/lib/blur";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {/* Single-sourced from the favicon file (lightning + gear mark). The
          favicon lives in the app dir, so use a passthrough loader instead of
          the image-optimizer endpoint. */}
      <Image
        src="/favicon.svg"
        alt=""
        aria-hidden
        width={24}
        height={24}
        placeholder="blur"
        blurDataURL={BLUR_WHITE}
        loader={({ src }) => src}
        className="h-6 w-6"
      />
      <span className="text-[0.95rem] font-semibold tracking-tight text-[var(--color-fg)]">
        swift<span className="text-[var(--color-accent)]">·</span>rust
      </span>
    </span>
  );
}
