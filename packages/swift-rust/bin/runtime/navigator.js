// Swift-Rust client navigator — turns full-page loads into SPA navigation for
// <a>/<Link>. Intercepts same-origin clicks, fetches the destination HTML,
// swaps <body>, re-runs body scripts (island bootstrap + serialized state),
// syncs <title>/meta, and manages history. Ships in dev and in the build
// output (NOT dev-only like the HMR client).
(() => {
  if (window.__SR_NAV__) return;
  const nav = (window.__SR_NAV__ = { cache: new Map(), inflight: new Map() });
  const ORIGIN = location.origin;
  const MAX_CACHE = 32;

  function internalAnchor(a) {
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return null;
    if (a.dataset.srNoNav !== undefined) return null;
    const raw = a.getAttribute("href");
    if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:")) return null;
    let url;
    try {
      url = new URL(a.href, location.href);
    } catch {
      return null;
    }
    if (url.origin !== ORIGIN) return null;
    return url;
  }

  function remember(key, html) {
    if (nav.cache.size >= MAX_CACHE) nav.cache.delete(nav.cache.keys().next().value);
    nav.cache.set(key, html);
  }

  // Fetch (and cache) a route's HTML. Deduped per URL so prefetch + click share.
  function fetchDoc(url) {
    const key = url;
    if (nav.cache.has(key)) return Promise.resolve(nav.cache.get(key));
    if (nav.inflight.has(key)) return nav.inflight.get(key);
    const p = fetch(url, { headers: { "x-swift-rust-nav": "1" }, credentials: "same-origin" })
      .then((res) => {
        if (!res.ok && res.status !== 404) throw new Error("nav fetch " + res.status);
        return res.text();
      })
      .then((html) => {
        remember(key, html);
        nav.inflight.delete(key);
        return html;
      })
      .catch((err) => {
        nav.inflight.delete(key);
        throw err;
      });
    nav.inflight.set(key, p);
    return p;
  }
  nav.prefetch = (url) => fetchDoc(new URL(url, location.href).href).catch(() => {});

  // Scripts inserted via DOM cloning don't execute; clone them into fresh nodes.
  function runScripts(root) {
    for (const old of root.querySelectorAll("script")) {
      const s = document.createElement("script");
      for (const att of old.attributes) s.setAttribute(att.name, att.value);
      s.textContent = old.textContent;
      old.replaceWith(s);
    }
  }

  function syncHead(doc) {
    const title = doc.querySelector("title");
    if (title) document.title = title.textContent || document.title;
    const selectors = ['meta[name="description"]', 'meta[property^="og:"]', 'meta[name^="twitter:"]', 'link[rel="canonical"]'];
    for (const sel of selectors) {
      document.head.querySelectorAll(sel).forEach((m) => m.remove());
      doc.head.querySelectorAll(sel).forEach((m) => document.head.appendChild(m.cloneNode(true)));
    }
  }

  // pending.tsx overlay: revealed only if a navigation outlasts the threshold,
  // so fast (cached) navigations don't flash it.
  let pendingTimer = null;
  function showPending() {
    const el = document.getElementById("__sr-pending");
    if (el) el.hidden = false;
  }
  function clearPending() {
    if (pendingTimer) {
      clearTimeout(pendingTimer);
      pendingTimer = null;
    }
    const el = document.getElementById("__sr-pending");
    if (el) el.hidden = true;
  }

  async function navigate(href, { push = true, scroll = true, replace = false } = {}) {
    let html;
    nav.active = href;
    if (pendingTimer) clearTimeout(pendingTimer);
    const delay = typeof window.__SR_NAV_PENDING_DELAY === "number" ? window.__SR_NAV_PENDING_DELAY : 120;
    pendingTimer = setTimeout(showPending, delay);
    window.dispatchEvent(new CustomEvent("sr:navigate-start", { detail: { url: href } }));
    try {
      html = await fetchDoc(href);
    } catch {
      location.href = href; // hard fallback
      return;
    }
    if (nav.active !== href) return; // superseded by a newer navigation
    const doc = new DOMParser().parseFromString(html, "text/html");
    if (!doc.body) {
      location.href = href;
      return;
    }
    document.body.replaceWith(doc.body);
    runScripts(document.body);
    syncHead(doc);
    if (push) {
      if (replace) history.replaceState({ srNav: true }, "", href);
      else history.pushState({ srNav: true }, "", href);
    }
    if (scroll) window.scrollTo(0, 0);
    clearPending();
    window.dispatchEvent(new CustomEvent("sr:navigate-end", { detail: { url: href } }));
  }
  nav.navigate = navigate;

  document.addEventListener(
    "click",
    (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest("a");
      const url = internalAnchor(a);
      if (!url) return;
      e.preventDefault();
      if (url.href === location.href) return;
      navigate(url.href, {
        push: true,
        scroll: a.dataset.srScroll !== "false",
        replace: a.dataset.srReplace === "true",
      });
    },
    false,
  );

  window.addEventListener("popstate", () => {
    navigate(location.href, { push: false, scroll: false });
  });

  // ── Prefetch (prefetch.ts) ────────────────────────────────────────────────
  // Strategy comes from the per-route prefetch.ts, injected as
  // window.__SR_PREFETCH__ = { strategy, margin? }. Default: "hover".
  // Per-link opt-out via data-sr-prefetch="false".
  function strategy() {
    const c = window.__SR_PREFETCH__;
    return (c && c.strategy) || "hover";
  }
  function prefetchableURL(a) {
    if (!a || a.dataset.srPrefetch === "false") return null;
    return internalAnchor(a);
  }
  function intent(e) {
    if (strategy() !== "hover") return;
    const a = e.target.closest && e.target.closest("a");
    const url = prefetchableURL(a);
    if (url && url.href !== location.href) nav.prefetch(url.href);
  }
  document.addEventListener("mouseover", intent, { passive: true });
  document.addEventListener("focusin", intent);
  document.addEventListener("touchstart", intent, { passive: true });

  let io = null;
  function scanViewport() {
    if (io) {
      io.disconnect();
      io = null;
    }
    if (strategy() !== "viewport" || !("IntersectionObserver" in window)) return;
    const margin = (window.__SR_PREFETCH__ && window.__SR_PREFETCH__.margin) || "200px";
    io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          const url = prefetchableURL(en.target);
          if (url && url.href !== location.href) nav.prefetch(url.href);
          io.unobserve(en.target);
        }
      },
      { rootMargin: margin },
    );
    document.querySelectorAll("a[href]").forEach((a) => {
      if (prefetchableURL(a)) io.observe(a);
    });
  }
  window.addEventListener("sr:navigate-end", scanViewport);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scanViewport, { once: true });
  } else {
    scanViewport();
  }
})();
