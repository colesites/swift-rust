export function Analytics() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };",
        }}
      />
      <script defer src="/_vercel/insights/script.js" />
    </>
  );
}
