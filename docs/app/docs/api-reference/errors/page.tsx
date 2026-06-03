import { DocArticle } from "@/app/components/doc-article";
export const metadata = { title: "Errors" };

export default function ErrorsRefPage() {
  return (
    <DocArticle>
      <h1>Errors</h1>
      <p>
        Swift Rust uses the <code>SR-E</code> error code prefix. Each code has a dedicated page in
        the docs.
      </p>

      <h2>Code format</h2>
      <p>
        <code>SR-E</code> followed by a 4-digit code. The first two digits identify the category,
        the last two identify the specific error.
      </p>

      <h2>Categories</h2>
      <ul>
        <li>
          <code>SR-E00xx</code> — Build errors
        </li>
        <li>
          <code>SR-E01xx</code> — Server errors
        </li>
        <li>
          <code>SR-E02xx</code> — Routing errors
        </li>
        <li>
          <code>SR-E03xx</code> — Component errors
        </li>
        <li>
          <code>SR-E04xx</code> — Image errors
        </li>
        <li>
          <code>SR-E05xx</code> — Font errors
        </li>
        <li>
          <code>SR-E06xx</code> — PDF errors
        </li>
        <li>
          <code>SR-E07xx</code> — Video errors
        </li>
        <li>
          <code>SR-E10xx</code> — Compiler errors
        </li>
        <li>
          <code>SR-E14xx</code> — Configuration errors
        </li>
      </ul>

      <h2>Looking up a code</h2>
      <p>
        Each error code has a page at <code>/errors/SR-Exxxx</code>. For example:{" "}
        <a href="/errors/SR-E0001">/errors/SR-E0001</a>.
      </p>
    </DocArticle>
  );
}
