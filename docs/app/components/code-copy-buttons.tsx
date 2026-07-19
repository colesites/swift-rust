"use client";

import { useEffect } from "react";

const COPY_ICON_PATHS = [
  ["rect", { x: "9", y: "9", width: "13", height: "13", rx: "2" }],
  ["path", { d: "M5 15V5a2 2 0 0 1 2-2h10" }],
] as const;

const CHECK_ICON_PATHS = [
  ["path", { d: "M20 6 9 17l-5-5", "stroke-linecap": "round", "stroke-linejoin": "round" }],
] as const;

function setIcon(button: HTMLButtonElement, copied: boolean) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("aria-hidden", "true");

  for (const [tag, attributes] of copied ? CHECK_ICON_PATHS : COPY_ICON_PATHS) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
    svg.append(element);
  }

  button.replaceChildren(svg);
}

function addCopyButton(pre: HTMLPreElement) {
  if (!pre.querySelector(":scope > .code-copy-button")) {
    const button = document.createElement("button");
    let resetTimer: ReturnType<typeof setTimeout> | undefined;

    button.type = "button";
    button.className = "code-copy-button";
    button.setAttribute("aria-label", "Copy code");
    button.title = "Copy code";
    setIcon(button, false);

    button.addEventListener("click", async () => {
      const code = pre.querySelector("code")?.textContent ?? pre.textContent ?? "";

      try {
        await navigator.clipboard.writeText(code);
        button.setAttribute("aria-label", "Code copied");
        button.title = "Copied";
        button.dataset.copied = "true";
        setIcon(button, true);
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          button.setAttribute("aria-label", "Copy code");
          button.title = "Copy code";
          delete button.dataset.copied;
          setIcon(button, false);
        }, 1600);
      } catch {
        button.setAttribute("aria-label", "Unable to copy code");
        button.title = "Unable to copy";
      }
    });

    pre.prepend(button);
  }
}

export function CodeCopyButtons() {
  useEffect(() => {
    const enhanceCodeBlocks = () => {
      for (const pre of document.querySelectorAll<HTMLPreElement>("pre")) addCopyButton(pre);
    };

    enhanceCodeBlocks();

    const observer = new MutationObserver(enhanceCodeBlocks);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
