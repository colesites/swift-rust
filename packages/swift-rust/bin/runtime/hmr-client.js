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

  // The server sends *unnamed* SSE messages whose payload is an envelope:
  //   data: {"event":"change","data":{"type":"reload",...}}
  // An unnamed SSE message fires the browser's default "message" event — NOT a
  // named "change" event. Listening only on addEventListener("change") meant the
  // handler never fired, so the browser never reloaded and you had to refresh by
  // hand. We listen on "message" (and "change", for forward-compat) and unwrap
  // the envelope, tolerating both the enveloped and flat payload shapes.
  function handlePayload(raw) {
    try {
      var msg = JSON.parse(raw);
      var data = msg && msg.event && msg.data ? msg.data : msg;
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
  }
  es.addEventListener("message", function (e) { handlePayload(e.data); });
  es.addEventListener("change", function (e) { handlePayload(e.data); });

  es.addEventListener("open", function () {
    if (window.__sr_setStatus) window.__sr_setStatus(true);
  });

  es.addEventListener("error", function () {
    if (window.__sr_setStatus) window.__sr_setStatus(false);
    setTimeout(function () {
      if (es.readyState === EventSource.CLOSED) {
        console.warn("[swift-rust] HMR connection lost, retrying…");
        location.reload();
      }
    }, 1000);
  });

  // ── Dev indicator: a sleek, glassy button at the bottom-left (Next.js-style).
  //    Click to toggle a popover with route / status / version info. ─────────
  function mountDevWidget() {
    if (document.getElementById("__sr_devwidget")) return;

    var root = document.createElement("div");
    root.id = "__sr_devwidget";
    root.setAttribute("data-sr-dev", "");
    root.style.cssText =
      "position:fixed;left:16px;bottom:16px;z-index:2147483646;" +
      "font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;" +
      "color-scheme:dark;";

    var glass =
      "background:rgba(10,10,10,0.55);-webkit-backdrop-filter:blur(12px) saturate(160%);" +
      "backdrop-filter:blur(12px) saturate(160%);border:1px solid rgba(255,255,255,0.12);";

    // Popover (hidden by default, opens above the button)
    var pop = document.createElement("div");
    pop.style.cssText =
      glass +
      "position:absolute;left:0;bottom:46px;width:236px;border-radius:14px;padding:12px;" +
      "box-shadow:0 12px 40px rgba(0,0,0,0.5);color:#ededed;font-size:12px;line-height:1.5;" +
      "opacity:0;transform:translateY(6px) scale(.97);pointer-events:none;transform-origin:bottom left;" +
      "transition:opacity .16s ease,transform .16s ease;";
    function row(label, value, color) {
      var r = document.createElement("div");
      r.style.cssText = "display:flex;justify-content:space-between;gap:12px;padding:5px 4px;";
      var l = document.createElement("span");
      l.textContent = label; l.style.cssText = "color:#8f8f8f;";
      var v = document.createElement("span");
      v.textContent = value;
      v.style.cssText = "color:" + (color || "#ededed") + ";font-weight:500;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";
      r.appendChild(l); r.appendChild(v);
      return { el: r, set: function (t, c) { v.textContent = t; if (c) v.style.color = c; } };
    }
    var head = document.createElement("div");
    head.style.cssText = "display:flex;align-items:center;gap:7px;padding:2px 4px 8px;border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:4px;";
    head.innerHTML =
      '<span style="display:inline-flex;width:18px;height:18px;border-radius:5px;background:#fb923c;align-items:center;justify-content:center;">' +
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.7"/><path d="M13.3 6.8 L8.9 12.6 H11.5 L10.7 16.6 L15.1 10.8 H12.5 Z" fill="#0a0a0a" stroke="none"/></svg></span>' +
      '<span style="font-weight:600;color:#fafafa;">Swift Rust</span>' +
      '<span style="margin-left:auto;font-size:10px;color:#8f8f8f;">dev</span>';
    var statusRow = row("Status", "Connected", "#4ade80");
    var routeRow = row("Route", location.pathname);
    var saveRow = row("Hot reload", "On save", "#8f8f8f");
    pop.appendChild(head);
    pop.appendChild(statusRow.el);
    pop.appendChild(routeRow.el);
    pop.appendChild(saveRow.el);

    // Button (the always-visible trigger)
    var btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-label", "Swift Rust dev tools");
    btn.style.cssText =
      glass +
      "display:flex;align-items:center;gap:8px;height:34px;padding:0 11px;border-radius:999px;" +
      "cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.35);transition:transform .12s ease,background .2s ease;";
    btn.onmouseenter = function () { btn.style.transform = "translateY(-1px)"; };
    btn.onmouseleave = function () { btn.style.transform = "none"; };
    var dot = document.createElement("span");
    dot.style.cssText = "width:8px;height:8px;border-radius:999px;background:#4ade80;box-shadow:0 0 8px #4ade80;flex-shrink:0;";
    var mark = document.createElement("span");
    mark.style.cssText = "display:inline-flex;width:18px;height:18px;align-items:center;justify-content:center;";
    mark.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fb923c" stroke-width="1.8" stroke-linecap="round">' +
      '<circle cx="12" cy="12" r="4.7"/>' +
      '<path d="M12 3.3v1.9M12 18.8v1.9M3.3 12h1.9M18.8 12h1.9M6 6l1.4 1.4M16.6 16.6l1.4 1.4M6 18l1.4-1.4M16.6 7.4l1.4-1.4"/>' +
      '<path d="M13.3 6.8 L8.9 12.6 H11.5 L10.7 16.6 L15.1 10.8 H12.5 Z" fill="#fb923c" stroke="none"/></svg>';
    btn.appendChild(dot);
    btn.appendChild(mark);

    root.appendChild(pop);
    root.appendChild(btn);
    document.body.appendChild(root);

    var openState = false;
    function setOpen(v) {
      openState = v;
      pop.style.opacity = v ? "1" : "0";
      pop.style.transform = v ? "translateY(0) scale(1)" : "translateY(6px) scale(.97)";
      pop.style.pointerEvents = v ? "auto" : "none";
    }
    btn.addEventListener("click", function (e) { e.stopPropagation(); setOpen(!openState); });
    document.addEventListener("click", function () { if (openState) setOpen(false); });
    pop.addEventListener("click", function (e) { e.stopPropagation(); });

    window.__sr_setStatus = function (ok) {
      dot.style.background = ok ? "#4ade80" : "#f87171";
      dot.style.boxShadow = "0 0 8px " + (ok ? "#4ade80" : "#f87171");
      statusRow.set(ok ? "Connected" : "Disconnected", ok ? "#4ade80" : "#f87171");
    };
  }
  if (document.body) mountDevWidget();
  else document.addEventListener("DOMContentLoaded", mountDevWidget);
})();
