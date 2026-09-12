"use client";

import { useEffect } from "react";

const INTERACTIVE_SELECTOR = "a, button, [role='button'], [onclick]";

export default function ClickTracker() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const pathname = window.location.pathname;
      if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
        return;
      }

      const target = event.target instanceof Element ? event.target.closest(INTERACTIVE_SELECTOR) : null;
      if (!target) {
        return;
      }

      fetch("/api/track/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathname }),
        keepalive: true,
      }).catch(() => {});
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
