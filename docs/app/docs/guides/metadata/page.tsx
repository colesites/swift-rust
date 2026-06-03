import { DocArticle } from "@/app/components/doc-article";
export const metadata = { title: "Metadata & SEO" };

export default function MetadataPage() {
  return (
    <DocArticle>
      <h1>Metadata &amp; SEO</h1>
      <p>
        Pages and layouts can export a <code>metadata</code> object. The framework turns it into{" "}
        <code>&lt;title&gt;</code>, Open Graph, Twitter Card, and other meta tags.
      </p>

      <h2>Static metadata</h2>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/about/page.tsx</span>
        </div>
        <pre>
          <code>{`export const metadata = {
  title: "About",
  description: "Learn more about Acme Co.",
  openGraph: {
    title: "About Acme",
    description: "Our story, our team, our mission.",
    images: ["/og/about.jpg"],
  },
};

export default function AboutPage() {
  return <h1>About</h1>;
}`}</code>
        </pre>
      </div>

      <h2>Dynamic metadata</h2>
      <p>
        For pages that need to set metadata based on data, export an async{" "}
        <code>generateMetadata</code> function.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/blog/[slug]/page.tsx</span>
        </div>
        <pre>
          <code>{`export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { images: [post.cover] },
  };
}`}</code>
        </pre>
      </div>

      <h2>Title templates</h2>
      <p>
        Set a <code>title.template</code> in the root layout's metadata to prefix every page title.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/layout.tsx</span>
        </div>
        <pre>
          <code>{`export const metadata = {
  title: {
    template: "%s · Acme",
    default: "Acme",
  },
};`}</code>
        </pre>
      </div>

      <h2>
        The <code>Head</code> component
      </h2>
      <p>
        For custom tags that aren't covered by <code>metadata</code>, use the <code>Head</code>,{" "}
        <code>Title</code>, <code>Meta</code>, and <code>Style</code> components from{" "}
        <code>swift-rust</code>.
      </p>
    </DocArticle>
  );
}
