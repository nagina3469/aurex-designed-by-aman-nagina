import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Magnetic from './ui/Magnetic';
import { lenisInstance } from '../lib/lenis';

/** `ScrollToTop` only resets scroll on a pathname change — clicking the
 * wordmark while already on "/" navigates to the same path, so that
 * effect never re-fires and the page doesn't move. This scrolls back to
 * the hero directly, independent of whether the route actually changes. */
function scrollToHero() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo(0, 0);
  }
}

type NavProps = {
  loaded?: boolean;
};

const LEFT_LINK = { label: 'The Build', href: '/#the-build' };
// "Specs" is the only other real destination — a "Support" link used to
// live here pointing at `/#reserve`, the exact same place the Reserve
// button already goes. That mislabeling (clicking "Support" landing you
// on a sales pitch) was worse than just not having the link.
const RIGHT_LINKS = [{ label: 'Specs', to: '/specs' }];

export default function Nav({ loaded = true }: NavProps) {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  // Nav is always transparent (background only ever shows on hover), so it
  // has to read whatever's actually behind it and flip between cream text
  // (over dark photo/video/ink sections) and ink text (over the site's
  // light bg-bg/bg-surface sections) — otherwise cream-on-light or
  // ink-on-dark goes unreadable. Sampled generically (walk up from
  // elementFromPoint for the first opaque background-color, compute its
  // luminance) rather than hardcoded per-section, so it keeps working as
  // sections are added/reordered.
  const [onLight, setOnLight] = useState(false);

  useEffect(() => {
    let rafId = 0;
    let scheduled = false;

    function sample() {
      scheduled = false;
      const nav = navRef.current;
      if (!nav) return;
      const prevPointerEvents = nav.style.pointerEvents;
      nav.style.pointerEvents = 'none';
      const el = document.elementFromPoint(window.innerWidth / 2, 36);
      nav.style.pointerEvents = prevPointerEvents;
      if (!el) return;

      let node: Element | null = el;
      let bg: string | null = null;
      while (node && node !== document.documentElement) {
        const c = getComputedStyle(node).backgroundColor;
        if (c && c !== 'transparent' && c !== 'rgba(0, 0, 0, 0)') {
          bg = c;
          break;
        }
        node = node.parentElement;
      }

      const match = bg?.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        const [r, g, b] = [Number(match[1]), Number(match[2]), Number(match[3])];
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        setOnLight(luminance > 0.6);
      }
    }

    function onScroll() {
      if (!scheduled) {
        scheduled = true;
        rafId = requestAnimationFrame(sample);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    sample();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Close the mobile menu on route change / resize back to desktop, so it
  // can't be left open and stranded across navigation.
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 640) setMenuOpen(false);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const linkClass = `hidden sm:inline-block rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors duration-200 ${
    onLight
      ? 'text-ink/70 hover:text-ink hover:bg-ink/8'
      : 'text-[#F4EFE4]/75 hover:text-[#F4EFE4] hover:bg-white/10'
  }`;

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between h-16 sm:h-[72px] px-4 sm:px-8 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
        }`}
      >
        <a href={LEFT_LINK.href} className={linkClass}>
          {LEFT_LINK.label}
        </a>

        {/* Absolutely centered on the viewport (nav is `fixed`, so it's the
            containing block) — independent of how wide the two side groups
            are. Same hover-fill treatment as the plain-text links, so the
            grey backdrop only ever appears on hover, never as a permanent bar. */}
        <Link
          to="/"
          onClick={scrollToHero}
          className={`absolute left-1/2 -translate-x-1/2 rounded-full px-3.5 py-2 font-display font-bold text-[18px] tracking-[0.1em] transition-colors duration-200 ${
            onLight ? 'text-ink hover:bg-ink/8' : 'text-[#F4EFE4] hover:bg-white/10'
          }`}
        >
          ULLR
        </Link>

        <div className="flex items-center gap-1 sm:gap-2 ml-auto">
          {RIGHT_LINKS.map((link) => (
            <Link key={link.label} to={link.to} className={linkClass}>
              {link.label}
            </Link>
          ))}

          {/* Mobile-only menu toggle — on desktop the links above are
              already visible, this only exists below `sm:`. Without it
              there was no way to reach the Specs page on mobile short of
              scrolling to the very bottom of the page for the footer
              link. */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className={`sm:hidden relative flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-200 ${
              onLight && !menuOpen ? 'text-ink/70 hover:bg-ink/8' : 'text-[#F4EFE4]/85 hover:bg-white/10'
            }`}
          >
            <span className="relative w-4 h-3">
              <span
                aria-hidden
                className={`absolute left-0 w-4 h-[1.5px] bg-current transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  menuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0 rotate-0'
                }`}
              />
              <span
                aria-hidden
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[1.5px] bg-current transition-opacity duration-200 ${
                  menuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                aria-hidden
                className={`absolute left-0 w-4 h-[1.5px] bg-current transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  menuOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0 rotate-0'
                }`}
              />
            </span>
          </button>

          <Magnetic strength={6}>
            <a
              href="/#reserve"
              className="ml-1 inline-block rounded-full bg-copper text-[#F4EFE4] px-4 sm:px-5 py-2 sm:py-2.5 text-[13px] font-semibold whitespace-nowrap transition-[filter,transform] duration-150 hover:brightness-110 active:scale-[0.98]"
            >
              Reserve →
            </a>
          </Magnetic>
        </div>
      </nav>

      {/* Full-screen mobile menu overlay */}
      <div
        aria-hidden={!menuOpen}
        className={`sm:hidden fixed inset-0 z-40 bg-ink transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col justify-center h-full px-8 gap-2">
          {[LEFT_LINK, ...RIGHT_LINKS.map((l) => ({ label: l.label, to: l.to }))].map((link, i) => (
            <span key={link.label} className="overflow-hidden">
              {'to' in link && link.to ? (
                <Link
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`block font-display font-semibold text-[15vw] leading-[1.15] text-[#F4EFE4] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    menuOpen ? 'translate-y-0' : 'translate-y-full'
                  }`}
                  style={{ transitionDelay: menuOpen ? `${i * 60}ms` : '0ms' }}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  href={(link as { href: string }).href}
                  onClick={() => setMenuOpen(false)}
                  className={`block font-display font-semibold text-[15vw] leading-[1.15] text-[#F4EFE4] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    menuOpen ? 'translate-y-0' : 'translate-y-full'
                  }`}
                  style={{ transitionDelay: menuOpen ? `${i * 60}ms` : '0ms' }}
                >
                  {link.label}
                </a>
              )}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
