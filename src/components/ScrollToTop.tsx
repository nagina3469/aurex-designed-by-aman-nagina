import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { lenisInstance } from '../lib/lenis';

/** React Router doesn't reset scroll on navigation by default. */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return; // let the browser handle in-page anchors
    // Go through Lenis (immediate, not smoothed) when it's mounted, rather
    // than a raw `window.scrollTo` — Lenis re-syncs from real scroll
    // position every frame regardless, but routing this through it avoids
    // a one-frame fight between the two on the very next raf tick.
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
