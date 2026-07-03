"use client";

import { useEffect, useState } from "react";

// Auto-advancing index for the product image carousel (4.2s like the design).
// Pauses for prefers-reduced-motion. Returns the active index and a setter
// (the setter restarts the timer by virtue of the effect dependency).
export function useCarousel(length: number, intervalMs = 4200) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % length),
      intervalMs
    );
    return () => clearInterval(id);
  }, [length, intervalMs, index]);

  return { index, setIndex };
}
