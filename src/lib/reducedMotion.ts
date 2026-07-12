/** True if the user has requested reduced motion at the OS level. Read once at
 * call time — the media query itself doesn't change mid-session in practice,
 * and none of the call sites here are in a render path that needs to react
 * to it changing live. */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
