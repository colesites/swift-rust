export const metadata = { title: "Videos" };

export default function VideosPage() {
  return (
    <article className="prose">
      <h1>Videos</h1>
      <p>
        The <code>&lt;Video&gt;</code> component supports HTML5 video, YouTube embeds, Vimeo embeds,
        lightbox mode, background video, and captions.
      </p>

      <h2>Basic HTML5 video</h2>
      <div className="code-block">
        <div className="code-block-header">
          <span>usage</span>
        </div>
        <pre>
          <code>{`import { Video } from "swift-rust";

<Video
  src="/videos/promo.mp4"
  poster="/images/promo-poster.jpg"
  width={1280}
  height={720}
  controls
/>`}</code>
        </pre>
      </div>

      <h2>Multiple sources</h2>
      <p>
        Pass an array of <code>VideoSource</code> objects to provide multiple formats. The browser
        will pick the first one it supports.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>usage</span>
        </div>
        <pre>
          <code>{`<Video
  src={[
    { src: "/videos/promo.webm", type: "video/webm" },
    { src: "/videos/promo.mp4", type: "video/mp4" },
  ]}
  poster="/images/promo-poster.jpg"
  controls
/>`}</code>
        </pre>
      </div>

      <h2>YouTube and Vimeo</h2>
      <p>
        Pass a YouTube or Vimeo URL as <code>src</code>, and the framework will detect the provider
        and embed it. You can also pass <code>youtubeId</code> or <code>vimeoId</code> directly.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>usage</span>
        </div>
        <pre>
          <code>{`<Video
  src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  title="Demo"
  width={1280}
  height={720}
/>`}</code>
        </pre>
      </div>

      <h2>Captions</h2>
      <p>
        Add captions in WebVTT format with the <code>captions</code> prop.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>usage</span>
        </div>
        <pre>
          <code>{`<Video
  src="/videos/promo.mp4"
  captions={[
    { src: "/captions/en.vtt", lang: "en", label: "English", default: true },
    { src: "/captions/es.vtt", lang: "es", label: "Español" },
  ]}
  controls
/>`}</code>
        </pre>
      </div>

      <h2>Lightbox</h2>
      <p>
        Add <code>lightbox</code> to open the video in a modal lightbox when the user clicks it.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>usage</span>
        </div>
        <pre>
          <code>{`<Video
  src="/videos/promo.mp4"
  poster="/images/promo-poster.jpg"
  width={1280}
  height={720}
  lightbox
  lightboxTitle="Product demo"
/>`}</code>
        </pre>
      </div>

      <h2>Background video</h2>
      <p>
        Use <code>&lt;BackgroundVideo&gt;</code> for full-bleed hero sections. It autoplays, loops,
        mutes, and renders an overlay so your content is always readable.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>usage</span>
        </div>
        <pre>
          <code>{`import { BackgroundVideo } from "swift-rust";

<BackgroundVideo src="/videos/hero.mp4" overlay>
  <h1>Hello, world</h1>
</BackgroundVideo>`}</code>
        </pre>
      </div>

      <h2>Next steps</h2>
      <p>
        Continue to <a href="/docs/getting-started/pdfs">PDFs</a>.
      </p>
    </article>
  );
}
