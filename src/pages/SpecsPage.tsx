import { useState } from 'react';
import Nav from '../components/Nav';
import Reveal from '../components/ui/Reveal';
import Magnetic from '../components/ui/Magnetic';
import CountUp from '../components/ui/CountUp';
import ClosingCta from '../components/ClosingCta';
import Footer from '../components/Footer';

const HERO_STATS = [
  { value: 42, decimals: 0, unit: 'kW', label: 'Peak power' },
  { value: 140, decimals: 0, unit: 'km', label: 'Range' },
  { value: 3.4, decimals: 1, unit: 'sec', label: '0–80 km/h' },
];

const SPEC_GROUPS = [
  {
    heading: 'Powertrain',
    rows: [
      ['Motor', 'Mid-drive brushless, air-cooled'],
      ['Peak power', '42 kW (56 hp)'],
      ['Peak torque', '76 Nm'],
      ['Top speed', '132 km/h'],
      ['0–80 km/h', '3.4 sec'],
      ['Drive', 'Chain final drive, single-speed'],
    ],
  },
  {
    heading: 'Battery & Charging',
    rows: [
      ['Capacity', '4.8 kWh, lithium-ion'],
      ['Range', '140 km (WMTC-equivalent)'],
      ['Onboard charger', 'Type 2, 3.3 kW'],
      ['Charge time', '38 min, 10–80%'],
      ['Fast-charge', 'CCS2 adapter compatible'],
    ],
  },
  {
    heading: 'Chassis & Suspension',
    rows: [
      ['Frame', 'CNC-machined aluminum spine, exposed'],
      ['Front travel', '210 mm'],
      ['Rear travel', '195 mm'],
      ['Ground clearance', '310 mm'],
      ['Wheelbase', '1,432 mm'],
      ['Seat height', '834 mm'],
    ],
  },
  {
    heading: 'Brakes & Wheels',
    rows: [
      ['Front brake', '260 mm disc, twin-piston floating caliper'],
      ['Rear brake', '220 mm disc, single-piston floating caliper'],
      ['Front tire', '90/90-21, dual-purpose knobby'],
      ['Rear tire', '120/90-18, dual-purpose knobby'],
      ['Wheels', 'Spoked, black anodized'],
    ],
  },
  {
    heading: 'Dimensions & Weight',
    rows: [
      ['Curb weight', '128 kg'],
      ['Length', '2,145 mm'],
      ['Width', '845 mm'],
      ['Height', '1,220 mm'],
      ['Fuel/energy capacity', '4.8 kWh (fixed pack)'],
    ],
  },
];

const DETAILS = [
  { src: '/images/studio-headlight-detail.jpg', label: 'Headlamp — 180 mm LED ring' },
  { src: '/images/studio-copper-three-quarter.jpg', label: 'Front three-quarter' },
  { src: '/images/studio-rear-three-quarter-2.jpg', label: 'Rear three-quarter' },
];

const RIDE_MODES = [
  {
    name: 'Trail',
    desc: 'Full power, full regen. The default — no compromises, no ceiling.',
    power: '42 kW',
    regen: 'High',
  },
  {
    name: 'Eco',
    desc: 'Power capped for range. Same chassis, longer legs.',
    power: '24 kW',
    regen: 'High',
  },
  {
    name: 'Sport',
    desc: 'Throttle response sharpened, regen relaxed for a freer roll-off.',
    power: '42 kW',
    regen: 'Low',
  },
];

const COMPARISON = [
  ['Recharge / refuel', '38 min (10–80%)', '~5 min, but a station detour'],
  ['Scheduled maintenance', 'Every 20,000 km', 'Every 5,000–8,000 km'],
  ['Noise at idle', 'Silent', '78–85 dB'],
  ['Torque delivery', 'Instant, from 0 rpm', 'Builds through the rev range'],
  ['Moving parts in the drivetrain', '3 (motor, chain, sprockets)', '12+ (chain, sprockets, clutch, gearbox)'],
];

export default function SpecsPage() {
  const [activeMode, setActiveMode] = useState('Trail');

  return (
    <>
      <Nav />

      {/* HERO — full-screen, headline + stats overlaying the photo directly,
          matching the landing page's IntroHero treatment. */}
      <section className="relative w-full min-h-[100dvh] overflow-hidden bg-ink">
        <img
          src="/images/gallery-side-profile.jpg"
          alt="AUREX One — clean side profile, studio"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* soft top scrim — keeps the nav bar's edges legible over the photo */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/50 via-ink/5 to-transparent pointer-events-none z-[1]"
        />

        {/* left-side vignette — grounds the copy block against the photo */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-3/5 z-10">
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/35 to-transparent pointer-events-none"
          />

          <div className="relative h-full flex flex-col justify-end pb-16 sm:pb-20 px-6 sm:px-12 md:px-20 lg:px-28">
            <div style={{ textShadow: '0 2px 24px rgba(0,0,0,0.55)' }}>
              <Reveal>
                <span className="font-mono text-[12px] tracking-[0.12em] uppercase text-copper-bright block mb-4">
                  Specifications
                </span>
              </Reveal>
              <h1 className="font-display font-semibold text-[1.85rem] sm:text-[2.5rem] lg:text-[3.75rem] leading-[1.08] tracking-tight text-white mb-8 max-w-2xl break-words">
                {['Every number,', 'accountable.'].map((line, i) => (
                  <Reveal key={line} variant="mask" delay={0.06 + i * 0.09}>
                    {line}
                  </Reveal>
                ))}
              </h1>

              <Reveal delay={0.2}>
                {/* Gap tightened at the md breakpoint specifically — the
                    copy column is a fraction of the viewport there (not
                    full width until `sm:` collapses it, not generously
                    padded until `lg:`), and the previous gap-12 pushed the
                    third stat onto its own orphan line instead of all
                    three sitting together. */}
                <div className="flex flex-wrap gap-x-6 gap-y-4 sm:gap-x-8 lg:gap-x-12">
                  {HERO_STATS.map((s) => (
                    <div key={s.label}>
                      <div className="font-display font-semibold text-[32px] sm:text-[42px] leading-none text-white tabular-nums">
                        <CountUp value={s.value} decimals={s.decimals} />
                        <span className="text-[16px] sm:text-[18px] font-medium text-white/60 ml-1">{s.unit}</span>
                      </div>
                      <div className="font-mono text-[11px] tracking-[0.08em] uppercase text-white/60 mt-2">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div className="hidden sm:flex absolute z-10 left-1/2 -translate-x-1/2 bottom-6 flex-col items-center gap-2 font-mono text-[11px] tracking-[0.1em] uppercase text-white/60">
          Scroll
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none" className="animate-bounce">
            <path d="M1 1L7 19L13 1" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </div>
      </section>

      {/* FULL SPEC TABLE */}
      <section className="relative bg-bg px-6 sm:px-12 md:px-20 lg:px-28 py-20 sm:py-28">
        <Reveal>
          <h2 className="font-display font-semibold text-[28px] sm:text-[42px] leading-tight tracking-tight text-ink text-center mb-10 sm:mb-14 max-w-6xl mx-auto">
            Engineered in every line.
          </h2>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="flex items-baseline justify-between border-b border-line pb-4 mb-12 sm:mb-16 max-w-6xl mx-auto">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-copper-deep">
              The full sheet
            </span>
            <span className="hidden sm:block font-mono text-[11px] tracking-[0.08em] text-muted tabular-nums">
              5 CATEGORIES — 26 FIGURES
            </span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14 max-w-6xl mx-auto">
          {SPEC_GROUPS.map((group, gi) => (
            <Reveal key={group.heading} delay={gi * 0.06}>
              <h3 className="font-display font-semibold text-[18px] text-ink mb-4">{group.heading}</h3>
              <dl className="divide-y divide-line">
                {group.rows.map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4 py-2.5">
                    <dt className="font-mono text-[12px] text-muted">{label}</dt>
                    <dd className="text-[14px] font-medium text-ink text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ))}
        </div>
      </section>

      {/* DETAIL GALLERY */}
      <section className="relative bg-bg px-6 sm:px-12 md:px-20 lg:px-28 pb-20 sm:pb-28">
        <Reveal>
          <h2 className="font-display font-semibold text-[20px] sm:text-[32px] leading-tight tracking-tight text-ink text-center mb-10 sm:mb-12 whitespace-nowrap">
            Every surface, considered.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 md:auto-rows-[320px] gap-px bg-ink">
          {DETAILS.map((d, i) => (
            <Reveal key={d.src} delay={i * 0.08}>
              <div className="group relative w-full aspect-[4/3] md:aspect-auto md:h-full overflow-hidden">
                <img
                  src={d.src}
                  alt={d.label}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                <div className="absolute left-5 bottom-5 font-mono text-[11px] tracking-[0.06em] text-[#F4EFE4]/85">
                  {d.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* RIDE MODES */}
      <section className="relative bg-surface px-6 sm:px-12 md:px-20 lg:px-28 py-20 sm:py-28">
        <Reveal>
          <div className="flex items-baseline justify-between border-b border-line pb-4 mb-12 sm:mb-16">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-copper-deep">
              One chassis, three moods
            </span>
          </div>
        </Reveal>
        <div className="flex flex-col md:flex-row gap-px bg-ink">
          {RIDE_MODES.map((mode, i) => {
            const active = mode.name === activeMode;
            return (
              <Reveal
                key={mode.name}
                delay={i * 0.08}
                className={`bg-surface transition-[flex-grow,flex-basis] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${active ? 'md:flex-[1.6]' : 'md:flex-1'}`}
              >
                <button
                  type="button"
                  onClick={() => setActiveMode(mode.name)}
                  aria-pressed={active}
                  className={`group relative w-full h-full text-left p-8 sm:p-10 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer ${
                    active ? 'bg-ink text-[#F4EFE4]' : 'bg-surface text-ink hover:bg-ink/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`font-mono text-[10px] tracking-[0.1em] uppercase transition-colors duration-500 ${active ? 'text-copper-bright' : 'text-copper-deep'}`}
                    >
                      Ride mode
                    </span>
                    {/* selection indicator — hollow ring that fills when active */}
                    <span
                      className={`flex items-center justify-center w-5 h-5 rounded-full border transition-colors duration-300 ${
                        active ? 'border-copper-bright' : 'border-ink/20 group-hover:border-ink/40'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full bg-copper-bright transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          active ? 'scale-100' : 'scale-0'
                        }`}
                      />
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-[26px] sm:text-[32px] mb-4">{mode.name}</h3>
                  <p
                    className={`text-[14px] leading-relaxed mb-8 max-w-xs transition-colors duration-500 ${active ? 'text-[#F4EFE4]/70' : 'text-muted'}`}
                  >
                    {mode.desc}
                  </p>
                  <div className="flex gap-8">
                    <div>
                      <div
                        className={`font-mono text-[10px] tracking-[0.08em] uppercase mb-1 transition-colors duration-500 ${active ? 'text-[#F4EFE4]/50' : 'text-muted'}`}
                      >
                        Power
                      </div>
                      <div className="font-display font-semibold text-[18px]">{mode.power}</div>
                    </div>
                    <div>
                      <div
                        className={`font-mono text-[10px] tracking-[0.08em] uppercase mb-1 transition-colors duration-500 ${active ? 'text-[#F4EFE4]/50' : 'text-muted'}`}
                      >
                        Regen
                      </div>
                      <div className="font-display font-semibold text-[18px]">{mode.regen}</div>
                    </div>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* COMPARISON */}
      <section className="relative bg-bg px-6 sm:px-12 md:px-20 lg:px-28 py-20 sm:py-28">
        <Reveal>
          <h2 className="font-display font-semibold text-[24px] sm:text-[32px] leading-tight tracking-tight text-ink mb-4 max-w-xl">
            Designed to be different.
          </h2>
          <p className="text-[14px] text-muted mb-10 sm:mb-12 max-w-md">
            Measured against a typical 450cc ICE adventure-tourer, category-equivalent.
          </p>
        </Reveal>

        <div className="max-w-3xl">
          <div className="grid grid-cols-3 gap-4 pb-3 border-b border-line">
            <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-muted">Category</span>
            <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-copper-deep">AUREX One</span>
            <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-muted">450cc ICE</span>
          </div>
          {COMPARISON.map(([label, vault, ice], i) => (
            <Reveal key={label} delay={i * 0.05}>
              <div className="grid grid-cols-3 gap-4 py-4 border-b border-line/60 items-baseline">
                <span className="text-[13px] text-muted">{label}</span>
                <span className="text-[14px] font-semibold text-ink">{vault}</span>
                <span className="text-[13px] text-muted">{ice}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <Magnetic strength={7} className="mt-12 sm:mt-14">
            <a
              href="/#reserve"
              className="group inline-flex items-center gap-2 rounded-full bg-copper text-[#F4EFE4] text-[13px] font-semibold px-6 py-3 hover:brightness-110 transition-all duration-200"
            >
              Reserve your build slot
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </a>
          </Magnetic>
        </Reveal>
      </section>

      <ClosingCta />
      <Footer />
    </>
  );
}
