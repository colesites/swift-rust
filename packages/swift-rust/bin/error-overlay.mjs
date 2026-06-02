import { existsSync, readFileSync } from "node:fs";

function escapeHtml(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function classifyError(message) {
  if (!message) return { kind: "error", code: "E0001", title: "Unknown error" };
  const m = String(message);

  if (/Cannot find module|SyntaxError|Unexpected token|is not defined|has no exported member|export.*not found/i.test(m)) {
    return {
      kind: "compile",
      code: "E0401",
      title: "Module or symbol not found",
      explain:
        "The compiler could not resolve a module, identifier, or export. " +
        "This usually means a typo, a missing dependency, or a case-sensitivity issue.",
      suggestions: [
        "Check the spelling and case of the import path",
        "Verify the file exists at the given path",
        "Run `bun install` if the module is from a package",
        "Check that the symbol is actually exported from the module",
      ],
    };
  }
  if (/does not provide an export named|TypeError.*is not a function/i.test(m)) {
    return {
      kind: "compile",
      code: "E0402",
      title: "Invalid import or usage",
      explain:
        "You are trying to use something that the module does not export, " +
        "or you are calling something that is not a function.",
      suggestions: [
        "Run `bun pm ls` to verify the package is installed",
        "Check the package's public API in its README",
        "If you added a default export, make sure to use `import X from ...`",
      ],
    };
  }
  if (/Failed to fetch|FetchError|NetworkError|ENOTFOUND|ECONNREFUSED/i.test(m)) {
    return {
      kind: "runtime",
      code: "E0901",
      title: "Network request failed",
      explain:
        "A fetch or HTTP call to an external service failed. " +
        "The server may be down, the URL may be wrong, or the network may be unavailable.",
      suggestions: [
        "Check your internet connection",
        "Verify the URL is correct and reachable",
        "If calling your own API, make sure the dev server is running",
        "Check for CORS issues if calling a third-party API from the browser",
      ],
    };
  }
  if (/notFound\(\)|NEXT_NOT_FOUND|NOT_FOUND/i.test(m)) {
    return {
      kind: "notFound",
      code: "E1404",
      title: "Resource not found",
      explain:
        "The page or resource you requested could not be found. " +
        "This is typically thrown intentionally with notFound() to render a 404 page.",
      suggestions: [
        "Check the URL is correct",
        "If this is unexpected, verify the data source returned a valid record",
        "Add a not-found.tsx in this segment to provide a custom 404",
      ],
    };
  }
  if (/redirect/i.test(m)) {
    return {
      kind: "redirect",
      code: "E1301",
      title: "Redirect",
      explain:
        "A redirect was thrown from this page. " +
        "This is expected behavior when calling redirect() from a server component.",
      suggestions: [
        "If this is unexpected, check the calling code for an unintended redirect()",
      ],
    };
  }
  if (/hydration|Text content does not match|There was an error while hydrating/i.test(m)) {
    return {
      kind: "runtime",
      code: "E0501",
      title: "Hydration mismatch",
      explain:
        "The server-rendered HTML does not match what the client tried to render. " +
        "This usually means a component renders different output on the server vs. the client.",
      suggestions: [
        "Avoid using `new Date()`, `Math.random()`, or other non-deterministic values in render",
        "Check that `typeof window` checks are inside `useEffect`",
        "Verify the same data is available on both server and client",
      ],
    };
  }
  if (/ENOSPC|EACCES|EADDRINUSE|EADDRNOTAVAIL|port.*already|port.*in use/i.test(m)) {
    return {
      kind: "system",
      code: "E0002",
      title: "Server failed to start",
      explain:
        "The dev server could not bind to the requested port, " +
        "or it ran out of system resources.",
      suggestions: [
        "Close any other process using this port (usually 3000)",
        "Run with --port 3001 to use a different port",
        "Check disk space with `df -h`",
      ],
    };
  }
  return {
    kind: "error",
    code: "E0001",
    title: "An unexpected error occurred",
    explain:
      "The dev server caught an error it could not classify. " +
      "Read the message and stack trace below to identify the cause.",
    suggestions: [
      "Read the error message carefully",
      "Check the stack trace to find the failing function",
      "Try reloading the page",
    ],
  };
}

function extractLocation(err) {
  if (!err) return null;
  const stack = err.stack || "";
  const patterns = [
    /at\s+.*?\s+\(([^()]+?):(\d+):(\d+)\)/,
    /at\s+([^:]+):(\d+):(\d+)/,
    /([^()\n]+\.(?:tsx?|jsx?|mjs|js)):(\d+):?(\d+)?/,
  ];
  for (const p of patterns) {
    const m = stack.match(p);
    if (m) {
      return {
        file: m[1],
        line: parseInt(m[2] || "0", 10),
        column: parseInt(m[3] || "0", 10),
      };
    }
  }
  if (err.lineNumber) {
    return { file: err.fileName || "<unknown>", line: err.lineNumber, column: err.columnNumber || 0 };
  }
  return null;
}

function readFileLines(filePath, targetLine, context = 3) {
  try {
    if (!existsSync(filePath)) return null;
    const text = readFileSync(filePath, "utf8");
    const lines = text.split("\n");
    const start = Math.max(0, targetLine - 1 - context);
    const end = Math.min(lines.length, targetLine + context);
    const out = [];
    for (let i = start; i < end; i++) {
      out.push({ number: i + 1, text: lines[i] });
    }
    return out;
  } catch {
    return null;
  }
}

function codeFrame(filePath, line, column, context = 3) {
  if (!filePath || !line) return "";
  const lines = readFileLines(filePath, line, context);
  if (!lines || lines.length === 0) return "";
  const maxWidth = String(lines[lines.length - 1].number).length;
  const out = [];
  out.push(
    `  <div class="frame-title"><span class="frame-file">${escapeHtml(filePath)}</span>:<span class="frame-line">${line}:${column || 1}</span></div>`,
  );
  out.push(`  <pre class="frame">`);
  for (const l of lines) {
    const isTarget = l.number === line;
    const gutter = String(l.number).padStart(maxWidth, " ");
    const marker = isTarget ? "▶" : " ";
    out.push(
      `<span class="frame-line${isTarget ? " is-target" : ""}"><span class="frame-gutter">${gutter} ${marker}</span><span class="frame-source">${escapeHtml(l.text || " ")}</span></span>`,
    );
  }
  if (column && column > 0) {
    out.push(
      `<span class="frame-caret">${" ".repeat(maxWidth + 2)}<span class="caret">${" ".repeat(Math.max(0, column - 1))}^</span></span>`,
    );
  }
  out.push(`  </pre>`);
  return out.join("\n");
}

function getExplainable({ code, title, kind }) {
  return {
    code,
    title,
    intro: kind === "notFound" ? "Not Found" : kind === "redirect" ? "Redirect" : "Something went wrong",
  };
}

export function errorOverlayHTML({ message, stack, hint, file, line, column, kind }) {
  const errMsg = message || "An unexpected error occurred";
  const cls = classifyError(errMsg);
  const finalKind = kind || cls.kind;
  const finalCode = cls.code;
  const finalTitle = cls.title;
  const explain = cls.explain;
  const suggestions = cls.suggestions || [];

  const location = extractLocation({ message: errMsg, stack });
  const finalFile = file || location?.file;
  const finalLine = line || location?.line || 0;
  const finalColumn = column || location?.column || 0;
  const frame = finalFile ? codeFrame(finalFile, finalLine, finalColumn) : "";

  const headerIcon = finalKind === "notFound" ? "🔍" : finalKind === "redirect" ? "↪️" : finalKind === "compile" ? "⚙️" : "✕";

  const headerLabel =
    finalKind === "notFound"
      ? "NOT FOUND"
      : finalKind === "redirect"
        ? "REDIRECT"
        : finalKind === "compile"
          ? "COMPILER"
          : finalKind === "system"
            ? "SYSTEM"
            : "ERROR";

  const headerColor =
    finalKind === "notFound"
      ? "#a3a3a3"
      : finalKind === "redirect"
        ? "#60a5fa"
        : finalKind === "compile"
          ? "#f59e0b"
          : finalKind === "system"
            ? "#f97316"
            : "#ef4444";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Swift Rust · ${escapeHtml(finalCode)} ${escapeHtml(finalTitle)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  *, *::before, *::after { box-sizing: border-box; }
  :root {
    color-scheme: dark;
  }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "Helvetica Neue", sans-serif;
    background: #09090b;
    color: #e4e4e7;
    min-height: 100vh;
    font-size: 14px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .mono { font-family: ui-monospace, "SF Mono", "JetBrains Mono", "Fira Code", Menlo, Monaco, Consolas, monospace; }

  .page { max-width: 920px; margin: 0 auto; padding: 48px 24px 96px; }
  .topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding-bottom: 20px; margin-bottom: 32px;
    border-bottom: 1px solid #27272a;
  }
  .brand { display: flex; align-items: center; gap: 10px; font-weight: 600; }
  .brand-mark {
    width: 22px; height: 22px; border-radius: 5px;
    background: linear-gradient(135deg, #0070f3 0%, #7c3aed 50%, #ec4899 100%);
  }
  .brand-name { font-size: 14px; }
  .topbar-right { font-size: 12px; color: #71717a; }

  .card {
    background: #0c0c0d;
    border: 1px solid #27272a;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 16px;
  }
  .card-head {
    padding: 14px 20px;
    display: flex; align-items: center; gap: 12px;
    background: #111113;
    border-bottom: 1px solid #27272a;
  }
  .card-head .code-badge {
    font-family: ui-monospace, "JetBrains Mono", monospace;
    font-size: 11px; font-weight: 700; letter-spacing: 0.5px;
    background: #1f1f23; color: #e4e4e7;
    padding: 3px 8px; border-radius: 4px;
  }
  .card-head .icon { font-size: 16px; line-height: 1; }
  .card-head .title { font-size: 14px; font-weight: 600; color: #e4e4e7; }
  .card-head .kind {
    margin-left: auto;
    font-size: 10px; font-weight: 700; letter-spacing: 0.5px;
    color: ${headerColor};
    background: ${headerColor}1A;
    border: 1px solid ${headerColor}33;
    padding: 3px 8px; border-radius: 4px;
  }
  .card-body { padding: 20px; }

  .lede {
    font-size: 16px; font-weight: 500;
    color: #fafafa;
    margin-bottom: 16px; line-height: 1.5;
  }
  .lede .err-code {
    font-family: ui-monospace, "JetBrains Mono", monospace;
    font-size: 12px;
    background: ${headerColor}1A;
    color: ${headerColor};
    padding: 2px 6px;
    border-radius: 3px;
    margin-right: 8px;
    font-weight: 600;
  }
  .explain {
    color: #a1a1aa;
    margin-bottom: 16px;
    font-size: 14px;
  }
  .section-label {
    font-size: 11px; font-weight: 600; letter-spacing: 0.5px;
    color: #71717a; text-transform: uppercase;
    margin: 20px 0 10px;
  }
  .suggestions {
    list-style: none; padding: 0; margin: 0;
    border: 1px solid #27272a; border-radius: 8px;
    overflow: hidden;
  }
  .suggestions li {
    padding: 10px 14px;
    font-size: 13px;
    color: #d4d4d8;
    background: #111113;
    border-top: 1px solid #27272a;
    display: flex; align-items: flex-start; gap: 10px;
  }
  .suggestions li:first-child { border-top: 0; }
  .suggestions li::before {
    content: "→";
    color: #60a5fa;
    font-weight: 600;
    flex-shrink: 0;
  }

  .frame {
    background: #000;
    border: 1px solid #27272a;
    border-radius: 8px;
    padding: 14px 16px;
    overflow-x: auto;
    font-size: 12.5px; line-height: 1.6;
    margin: 0;
  }
  .frame-title {
    font-family: ui-monospace, "JetBrains Mono", monospace;
    font-size: 12px;
    color: #71717a;
    margin-bottom: 8px;
    display: flex; align-items: center; gap: 4px;
  }
  .frame-file { color: #a1a1aa; }
  .frame-line { color: #71717a; }
  .frame-line { display: block; white-space: pre; }
  .frame-gutter { color: #3f3f46; user-select: none; margin-right: 12px; }
  .frame-line.is-target .frame-source { color: #fafafa; }
  .frame-line.is-target .frame-gutter { color: #ef4444; }
  .frame-caret { display: block; white-space: pre; color: #ef4444; }
  .caret { background: #ef444433; color: #ef4444; }

  .stack-wrap { margin-top: 12px; }
  details summary {
    cursor: pointer;
    color: #a1a1aa;
    font-size: 12px;
    padding: 8px 0;
    user-select: none;
    font-weight: 500;
  }
  details summary:hover { color: #e4e4e7; }
  details[open] summary { color: #fafafa; }
  pre.stack {
    background: #000;
    border: 1px solid #27272a;
    border-radius: 8px;
    padding: 14px 16px;
    overflow-x: auto;
    font-size: 12px; line-height: 1.6;
    color: #a1a1aa;
    margin: 0;
    max-height: 320px;
  }

  .hint {
    background: #1e1b4b;
    border: 1px solid #4338ca;
    color: #c7d2fe;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 13px;
    margin-bottom: 16px;
  }

  .actions { display: flex; gap: 8px; margin-top: 24px; flex-wrap: wrap; }
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 6px;
    font-size: 13px; font-weight: 500;
    border: 1px solid #27272a;
    background: #18181b;
    color: #e4e4e7;
    cursor: pointer;
    text-decoration: none;
    font-family: inherit;
    transition: all 0.15s ease;
  }
  .btn:hover { background: #27272a; border-color: #3f3f46; }
  .btn-primary {
    background: #fafafa;
    color: #09090b;
    border-color: #fafafa;
  }
  .btn-primary:hover { background: #e4e4e7; border-color: #e4e4e7; }

  .footer {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #27272a;
    display: flex; justify-content: space-between;
    font-size: 11px; color: #52525b;
  }
  .footer a { color: #71717a; text-decoration: none; }
  .footer a:hover { color: #a1a1aa; }

  @media (max-width: 640px) {
    .page { padding: 24px 16px 64px; }
    .topbar { flex-direction: column; align-items: flex-start; gap: 8px; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="topbar">
    <div class="brand">
      <div class="brand-mark"></div>
      <div class="brand-name">Swift Rust <span style="color:#71717a;font-weight:400">dev</span></div>
    </div>
    <div class="topbar-right">Press <kbd style="background:#1f1f23;border:1px solid #27272a;border-radius:3px;padding:1px 5px;font-family:ui-monospace;font-size:11px">Esc</kbd> to dismiss</div>
  </div>

  <div class="card">
    <div class="card-head">
      <span class="icon">${headerIcon}</span>
      <span class="code-badge">${escapeHtml(finalCode)}</span>
      <span class="title">${escapeHtml(finalTitle)}</span>
      <span class="kind">${escapeHtml(headerLabel)}</span>
    </div>
    <div class="card-body">
      <div class="lede">
        <span class="err-code">${escapeHtml(finalCode)}</span>
        ${escapeHtml(errMsg.split("\n")[0])}
      </div>
      <div class="explain">${escapeHtml(explain)}</div>

      ${hint ? `<div class="hint">${escapeHtml(hint)}</div>` : ""}

      ${suggestions.length > 0 ? `
        <div class="section-label">Suggested fixes</div>
        <ul class="suggestions">
          ${suggestions.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}
        </ul>
      ` : ""}

      ${frame ? `
        <div class="section-label">Source</div>
        ${frame}
      ` : ""}

      ${stack ? `
        <div class="stack-wrap">
          <details>
            <summary>Stack trace</summary>
            <pre class="stack">${escapeHtml(stack)}</pre>
          </details>
        </div>
      ` : ""}

      <div class="actions">
        <button class="btn btn-primary" onclick="location.reload()">Reload page</button>
        <button class="btn" onclick="document.querySelectorAll('details').forEach(d => d.open = true)">Show all frames</button>
        <a class="btn" href="/">Go home</a>
      </div>
    </div>
  </div>

  <div class="footer">
    <div>Swift Rust v0.1.0 · dev mode</div>
    <div><a href="https://github.com/swift-rust/swift-rust/issues">Report this error</a></div>
  </div>
</div>
<script>
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") location.reload();
  });
</script>
</body>
</html>`;
}
