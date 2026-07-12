import { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Magnetic from './ui/Magnetic';
import { lenisInstance } from '../lib/lenis';

/** Same reasoning as Nav.tsx's wordmark: `ScrollToTop` only fires on a
 * pathname change, so clicking this while already on "/" wouldn't move
 * the page otherwise. */
function scrollToHero() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo(0, 0);
  }
}

/** Live local clock — isolated + memoized so the 1s interval never re-renders the footer tree. */
const LocalTime = memo(function LocalTime() {
  const [time, setTime] = useState('');

  useEffect(() => {
    function update() {
      setTime(
        new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      );
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="tabular-nums">{time}</span>;
});

const FOOTER_LINKS = [
  {
    heading: 'Explore',
    links: [
      { label: 'The Build', href: '/#the-build' },
      { label: 'Specs', to: '/specs' },
      { label: 'Reserve', href: '/#reserve' },
    ],
  },
  { heading: 'Company', links: [{ label: 'See the build', href: '/#the-build' }, { label: 'Journal', href: '#' }, { label: 'Support', href: '#' }] },
  // Real links out to the designer's own profiles, not in-universe ULLR
  // accounts — this is a portfolio case study, not an actual brand, so
  // "Social" here means "where to find the person who built this."
  {
    heading: 'Social',
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/amannagina_' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/amannagina/' },
      { label: 'Behance', href: 'https://www.behance.net/amannagina' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-ink text-[#F4EFE4] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-20 sm:pt-24 pb-10">
        {/* top row — link columns + coordinates */}
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-20 sm:mb-28">
          <div className="max-w-[260px]">
            <Link
              to="/"
              onClick={scrollToHero}
              className="inline-block font-display font-bold text-[20px] tracking-[0.08em] mb-4 hover:opacity-80 transition-opacity duration-200"
            >
              ULLR<span className="text-copper-bright">.</span>
            </Link>
            <p className="text-[13px] leading-relaxed text-[#F4EFE4]/50">
              An electric adventure-tourer with nothing hidden. Concept portfolio project.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-16">
            {FOOTER_LINKS.map((col) => (
              <div key={col.heading}>
                <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#F4EFE4]/40 mb-4">
                  {col.heading}
                </div>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.to ? (
                        <Link
                          to={link.to}
                          className="group relative inline-block text-[13.5px] font-medium text-[#F4EFE4]/75 hover:text-[#F4EFE4] transition-colors duration-200"
                        >
                          {link.label}
                          <span className="absolute left-0 -bottom-0.5 h-px w-full bg-copper-bright origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          // Placeholder links (`#`) used to jump-scroll the
                          // page to top on click, which reads as broken
                          // rather than "not built yet" — this stops that
                          // without pretending the destination exists.
                          onClick={link.href === '#' ? (e) => e.preventDefault() : undefined}
                          aria-disabled={link.href === '#' || undefined}
                          target={link.href?.startsWith('http') ? '_blank' : undefined}
                          rel={link.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className={`group relative inline-block text-[13.5px] font-medium transition-colors duration-200 ${
                            link.href === '#'
                              ? 'text-[#F4EFE4]/40 cursor-default'
                              : 'text-[#F4EFE4]/75 hover:text-[#F4EFE4]'
                          }`}
                        >
                          {link.label}
                          {link.href !== '#' && (
                            <span className="absolute left-0 -bottom-0.5 h-px w-full bg-copper-bright origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                          )}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Magnetic strength={10} className="self-start">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className="flex items-center justify-center w-14 h-14 rounded-full border border-[#F4EFE4]/25 text-[#F4EFE4]/75 text-[18px] hover:bg-[#F4EFE4] hover:text-ink hover:border-[#F4EFE4] transition-colors duration-200"
            >
              ↑
            </button>
          </Magnetic>
        </div>

        {/* giant wordmark */}
        <div aria-hidden className="select-none pointer-events-none -mb-1 sm:-mb-2">
          <div className="font-display font-bold tracking-tight leading-[0.8] text-[clamp(60px,12vw,190px)] text-[#F4EFE4]/[0.12] whitespace-nowrap">
            ULLR
          </div>
        </div>

        {/* legal row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F4EFE4]/15 pt-6 font-mono text-[11px] tracking-[0.06em] text-[#F4EFE4]/45">
          <span>© 2026 ULLR MOTO — CONCEPT PORTFOLIO PROJECT</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-copper-bright animate-pulse" />
            LOCAL TIME — <LocalTime />
          </span>
          <a
            href="https://amannagina.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#F4EFE4] transition-colors duration-200"
          >
            DESIGNED BY AMAN NAGINA
          </a>
        </div>
      </div>
    </footer>
  );
}
