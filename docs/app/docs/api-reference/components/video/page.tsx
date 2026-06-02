---
title: Video component
---

# Video

HTML5 video, YouTube, Vimeo, lightbox, and background video modes. Full error handling: load failures, decode errors, network errors, and invalid embed IDs are all surfaced through `onError` and the built-in error UI.

See `/components/video` for a live demo.

## Import

```ts
import { Video, BackgroundVideo, VideoLightbox, VideoError } from "swift-rust";
```

`VideoError` has stable codes: `SR0154` for native media errors, `SR0155` for invalid YouTube/Vimeo IDs.

## `<Video>` props

| Prop | Type | Description |
|---|---|---|
| `src` | `string \| VideoSource[]` | URL or array of sources. Required. |
| `provider` | `"html5" \| "youtube" \| "vimeo"` | Auto-detected from `src`. |
| `poster` | `string` | Poster image URL. |
| `width` | `number \| string` | Width in pixels or any CSS unit. |
| `height` | `number \| string` | Height in pixels or any CSS unit. |
| `aspectRatio` | `string` | CSS aspect-ratio, e.g. `"16/9"`. |
| `controls` | `boolean` | Show playback controls. Default: `true`. |
| `autoPlay` | `boolean` | Start playing automatically. Most browsers require `muted` too. |
| `loop` | `boolean` | Loop the video. |
| `muted` | `boolean` | Mute the audio. |
| `playsInline` | `boolean` | Play inline on iOS instead of fullscreen. |
| `preload` | `"auto" \| "metadata" \| "none"` | How much to preload. Default: `"metadata"`. |
| `captions` | `string \| VideoCaption[]` | VTT caption file or array of tracks. |
| `lightbox` | `boolean` | Open in modal lightbox on click. |
| `lightboxTitle` | `string` | Title shown in the lightbox. |
| `onError` | `(err: VideoError) => void` | Fired for all media errors. |
| `onLoadStart` | `() => void` | Fired when loading begins. |
| `onCanPlay` | `() => void` | Fired when the player can begin playback. |
| `onWaiting` | `() => void` | Fired when playback is buffering. |
| `onLoadedData` | `() => void` | Fired when the first frame is loaded. |
| `errorFallback` | `ReactNode \| (err) => ReactNode` | Custom error UI. Default: built-in alert. |
| `loadingFallback` | `ReactNode` | UI shown while the player is loading. |

## Error handling

The viewer wraps the native `<video>` element's `MediaError` event. Each browser error code is mapped to a `VideoError.kind`:

| `MediaError.code` | `VideoError.kind` | `VideoError.code` |
|---|---|---|
| 1 (aborted) | `"media"` | `SR0154` |
| 2 (network) | `"network"` | `SR0154` |
| 3 (decode) | `"decode"` | `SR0154` |
| 4 (unsupported) | `"src-not-supported"` | `SR0154` |

Invalid YouTube/Vimeo URLs (where no video ID can be extracted) raise `SR0155` with `kind: "invalid-id"`.

```tsx
<Video
  src="/clip.mp4"
  onError={(err) => {
    if (err.kind === "src-not-supported") {
      // try the .webm fallback
    }
    if (err.code === "SR0155") {
      // bad YouTube/Vimeo ID
    }
    if (err.mediaErrorCode === 1) {
      // user pressed Stop; not a fatal error
    }
  }}
/>
```

## Helper functions

```ts
isYouTubeUrl(url)             // Check if URL is YouTube
isVimeoUrl(url)               // Check if URL is Vimeo
getYouTubeId(url)             // Extract YouTube video ID
getVimeoId(url)               // Extract Vimeo video ID
detectProvider(src)           // Detect "html5" | "youtube" | "vimeo"
getYouTubeEmbedUrl(id, opts)  // Build YouTube embed URL
getVimeoEmbedUrl(id, opts)    // Build Vimeo embed URL
```

## Examples

### Multi-source H.264 + VP9

```tsx
<Video
  src={[
    { src: "/clip.webm", type: "video/webm" },
    { src: "/clip.mp4", type: "video/mp4" },
  ]}
  width={1280}
  height={720}
  aspectRatio="16/9"
  controls
  captions="/clip.en.vtt"
  onError={(err) => console.warn("video:", err.code, err.message)}
/>
```

### YouTube

```tsx
<Video
  provider="youtube"
  youtubeId="dQw4w9WgXcQ"
  width={1280}
  height={720}
/>
```

Or via URL auto-detection:

```tsx
<Video src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
```

Shorts and `/embed/` URLs are also recognized.

### Background video

```tsx
<BackgroundVideo
  src="/hero.mp4"
  poster="/hero.jpg"
  overlay
  overlayOpacity={0.4}
>
  <h1>Welcome</h1>
</BackgroundVideo>
```

### Lightbox

```tsx
<VideoLightbox
  src="/clip.mp4"
  trigger={<Thumbnail src="/thumb.jpg" alt="Watch" />}
  title="Product demo"
  captions="/clip.en.vtt"
/>
```

## Failure modes

See `SR0154` for native media errors and `SR0155` for invalid YouTube/Vimeo IDs.
