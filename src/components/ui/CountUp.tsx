import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../lib/reducedMotion';

type CountUpProps = {
  /** target value to count up to */
  value: number;
  /** decimal places to keep (0 for whole numbers) */
  decimals?: number;
  duration?: number;
  className?: string;
};

/**
 * Counts up from 0 to `value` once it scrolls into view. IntersectionObserver
 * to trigger + a single rAF loop for the tween, matching the Reveal/Magnetic
 * pattern used elsewhere (no extra libraries, no re-renders during motion
 * beyond the numeric text itself).
 */
export default function CountUp({ value, decimals = 0, duration = 1.4, className = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.disconnect();

          if (prefersReducedMotion()) {
            setDisplay(value.toFixed(decimals));
            return;
          }

          const start = performance.now();
          function tick(now: number) {
            const t = Math.min((now - start) / (duration * 1000), 1);
            // ease-out-expo, matching the site's shared easing curve
            const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            setDisplay((value * eased).toFixed(decimals));
            if (t < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, decimals, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
