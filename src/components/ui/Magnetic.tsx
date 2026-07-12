import { useEffect, useRef, type ReactNode } from 'react';

type MagneticProps = {
  children: ReactNode;
  /** max pull distance in px */
  strength?: number;
  className?: string;
};

/**
 * Magnetic hover: the wrapped element eases toward the cursor while hovered
 * and springs back on leave. Runs entirely outside React state — a single
 * rAF loop lerping a transform, so re-renders never happen during motion.
 */
export default function Magnetic({ children, strength = 8, className = '' }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let running = false;

    function tick() {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      el!.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`;
      if (Math.abs(targetX - currentX) < 0.05 && Math.abs(targetY - currentY) < 0.05 && targetX === 0 && targetY === 0) {
        el!.style.transform = '';
        running = false;
        return;
      }
      rafId = requestAnimationFrame(tick);
    }

    function start() {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    }

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      targetX = Math.max(-1, Math.min(1, relX)) * strength;
      targetY = Math.max(-1, Math.min(1, relY)) * strength;
      start();
    }

    function onLeave() {
      targetX = 0;
      targetY = 0;
      start();
    }

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
    };
  }, [strength]);

  return (
    <div ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </div>
  );
}
