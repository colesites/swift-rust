export function Analytics() {
  return (
    <>
      <script>
        {"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };"}
      </script>
      <script defer src="/_vercel/insights/script.js" />
    </>
  );
}
