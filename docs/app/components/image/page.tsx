import { Image } from "swift-rust/image";

const BLUR =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

export default function ImageDocsPage() {
  return (
    <article>
      <h1>Image</h1>
      <p>
        The <code>&lt;Image&gt;</code> component handles optimization, responsive{" "}
        <code>srcset</code>, and lazy loading.
      </p>
      <Image
        src="/hero.jpg"
        width={1200}
        height={600}
        alt="Hero"
        placeholder="blur"
        blurDataURL={BLUR}
        priority
      />
      <pre>
        <code>{`<Image
  src="/hero.jpg"
  width={1200}
  height={600}
  alt="Hero"
  placeholder="blur"
  blurDataURL="data:image/png;base64,..."
  priority
/>`}</code>
      </pre>
      <h2>Remote sources</h2>
      <p>
        Add the domain to <code>swift-rust.config.json</code>:
      </p>
      <pre>
        <code>{`{
  "image": { "domains": ["cdn.example.com"] }
}`}</code>
      </pre>
    </article>
  );
}
