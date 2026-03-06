"use client";

import { useEffect } from "react";

interface HtmlContentScriptsProps {
  containerId: string;
}

export default function HtmlContentScripts({
  containerId,
}: HtmlContentScriptsProps) {
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const scripts = container.querySelectorAll("script");

    scripts.forEach((script) => {
      const replacement = document.createElement("script");

      Array.from(script.attributes).forEach((attribute) => {
        replacement.setAttribute(attribute.name, attribute.value);
      });

      replacement.text = script.text;
      script.replaceWith(replacement);
    });
  }, [containerId]);

  return null;
}
