import { createElement, useCallback, useEffect, useRef, useState } from "react";
import type {
  CSSProperties,
  ChangeEvent,
  FormEvent,
  MouseEvent,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
  SyntheticEvent,
  VideoHTMLAttributes,
} from "react";

export type VideoProvider = "html5" | "youtube" | "vimeo";
export type VideoErrorCode = "SR0154" | "SR0155" | "SR0156";

export class VideoError extends Error {
  override readonly name = "VideoError";
  readonly code: VideoErrorCode;
  readonly kind: "media" | "network" | "decode" | "src-not-supported" | "embed" | "invalid-id";
  readonly mediaErrorCode?: number;
  readonly url?: string;

  constructor(
    kind: VideoError["kind"],
    message: string,
    options: { mediaErrorCode?: number; url?: string; code?: VideoErrorCode } = {},
  ) {
    super(message);
    this.kind = kind;
    this.code = options.code ?? "SR0154";
    this.mediaErrorCode = options.mediaErrorCode;
    this.url = options.url;
  }
}

export interface VideoSource {
  src: string;
  type?: string;
}

export interface VideoCaption {
  src: string;
  lang: string;
  label?: string;
  default?: boolean;
}

export type VideoPreload = "auto" | "metadata" | "none";

export interface VideoProps
  extends Omit<
    VideoHTMLAttributes<HTMLVideoElement>,
    | "src"
    | "poster"
    | "width"
    | "height"
    | "controls"
    | "autoPlay"
    | "loop"
    | "muted"
    | "playsInline"
    | "preload"
    | "onError"
    | "onLoadStart"
    | "onCanPlay"
    | "onWaiting"
    | "onLoadedData"
    | "children"
  > {
  src: string | VideoSource[];
  poster?: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: string;
  provider?: VideoProvider;
  youtubeId?: string;
  vimeoId?: string;
  captions?: string | VideoCaption[];
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  preload?: VideoPreload;
  lightbox?: boolean;
  lightboxTitle?: string;
  className?: string;
  style?: CSSProperties;
  onError?: (err: VideoError) => void;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onWaiting?: () => void;
  onLoadedData?: () => void;
  errorFallback?: ReactNode | ((err: VideoError) => ReactNode);
  loadingFallback?: ReactNode;
  children?: ReactNode;
}

export interface BackgroundVideoProps {
  src: string | VideoSource[];
  poster?: string;
  overlay?: boolean | string;
  overlayOpacity?: number;
  contentClassName?: string;
  className?: string;
  youtubeId?: string;
  vimeoId?: string;
  startTime?: number;
  endTime?: number;
  onError?: (err: VideoError) => void;
  children?: ReactNode;
}

export interface VideoLightboxProps {
  trigger: ReactNode;
  src: string | VideoSource[];
  provider?: VideoProvider;
  youtubeId?: string;
  vimeoId?: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  captions?: string | VideoCaption[];
  className?: string;
  onError?: (err: VideoError) => void;
}

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtube-nocookie.com",
]);
const VIMEO_HOSTS = new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]);

export function isYouTubeUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname === "youtu.be" || YOUTUBE_HOSTS.has(u.hostname);
  } catch {
    return false;
  }
}

export function isVimeoUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return VIMEO_HOSTS.has(u.hostname);
  } catch {
    return false;
  }
}

export function getYouTubeId(input: string): string | null {
  if (!input) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(input)) return input;
  try {
    const u = new URL(input);
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (YOUTUBE_HOSTS.has(u.hostname)) {
      if (u.pathname.startsWith("/embed/")) {
        const id = u.pathname.replace("/embed/", "").split("/")[0];
        return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
      }
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.replace("/shorts/", "").split("/")[0];
        return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
      }
      const v = u.searchParams.get("v");
      if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
    }
    return null;
  } catch {
    return null;
  }
}

export function getVimeoId(input: string): string | null {
  if (!input) return null;
  if (/^\d{6,}$/.test(input)) return input;
  try {
    const u = new URL(input);
    if (VIMEO_HOSTS.has(u.hostname)) {
      const m = u.pathname.match(/\/(\d+)/);
      if (m?.[1]) return m[1];
    }
    return null;
  } catch {
    return null;
  }
}

export function detectProvider(src: string | VideoSource[]): VideoProvider {
  if (Array.isArray(src)) {
    const first = src[0]?.src ?? "";
    if (isYouTubeUrl(first)) return "youtube";
    if (isVimeoUrl(first)) return "vimeo";
    return "html5";
  }
  if (isYouTubeUrl(src)) return "youtube";
  if (isVimeoUrl(src)) return "vimeo";
  return "html5";
}

export function getYouTubeEmbedUrl(
  id: string,
  options: {
    autoPlay?: boolean;
    controls?: boolean;
    mute?: boolean;
    loop?: boolean;
    start?: number;
    end?: number;
    modestBranding?: boolean;
  } = {},
): string {
  const params = new URLSearchParams();
  params.set("rel", "0");
  if (options.autoPlay) params.set("autoplay", "1");
  if (options.mute) params.set("mute", "1");
  if (options.loop) {
    params.set("loop", "1");
    params.set("playlist", id);
  }
  if (options.controls === false) params.set("controls", "0");
  if (options.modestBranding ?? true) params.set("modestbranding", "1");
  if (options.start != null) params.set("start", options.start.toString());
  if (options.end != null) params.set("end", options.end.toString());
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export function getVimeoEmbedUrl(
  id: string,
  options: {
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    title?: boolean;
    byline?: boolean;
    portrait?: boolean;
  } = {},
): string {
  const params = new URLSearchParams();
  params.set("dnt", "1");
  if (options.autoPlay) params.set("autoplay", "1");
  if (options.muted ?? true) params.set("muted", "1");
  if (options.loop) params.set("loop", "1");
  if (options.title === false) params.set("title", "0");
  if (options.byline === false) params.set("byline", "0");
  if (options.portrait === false) params.set("portrait", "0");
  return `https://player.vimeo.com/video/${id}?${params.toString()}`;
}

function inferMimeType(src: string): string {
  const ext = src.split(".").pop()?.toLowerCase().split("?")[0] ?? "";
  if (ext === "mp4") return "video/mp4";
  if (ext === "webm") return "video/webm";
  if (ext === "ogg" || ext === "ogv") return "video/ogg";
  if (ext === "mov") return "video/quicktime";
  if (ext === "m4v") return "video/x-m4v";
  return "video/mp4";
}

function resolveSources(src: string | VideoSource[]): VideoSource[] {
  if (Array.isArray(src))
    return src.map((s) => ({ src: s.src, type: s.type ?? inferMimeType(s.src) }));
  return [{ src, type: inferMimeType(src) }];
}

function resolveCaptions(captions: string | VideoCaption[] | undefined): VideoCaption[] {
  if (!captions) return [];
  if (typeof captions === "string")
    return [{ src: captions, lang: "en", label: "English", default: true }];
  return captions;
}

function buildStyle({
  width,
  height,
  aspectRatio,
  style,
}: {
  width?: number | string;
  height?: number | string;
  aspectRatio?: string;
  style?: CSSProperties;
}): CSSProperties {
  const out: CSSProperties = { ...style };
  if (width !== undefined) out.width = width as CSSProperties["width"];
  if (height !== undefined) out.height = height as CSSProperties["height"];
  if (aspectRatio) out.aspectRatio = aspectRatio;
  return out;
}

function describeMediaError(code: number): string {
  switch (code) {
    case 1:
      return "Playback aborted";
    case 2:
      return "Network error while loading media";
    case 3:
      return "Media decode error";
    case 4:
      return "Source format not supported";
    default:
      return "Unknown media error";
  }
}

export { describeMediaError };

function renderEmbed(
  provider: "youtube" | "vimeo",
  id: string,
  title: string,
  style: CSSProperties,
  className: string | undefined,
  start: number | undefined,
  end: number | undefined,
  autoPlay: boolean,
) {
  const url =
    provider === "youtube"
      ? getYouTubeEmbedUrl(id, { autoPlay, controls: true, mute: autoPlay, start, end })
      : getVimeoEmbedUrl(id, { autoPlay, muted: true });
  return createElement("iframe", {
    src: url,
    title,
    allow:
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
    allowFullScreen: true,
    frameBorder: 0,
    className,
    style: { border: 0, ...style },
  });
}

function renderVideoError(
  err: VideoError,
  fallback: ReactNode | ((err: VideoError) => ReactNode) | undefined,
  className: string | undefined,
  style: CSSProperties | undefined,
): ReactNode {
  if (fallback) {
    return typeof fallback === "function" ? fallback(err) : fallback;
  }
  return createElement(
    "div",
    {
      role: "alert",
      className: ["__swift_rust_video __swift_rust_video_error", className]
        .filter(Boolean)
        .join(" "),
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "1.5rem",
        background: "rgba(220, 38, 38, 0.05)",
        border: "1px solid rgba(220, 38, 38, 0.3)",
        borderRadius: "0.5rem",
        color: "rgb(127, 29, 29)",
        ...style,
      },
    },
    createElement("strong", null, `Video error (${err.code})`),
    createElement("span", { style: { fontSize: "0.875rem" } }, err.message),
    err.url
      ? createElement(
          "a",
          {
            href: err.url,
            target: "_blank",
            rel: "noopener noreferrer",
            style: { fontSize: "0.875rem", textDecoration: "underline" },
          },
          "Open source directly",
        )
      : null,
  );
}

export function Video(props: VideoProps) {
  const {
    src,
    poster,
    width,
    height,
    aspectRatio,
    provider,
    youtubeId,
    vimeoId,
    captions,
    controls = true,
    autoPlay = false,
    loop = false,
    muted = false,
    playsInline = false,
    preload = "metadata",
    lightbox = false,
    lightboxTitle,
    className,
    style,
    onError,
    onLoadStart,
    onCanPlay,
    onWaiting,
    onLoadedData,
    errorFallback,
    loadingFallback,
    children,
    ...rest
  } = props;

  const resolvedProvider = provider ?? detectProvider(src);
  const styleObj = buildStyle({ width, height, aspectRatio, style });
  const videoClass = ["__swift_rust_video", className].filter(Boolean).join(" ");

  if (lightbox) {
    return createElement(VideoLightbox, {
      trigger: createElement(VideoSurface, {
        src,
        poster,
        width,
        height,
        aspectRatio,
        provider: resolvedProvider,
        youtubeId,
        vimeoId,
        controls,
        autoPlay,
        loop,
        muted,
        playsInline,
        preload,
        className: videoClass,
        style: styleObj,
        onError,
        onLoadStart,
        onCanPlay,
        onWaiting,
        onLoadedData,
        errorFallback,
        loadingFallback,
      }),
      src,
      provider: resolvedProvider,
      youtubeId,
      vimeoId,
      poster,
      title: lightboxTitle,
      autoPlay: true,
      captions,
      onError,
    });
  }

  return createElement(VideoSurface, {
    src,
    poster,
    width,
    height,
    aspectRatio,
    provider: resolvedProvider,
    youtubeId,
    vimeoId,
    controls,
    autoPlay,
    loop,
    muted,
    playsInline,
    preload,
    captions,
    className: videoClass,
    style: styleObj,
    onError,
    onLoadStart,
    onCanPlay,
    onWaiting,
    onLoadedData,
    errorFallback,
    loadingFallback,
    children,
    ...rest,
  });
}

interface VideoSurfaceProps
  extends Omit<
    VideoHTMLAttributes<HTMLVideoElement>,
    | "src"
    | "poster"
    | "width"
    | "height"
    | "controls"
    | "autoPlay"
    | "loop"
    | "muted"
    | "playsInline"
    | "preload"
    | "onError"
    | "onLoadStart"
    | "onCanPlay"
    | "onWaiting"
    | "onLoadedData"
    | "children"
  > {
  src: string | VideoSource[];
  poster?: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: string;
  provider: VideoProvider;
  youtubeId?: string;
  vimeoId?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  preload?: VideoPreload;
  captions?: string | VideoCaption[];
  className?: string;
  style?: CSSProperties;
  onError?: (err: VideoError) => void;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onWaiting?: () => void;
  onLoadedData?: () => void;
  errorFallback?: ReactNode | ((err: VideoError) => ReactNode);
  loadingFallback?: ReactNode;
  children?: ReactNode;
}

function VideoSurface({
  src,
  poster,
  aspectRatio,
  provider,
  youtubeId,
  vimeoId,
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  playsInline = false,
  preload = "metadata",
  captions,
  className,
  style,
  onError,
  onLoadStart,
  onCanPlay,
  onWaiting,
  onLoadedData,
  errorFallback,
  loadingFallback,
  children,
  ...rest
}: VideoSurfaceProps) {
  const [error, setError] = useState<VideoError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: values are derived from props
  useEffect(() => {
    setError(null);
    setIsLoading(true);
  }, [src, provider]);

  const reportError = useCallback(
    (err: VideoError) => {
      setError(err);
      onError?.(err);
    },
    [onError],
  );

  const handleMediaError = useCallback(
    (e: SyntheticEvent<HTMLVideoElement>) => {
      const el = e.currentTarget;
      const mediaErr = el.error;
      const code = mediaErr?.code ?? 0;
      const kind: VideoError["kind"] =
        code === 2 ? "network" : code === 3 ? "decode" : code === 4 ? "src-not-supported" : "media";
      const src0 = Array.isArray(src) ? src[0]?.src : src;
      const ve = new VideoError(kind, describeMediaError(code), {
        mediaErrorCode: code,
        url: src0,
        code: "SR0154",
      });
      reportError(ve);
    },
    [src, reportError],
  );

  if (provider === "youtube" || provider === "vimeo") {
    const direct = provider === "youtube" ? youtubeId : vimeoId;
    const firstSrc = Array.isArray(src) ? src[0]?.src : src;
    const id =
      direct ??
      (firstSrc ? (provider === "youtube" ? getYouTubeId(firstSrc) : getVimeoId(firstSrc)) : null);
    if (!id) {
      const err = new VideoError(
        "invalid-id",
        `Invalid ${provider} URL or ID: ${firstSrc ?? "(empty)"}`,
        { url: firstSrc, code: "SR0155" },
      );
      return createElement(
        "div",
        { className, style },
        renderVideoError(err, errorFallback, className, style),
      );
    }
    return renderEmbed(
      provider,
      id,
      `Embedded ${provider} video`,
      style ?? {},
      className,
      undefined,
      undefined,
      autoPlay,
    );
  }

  if (error) {
    return createElement(
      "div",
      { className, style },
      renderVideoError(error, errorFallback, className, style),
    );
  }

  const sources = resolveSources(src);
  const tracks = resolveCaptions(captions).map((c, i) =>
    createElement("track", {
      key: `track-${i}`,
      kind: "captions",
      src: c.src,
      srcLang: c.lang,
      label: c.label ?? c.lang,
      default: c.default ?? i === 0,
    }),
  );

  return createElement(
    "div",
    { className, style: { position: "relative", ...style } },
    isLoading && loadingFallback
      ? createElement(
          "div",
          {
            "aria-hidden": "true",
            style: {
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0, 0, 0, 0.4)",
              color: "white",
              fontSize: "0.875rem",
              pointerEvents: "none",
            },
          },
          loadingFallback,
        )
      : null,
    createElement(
      "video",
      {
        ...rest,
        ref: videoRef,
        poster,
        controls,
        autoPlay,
        loop,
        muted,
        playsInline,
        preload,
        className: ["__swift_rust_video_media", className].filter(Boolean).join(" "),
        style: {
          ...(aspectRatio ? { aspectRatio } : {}),
          display: "block",
          width: "100%",
          height: "auto",
        },
        onLoadStart: () => {
          setIsLoading(true);
          onLoadStart?.();
        },
        onCanPlay: () => {
          setIsLoading(false);
          onCanPlay?.();
        },
        onWaiting: () => {
          setIsLoading(true);
          onWaiting?.();
        },
        onLoadedData: () => {
          setIsLoading(false);
          onLoadedData?.();
        },
        onError: handleMediaError,
      },
      sources.map((s, i) =>
        createElement("source", { key: `source-${i}`, src: s.src, type: s.type }),
      ),
      ...tracks,
      children,
    ),
  );
}

export function BackgroundVideo({
  src,
  poster,
  overlay = true,
  overlayOpacity = 0.4,
  contentClassName,
  className,
  youtubeId,
  vimeoId,
  startTime,
  endTime,
  onError,
  children,
}: BackgroundVideoProps) {
  const provider = detectProvider(src);
  const containerClass = ["__swift_rust_background_video", className].filter(Boolean).join(" ");
  const overlayStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    background: typeof overlay === "string" ? overlay : `rgba(0, 0, 0, ${overlayOpacity})`,
    pointerEvents: "none",
  };

  const onSourceError = useCallback(
    (e: SyntheticEvent<HTMLVideoElement>) => {
      const code = e.currentTarget.error?.code ?? 0;
      const src0 = Array.isArray(src) ? src[0]?.src : src;
      onError?.(
        new VideoError("media", describeMediaError(code), { mediaErrorCode: code, url: src0 }),
      );
    },
    [src, onError],
  );

  let mediaElement: ReactNode;
  if (provider === "youtube" || provider === "vimeo") {
    const direct = provider === "youtube" ? youtubeId : vimeoId;
    const firstSrc = Array.isArray(src) ? src[0]?.src : src;
    const id =
      direct ??
      (firstSrc ? (provider === "youtube" ? getYouTubeId(firstSrc) : getVimeoId(firstSrc)) : null);
    if (id) {
      mediaElement = createElement(
        "div",
        {
          className: "__swift_rust_background_video_media",
          style: { position: "absolute", inset: 0, overflow: "hidden" },
        },
        renderEmbed(
          provider,
          id,
          "Background video",
          {
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100vw",
            height: "100vh",
            transform: "translate(-50%, -50%)",
          },
          undefined,
          startTime,
          endTime,
          true,
        ),
      );
    } else {
      const err = new VideoError(
        "invalid-id",
        `Invalid ${provider} URL or ID: ${firstSrc ?? "(empty)"}`,
        { url: firstSrc, code: "SR0155" },
      );
      onError?.(err);
      mediaElement = null;
    }
  } else {
    const sources = resolveSources(src);
    mediaElement = createElement(
      "video",
      {
        autoPlay: true,
        loop: true,
        muted: true,
        playsInline: true,
        poster,
        onError: onSourceError,
        className: "__swift_rust_background_video_media",
        style: {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        },
      },
      sources.map((s, i) =>
        createElement("source", { key: `bg-source-${i}`, src: s.src, type: s.type }),
      ),
    );
  }

  return createElement(
    "div",
    { className: containerClass, style: { position: "relative", overflow: "hidden" } },
    mediaElement,
    overlay
      ? createElement("div", {
          className: "__swift_rust_background_video_overlay",
          style: overlayStyle,
        })
      : null,
    createElement(
      "div",
      {
        className: ["__swift_rust_background_video_content", contentClassName]
          .filter(Boolean)
          .join(" "),
        style: { position: "relative", zIndex: 1 },
      },
      children,
    ),
  );
}

export function VideoLightbox({
  trigger,
  src,
  provider,
  youtubeId,
  vimeoId,
  poster,
  title,
  autoPlay = true,
  captions,
  className,
  onError,
}: VideoLightboxProps) {
  const [open, setOpen] = useState(false);
  const [_pageInput, _setPageInput] = useState("1");
  const [error, setError] = useState<VideoError | null>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const reportError = useCallback(
    (err: VideoError) => {
      setError(err);
      onError?.(err);
    },
    [onError],
  );

  return createElement(
    "div",
    { className: ["__swift_rust_video_lightbox", className].filter(Boolean).join(" ") },
    createElement(
      "div",
      {
        role: "button",
        tabIndex: 0,
        onClick: () => {
          setError(null);
          setOpen(true);
        },
        onKeyDown: (e: ReactKeyboardEvent<HTMLDivElement>) => {
          if (e.key === "Enter" || e.key === " ") setOpen(true);
        },
        style: { cursor: "pointer", display: "inline-block", position: "relative" },
      },
      trigger,
    ),
    open
      ? createElement(
          "div",
          {
            role: "dialog",
            "aria-modal": "true",
            onClick: close,
            className: "__swift_rust_video_lightbox_backdrop",
            style: {
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.85)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem",
            },
          },
          createElement(
            "div",
            {
              onClick: (e: MouseEvent) => e.stopPropagation(),
              className: "__swift_rust_video_lightbox_content",
              style: {
                position: "relative",
                width: "100%",
                maxWidth: "1100px",
                aspectRatio: "16/9",
                background: "black",
                borderRadius: "0.5rem",
                overflow: "hidden",
              },
            },
            error
              ? renderVideoError(error, undefined, "__swift_rust_video_lightbox_error", {
                  background: "black",
                })
              : createElement(VideoSurface, {
                  src,
                  poster,
                  provider: provider ?? detectProvider(src),
                  youtubeId,
                  vimeoId,
                  controls: true,
                  autoPlay,
                  captions,
                  className: "__swift_rust_video_lightbox_video",
                  style: { width: "100%", height: "100%" },
                  onError: reportError,
                }),
            createElement(
              "button",
              {
                type: "button",
                onClick: close,
                "aria-label": "Close",
                style: {
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  width: "2.25rem",
                  height: "2.25rem",
                  borderRadius: "9999px",
                  background: "rgba(0, 0, 0, 0.6)",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  lineHeight: 1,
                },
              },
              "\u00D7",
            ),
            title
              ? createElement(
                  "div",
                  {
                    style: {
                      position: "absolute",
                      bottom: "0.75rem",
                      left: "1rem",
                      color: "white",
                      fontSize: "0.875rem",
                      textShadow: "0 1px 2px rgba(0,0,0,0.7)",
                    },
                  },
                  title,
                )
              : null,
          ),
        )
      : null,
  );
}

export default Video;
