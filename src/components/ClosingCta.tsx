import { Link } from 'react-router-dom';
import Reveal from './ui/Reveal';
import Magnetic from './ui/Magnetic';

export default function ClosingCta() {
  return (
    <section id="reserve" className="relative bg-bg overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-28 sm:pt-36 pb-24 sm:pb-32">
        <Reveal>
          <div className="flex items-baseline justify-between border-b border-line pb-4 mb-12 sm:mb-16">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-copper-deep">Reserve</span>
            <span className="font-mono text-[11px] tracking-[0.08em] text-muted tabular-nums">
              BUILD SLOTS — 118 / 500 CLAIMED
            </span>
          </div>
        </Reveal>

        {/* Oversized kinetic type moment */}
        <h2 className="font-display font-semibold tracking-tight leading-[0.92] text-ink text-[clamp(64px,12vw,180px)] mb-10 sm:mb-14">
          <Reveal variant="mask">Go</Reveal>
          {/* "First batch" label lives outside the reveal-mask (as a sibling,
              absolutely positioned) rather than inline in the same flex row
              as "further." — at the clamp's max size (full-screen-width
              viewports) "further." alone can nearly fill the mask's width,
              and the label being IN that overflow-hidden row was getting
              its trailing edge clipped off instead of just wrapping. */}
          <span className="relative inline-block">
            <Reveal variant="mask" delay={0.1}>
              further<span className="text-copper">.</span>
            </Reveal>
            <span className="hidden sm:block absolute left-full top-[0.2em] ml-4 sm:ml-8 font-mono font-normal text-[13px] tracking-[0.08em] text-muted uppercase whitespace-nowrap">
              First batch — Spring 2027
            </span>
          </span>
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
          <Reveal delay={0.2}>
            <p className="text-[15px] leading-relaxed text-muted max-w-sm">
              First deliveries roll out in limited batches. No deposit charged until your configuration is confirmed.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <Magnetic strength={10}>
              {/* Was a dead <button> with no handler — the single strongest
                  commitment moment on the page did nothing when clicked.
                  Routes to the Specs page, where the actual build options
                  live, matching what "configure" implies. */}
              <Link
                to="/specs"
                className="group relative inline-flex items-center overflow-hidden rounded-full bg-copper text-[#F4EFE4] px-8 py-4 text-[14px] font-semibold whitespace-nowrap transition-[filter,transform] duration-150 hover:brightness-110 active:scale-[0.98]"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <span className="relative">Configure now</span>
                <span className="relative inline-block ml-2 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
