---
"@swift-rust/image": major
"@swift-rust/pdf": minor
"@swift-rust/video": minor
---

Three component-level changes:

- **`@swift-rust/image`**: `<Image>` now requires `placeholder="blur"` and a `blurDataURL` (base64 data URL). The `"empty"` placeholder option is removed. Missing or invalid props throw `ImageMissingBlurError` (code `SR0151`) at render time. See `errors/docs/SR0151.md` for the migration guide.

- **`@swift-rust/pdf`**: New `<Pdf>` viewer component for displaying existing PDFs in the page. Multi-page navigation, zoom, keyboard controls, error states. Depends on `pdfjs-dist@^4.7.0` (added as a runtime dependency). The existing generator (`<Document>`, `<Page>`, `<Text>`, `<View>`) is unchanged. Two new error codes: `SR0152` (load failed) and `SR0153` (render failed).

- **`@swift-rust/video`**: New error events: `onError`, `onLoadStart`, `onCanPlay`, `onWaiting`, `onLoadedData`. The `MediaError` event is now wired to a `VideoError` with stable codes `SR0154` (media) and `SR0155` (invalid YouTube/Vimeo ID). Built-in error UI replaces the player on failure. New `errorFallback` and `loadingFallback` props for custom UI.
