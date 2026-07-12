import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { setLenisInstance } from '../lib/lenis';
import { prefersReducedMotion } from '../lib/reducedMotion';

/**
 * Site-wide smooth scroll. Lenis wraps the browser's own scroll (not a
 * virtual/transform-based one), so `position: sticky`, anchor links, and
 * every existing scroll-position read in this codebase (Nav's background
 * sampling, FeatureShowcase's active-item tracking, ScrollProgress) keep
 * working unchanged — they all read real `window.scrollY`/
 * `getBoundingClientRect`, which Lenis updates every frame via its own
 * internal rAF loop (`autoRaf: true`).
 */
export default function SmoothScroll() {
  useEffect(() => {
    // Leave native scroll untouched for reduced-motion users instead of
    // easing every scroll through Lenis's own inertia curve.
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });
    setLenisInstance(lenis);

    return () => {
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return null;
}
