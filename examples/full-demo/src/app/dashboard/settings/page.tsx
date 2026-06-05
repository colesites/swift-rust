import type { Metadata } from "swift-rust";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10 sm:px-10">
      <p className="text-[0.75rem] font-semibold uppercase tracking-wider text-fg-subtle">
        Dashboard
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-fg-muted">Manage your project preferences.</p>

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="text-[0.95rem] font-semibold">Profile</h2>
          <p className="mt-1 text-[0.875rem] text-fg-muted">
            Information that shows up on posts you author.
          </p>
          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="name" className="block text-[0.8125rem] font-medium">
                Name
              </label>
              <input id="name" type="text" defaultValue="Alex Chen" className="input mt-1.5" />
            </div>
            <div>
              <label htmlFor="email" className="block text-[0.8125rem] font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                defaultValue="alex@swift-rust.dev"
                className="input mt-1.5"
              />
            </div>
            <div>
              <label htmlFor="bio" className="block text-[0.8125rem] font-medium">
                Bio
              </label>
              <textarea
                id="bio"
                className="textarea mt-1.5"
                defaultValue="Founding engineer at Swift Rust. Likes Rust, dislikes webpack."
              />
            </div>
          </div>
        </section>

        <section className="border-t border-border pt-8">
          <h2 className="text-[0.95rem] font-semibold">Rendering</h2>
          <p className="mt-1 text-[0.875rem] text-fg-muted">
            How the framework renders pages for this project.
          </p>
          <div className="mt-5 grid gap-2">
            {[
              {
                id: "ssr-wasm",
                label: "SSR + WASM",
                hint: "Default. Server-rendered HTML, WASM-hydrated.",
              },
              { id: "ssr", label: "SSR only", hint: "No client JavaScript." },
              { id: "ssr-htmx", label: "SSR + HTMX", hint: "Progressive enhancement." },
              { id: "wasm", label: "Full WASM SPA", hint: "Single-page app in WebAssembly." },
            ].map((opt, i) => (
              <label
                key={opt.id}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-surface-2 has-[:checked]:border-accent has-[:checked]:bg-accent-soft"
              >
                <input
                  type="radio"
                  name="renderer"
                  defaultChecked={i === 0}
                  className="mt-1 h-4 w-4 cursor-pointer accent-accent"
                />
                <div>
                  <p className="font-medium">{opt.label}</p>
                  <p className="text-[0.8125rem] text-fg-muted">{opt.hint}</p>
                </div>
              </label>
            ))}
          </div>
        </section>

        <section className="border-t border-border pt-8">
          <h2 className="text-[0.95rem] font-semibold">Danger zone</h2>
          <p className="mt-1 text-[0.875rem] text-fg-muted">
            Irreversible actions. Be sure before proceeding.
          </p>
          <div className="mt-5 flex items-center justify-between rounded-lg border border-[#fecaca] bg-[#fef2f2] p-4">
            <div>
              <p className="font-medium text-[#991b1b]">Delete project</p>
              <p className="text-[0.8125rem] text-[#b91c1c]">
                All posts, settings, and data will be permanently removed.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-sm"
              style={{ background: "#dc2626", color: "white" }}
            >
              Delete
            </button>
          </div>
        </section>

        <div className="flex justify-end gap-2 border-t border-border pt-8">
          <button type="button" className="btn btn-outline">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
