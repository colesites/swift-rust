export const metadata = { title: "Forms" };

export default function FormsPage() {
  return (
    <article className="prose">
      <h1>Forms</h1>
      <p>
        Forms in Swift Rust work the way you'd expect in React, with one twist: server actions let
        you handle the submission without writing a separate API route.
      </p>

      <h2>A simple form</h2>
      <div className="code-block">
        <div className="code-block-header">
          <span>app/contact/page.tsx</span>
        </div>
        <pre>
          <code>{`import { submitContact } from "./actions";

export default function ContactPage() {
  return (
    <form action={submitContact}>
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit">Send</button>
    </form>
  );
}`}</code>
        </pre>
      </div>

      <div className="code-block">
        <div className="code-block-header">
          <span>app/contact/actions.ts</span>
        </div>
        <pre>
          <code>{`"use server";

import { revalidatePath } from "swift-rust/router";

export async function submitContact(formData: FormData) {
  const email = formData.get("email");
  const message = formData.get("message");
  await db.messages.create({ data: { email, message } });
  revalidatePath("/contact");
}`}</code>
        </pre>
      </div>

      <h2>Client-side state</h2>
      <p>
        For forms that need optimistic updates or progressive enhancement, mark the component with{" "}
        <code>"use client"</code> and use <code>useState</code> + <code>fetch</code>.
      </p>
      <div className="code-block">
        <div className="code-block-header">
          <span>usage</span>
        </div>
        <pre>
          <code>{`"use client";
import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    await fetch("/api/subscribe", { method: "POST", body: JSON.stringify({ email }) });
    setStatus("done");
  }

  return (
    <form onSubmit={onSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button disabled={status === "loading"}>Subscribe</button>
    </form>
  );
}`}</code>
        </pre>
      </div>

      <h2>Validation</h2>
      <p>
        The framework doesn't ship a validation library. We recommend <code>zod</code> for parsing
        form data and API request bodies.
      </p>
    </article>
  );
}
