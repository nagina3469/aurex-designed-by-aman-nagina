import type Lenis from 'lenis';

/**
 * Single shared Lenis instance, set by <SmoothScroll/> at the app root.
 * Exported as a mutable ref (not React context) so non-component code —
 * e.g. `ScrollToTop`'s route-change handler — can call `.scrollTo()`
 * directly without prop-drilling or a provider.
 */
export let lenisInstance: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
}
