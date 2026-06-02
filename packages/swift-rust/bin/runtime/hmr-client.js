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
})();
