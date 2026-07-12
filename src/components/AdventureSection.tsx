import { Link } from 'react-router-dom';
import Reveal from './ui/Reveal';
import Magnetic from './ui/Magnetic';

const GALLERY = [
  { src: '/images/mountain-2.jpg', caption: 'Built for the climb', meta: 'STAGE 02 — SCREE FIELD' },
  // relocated from the "In Detail" section above (ProductShowcase) —
  // field-test action shots fit this adventure narrative at least as
  // well as the studio-heavy detail gallery they came from.
  { src: '/images/forest-action-2.jpg', caption: 'Built to be pushed', meta: 'FIELD TEST — 02' },
];

export default function AdventureSection() {
  return (
    <section className="relative bg-ink">
      {/* Full-bleed statement video */}
      <div className="relative h-[85vh] min-h-[560px] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          // "auto" had this 12MB video competing for bandwidth with the hero
          // video on initial page load despite sitting well below the fold —
          // "metadata" only fetches enough to know duration/dimensions
          // up front, and the browser fills in the rest once this section is
          // actually near the viewport.
          preload="metadata"
          poster="/images/mountain-1.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          src="/video/mountain-ride.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-end px-6 sm:px-12 md:px-20 lg:px-28 pb-16 sm:pb-20">
          <Reveal>
            <div className="flex items-baseline gap-6 mb-4">
              <span className="font-mono text-[12px] tracking-[0.12em] uppercase text-copper-bright">
                Beyond the build
              </span>
              <span className="hidden sm:block font-mono text-[11px] tracking-[0.08em] text-[#F4EFE4]/50 tabular-nums">
                46.4102° N / 11.8440° E — DOLOMITES TEST ROUTE
              </span>
            </div>
          </Reveal>
          <h2 className="font-display font-semibold text-[2rem] sm:text-[3rem] lg:text-[3.5rem] leading-[1.05] tracking-tight text-[#F4EFE4] mb-5 max-w-2xl">
            {['Built for the ride,', 'not the road.'].map((line, i) => (
              <Reveal key={line} variant="mask" delay={0.08 + i * 0.09}>
                {line}
              </Reveal>
            ))}
          </h2>
          <Reveal delay={0.25}>
            <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#F4EFE4]/70 mb-8 max-w-md">
              4,000 meters up, zero compromises. The AUREX One goes where the map stops — real range, real suspension
              travel, a chassis that doesn't flinch at altitude.
            </p>
          </Reveal>
          <Reveal delay={0.35}>
            <Magnetic strength={7}>
              {/* Was labeled "Our story" while pointing at the build-features
                  section — a mismatch between what the label promises and
                  where it actually goes. Relabeled to match the real
                  destination instead of inventing story content. */}
              <a
                href="#the-build"
                className="group inline-flex items-center gap-2 self-start rounded-full border border-[#F4EFE4]/40 text-[#F4EFE4] text-[13px] font-semibold px-6 py-3 hover:bg-[#F4EFE4] hover:text-ink hover:border-[#F4EFE4] transition-all duration-200"
              >
                See the build
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </a>
            </Magnetic>
          </Reveal>
        </div>
      </div>

      {/* Four-image gallery, 2x2 on sm+. These tiles show a hover arrow —
          real link affordance now, not just a decorative icon (they used
          to be plain divs with an arrow that went nowhere on click). */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-ink">
        {GALLERY.map((item, i) => (
          <Reveal key={item.src} delay={i * 0.12} className="relative">
            <Link to="/specs" className="group relative block aspect-[4/3] overflow-hidden">
              <img
                src={item.src}
                alt={item.caption}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <div className="absolute left-6 right-6 bottom-6 flex items-end justify-between gap-4">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.1em] text-[#F4EFE4]/50 mb-1.5 opacity-0 translate-y-2 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-y-0">
                    {item.meta}
                  </div>
                  <div className="font-display text-[18px] sm:text-[22px] font-semibold text-[#F4EFE4]">
                    {item.caption}
                  </div>
                </div>
                <span className="text-[#F4EFE4]/60 text-[18px] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:text-[#F4EFE4]">
                  →
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
