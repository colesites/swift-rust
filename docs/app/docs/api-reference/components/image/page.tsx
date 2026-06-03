---
title: Image component
---

# Image
The `<Image>` component handles image optimization, responsive `srcset`, lazy loading, **and a required blur placeholder**. Every image must declare `placeholder="blur"` and a base64 `blurDataURL`. There is no "empty" mode.
## Import
```ts
import { Image, ImageMissingBlurError } from "swift-rust";
```
`ImageMissingBlurError` has a stable `code: "SR0151"` for log aggregation.
## Props
| Prop | Type | Description |
|---|---|---|
| `src` | `string` | The image source URL or path. Required. |
| `width` | `number` | Intrinsic width in pixels. Required. |
| `height` | `number` | Intrinsic height in pixels. Required. |
| `alt` | `string` | Alternative text. Required for accessibility. |
| `placeholder` | `"blur"` | **Required.** Always `"blur"`. |
| `blurDataURL` | `string` | **Required.** A base64 data URL (e.g. `data:image/jpeg;base64,...`). |
| `quality` | `number` | Quality 1-100. Default: 75. |
| `priority` | `boolean` | Skip lazy loading. Use for above-the-fold images. |
| `sizes` | `string` | The `sizes` attribute for responsive images. |
| `loader` | `function` | Custom image URL builder. |
## Why blur is required
A blur placeholder is part of the `<Image>` contract, not an optional nicety. The runtime throws `ImageMissingBlurError` at render time so the gap surfaces during development, not in production. The render output includes the blur as a `background-image` so the placeholder is visible the moment the element is painted.
## Examples
### Local image with a pre-generated blur
```tsx
import hero from "./hero.jpg";
import heroBlur from "./hero.jpg?blur";
<Image
src={hero.src}
width={hero.width}
height={hero.height}
alt="Hero"
placeholder="blur"
blurDataURL={heroBlur}
/>
```
The `?blur` import suffix is reserved for a future build-time generator. Today, generate the data URL with `plaiceholder`, `@unpic/placeholder`, or `blurhash` and pass it as a string.
### Remote image with a runtime-generated blur
```tsx
async function getBlur(url: string): Promise<string> {
const res = await fetch(`/_swift-rust/image?url=${encodeURIComponent(url)}&w=20&blur=1`);
const buf = await res.arrayBuffer();
return `data:image/jpeg;base64,${Buffer.from(buf).toString("base64")}`;
<Image
src="/photo.jpg"
width={1200}
height={800}
alt="Photo"
placeholder="blur"
blurDataURL={await getBlur("/photo.jpg")}
/>
```
### Custom loader
```tsx
const cloudinaryLoader = ({ src, width, quality }) =>
`https://res.cloudinary.com/demo/image/upload/w_${width},q_${quality ?? 75}/${src}`;
<Image
src="sample"
width={1200}
height={800}
alt="Cloudinary"
placeholder="blur"
blurDataURL="data:image/jpeg;base64,..."
loader={cloudinaryLoader}
/>
```
## Failure modes
If `placeholder` is missing, `blurDataURL` is missing, or `blurDataURL` is not a data URL, the component throws `ImageMissingBlurError` with `code: "SR0151"` and a message that names the missing field. TypeScript catches `placeholder` and `blurDataURL` missingness at build time; the runtime check is a safety net for dynamic prop values.
See `SR0151` for the full error reference.
);
}
