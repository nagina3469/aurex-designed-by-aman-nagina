import { Link } from 'react-router-dom';
import Reveal from './ui/Reveal';

type ShowcaseItem = {
  src: string;
  alt: string;
  meta: string;
  caption: string;
  span: string;
  mobileAspect: string;
  /** default center; set when object-cover's centered crop would cut the
   * actual subject out of frame at this tile's aspect ratio */
  objectPosition?: string;
};

const ITEMS: ShowcaseItem[] = [
  {
    src: '/images/studio-three-quarter.jpg',
    alt: 'AUREX One — three-quarter studio view on paddock stand',
    meta: 'STUDIO — 3/4 FRONT',
    caption: 'Nothing to hide',
    span: 'md:col-span-4 md:row-span-2',
    mobileAspect: 'aspect-[4/3]',
  },
  {
    src: '/images/gallery-cockpit.jpg',
    alt: 'AUREX One — cockpit view from the saddle',
    meta: 'COCKPIT',
    caption: 'Everything you need',
    span: 'md:col-span-2',
    mobileAspect: 'aspect-[4/3]',
    objectPosition: '50% 25%',
  },
  {
    src: '/images/gallery-fork-detail.jpg',
    alt: 'AUREX One — front fork and fender detail',
    meta: 'DETAIL — FRONT FORK',
    caption: 'Machined, not molded',
    span: 'md:col-span-2',
    mobileAspect: 'aspect-[4/3]',
    objectPosition: '50% 30%',
  },
  {
    src: '/images/studio-front.jpg',
    alt: 'AUREX One — straight-on studio view',
    meta: 'STUDIO — FRONT',
    caption: 'Symmetry by design',
    span: 'md:col-span-2',
    mobileAspect: 'aspect-[4/3]',
  },
  {
    src: '/images/gallery-tank-macro.jpg',
    alt: 'AUREX One — copper tank edge macro detail',
    meta: 'MACRO — TANK EDGE',
    caption: 'Copper, hand-finished',
    span: 'md:col-span-2',
    mobileAspect: 'aspect-[4/3]',
  },
  {
    src: '/images/gallery-controls-macro.jpg',
    alt: 'AUREX One — handlebar controls macro detail',
    meta: 'MACRO — CONTROLS',
    caption: 'Every switch, tactile',
    span: 'md:col-span-2',
    mobileAspect: 'aspect-[4/3]',
  },
];

function ShowcaseTile({ item, delay }: { item: ShowcaseItem; delay: number }) {
  return (
    <Reveal delay={delay} className={item.span}>
      {/* Mobile: no fixed row grid, so the tile's own aspect ratio gives it
          height. Desktop: the grid (auto-rows + row-span) already defines
          both dimensions, so aspect-ratio is dropped in favor of a plain
          w-full h-full fill — mixing aspect-ratio with a definite height
          makes the browser derive width FROM the aspect ratio instead of
          stretching to the grid column, which was quietly shrinking every
          tile to less than its cell's width. */}
      {/* Links to the Specs page, where the full detail on each part
          actually lives — no arrow affordance needed, the whole tile is
          clickable and the hover zoom already signals that. */}
      <Link to="/specs" className={`group relative block w-full overflow-hidden ${item.mobileAspect} md:aspect-auto md:h-full`}>
        <img
          src={item.src}
          alt={item.alt}
          style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent" />
        <div className="absolute left-5 right-5 bottom-5">
          <div className="font-mono text-[10px] tracking-[0.1em] text-[#F4EFE4]/55 mb-1.5 opacity-0 translate-y-2 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-y-0">
            {item.meta}
          </div>
          <div className="font-display text-[16px] sm:text-[19px] font-semibold text-[#F4EFE4]">{item.caption}</div>
        </div>
      </Link>
    </Reveal>
  );
}

export default function ProductShowcase() {
  return (
    <section className="relative bg-bg">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-24 sm:py-32">
        <Reveal>
          <div className="flex items-baseline justify-between border-b border-line pb-4 mb-12 sm:mb-16">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-copper-deep">In Detail</span>
            <span className="hidden sm:block font-mono text-[11px] tracking-[0.08em] text-muted tabular-nums">
              STUDIO — 6 FRAMES
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display font-semibold text-[28px] sm:text-[42px] leading-tight tracking-tight text-ink mb-12 sm:mb-16 max-w-2xl">
            Every angle, unretouched.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-6 md:auto-rows-[240px] gap-px bg-ink">
          {ITEMS.map((item, i) => (
            <ShowcaseTile key={item.src} item={item} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
