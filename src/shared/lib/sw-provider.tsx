"use client";

import { useEffect } from "react";

export function SWProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("serviceWorker" in navigator) {
      // Register service worker for offline cache
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => {
          // noop; optional logging
        });
    }
  }, []);
  return null;
}

