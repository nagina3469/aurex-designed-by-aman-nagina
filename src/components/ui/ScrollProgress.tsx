import { useEffect, useRef } from 'react';

/**
 * 2px copper hairline fixed to the top of the viewport, scaleX driven by
 * overall document scroll. Transform-only, rAF-throttled.
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let rafId = 0;
    let scheduled = false;

    function update() {
      scheduled = false;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const p = total > 0 ? window.scrollY / total : 0;
      bar!.style.transform = `scaleX(${Math.min(Math.max(p, 0), 1).toFixed(4)})`;
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

  return (
    <div
      ref={barRef}
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[90] h-[2px] bg-copper origin-left"
      style={{ transform: 'scaleX(0)' }}
    />
  );
}
