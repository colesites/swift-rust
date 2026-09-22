export function Analytics() {
  return (
    <>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static inline script for Vercel analytics
        dangerouslySetInnerHTML={{
          __html:
            "window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };",
        }}
      />
      <script defer src="/_vercel/insights/script.js" />
    </>
  );
}
