export default function PdfDownloadPage() {
  return (
    <div className="container-page max-w-xl py-16">
      <h1 className="mb-2">Download</h1>
      <p className="text-fg-secondary mb-6">Your download should start automatically.</p>
      <a
        href="/api/pdf"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-fg text-bg font-medium text-sm hover:opacity-90 transition-opacity"
      >
        Download PDF
      </a>
    </div>
  );
}
