import { useEffect, useRef, useState, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  /** stagger delay in seconds, applied via --d custom property */
  delay?: number;
  /** 'fade' rises + fades the whole block; 'mask' clips and raises a line */
  variant?: 'fade' | 'mask';
  className?: string;
};

/**
 * IntersectionObserver-driven reveal. Adds `.is-inview` once when ~20% of
 * the element enters the viewport; all motion lives in CSS (transform +
 * opacity only) with the shared --ease-out-expo curve.
 *
 * `is-inview` is tracked as React state, not toggled imperatively via
 * `classList.add` — it used to be imperative, but any caller passing a
 * `className` that changes after mount (e.g. driven by its own state,
 * like a toggled "active" card) would re-render this component with a
 * new `className` prop, and React setting `element.className` on that
 * re-render silently wiped out the imperatively-added `is-inview` class,
 * snapping the element back to its pre-reveal `opacity: 0` — everything
 * "going blank" the instant its className changed for an unrelated
 * reason. Keeping `is-inview` in state means it's part of what React
 * renders every time, so it can never be clobbered by an unrelated
 * className update.
 */
export default function Reveal({ children, delay = 0, variant = 'fade', className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const inViewClass = inView ? 'is-inview' : '';

  if (variant === 'mask') {
    return (
      <div ref={ref} className={`reveal-mask ${inViewClass} ${className}`} style={{ ['--d' as string]: `${delay}s` }}>
        <span className="reveal-line">{children}</span>
      </div>
    );
  }

  return (
    <div ref={ref} className={`reveal ${inViewClass} ${className}`} style={{ ['--d' as string]: `${delay}s` }}>
      {children}
    </div>
  );
}
