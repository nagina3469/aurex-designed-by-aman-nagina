import { useEffect, useRef, useState } from 'react';
import Reveal from './ui/Reveal';

const FEATURES = [
  {
    label: 'Nothing hidden',
    value: '140 km range',
    caption: 'The battery pack is structural, not concealed.',
    image: '/images/studio-three-quarter.jpg',
  },
  {
    label: '42 kW on tap',
    value: 'Peak power',
    caption: 'Instant torque, zero drivetrain lag.',
    image: '/images/studio-rear-three-quarter-1.jpg',
  },
  {
    label: '128 kg, no excess',
    value: 'Dry weight',
    caption: 'Every gram justified by the exposed frame.',
    image: '/images/gallery-frame-detail.jpg',
  },
  {
    label: '3.4 sec to 80 km/h',
    value: '0–80 km/h',
    caption: 'No gearbox to hesitate through.',
    image: '/images/forest-action-1.jpg',
  },
  {
    label: '38 minute charge',
    value: '10–80%',
    caption: "10 to 80 percent before your coffee's cold.",
    image: '/images/studio-headlight-detail.jpg',
  },
  {
    label: '310 mm clearance',
    value: 'Ground clearance',
    caption: 'Built for terrain, not just tarmac.',
    image: '/images/forest-action-2.jpg',
  },
];

/** small blueprint-style corner tick */
function CornerTick({ className }: { className: string }) {
  return (
    <span aria-hidden className={`absolute font-mono text-[13px] leading-none text-[#F4EFE4]/50 ${className}`}>
      +
    </span>
  );
}

export default function FeatureShowcase() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [railPct, setRailPct] = useState(0);

  // Which item is "active" is driven by scroll progress through the sticky
  // card's own pin range (wrap height minus one viewport), not by which
  // item's center is nearest the viewport middle. The center-proximity
  // approach looked right in principle but couldn't actually reach the
  // last item while still pinned: with 6 items at min-h-[22vh] each, the
  // span between item 1's center-crossing and item 6's center-crossing is
  // roughly 110vh, while the sticky's actual pin window (wrap height minus
  // one viewport) is only on the order of 30-40vh — so the card started
  // unpinning and scrolling away well before the last item or two ever got
  // their turn. Progress-based indexing guarantees the full 0..1 range
  // (and therefore every item, including the last) is covered exactly
  // within the pin window, matching the scroll-scrub approach already used
  // in `IntroHero.tsx`.
  useEffect(() => {
    let rafId = 0;
    let scheduled = false;

    function update() {
      scheduled = false;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.min(Math.max(total > 0 ? scrolled / total : 0, 0), 1);

      const index = Math.min(Math.floor(p * FEATURES.length), FEATURES.length - 1);
      setActiveIndex((prev) => (prev === index ? prev : index));
      setRailPct(p * 100);

      // gentle parallax inside the sticky card — image drifts against scroll
      if (imgRef.current) {
        imgRef.current.style.transform = `scale(1.08) translateY(${((p - 0.5) * -5).toFixed(2)}%)`;
      }
    }

    function onScroll() {
      if (!scheduled) {
        scheduled = true;
        rafId = requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // mouse-tracked spotlight on the sticky card — a soft light follows the
  // cursor via CSS custom properties feeding a radial-gradient overlay,
  // pure CSS/transform, no layout-triggering properties touched.
  function handleCardMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--spot-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty('--spot-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }

  return (
    <section id="the-build" className="relative bg-bg scroll-mt-20">
      <div ref={wrapRef} className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col md:flex-row gap-10 md:gap-16">
        {/* Left — scrolling feature list. `overflow-hidden` is scoped to
            just this column rather than the whole section — putting it on
            an ancestor of the sticky image card on the right breaks
            `position: sticky` entirely (a real CSS gotcha: any `overflow`
            other than `visible` on an ancestor between a sticky element
            and its containing block clips its sticking range to that
            ancestor's box), which was cutting the image off mid-scroll
            instead of letting it stay pinned. */}
        <div className="relative md:w-1/3 py-24 sm:py-32 overflow-hidden">
          <Reveal>
            <div className="flex items-baseline justify-between border-b border-line pb-4 mb-2">
              <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-copper-deep">The Build</span>
              <span className="font-mono text-[11px] tracking-[0.08em] text-muted tabular-nums">
                {String(activeIndex + 1).padStart(2, '0')} / {String(FEATURES.length).padStart(2, '0')}
              </span>
            </div>
          </Reveal>

          <div className="relative">
            {/* timeline rail — replaces the flat "01 02 03" index markers
                with a kinetic progress line + per-item dot, closer to a
                scrollytelling progress indicator than a plain list */}
            <div className="absolute left-[3px] top-0 bottom-0 w-px bg-line" />
            <div
              className="absolute left-[3px] top-0 w-px bg-copper"
              style={{ height: `${railPct}%` }}
            />

            {FEATURES.map((f, i) => (
              <div key={f.label} className="relative min-h-[22vh] flex items-center gap-6 pl-8 border-b border-line/60">
                <span
                  aria-hidden
                  className={`absolute left-0 top-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    i === activeIndex ? 'w-[9px] h-[9px] bg-copper' : 'w-[7px] h-[7px] bg-ink/15'
                  }`}
                />
                {/* Active item rises into place from below (translate-y)
                    rather than just sliding sideways — reads as each name
                    "arriving" as its turn comes up, matching the sticky
                    photo's own crossfade timing. */}
                <div>
                  <div
                    className={`font-display font-semibold text-[28px] sm:text-[38px] leading-tight tracking-tight transition-[color,transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      i === activeIndex
                        ? 'text-ink translate-y-0 opacity-100'
                        : 'text-ink/25 translate-y-2 opacity-70'
                    }`}
                  >
                    {f.label}
                  </div>
                  <div
                    className={`overflow-hidden transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] grid ${
                      i === activeIndex ? 'grid-rows-[1fr] mt-1.5' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="min-h-0">
                      <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-copper">
                        {f.value}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — sticky media card (sticky only applies once side-by-side
            on md+). Pinned via `md:sticky` while the taller left column
            (flex sibling, so it stretches to the same height) scrolls past
            underneath — releases naturally once the last item clears, no
            extra JS needed for that hand-off. */}
        <div className="md:w-2/3">
          <div className="md:sticky md:top-0 md:min-h-screen flex items-center py-6 md:py-8">
            <div
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              className="group relative w-full aspect-[4/5] sm:aspect-[3/4] md:aspect-auto md:h-[85vh] rounded-3xl overflow-hidden shadow-[0_40px_70px_-30px_rgba(34,31,23,0.35)] ring-1 ring-ink/5"
            >
              <img
                ref={imgRef}
                key={activeIndex}
                src={FEATURES[activeIndex].image}
                alt={FEATURES[activeIndex].label}
                className="absolute inset-0 w-full h-full object-cover will-change-transform media-fade"
                style={{ transform: 'scale(1.08)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />

              {/* mouse-tracked spotlight — soft light following the cursor,
                  opacity-0 by default so it only reads on desktop hover */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(360px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(255,255,255,0.14), transparent 65%)',
                }}
              />

              <CornerTick className="top-4 left-5" />
              <CornerTick className="top-4 right-5" />
              <CornerTick className="bottom-4 left-5" />
              <CornerTick className="bottom-4 right-5" />

              <div className="absolute left-6 bottom-6 right-6 flex items-end justify-between gap-4">
                <div>
                  <div className="font-mono text-[11px] tracking-[0.08em] uppercase text-[#F4EFE4]/70 mb-1">
                    {FEATURES[activeIndex].value}
                  </div>
                  <div key={activeIndex} className="text-[15px] text-[#F4EFE4] leading-snug caption-swap">
                    {FEATURES[activeIndex].caption}
                  </div>
                </div>
                {/* live/breathing indicator replaces the flat trailing
                    counter — the header above already shows the count */}
                <span className="flex items-center gap-2 shrink-0">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inset-0 rounded-full bg-copper-bright animate-ping" />
                    <span className="relative w-2 h-2 rounded-full bg-copper-bright" />
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#F4EFE4]/60">Live</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
