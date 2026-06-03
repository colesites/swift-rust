import { DocArticle } from "@/app/components/doc-article";
export const metadata = { title: "Images" };

export default function ImagesPage() {
  return (
    <DocArticle>
      <h1>Images</h1>
      <p>
        The <code>&lt;Image&gt;</code> component handles optimization, responsive{" "}
        <code>srcset</code>, lazy loading, and blur-up placeholders — all automatically.
      </p>

      <h2>Basic usage</h2>
      <p>
        The <code>width</code>, <code>height</code>, and <code>alt</code> props are required. They
        help the framework reserve space and generate the correct <code>srcset</code>.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>usage</span>
        </div>
        <pre>
          <code>{`import { Image } from "swift-rust";

<Image
  src="/hero.jpg"
  alt="A description of the image"
  width={1200}
  height={600}
  priority
/>`}</code>
        </pre>
      </div>

      <h2>
        Responsive <code>srcset</code>
      </h2>
      <p>
        The framework generates a <code>srcset</code> with three densities (1x, 2x, 3x) and emits a{" "}
        <code>sizes</code> attribute when you provide one. Add <code>priority</code> for
        above-the-fold images to skip lazy loading.
      </p>

      <h2>Remote sources</h2>
      <p>
        Add the domain to <code>swift-rust.config.json</code> to allow remote images:
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>swift-rust.config.json</span>
        </div>
        <pre>
          <code>{`{
  "image": {
    "domains": ["cdn.example.com"],
    "formats": ["image/avif", "image/webp"]
  }
}`}</code>
        </pre>
      </div>

      <h2>Blur placeholders</h2>
      <p>
        Pass a <code>blurDataURL</code> (a small base64-encoded image) to show a blurry preview
        while the full image loads.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>usage</span>
        </div>
        <pre>
          <code>{`<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>`}</code>
        </pre>
      </div>

      <h2>Next steps</h2>
      <p>
        Continue to <a href="/docs/getting-started/videos">Videos</a>.
      </p>
    </DocArticle>
  );
}
