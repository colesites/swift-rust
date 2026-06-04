(function () {
  if (typeof window === "undefined" || typeof EventSource === "undefined") return;
  var lastError = null;
  var es = new EventSource("/_swift-rust/hmr");

  function showOverlay(message) {
    hideOverlay();
    var el = document.createElement("div");
    el.id = "__swift_rust_overlay__";
    el.style.cssText =
      "position:fixed;left:0;right:0;bottom:0;background:#ef4444;color:#fff;" +
      "padding:14px 20px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;" +
      "font-size:13px;line-height:1.5;z-index:2147483647;border-top:2px solid #b91c1c;" +
      "box-shadow:0 -4px 12px rgba(0,0,0,0.2);display:flex;align-items:flex-start;gap:12px;";
    var icon = document.createElement("strong");
    icon.textContent = "●";
    icon.style.cssText = "color:#fff;opacity:0.9;flex-shrink:0;";
    var text = document.createElement("div");
    text.style.cssText = "flex:1;white-space:pre-wrap;word-break:break-word;";
    text.textContent = message;
    el.appendChild(icon);
    el.appendChild(text);
    document.body.appendChild(el);
  }

  function hideOverlay() {
    var old = document.getElementById("__swift_rust_overlay__");
    if (old) old.remove();
  }

  function showToast(message) {
    var el = document.createElement("div");
    el.style.cssText =
      "position:fixed;bottom:16px;right:16px;background:#0a0a0a;color:#fff;" +
      "padding:8px 14px;border-radius:6px;font-family:ui-monospace,monospace;" +
      "font-size:12px;z-index:2147483647;opacity:0;transition:opacity 0.2s;";
    el.textContent = message;
    document.body.appendChild(el);
    requestAnimationFrame(function () {
      el.style.opacity = "1";
    });
    setTimeout(function () {
      el.style.opacity = "0";
      setTimeout(function () { el.remove(); }, 300);
    }, 1800);
  }

  es.addEventListener("change", function (e) {
    try {
      var data = JSON.parse(e.data);
      if (data.type === "reload") {
        showToast("↻ Reloading…");
        setTimeout(function () { location.reload(); }, 100);
      } else if (data.type === "error") {
        lastError = data.message;
        showOverlay("[swift-rust] " + data.message);
      } else if (data.type === "ok") {
        if (lastError) {
          hideOverlay();
          lastError = null;
          showToast("✓ Recovered");
        }
      }
    } catch (err) {
      console.error("[swift-rust] bad HMR payload", err);
    }
  });

  es.addEventListener("error", function () {
    setTimeout(function () {
      if (es.readyState === EventSource.CLOSED) {
        console.warn("[swift-rust] HMR connection lost, retrying…");
        location.reload();
      }
    }, 1000);
  });

  // ── Dev widget: a tab peeking from the left edge; hover to open. ──────────
  function mountDevWidget() {
    if (document.getElementById("__sr_devwidget")) return;
    var connected = true;
    var wrap = document.createElement("div");
    wrap.id = "__sr_devwidget";
    wrap.setAttribute("data-sr-dev", "");
    wrap.style.cssText =
      "position:fixed;left:0;top:50%;transform:translateY(-50%) translateX(-188px);" +
      "z-index:2147483646;display:flex;align-items:stretch;height:auto;" +
      "font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;" +
      "transition:transform .22s cubic-bezier(.4,0,.2,1);will-change:transform;";

    // Panel (the part that slides out)
    var panel = document.createElement("div");
    panel.style.cssText =
      "width:188px;background:#0a0a0a;color:#fafafa;border:1px solid #262626;border-left:none;" +
      "border-radius:0 12px 12px 0;padding:12px 14px;box-shadow:0 8px 30px rgba(0,0,0,.45);" +
      "font-size:12px;line-height:1.5;";
    function row(label, value, valColor) {
      var r = document.createElement("div");
      r.style.cssText = "display:flex;justify-content:space-between;gap:10px;margin:3px 0;";
      var l = document.createElement("span");
      l.textContent = label;
      l.style.cssText = "color:#a3a3a3;";
      var v = document.createElement("span");
      v.textContent = value;
      v.style.cssText = "color:" + (valColor || "#fafafa") + ";font-weight:500;max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";
      r.appendChild(l); r.appendChild(v);
      return r;
    }
    var title = document.createElement("div");
    title.textContent = "swift·rust dev";
    title.style.cssText = "font-weight:600;letter-spacing:-.01em;margin-bottom:8px;color:#fb923c;";
    var statusRow = row("status", "● connected", "#4ade80");
    var routeRow = row("route", location.pathname, "#fafafa");
    panel.appendChild(title);
    panel.appendChild(statusRow);
    panel.appendChild(routeRow);
    panel.appendChild(row("reload", "on save", "#a3a3a3"));

    // Tab (always visible, peeking ~28px)
    var tab = document.createElement("button");
    tab.type = "button";
    tab.setAttribute("aria-label", "swift-rust dev tools");
    tab.style.cssText =
      "width:28px;background:#fb923c;border:none;border-radius:0 10px 10px 0;cursor:pointer;" +
      "display:flex;align-items:center;justify-content:center;padding:14px 0;";
    tab.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="1.8" stroke-linecap="round">' +
      '<circle cx="12" cy="12" r="4.7"/>' +
      '<path d="M12 3.3v1.9M12 18.8v1.9M3.3 12h1.9M18.8 12h1.9M6 6l1.4 1.4M16.6 16.6l1.4 1.4M6 18l1.4-1.4M16.6 7.4l1.4-1.4"/>' +
      '<path d="M13.3 6.8 L8.9 12.6 H11.5 L10.7 16.6 L15.1 10.8 H12.5 Z" fill="#0a0a0a" stroke="none"/></svg>';

    wrap.appendChild(panel);
    wrap.appendChild(tab);
    document.body.appendChild(wrap);

    function open() { wrap.style.transform = "translateY(-50%) translateX(0)"; }
    function close() { wrap.style.transform = "translateY(-50%) translateX(-188px)"; }
    wrap.addEventListener("mouseenter", open);
    wrap.addEventListener("mouseleave", close);
    tab.addEventListener("click", function () {
      // toggle pinned-open on click
      if (wrap.style.transform.indexOf("translateX(0") !== -1) close(); else open();
    });

    // keep status fresh
    window.__sr_setStatus = function (ok) {
      connected = ok;
      statusRow.replaceWith((statusRow = row("status", ok ? "● connected" : "● offline", ok ? "#4ade80" : "#f87171")));
    };
  }
  if (document.body) mountDevWidget();
  else document.addEventListener("DOMContentLoaded", mountDevWidget);
})();
