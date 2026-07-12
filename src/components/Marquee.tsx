const PHRASES = ['Built to go further', 'The Ullr One', 'Nothing hidden', '42 kW on tap'];

/**
 * Kinetic type band between the hero and The Build — alternating filled and
 * outlined Panchang, doubled content for a seamless CSS loop.
 */
export default function Marquee() {
  const sequence = [...PHRASES, ...PHRASES];
  return (
    <div className="relative overflow-hidden border-y border-line bg-bg py-5 sm:py-6" aria-hidden>
      <div className="marquee-track items-baseline gap-10 sm:gap-14">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-baseline gap-10 sm:gap-14 pr-10 sm:pr-14">
            {sequence.map((phrase, i) => (
              <span key={`${half}-${i}`} className="flex items-baseline gap-10 sm:gap-14 whitespace-nowrap">
                <span
                  className={`font-display font-semibold text-[26px] sm:text-[34px] tracking-tight leading-none ${
                    i % 2 === 0 ? 'text-ink' : 'text-outline'
                  }`}
                >
                  {phrase}
                </span>
                <span className="w-[7px] h-[7px] rounded-full bg-copper-bright self-center shrink-0" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
