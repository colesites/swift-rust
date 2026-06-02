import { createElement } from "react";
import type { CSSProperties, ImgHTMLAttributes } from "react";

export type ImageFormat = "image/webp" | "image/avif" | "image/jpeg" | "image/png";

export type ImagePlaceholder = "blur";

export class ImageMissingBlurError extends Error {
  readonly code = "SR0151";
  readonly name = "ImageMissingBlurError";

  constructor(reason: "placeholder" | "blurDataURL" | "dataURL", extra?: string) {
    const message =
      reason === "placeholder"
        ? "The <Image> component requires `placeholder=\"blur\"`. Pass `placeholder=\"blur\"` and a base64 `blurDataURL` for every <Image>."
        : reason === "blurDataURL"
          ? "The <Image> component requires a `blurDataURL`. Provide a base64-encoded data URL (for example a 20x30 JPEG of the source image at low quality)."
          : "`blurDataURL` must be a base64 data URL (starting with `data:image/...`). Got a plain URL or empty string.";
    super(extra ? `${message}\n\n${extra}` : message);
  }
}

export interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: string;
  width: number;
  height: number;
  alt: string;
  placeholder: ImagePlaceholder;
  blurDataURL: string;
  quality?: number;
  priority?: boolean;
  sizes?: string;
  loader?: (props: { src: string; width: number; quality?: number }) => string;
}

const DEFAULT_LOADER = ({
  src,
  width,
  quality,
}: { src: string; width: number; quality?: number }): string => {
  const params = new URLSearchParams();
  params.set("url", src);
  params.set("w", width.toString());
  if (quality) params.set("q", quality.toString());
  return `/_swift-rust/image?${params.toString()}`;
};

function validate(props: ImageProps): void {
  if (props.placeholder !== "blur") {
    throw new ImageMissingBlurError("placeholder", `received: ${JSON.stringify(props.placeholder)}`);
  }
  if (typeof props.blurDataURL !== "string" || props.blurDataURL.length === 0) {
    throw new ImageMissingBlurError("blurDataURL");
  }
  if (!props.blurDataURL.startsWith("data:image/")) {
    throw new ImageMissingBlurError("dataURL", `received prefix: ${props.blurDataURL.slice(0, 32)}`);
  }
}

export function Image(props: ImageProps) {
  validate(props);

  const {
    src,
    width,
    height,
    alt,
    blurDataURL,
    quality = 75,
    priority = false,
    sizes,
    loader = DEFAULT_LOADER,
    className,
    style,
    placeholder: _placeholder,
    ...rest
  } = props;

  const srcSet = [1, 2, 3]
    .map((d) => `${loader({ src, width: width * d, quality })} ${width * d}w`)
    .join(", ");

  return createElement("img", {
    ...rest,
    src: loader({ src, width, quality }),
    srcSet,
    sizes,
    width,
    height,
    alt,
    loading: priority ? "eager" : "lazy",
    fetchPriority: priority ? "high" : "auto",
    decoding: "async",
    placeholder: "blur",
    style: {
      ...style,
      backgroundImage: `url("${blurDataURL}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    } as CSSProperties,
    className: className as string | undefined,
  });
}

export default Image;
