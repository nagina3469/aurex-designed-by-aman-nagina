import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Magnetic from './ui/Magnetic';
import Nav from './Nav';
import { prefersReducedMotion } from '../lib/reducedMotion';
import { lenisInstance } from '../lib/lenis';

// Worst-case wait for Phase A to reveal on its own (video actually
// loading/playing/reaching INTRO_END) before forcing it — covers slow
// connections where the video never gets far enough for `onTimeUpdate`
// to fire at all, so the page doesn't stay scroll-locked indefinitely.
// Must stay well above INTRO_END's 4 real seconds of required playback,
// not equal to it — at 4000 this raced the natural pause on essentially
// every normal load (any buffering/decode jitter pushes real completion
// past 4000ms wall-clock), so it was winning and forcing an instant-seek
// jump-cut instead of the smooth natural pause almost every time. This
// is a genuine-stall fallback, not a race partner for normal playback.
const REVEAL_TIMEOUT_MS = 10000;

const CARD_PHOTOS = [
  { src: '/images/studio-headlight-detail.jpg', label: 'Headlamp' },
  { src: '/images/forest-action-1.jpg', label: 'On the trail' },
  { src: '/images/studio-rear-three-quarter-1.jpg', label: 'Rear three-quarter' },
  { src: '/images/forest-action-2.jpg', label: 'Built to be pushed' },
];
const CARD_INTERVAL_MS = 2600;

// The intro auto-plays 0→INTRO_END unattended, then pauses and hands
// control to scroll — from there, scroll progress (0-1 across the
// wrapper's scroll range) maps to the remaining INTRO_END→duration span.
// Was 4 — the source footage holds a static headlight close-up until
// ~3.5s, then starts pulling back into the full-bike turntable shot.
// Pausing at 4 landed squarely mid-pull-back, so however the natural
// pause drifted (a few ms past the target, same as always), it froze on
// a different in-motion frame each time — reading as the frame randomly
// jumping/sliding left. 3.3 sits with real margin before that motion
// starts (confirmed by sampling frames through 3.5s), so Phase A always
// stops on the same static frame, and the pull-back itself becomes part
// of the scroll-scrub — driven by the user instead of autoplayed.
const INTRO_END = 3.3;
// Copy fades out over this much scroll progress once scrubbing starts —
// a short range, not a hard cutoff, so it reads as a quick dissolve
// rather than a jump cut the instant the wheel moves.
const COPY_FADE_END = 0.06;

export default function IntroHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const cardWrapRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  const [revealed, setRevealed] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const revealedRef = useRef(false);
  // Where Phase A actually stopped, not the theoretical INTRO_END — the
  // video pauses wherever `timeupdate` happens to catch it (a few ms past
  // INTRO_END), and anchoring Phase C's scroll-scrub to the constant
  // instead of this actual value caused a visible snap the instant scroll
  // started: p=0 mapped to exactly INTRO_END, a small backward jump from
  // wherever it had actually drifted to.
  const pausedAtRef = useRef(INTRO_END);

  useEffect(() => {
    const id = setInterval(() => {
      setCardIndex((i) => (i + 1) % CARD_PHOTOS.length);
    }, CARD_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // Scroll is genuinely locked (not just ignored) until Phase A reveals —
  // previously scroll was only *unread* during Phase A, but the page
  // itself was never actually blocked from scrolling, so scrolling fast
  // (or just impatiently) while the video was still loading could carry
  // straight past the whole 300vh wrapper before it ever revealed,
  // dropping the visitor into the section below with the hero never
  // having played. Lenis owns real scroll here (see `SmoothScroll.tsx`),
  // so its own stop()/start() is the correct lever on its own — verified
  // in Lenis's source that stop() calls preventDefault() on wheel/touch
  // input directly, no CSS needed.
  //
  // The `documentElement` overflow toggle is scoped to ONLY the
  // no-Lenis path (reduced-motion, see `SmoothScroll.tsx`) rather than
  // running unconditionally — toggling `overflow` forces a layout
  // recalculation for the entire page, and doing that in the same React
  // commit as the video's pause() was landing squarely on the reveal
  // frame, competing for the main thread at the exact moment the video
  // was trying to stop cleanly. That's what caused the small jerk right
  // as the intro stopped. Lenis's own stop()/start() doesn't touch
  // layout at all, so the normal path no longer pays that cost.
  useEffect(() => {
    if (lenisInstance) {
      if (revealed) lenisInstance.start();
      else lenisInstance.stop();
      return () => lenisInstance?.start();
    }
    if (revealed) {
      document.documentElement.style.overflow = '';
      return;
    }
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [revealed]);

  // Phase A — unattended intro playback, 0 → INTRO_END, scroll-locked (see
  // above) until it finishes, so an impatient early scroll can't skip
  // past the hero or put the video in a half-controlled state.
  useEffect(() => {
    const video = videoRef.current;
    // Guard on the persistent ref, not a local flag — React StrictMode
    // double-invokes this effect once in dev (mount → cleanup → mount
    // again on the same component instance). A local `let` guard doesn't
    // survive that second invocation, so both runs would call
    // `video.play()` independently and the second would silently
    // re-arm/override the first's already-completed reveal — which is
    // exactly what caused the video to blow straight through INTRO_END
    // and never actually pause. `revealedRef` persists across both runs
    // since refs aren't reset by StrictMode's replay, unlike local vars.
    if (!video || revealedRef.current) return;

    // Skip the unattended autoplay-then-scrub choreography entirely —
    // jump straight to the revealed state on a static poster frame instead
    // of motion the user asked not to see.
    if (prefersReducedMotion()) {
      video.pause();
      revealedRef.current = true;
      setRevealed(true);
      return;
    }

    video.muted = true;
    let cancelled = false;

    // `forceTime` is only used for the autoplay-blocked fallback, where
    // nothing was ever playing — an instant seek there is a cold jump,
    // not a snap-back after motion, so it doesn't read as a jerk. The
    // normal path pauses wherever `timeupdate` happens to catch it (a few
    // ms past INTRO_END at most) and leaves it there — NOT forcing
    // `currentTime` back to an exact value, since that backward
    // correction was the actual jerk. An earlier attempt tried to smooth
    // this by ramping `playbackRate` down to near-zero going into the
    // stop; that made things worse (visibly stuttery — browsers don't
    // decode/paint extreme slow-motion smoothly on a video this size) and
    // was reverted. Plain full-speed playback + a plain pause is what
    // actually reads as clean.
    function reveal(forceTime: boolean) {
      if (revealedRef.current || cancelled) return;
      video!.pause();
      if (forceTime) video!.currentTime = INTRO_END;
      pausedAtRef.current = video!.currentTime;
      revealedRef.current = true;
      setRevealed(true);
    }

    function onTimeUpdate() {
      if (video!.currentTime >= INTRO_END) reveal(false);
    }

    video.addEventListener('timeupdate', onTimeUpdate);
    const playPromise = video.play();
    if (playPromise) {
      // Autoplay can be blocked in rare cases even when muted — don't
      // strand the page with a hidden nav/headline if it is.
      playPromise.catch(() => reveal(true));
    }

    // Slow connection fallback — if the video hasn't gotten far enough to
    // fire `onTimeUpdate` past INTRO_END within REVEAL_TIMEOUT_MS, force
    // the reveal instead of leaving the page scroll-locked (see the effect
    // below) indefinitely while a 28MB file crawls in.
    const timeoutId = window.setTimeout(() => reveal(true), REVEAL_TIMEOUT_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      video.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, []);

  // Phase B/C — once revealed, scroll drives the rest of the video
  // (INTRO_END → duration) and fades the copy block out. Direct DOM
  // writes via refs in a single rAF loop, matching the rest of this
  // codebase's scroll-driven components (no per-frame React re-renders).
  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    let rafId = 0;
    let scheduled = false;
    let duration = 0;
    let lastWrittenTime = -1;

    function applyVisuals(p: number) {
      const copyT = Math.min(p / COPY_FADE_END, 1);
      if (copyRef.current) {
        copyRef.current.style.opacity = String(1 - copyT);
        copyRef.current.style.transform = `translateY(${-16 * copyT}px)`;
        copyRef.current.style.pointerEvents = copyT > 0.5 ? 'none' : 'auto';
      }
      if (cardWrapRef.current) {
        cardWrapRef.current.style.opacity = String(1 - copyT);
        cardWrapRef.current.style.transform = `translateY(${-16 * copyT}px)`;
        cardWrapRef.current.style.pointerEvents = copyT > 0.5 ? 'none' : 'auto';
      }
      if (scrollCueRef.current) {
        scrollCueRef.current.style.opacity = p < 0.03 ? '1' : String(Math.max(1 - p * 12, 0));
      }

      // Scroll-scrubbing the video is the motion reduced-motion users are
      // opting out of; the copy/card fade above still runs since it's
      // ordinary scroll-linked UI, not simulated motion.
      if (revealedRef.current && duration > 0 && !prefersReducedMotion()) {
        const base = pausedAtRef.current;
        const targetTime = base + p * (duration - base);
        if (Math.abs(targetTime - lastWrittenTime) > 0.01) {
          video!.currentTime = targetTime;
          lastWrittenTime = targetTime;
        }
      }
    }

    function update() {
      scheduled = false;
      if (!revealedRef.current) return;
      const rect = wrap!.getBoundingClientRect();
      const total = wrap!.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.min(Math.max(total > 0 ? scrolled / total : 0, 0), 1);
      applyVisuals(p);
    }

    function onScroll() {
      if (!scheduled) {
        scheduled = true;
        rafId = requestAnimationFrame(update);
      }
    }

    function onLoadedMetadata() {
      duration = video!.duration || 0;
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    if (video.readyState >= 1) onLoadedMetadata();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [revealed]);

  return (
    <>
      <Nav loaded={revealed} />

      {/* Tall scroll-wrapper + sticky inner video, same shape as this
          project's earlier video hero: the sticky element is bounded by
          the wrapper's height and releases naturally into the next
          section once scroll clears it — no extra JS needed for that
          hand-off. */}
      <div ref={wrapRef} className="relative h-[300vh]">
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-ink">
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            poster="/video/aman-hero-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            src="/video/aman-hero.mp4"
          />

          {/* soft top scrim — keeps the nav legible over the video */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/50 via-ink/5 to-transparent pointer-events-none z-[1]"
          />
          {/* left-side vignette — grounds the copy block */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-full sm:w-3/5 bg-gradient-to-r from-ink/80 via-ink/35 to-transparent pointer-events-none z-[1]"
          />

          {/* Copy block — this outer element is the JS-driven scroll-EXIT
              controller only (ref-based opacity/transform writes in the
              rAF loop below). Entrance is handled independently by each
              child's own `revealed`-gated transition, staggered — a slow
              cascade (eyebrow → headline → paragraph/CTAs) reads as far
              more premium than one flat block fading in at once. */}
          <div
            ref={copyRef}
            className={`absolute z-10 inset-y-0 left-0 w-full sm:w-3/5 flex flex-col justify-end pb-16 sm:pb-20 px-6 sm:px-12 md:px-20 lg:px-28 ${
              revealed ? '' : 'pointer-events-none'
            }`}
          >
            <div className="max-w-lg" style={{ textShadow: '0 2px 24px rgba(0,0,0,0.55)' }}>
              <span className="block overflow-hidden mb-4">
                <span
                  className={`inline-flex items-center gap-2 font-mono text-[13px] font-semibold tracking-[0.2em] uppercase text-white/70 transition-[opacity,transform] duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-copper-bright" />
                  The Ullr One
                </span>
              </span>

              <h1 className="font-display font-bold text-white leading-[1.08] tracking-tight text-[2.5rem] sm:text-[3.25rem] lg:text-[4.5rem] mb-5 sm:mb-6 whitespace-nowrap">
                {['Built to go', 'further.'].map((line, i) => (
                  <span key={line} className="block overflow-hidden pb-[0.18em] pr-[0.08em] -mb-[0.18em] -mr-[0.08em]">
                    {/* Opacity gates this too, not just translate — with
                        translate alone, the parent's large-blur text-shadow
                        (24px) could still bleed a few px into the visible
                        clipped area even while the glyphs themselves sat
                        translated out of view below the fold. Opacity-0
                        suppresses the shadow outright regardless of where
                        the (still fully rendered) element sits. */}
                    <span
                      className={`block transition-[transform,opacity] duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        revealed ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                      }`}
                      style={{ transitionDelay: `${0.12 + i * 0.1}s` }}
                    >
                      {line}
                    </span>
                  </span>
                ))}
              </h1>

              <div
                className={`transition-[opacity,transform] duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '0.36s' }}
              >
                <p className="text-[14px] sm:text-[15px] leading-relaxed text-white/70 max-w-sm mb-8">
                  An electric adventure-tourer with nothing hidden. The battery is the frame. The frame is the
                  statement.
                </p>
                <div className="flex items-center gap-3 sm:gap-4">
                  <Magnetic strength={7}>
                    <a
                      href="#reserve"
                      className="group relative inline-flex items-center gap-3 overflow-hidden text-[16px] font-medium text-[#F4EFE4] bg-copper rounded-full pl-6 pr-1.5 py-1.5 hover:brightness-110 transition-all duration-200"
                    >
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                      <span className="relative">Reserve your build slot</span>
                      <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-black/15 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        →
                      </span>
                    </a>
                  </Magnetic>
                  <Magnetic strength={7}>
                    <Link
                      to="/specs"
                      className="group inline-flex items-center gap-3 text-[16px] font-medium text-ink bg-[#F4EFE4] rounded-full pl-6 pr-1.5 py-1.5 hover:brightness-95 transition-all duration-200"
                    >
                      Explore the build
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-ink/10 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5">
                        →
                      </span>
                    </Link>
                  </Magnetic>
                </div>
              </div>
            </div>
          </div>

          {/* floating detail card, bottom-right — last to arrive in the
              entrance cascade (eyebrow → headline → paragraph/CTAs →
              card), fades with the rest of the copy once scroll starts */}
          <div
            ref={cardWrapRef}
            className={`hidden md:block absolute z-10 right-12 lg:right-20 bottom-16 sm:bottom-20 transition-[opacity,transform] duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-[480ms] ${
              revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <Link
              to="/specs"
              className="group relative block w-64 h-52 lg:w-80 lg:h-60 rounded-2xl overflow-hidden ring-1 ring-white/15 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_28px_55px_-20px_rgba(0,0,0,0.6)]"
            >
              <img
                key={cardIndex}
                src={CARD_PHOTOS[cardIndex].src}
                alt={CARD_PHOTOS[cardIndex].label}
                className="absolute inset-0 w-full h-full object-cover media-fade transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
              <div
                key={`${cardIndex}-label`}
                className="absolute left-3.5 bottom-3.5 right-3.5 text-[13px] font-semibold text-white leading-tight caption-swap"
              >
                {CARD_PHOTOS[cardIndex].label}
              </div>
            </Link>
          </div>

          {/* scroll cue — arrives last, once the rest of the cascade has
              settled. Right-aligned rather than centered: centered, it
              measured as overlapping the "Explore the build" CTA on
              shorter viewports (the copy block occupies the left ~60% of
              the screen, and a centered cue at typical laptop heights sat
              right on top of the button row). The far-right edge is
              clear of both the CTA row and the floating card above it. */}
          <div
            ref={scrollCueRef}
            className={`hidden sm:flex absolute z-10 right-6 lg:right-8 bottom-6 flex-col items-center gap-2 font-mono text-[11px] tracking-[0.1em] uppercase text-white/60 transition-opacity duration-700 delay-[600ms] ${
              revealed ? '' : 'opacity-0'
            }`}
          >
            Scroll
            <svg width="14" height="20" viewBox="0 0 14 20" fill="none" className="animate-bounce">
              <path d="M1 1L7 19L13 1" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
