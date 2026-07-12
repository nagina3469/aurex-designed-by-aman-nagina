# ULLR — Project Notes

> Renamed from AUREX (2026-07-12) — see changelog entry near the end of
> this file for why, and for the GitHub/Vercel rename that went with it.
> This file's own title and early sections still say "VAULT"/"AUREX" in
> places since they're a running log, not a spec sheet — treat the
> **most recent** changelog entries as the source of truth for current
> naming, not the top of the file.

Portfolio case study: electric adventure-tourer motorcycle landing page.
Source brief: `~/Downloads/VAULT_handoff_brief.md`. This file tracks decisions
and changes made beyond that original brief — update it after every
meaningful change to the project.

## Stack (current — Radian-style full-bleed hero + sticky feature list)
- Vite + React + **TypeScript** + **Tailwind CSS v4** (`@tailwindcss/vite`)
- `lucide-react` installed (available, not currently used — arrows are plain
  `→` text characters per user preference)
- No three.js — the 3D camera-rig hero was replaced by a scroll-scrubbed
  video hero. `three` and `public/models/` were removed.
- Fonts: **Panchang** (display), **General Sans** (body), IBM Plex Mono
  (data/labels). Panchang/General Sans are self-hosted local `.otf` files in
  `public/fonts/` (both were already installed on this machine via
  Fontshare) loaded via `@font-face` in `src/index.css` — replaced the
  original Space Grotesk/Inter Google Fonts pairing per user feedback that
  it read as a generic AI-template default. IBM Plex Mono still comes from
  Google Fonts. All three exposed as Tailwind theme tokens (`font-display`,
  `font-sans`, `font-mono`) via `@theme`.
- Video: `public/video/vault-hero.mp4` — re-encoded from
  `~/Downloads/Video-upscale.mp4` via ffmpeg (`-g 1 -keyint_min 1`, scaled to
  1280px wide) so **every frame is a keyframe**, fixing scrub jitter (seeking
  no longer needs to decode forward from a prior keyframe). Source: 10s,
  24fps, originally 1920×1440. `public/video/vault-hero-poster.jpg` is the
  last frame (fully assembled bike), extracted via
  `ffmpeg -sseof -0.1 -i vault-hero.mp4 -vframes 1`, used as the video
  `poster` attribute and as the static image in the feature showcase's
  sticky card.

## Design tokens (Tailwind `@theme`, in `src/index.css`)
```
--color-bg:            #FFFDFD   (near-white — user-specified exact value,
                                  see changelog; briefly was #EEE7D7 stone,
                                  before that #F2EEE3 flat cream)
--color-surface:       #F5F1EC   (adjusted to stay visible against the
                                  near-white bg)
--color-ink:           #221F17   (dark charcoal text)
--color-muted:         #726A5C
--color-copper:        #BA5A1F   (buttons, solid fills)
--color-copper-bright: #E07A34   (dot accents, glow)
--color-copper-deep:   #8F4517   (small text on light bg, better contrast)
--color-line:          #E8E2D8   (lightened to match; was too dark/tan
                                  relative to the near-white bg otherwise)
```

## Master prompt — regenerate this style of site from scratch

Added 2026-07-12 at the user's request, so this project can be used as a
one-shot template for a similar site in a fresh session. Copy everything
in the fenced block below into a new conversation with a coding agent.
It captures the tech stack, design system, page structure, and the
specific interaction-pattern lessons this project learned the hard way
(scroll-scrub jitter, sticky-pin timing, reveal-animation pitfalls) so a
regeneration doesn't have to rediscover them.

```
Build a single-product portfolio case-study website for a fictional
electric adventure-touring motorcycle. Tone: premium, minimal, "nothing
hidden" honesty — no fake specs, no claims the product photography
contradicts (e.g. don't say "chainless direct-drive" if the renders show
a chain). Reference feel: Rivian, Cake, other modern EV DTC sites — one
flowing narrative landing page, not a photo-dump gallery page.

STACK
- Vite + React 19 + TypeScript + Tailwind CSS v4 (@tailwindcss/vite,
  @theme block for design tokens, not tailwind.config.js)
- react-router-dom v6 for routing (landing page + a /specs page)
- Lenis for smooth scroll (wraps native scroll, doesn't replace it —
  keeps position:sticky and getBoundingClientRect-based scroll-linked
  code working unchanged)
- No animation library (no Framer Motion/GSAP) — all motion is CSS
  transitions/transforms driven by React state, plus a couple of
  IntersectionObserver-driven scroll reveals and rAF-driven scroll-scrub
  effects for the two places that need frame-accurate scroll coupling.

DESIGN SYSTEM
- Fonts: one distinctive display/headline font (self-hosted local .otf
  files via @font-face, not Google Fonts — reads less like a generic
  AI-template default), a clean sans body font, and a monospace font for
  data/labels/stats/eyebrow text. Expose all three as Tailwind theme
  tokens (font-display, font-sans, font-mono).
- Palette: near-white background (not pure #fff), dark ink text, one
  warm accent color (this project used copper/burnt-orange — pick
  something that fits the product) with a "bright" and "deep" variant
  for glows vs. small-text-on-light-bg contrast, a muted gray-brown for
  secondary text, a light line/border color.
- A subtle site-wide film-grain overlay (fixed position, SVG
  feTurbulence noise, ~5% opacity, animated drift) for texture.
- Every interactive element gets a real hover/press state — no static
  buttons. Small "magnetic" cursor-follow effect on primary CTAs is a
  nice touch but skip it if using a heavy animation library is off the
  table.

PAGE STRUCTURE (landing page)
1. Fixed transparent Nav — adaptive text color that samples the
   background luminance under it on scroll (light text over dark hero
   video, dark text once scrolled over a light section).
2. Full-bleed scroll-scrubbed video hero: plays unattended for the
   first few seconds (autoplay, muted), pauses, then hands control to
   scroll — scroll position maps to the rest of the video's timeline.
   Headline/CTA copy cascades in with staggered delays once the
   unattended phase ends, then fades out as scroll-scrub begins.
3. A kinetic marquee band (scrolling brand phrases) as a rhythm break.
4. A sticky scroll-spy feature section: left column is a vertical list
   of feature headlines: right column is a pinned media card whose
   image/caption updates to match whichever list item is "active."
5. A bento-grid product detail gallery (mixed tile sizes, hover zoom,
   links through to the specs page).
6. A full-bleed "lifestyle" video/image section for a different context
   than the studio shots (e.g. the product in actual use).
7. A closing CTA section with a reservation/waitlist framing.
8. A footer with real founder/designer social links (not fake in-universe
   brand social accounts), a giant faint wordmark, live local clock as a
   small "always-on" detail.

PAGE STRUCTURE (/specs page)
1. Full-screen hero: a photo where the angle actually supports the
   page's content — for a specs page specifically, a side-profile shot
   works better than a 3/4 hero shot, since dimension callouts
   (wheelbase, seat height, ground clearance) read naturally against a
   silhouette.
2. Full spec table grouped by category (powertrain, battery/charging,
   chassis, brakes/wheels, dimensions).
3. A small detail-photo gallery (3-4 tiles).
4. An interactive ride-mode/trim selector (click to swap active state).
5. A comparison table against the closest ICE-equivalent category.

HARD-WON LESSONS (avoid rediscovering these)
- Scroll-scrubbed video: encode with every frame as a keyframe
  (ffmpeg -g 1 -keyint_min 1 -sc_threshold 0) or seeking during scroll
  will stutter — the browser has to decode forward from the last
  keyframe otherwise. This trades file size/quality for seek smoothness;
  raise -crf/bitrate to compensate if the result looks soft, don't
  downscale resolution as the first fix.
- That same video's "unattended autoplay then hand off to scroll" phase
  transition will visibly snap/jitter unless you anchor the scroll-scrub
  math to the video's ACTUAL paused currentTime (read after autoplay
  pauses), not a theoretical constant — autoplay never pauses at exactly
  the constant you told it to stop at.
- Sticky scroll-spy sections (pinned media card, scrolling text list):
  don't pick the "active" item by finding whichever list item's center
  is closest to the viewport center. Do the math on whether the sticky
  element's actual pin range (container height minus one viewport) is
  even long enough to let the LAST item's center ever cross viewport-
  center while still pinned — with enough list items it usually isn't,
  and the pinned card starts scrolling away before the last item/s ever
  get shown. Use scroll-progress-through-the-pin-range instead (p =
  clamp(-containerRect.top / (containerHeight - viewportHeight), 0, 1),
  activeIndex = floor(p * itemCount)) — guarantees full, even coverage.
- `overflow` (anything but visible) on ANY ancestor between a
  position:sticky element and its containing block silently breaks the
  sticky behavior. If you need overflow-hidden for a decorative element
  near a sticky section, scope it to the smallest possible wrapper, not
  a shared ancestor.
- IntersectionObserver-driven reveal-on-scroll: track the "revealed"
  class via React state, not by imperatively calling
  el.classList.add() outside React's render cycle. If that same
  element's className prop can ever change later for an unrelated
  reason (e.g. a toggled active state), React will overwrite the whole
  className attribute on that re-render and silently wipe the
  imperatively-added class — everything snaps back to its pre-reveal
  hidden state.
- Don't eagerly load every image on the page regardless of scroll
  position — add loading="lazy" to anything below the first viewport.
  Don't set autoPlay on any below-the-fold video either: autoplay makes
  browsers buffer enough to sustain playback immediately regardless of
  any preload="none"/"metadata" hint or actual visibility. Gate both
  loading and play()/pause() behind an IntersectionObserver instead.
- Before naming the product/brand, check search-engine uniqueness, not
  just "does this sound cool" — a mythology name can still collide hard
  with an existing tech product, security company, or malware family
  (this project's first two mythology picks both did).
- Deploying a client-side-routed SPA (react-router) to a static host
  needs an explicit rewrite-all-paths-to-index.html rule (a vercel.json
  with a catch-all rewrite, for example) or any route besides / 404s on
  direct load/refresh — the dev server's built-in history fallback
  doesn't exist in production.

Ask me for the specific product name, mythology/brand-name direction,
color accent, and photography before generating copy or picking assets
— don't invent those unprompted.
```

## Page structure (rebuilt to match a screen recording of the Radian EXR
reference site the user provided)
Watching that recording (extracted to frames via ffmpeg) showed the actual
reference pattern is different from the card→fullbleed version built
previously:
1. Hero opens **full-bleed** (not a small corner card) with a rotating/
   exploding bike and overlaid text that disappears almost immediately once
   scrolling starts.
2. The bike keeps rotating/transforming full-bleed through the scroll.
3. Only *after* the hero finishes does the media shrink into a **persistent
   sticky card**, at which point a new section appears: a vertical list of
   feature headlines on the left that scrolls past a pinned media card on
   the right, with the active (centered) item bold/dark and the rest faded,
   and the card's caption updating to match.

This is what's now built:

### `src/components/Hero.tsx` — full-bleed scroll-scrubbed hero
- `h-[300vh]` wrapper, `sticky top-0 h-screen` inner container, `<video>`
  full-bleed from the first frame (`poster` = the assembled-bike jpg so
  there's no flash before the video loads).
- A `bg-gradient-to-t from-bg/90 via-bg/25 to-transparent` scrim over the
  full video keeps the bottom-left copy legible against the light studio
  footage.
- **0–8% scroll**: hero copy (eyebrow/headline/subtext/CTA) fades out with a
  `translateY(-18px)` lift — fast, matching how quickly the reference's text
  disappears once scrolling starts.
- **0–85% scroll**: linear scroll → `video.currentTime` mapping across the
  full clip (the explode/reassemble animation).
- **85–100%**: holds the final assembled frame; technical callouts fade in
  staggered, then the hero releases into the next section.
- Smoothing: a persistent `requestAnimationFrame` loop lerps a
  `smoothProgress` toward the raw scroll-derived target
  (`+= (target - smooth) * 0.15` per frame); all visuals are driven off the
  smoothed value. `video.currentTime` writes are skipped unless the delta
  exceeds 0.008s. This (plus the all-keyframe video re-encode) was the fix
  for the previously reported "very very jittery" scroll feel.

### `src/components/FeatureShowcase.tsx` — new sticky scroll-spy section
Replaces the old plain specs grid. Two-column layout (`flex-col` on mobile,
`md:flex-row` desktop):
- **Left**: vertical list of 6 feature headlines (reusing the original specs
  data — range, peak power, weight, 0–80, charge time, ground clearance —
  rephrased as headline-style copy). A scroll listener finds whichever item
  is closest to viewport-center and marks it active (`text-ink` vs
  `text-ink/25`).
- **Right**: `md:sticky md:top-0 md:min-h-screen` card showing the poster
  image with a caption overlay that updates to match the active feature.
  The `md:` prefix matters — sticky/pinned only makes sense in the desktop
  side-by-side layout; on mobile this is a normal static block (a mobile
  bug in the first pass had `min-h-screen` unconditionally, creating a large
  blank gap after the list since sticky doesn't do anything useful when
  stacked in a single column).

Closing CTA and footer are unchanged.

## Changelog
- **Initial build**: scaffolded Vite+React (JS) project from the original
  brief, three.js hero with GLTFLoader + scroll-driven camera rig, local
  GLB, specs/CTA/footer sections, mobile nav fix.
- **Redesign pass**: switched three.js hero from dark theme to warm
  off-white theme; reworked camera into a 3-phase headlight→front→3/4-reveal
  sequence; added legibility scrim; ran `/design-taste-frontend-v1` polish
  pass.
- **Video-hero rebuild**: converted the whole project to TypeScript +
  Tailwind CSS v4, removed three.js/GLTFLoader entirely, replaced the 3D
  camera rig with a full-bleed scroll-scrubbed `<video>` hero.
- **Asymmetric hero restructure**: reworked into a card→fullbleed phase
  structure (left text / right framed video card at rest). Re-encoded the
  source video with all-intraframe keyframes to fix scrub jitter, added
  rAF-based progress smoothing. Fixed a mobile text/card overlap bug.
- **Reference-accurate rebuild** (this revision): user sent a screen
  recording of the actual Radian EXR reference site's scroll behavior,
  which turned out to be full-bleed-first (not small-card-first) followed
  by a shrink into a sticky scroll-spy feature section — different from
  what the card→fullbleed version built. Rewrote `Hero.tsx` to be full-bleed
  from the start, and added `FeatureShowcase.tsx` as a new section
  replacing the plain specs grid. Extracted a poster frame from the video
  via ffmpeg for use as both the video's `poster` attribute and the feature
  card's static image. Fixed a mobile layout bug in the new section (sticky
  media wrapper needed `md:` prefixes, since sticky positioning does nothing
  useful in a stacked single-column mobile layout and was leaving a large
  blank gap).
- **Clarity + crop + callout-accuracy fixes** (this revision): three
  targeted fixes to `Hero.tsx` based on direct feedback:
  1. The full-screen scrim was dimming the bike throughout the scroll. It
     now only exists while the hero copy is visible — `scrimRef` opacity is
     driven by the same `copyT` value as the copy fade, so by 8% scroll
     (`COPY_FADE_END`) both the text and the scrim are fully gone, leaving
     the bike completely clear for the rest of the scroll.
  2. The explode/reassemble animation could get clipped at the top/bottom
     because the video (`object-cover`) was being cropped to fill a
     container with a different aspect ratio than the source 4:3 clip.
     Switched to `object-contain` so the full video frame is always shown
     letterboxed/pillarboxed (never cropped), with the sticky container's
     background set to a cool-gray radial gradient sampled from the video's
     own studio backdrop (`ffmpeg` pixel probe read `rgb(133,140,150)` from
     a corner) so the letterbox bars blend in rather than showing the page's
     warm off-white.
  3. Callout dots were positioned as raw viewport percentages tuned for the
     old three.js camera framing, so "headlamp" landed near the tail instead
     of the actual headlight. Replaced with `CALLOUTS` fractions (0–1) read
     directly off the poster image's actual layout (headlamp upper-left at
     roughly 28%/29%, battery center at 44%/52%, motor/chain at 66%/58%),
     converted to real pixel positions at runtime via `getContainRect()`
     (the same contain-fit math used for the video itself) so dots track
     the correct anatomical spot regardless of viewport size.
- **Hero background blend + new "Beyond the Build" adventure section**
  (this revision):
  - The hero's letterbox fill was a cool blue-gray sampled directly from the
    video's studio backdrop, which made the handoff into the next section
    (warm off-white `--color-bg`) feel like a hard, disconnected cut.
    Replaced it with a top-to-bottom linear gradient
    (`#e9e9e7 → #eeece1 → #F2EEE3`) that starts near-neutral at the top and
    settles exactly into the page's `--color-bg` by the bottom edge, so
    scrolling out of the hero is seamless.
  - New `src/components/AdventureSection.tsx`, placed right after
    `FeatureShowcase` ("The Build"), matching the reference site's
    full-bleed dark statement section: an autoplaying/looping/muted
    background video (`public/video/mountain-ride.mp4` — re-encoded from
    the user's supplied clip via `ffmpeg -crf 23 -vf scale=1600:-2`, 25MB →
    12MB, normal GOP since it's just looping, not scroll-scrubbed) with a
    dark gradient overlay, headline ("Built for the ride, not the road."),
    subcopy, and an "Our story →" ghost CTA. Below it, a two-image duo
    (`mountain-2.jpg` / `mountain-3.jpg`, both downsized via `sips -Z 1800`
    from ~3.2MB to ~560KB) captioned "Built for the climb" / "Ready for
    anything", using the remaining supplied photos. `mountain-1.jpg` is the
    video's `poster`.
  - Wired into `App.tsx` as `<Hero /> <FeatureShowcase /> <AdventureSection />`.
- **Ambient blurred-video backdrop** (follow-up fix): the linear-gradient
  letterbox fill above only matched colors along the top-to-bottom axis, so
  at viewport aspect ratios where the video pillarboxes left/right instead
  (e.g. a narrow/tall window), there was still a visible vertical seam
  between the video's own gray-blue tone and the gradient. A static gradient
  fundamentally can't solve this for every aspect ratio and scroll position
  at once. Replaced it with the standard "ambient mode" technique (same
  approach YouTube/Apple product pages use for letterboxed video): a second
  `<video>` element (`bgVideoRef`) with the *same* source, `object-cover`
  (fills the container completely, no letterbox), and
  `scale-125 blur-3xl brightness-95 saturate-95`, sitting behind the sharp
  `object-contain` video. Both videos are driven by the same
  `currentTime`-setting code in `applyVisuals`, so the blurred backdrop is
  always the same frame as the foreground, just softened — meaning the
  letterbox area matches the video's actual colors exactly, from any
  direction, at any scroll position, automatically. The sticky container's
  background is now just a plain `bg-bg` fallback (shown only for an instant
  before either video paints). Confirmed no seam at 1280×800 (pillarboxed)
  and at mobile widths (letterboxed), including mid-explode frames where the
  composition changes significantly.
- **Exact color match for scrim + fallback** (follow-up fix): the ambient
  blurred-video backdrop handles the letterbox area dynamically, but the
  hero copy scrim and the sticky container's instant-load fallback were
  still using the site's warm off-white `--color-bg` (`#F2EEE3`), which
  reads noticeably warmer/creamier than the bike's actual cool-gray studio
  backdrop — sampled directly via `ffmpeg` pixel probes at 6 points across
  the poster frame (top, sides, floor reflections) and averaged to
  `rgb(189,194,202)` / `#bdc2ca`. Replaced `bg-bg` and `from-bg/85 via-bg/15`
  with `#bdc2ca` in `Hero.tsx` (sticky container fallback, copy scrim, and
  the callout label's small text backdrop) so every non-video-driven surface
  in the hero matches the bike's own background tone instead of the page's
  brand cream, which is only reintroduced once you scroll into "The Build".
- **Synthesized explode/reassemble sound effects** (this revision):
  `src/lib/sfx.ts` — a small Web Audio API engine (`createSfxEngine()`) with
  two synthesized one-shot sounds, no audio files:
  - `playClick()` — a light metallic latch: a short (60ms) bandpass-filtered
    noise burst centered at 2200Hz, fast exponential decay. Used for "a part
    separating."
  - `playClunk()` — a heavier mechanical settle: a triangle oscillator
    sweeping 180Hz→55Hz (160ms) layered with a lowpass-filtered noise thump.
    Used for "a part landing/reassembling."
  `Hero.tsx` defines `SFX_CUES` — six trigger points across the 0–1
  explode/reassemble timeline (`0.12 click, 0.28 clunk, 0.42 click, 0.58
  clunk, 0.74 click, 0.9 clunk`), alternating in the absence of real
  per-part timing data from the source video. Each cue fires once per
  crossing (tracked via `lastScrubT` inside the existing scroll-effect
  closure), in either scroll direction, so scrolling back through the
  sequence re-triggers the same sounds in reverse.
  - Browsers require a user gesture before audio can play, so scrolling
    alone can't unlock it. Added a mute/unmute toggle button in the nav
    (`Volume2`/`VolumeX` from `lucide-react`, the first actual icon use in
    this project — previously arrows were kept as plain `→` text per
    earlier preference, but a mute toggle isn't an arrow). Sound defaults
    **off**; clicking the toggle both creates/resumes the `AudioContext`
    (satisfying the gesture requirement) and flips a `soundOnRef` that the
    scroll-effect's cue-firing logic reads every frame (a plain ref, not
    state, so the rAF loop always sees the latest value without needing the
    effect to re-run).
  - Verified: toggle flips the icon and `aria-pressed` correctly, and
    scrolling through all six cue points with sound enabled produces no
    console errors (the actual audio output can't be verified through the
    automated preview tool — no speaker/audio-capture path — so this should
    be given a listen in a real browser tab to confirm the sounds themselves
    feel right, not just that the code runs).
- **Sound redesign: continuous scroll-coupled ratchet, not fixed thuds**
  (follow-up, desktop-only for now — mobile sound behavior not addressed
  yet per user request): the discrete click/clunk cues above read as
  repetitive "bump bump" and didn't feel connected to the actual scroll
  motion. Replaced with:
  - `playTick(intensity)` in `sfx.ts` — a very short (18-30ms) bandpass
    noise burst around 3200-4100Hz with per-call random detune, so a rapid
    run of ticks sounds like a mechanical ratchet/screw-thread catching
    rather than a repeated identical sample. `intensity` (0-1) scales gain
    and duration slightly, so faster scrolling reads as quicker, brighter
    ticking.
  - `playClink()` — three short high-pitched tones (triangle 2600Hz + sine
    1800Hz slightly delayed + sine 3400Hz) plus a touch of high-passed
    noise, all with fast decay and no low-frequency body at all, so it
    reads as two small metal parts touching, never a "bump".
  - Removed `playClick`/`playClunk` and the fixed `SFX_CUES` array entirely.
    `Hero.tsx` now accumulates actual scrub distance traveled per frame
    (`tickAccumulator`) and fires one `playTick` every `TICK_STEP` (0.02) of
    progress covered — ticking rate is directly driven by how fast you're
    actually scrolling, and stops immediately when scrolling stops (no
    fixed-interval sound at all when idle). `CLINK_CUES = [0.48, 0.9]` still
    uses the old crossing-detection approach for exactly two punctuation
    moments: parts fully separated, and parts locked back together.
  - Verified via a standalone stress test (60 rapid overlapping tick nodes
    fired in quick succession, simulating a fast scroll) that the Web Audio
    graph handles the burst without throwing.
- **Switched to real audio from the source video, not synthesis**
  (follow-up — user reported the synthesized ticks/clinks "doesn't sound
  good" and asked to use the original video's own audio instead): it turns
  out the original supplied clip (`~/Downloads/Video-upscale.mp4`) has a
  real recorded audio track — I'd stripped it with `-an` during the earlier
  all-intraframe re-encode for scrub-jitter, without checking first.
  `ffmpeg -af volumedetect` confirmed real content (mean -17.3dB, not
  silence). Extracted it to `public/video/vault-hero-audio.wav` (PCM 16-bit
  stereo, `ffmpeg -vn -acodec pcm_s16le`) — WAV rather than compressed audio
  so the browser's decoder has zero ambiguity.
  - Rewrote `sfx.ts` entirely: `createSfxEngine(audioUrl)` now fetches +
    `decodeAudioData`s that WAV into a single `AudioBuffer` (network fetch
    and decode don't need a user gesture, only playback does, so this loads
    eagerly on mount). The one primitive is `playGrain(progress, {duration,
    gain})` — plays a short snippet of the *real* buffer starting at
    `progress * buffer.duration`, with a linear fade-in/out envelope (~6ms)
    to avoid clicks at grain boundaries. No oscillators, no synthesized
    noise anywhere anymore.
  - `Hero.tsx`: the same distance-accumulator approach as before now calls
    `playGrain(scrubT, ...)` — i.e. it plays whatever was actually recorded
    in the source video at that exact normalized position in the timeline,
    scrubbed at scroll speed. `ACCENT_CUES = [0.48, 0.9]` still exist as two
    longer/louder grains at the same two structural moments (fully
    separated, locked back together), also pulled from the real audio
    rather than synthesized.
  - Verified: the WAV fetches (200 OK) and `decodeAudioData`s successfully
    in-browser (10.077s, 2ch, 48kHz — matches the source video's duration
    exactly, so proportional scrubbing stays in sync throughout), and
    scrolling the full range with sound enabled produces no console errors.
    As before, actual audio output/character can't be verified through the
    automated preview (no speaker capture) — please give this one a real
    listen too.

- **Hero pillarbox seam fix** (user-flagged via annotated screenshot at a
  very wide viewport, ~1888px): the ambient blurred-video backdrop
  technique still left a visible hard-edged rectangle — the sharp
  `object-contain` video's own rendered content has a crisp rectangular
  boundary where it meets its transparent letterbox margin, and that edge
  sat directly on top of the blurred backdrop with no transition, reading
  as a seam/box at wide aspect ratios where the margin is large. Root
  cause: `getContainRect()` already tells us exactly where that boundary
  is, but nothing was using it to blend the edge itself.
  - Added `applyVideoMask()` in `Hero.tsx`: on mount and resize, computes
    the contain-fit rect, determines which single axis has the margin (it's
    always exactly one — pillarboxed left/right OR letterboxed top/bottom,
    never both, per the branching in `getContainRect`), and applies a
    `mask-image` linear-gradient directly on the sharp video element that
    feathers ±6% inward from the real content boundary on that axis. The
    sharp video now dissolves into the blurred backdrop instead of cutting
    off sharply. `mask-image` + `-webkit-mask-image` (set via
    `setProperty` — camelCase `.style.WebkitMaskImage` isn't a valid DOM
    property name, `tsc` caught this) for Safari.
  - Verified at 1888×918 (the width in the user's screenshot) and 1280×800
    — no visible seam at either, in both the resting frame and mid-explode.

- **Progressive blur ring, not just an opacity fade** (follow-up — user
  wanted the edges/corners to actually look *blurred into* the background,
  not just faded out; also confirmed desktop-only for now, mobile "we'll
  see next"): the mask feather above only fades the sharp video's own
  opacity — it can't add blur *beyond* the sharp video's content box, since
  `object-contain` means there are literally no pixels out there to blur.
  Fixed by adding a third layer, `midVideoRef` in `Hero.tsx`: a lightly
  blurred (`blur-xl`) *`object-cover`* copy of the same clip — cover-fit
  means it has real pixel data across the entire viewport, including past
  the sharp video's edge, unlike the contain-boxed sharp video. It's kept
  in sync via the same `currentTime` writes as `bgVideo`/`video`, and
  revealed only in a band straddling each true content edge via
  `applyMidVideoMask()` — a band-pass `mask-image` gradient (transparent →
  opaque ring → transparent) computed from the same `getContainRect()` rect,
  with a fallback of full opacity on any axis that has no margin (so
  `mask-composite: intersect` across the x/y gradients doesn't cancel the
  other axis's band). Net effect, sharp center → soft blur ring exactly at
  the boundary → heavy blur (`bgVideo`) beyond — a real graduated blur
  rather than a flat fade. Verified at 1888×918 and 1280×800, resting frame
  and mid-explode: soft, rounded blur shapes at the edges, no hard lines.

- **New `ProductShowcase.tsx`** (this revision) — a 6-image bento gallery
  ("02 — In Detail") inserted between The Build and Beyond the Build, using
  a fresh photo batch the user supplied (3 studio shots, 3 forest field
  shots). Bumped `AdventureSection`'s label to "03 —" and `ClosingCta`'s to
  "04 —" to keep the section numbering sequential.
  - **Asset vetting before use**: two of the six supplied studio images had
    a visible "RADIAN" logo printed on the display stand next to the bike —
    Radian is a real competing motorcycle brand, so shipping those would
    put a competitor's name directly on the VAULT product page. Flagged
    this to the user with a screenshot comparison before doing anything;
    they confirmed dropping those two in favor of the third studio shot
    (same stand type, no branding). Minor/lower-stakes note also flagged in
    passing: the forest shots have real "FOX"/"100%" apparel logos on the
    rider's gear, which is normal for lifestyle photography of real riding
    equipment (not on the product itself) — left as-is.
  - Final 6 assets, resized via `sips -Z 2000` and compressed to ~80%
    quality (each now 200-830KB, down from 2-3MB originals):
    `studio-three-quarter.jpg`, `studio-headlight-detail.jpg`,
    `studio-front.jpg`, `forest-action-1.jpg`, `forest-action-2.jpg`,
    `forest-standing.jpg`.
  - Layout: a 6-column desktop grid (`grid-cols-1 md:grid-cols-6
    md:auto-rows-[240px]`) — large 3/4 studio shot at `col-span-4
    row-span-2`, headlight detail + front-on stacked at `col-span-2` each,
    two field-test shots at `col-span-3` each, and the standing-rider shot
    as a full-width `col-span-6` banner. Deliberately not a 3-equal-column
    grid (banned pattern) — asymmetric bento per the design skill's layout
    rules. Hover treatment (mono meta label + caption + arrow, revealed on
    hover) reused verbatim from `AdventureSection`'s image duo for visual
    consistency across the two galleries.
  - **Real bug caught and fixed via DOM measurement, not just eyeballing**:
    every tile initially rendered narrower than its grid cell (e.g. the
    full-width banner only took up half the row). Root cause: each tile div
    had both `h-full` (a definite height, from the grid's fixed row height)
    **and** an `aspect-[]` class. Per the CSS spec, when height is definite
    and width is auto, `aspect-ratio` computes width *from* that height
    instead of letting the element stretch to fill its grid column — so a
    240px-tall row with `aspect-[4/3]` rendered at 320px wide regardless of
    how wide its actual column was. Fixed by giving mobile (`grid-cols-1`,
    no fixed row height) `aspect-[]` classes so tiles get a sane height
    there, and unconditionally overriding to `md:aspect-auto md:h-full` at
    the desktop breakpoint where the grid itself already defines both
    dimensions — confirmed via `getBoundingClientRect()` before and after
    (560px → 1184px for the full-width tile) and re-verified visually at
    both breakpoints.

- **Awwwards elevation pass** (this revision, via
  `/design-taste-frontend-v1`): full craft layer on top of the existing
  architecture — no content, copy, or scroll-mechanic changes.
  - **Global** (`index.css`): easing tokens (`--ease-out-expo`,
    `--ease-inout-quart`); animated SVG film grain as a fixed
    `pointer-events-none` overlay (`.grain::after`, 5% opacity, stepped
    drift — fixed element so scrolling never repaints it); copper
    `::selection`; `prefers-reduced-motion` kills grain/marquee/reveals.
  - **Reveal engine**: `ui/Reveal.tsx` — IntersectionObserver adds
    `.is-inview` once at 20% visibility; CSS handles fade-rise or masked
    line-rise (`variant="mask"`), staggered via a `--d` delay custom prop.
  - **Magnetic hover**: `ui/Magnetic.tsx` — wrapper that lerps toward the
    cursor via its own rAF loop (zero React state during motion), springs
    back on leave. Applied to nav Reserve, hero CTA, adventure CTA, closing
    CTA, footer back-to-top.
  - **Scroll progress**: `ui/ScrollProgress.tsx` — 2px copper hairline fixed
    top, `scaleX` transform driven by document scroll, rAF-throttled.
  - **Hero load-in choreography**: nav drops in and copy lines rise through
    overflow masks (staggered 80–420ms) once `document.fonts.ready`
    resolves. Critically, the load-in animates only *inner* children —
    the outer copy container's opacity stays owned by the scroll-driven
    rAF loop, so the two systems never fight. Nav links gained copper
    underline-grow hovers.
  - **Marquee** (`Marquee.tsx`): kinetic type band between hero and The
    Build — alternating filled/outlined Space Grotesk phrases with copper
    dot separators, doubled content, 36s CSS linear loop.
  - **FeatureShowcase**: section header row ("01 — The Build" + live
    `02 / 06` counter fed by the existing activeIndex); mono index numeral
    per row (copper when active) with hairline row separators; active
    headline nudges right 6px; sticky card gained blueprint corner ticks
    (`+`), a ghost numeral, caption swap animation (key-remount +
    `captionIn`), and a subtle scroll parallax on the image
    (scale 1.08, ±5% translateY). Scroll-spy handler is now rAF-throttled
    and skips redundant setState.
  - **AdventureSection**: masked line reveals on the headline; mono
    coordinates detail ("46.4102° N / 11.8440° E — DOLOMITES TEST ROUTE");
    section index "02 — Beyond the build"; image duo hover reveals a mono
    stage label + arrow slide (700ms expo zoom instead of generic 500ms).
  - **ClosingCta.tsx** (replaces the centered CTA block in App): oversized
    "Go further." at `clamp(64px,12vw,180px)` with copper period, masked
    reveals, "FIRST BATCH — SPRING 2027" mono annotation, "BUILD SLOTS —
    118 / 500 CLAIMED" counter row, split copy/CTA layout (anti-center).
  - **Footer.tsx** (new, replaces the one-line footer): ink-dark designed
    moment — wordmark + link columns with underline-grow hovers, magnetic
    back-to-top circle, giant outlined "VAULT" (`.text-outline-light` —
    the first attempt used `.text-outline`, whose ink-colored stroke was
    invisible on the ink background; caught via screenshot), legal row
    with pulsing copper dot + live local-time clock (isolated, memoized
    `LocalTime` component so the 1s interval never re-renders the tree).
  - Verified: `tsc -b` clean, no console errors, all sections
    screenshot-verified on desktop (1280×800) including footer wordmark
    fix, mobile (375×812) stacks with zero horizontal overflow.
    The `h-screen` in the hero sticky pane was deliberately NOT changed to
    `100dvh` despite the skill's guidance — the scrub math is calibrated
    against `window.innerHeight` and verified; changing the sticky pane
    unit risks desync on mobile browser chrome show/hide.

## Known considerations / open issues
- **Preview tool oddity, not an app bug**: mid-session, the preview
  screenshot tool started rendering the page confined to a narrow left
  strip of the image with blank space beside it, even though `getBoundingClientRect()`
  on the same elements confirmed the real DOM layout was full-width and
  correct. Restarting the preview server (`preview_stop` + `preview_start`)
  resolved it. If a screenshot ever looks inexplicably narrow/cropped again,
  don't assume a CSS regression — verify with `getBoundingClientRect()` via
  `preview_eval` first, since the DOM has been the reliable source of truth
  all session while screenshot rendering has had multiple unrelated
  hiccups (this one, plus the earlier video-seek compositing issue below).
- **Automated verification limits**: the CDP-based preview/screenshot tool
  used to test this could not reliably drive continuous `requestAnimationFrame`
  loops (a bare rAF counter test timed out waiting on just 5 frames) —
  likely because the tab is treated as backgrounded/inactive in that
  automation context. This means the live smoothed scroll-scrub animation
  could not be fully verified through automated screenshots alone. What
  *was* verified: the phase math is correct (confirmed by temporarily
  bypassing the smoothing layer and checking `video.currentTime` / callout
  opacity at several scroll positions), the full-bleed hero layout and the
  new sticky feature section both render correctly at multiple scroll
  positions on both desktop and mobile widths, and video frame decode is
  correct via `canvas.drawImage` pixel readback. **The live smoothness of
  the scroll feel and the scroll-spy list's responsiveness should be
  confirmed by scrolling the page yourself** in a real browser tab.
- Not yet built: the reference site's small floating "release video"
  preview thumbnail in the hero corner, the full-bleed dark statement
  section further down ("Some people wait for change. Others create it."),
  color/trim configurator, Behance case-study write-up. These were left out
  of this pass to keep scope to the two things explicitly requested (hero
  sequence + sticky feature list) — flag if you want any of them added.
- `ffmpeg` was installed via Homebrew on this machine to do the video
  re-encode and poster-frame extraction (`brew install ffmpeg`) — wasn't
  previously installed.

## New: dedicated Specifications page + routing (this revision)

The site is no longer a single page. Added `react-router-dom`, wrapped
`main.tsx` in `<BrowserRouter>`, and split `App.tsx` into a `<Routes>` with
`/` (`pages/LandingPage.tsx`, the existing sections) and `/specs`
(`pages/SpecsPage.tsx`, new). `components/ScrollToTop.tsx` resets scroll on
route change (React Router doesn't do this by default) but skips it when
navigating to an in-page hash.

- **Shared `Nav.tsx`** extracted from `Hero.tsx` (which previously had the
  nav inline) so both pages use the same header. Sound toggle is passed in
  as optional props and only rendered on the hero (`SpecsPage` has no
  audio). "Specs" is a real `<Link to="/specs">`; "The Build"/"Support" and
  the Reserve buttons are plain `<a href="/#the-build">` /
  `/#reserve"` anchors — cross-page hash links do a full navigation
  (acceptable for a portfolio site; avoids the complexity of manual scroll
  restoration on client-side hash routing). Renamed `FeatureShowcase`'s
  section id from the overloaded `specs` to `the-build`, and added `id=
  "reserve"` to `ClosingCta`, so every nav target now points somewhere
  real and unambiguous.
- **`SpecsPage.tsx`**: hero (3 stat callouts + large studio image), a full
  categorized spec table (Powertrain / Battery & Charging / Chassis &
  Suspension / Brakes & Wheels / Dimensions & Weight — extends the
  brief's original 6 numbers to ~26 organic-feeling figures, not
  round/fake-sounding ones), a 3-image detail gallery, a "one chassis,
  three moods" ride-mode section (Trail/Eco/Sport — asymmetric flex-basis
  row, not the banned equal-3-column pattern), and a VAULT-vs-typical-ICE
  comparison table, closing with the existing `ClosingCta`/`Footer`.
- **Two more new photos vetted before use** (same RADIAN-branding check as
  the ProductShowcase batch): both clean — a rear 3/4 studio shot on a
  plain unbranded stand (`studio-rear-three-quarter-1.jpg`) and the same
  angle rotated (`studio-rear-three-quarter-2.jpg`), used in the specs
  hero and detail gallery respectively.

### Real bug found and fixed: `var()` inside a multi-value `transition` shorthand silently fails to parse

While verifying the new page, entire sections appeared blank despite
correct-looking markup. Root-caused via direct CSS inspection (not
guesswork): `.reveal`'s `transition: opacity 0.9s var(--ease-out-expo),
transform 0.9s var(--ease-out-expo);` — defined back in the Awwwards pass —
**parses to empty `transition-property`/`duration`/`timing-function`
longhands entirely**, confirmed by reproducing it in isolation
(`div.style.cssText = 'transition: ...'` then reading back
`div.style.transitionProperty` etc., all empty strings). This wasn't
specific to the multi-value case either — a single-value
`transition: transform 1.1s var(--ease-out-expo);` and even
`animation: captionIn 0.45s var(--ease-out-expo);` failed the same way.
Net effect: the `.reveal.is-inview` override rule was never wrong, but the
*base* `.reveal` rule's transition silently never existed, and — this is
the part that actually broke rendering — investigating further showed
`opacity: 0` from the base rule doesn't get animated away without a working
transition once `is-inview` is added if something upstream also depends on
it (in this case, it meant reveal cycles that looked "stuck at opacity 0"
under certain timing).
- **Fix**: replaced every `var(--ease-out-expo)` used *inside* a
  `transition`/`animation` shorthand with the literal
  `cubic-bezier(0.16, 1, 0.3, 1)` value, in `index.css` (`.reveal`,
  `.reveal-mask > .reveal-line`, `.caption-swap`). The `--ease-out-expo`/
  `--ease-inout-quart` custom properties themselves are fine and still
  defined in `@theme` — they're just unsafe to reference from inside a
  shorthand property value; using them as literal values (which is what
  every other place in the codebase already did, e.g.
  `ease-[cubic-bezier(0.16,1,0.3,1)]` Tailwind arbitrary values) avoids the
  parse failure entirely. Confirmed fixed via the same isolated
  `div.style.cssText` repro (now returns the correct longhand values).
- **Separate tooling limitation surfaced while debugging this**:
  `IntersectionObserver` callbacks do not fire at all in this session's
  automated preview environment (confirmed with a minimal standalone
  `new IntersectionObserver(...).observe(div)` test that timed out after
  2s with zero callback firings) — almost certainly the same
  backgrounded-tab throttling documented earlier for `requestAnimationFrame`.
  This means `Reveal.tsx`'s scroll-triggered animations can't be exercised
  end-to-end via this tool's scrolling; verification for this page was done
  by manually adding `.is-inview` via `preview_eval` (simulating what the
  real observer does in a real browser) and confirming `getComputedStyle`
  then reports the correct `opacity`/`transform`, plus one full-page mobile
  screenshot that (unlike the desktop scroll-and-recapture flow) rendered
  every section correctly in one shot. **If new content added later to this
  site ever "looks blank" in this tool after scrolling, check
  `getComputedStyle` and manually toggle `.is-inview` before assuming a
  real bug** — this IntersectionObserver gap is now a known, recurring
  cause, distinct from the earlier rAF/video-seek tooling quirks.

## Fonts + background overhaul (this revision)

User feedback: the Space Grotesk/Inter pairing and the flat `#F2EEE3`
background read as generic "AI-template" defaults.

- **Fonts**: asked the user to clarify "don't use the font from installed
  library" — turned out to mean pick from fonts already installed locally
  rather than pulling something new. Checked `~/Library/Fonts` and found
  **Panchang** and **General Sans** (both Fontshare, free for commercial
  use) already present, alongside Gambetta and Satoshi from other projects.
  Chose **Panchang** for display (distinctive geometric character —
  angular "V"/"T" shapes read well for an adventure-tourer brand, and it's
  far less overused than Space Grotesk) and **General Sans** for body
  (clean, versatile, pairs well with Panchang's personality without
  competing with it). Copied the needed weights
  (Regular/Medium/Semibold/Bold/Extrabold for Panchang;
  Regular/Medium/Semibold for General Sans) into `public/fonts/` and
  self-hosted via `@font-face` in `index.css`, removing the Space
  Grotesk/Inter Google Fonts `<link>` from `index.html` (IBM Plex Mono
  stays on Google Fonts — never the complaint).
- **Background**: deepened `--color-bg` from `#F2EEE3` to `#EEE7D7` (and
  `--color-surface`/`--color-line` to match) — a warmer, richer stone/paper
  tone instead of the very pale, extremely common "SaaS light-mode cream."
  More importantly, added a subtle two-stop radial light-wash (soft white
  glow upper-left, soft ink shadow lower-right) directly on `body` *and* on
  the `.bg-bg` Tailwind utility class itself (via a plain CSS rule
  overriding the generated utility) — this means every section across the
  whole site using `bg-bg` picks up the same soft directional lighting
  automatically, without having to touch every component file individually.
  Combined with the existing film-grain overlay, backgrounds now read as a
  lit, textured surface rather than a flat single-hex fill.
- Verified: `tsc -b` and `oxlint` clean, fonts render correctly (visually
  distinct Panchang display type confirmed in hero headline, footer giant
  wordmark, and nav wordmark) on both the landing page and `/specs`, new
  background gradient visible and consistent across light sections (The
  Build, Product Showcase) and dark sections (footer) at both desktop
  (1280×800) and mobile (375×812) widths, no console errors.

## Follow-up: exact background color (this revision)

User asked to change "the color" to `#FFFDFD` (a near-white) right after
the stone-tone background change above — interpreted as `--color-bg`, the
most recent topic, rather than asking for clarification since the request
was short/direct and low-risk to redo if wrong. Updated `--color-bg` to
`#FFFDFD` and adjusted the dependent tokens that were tuned relative to the
old darker stone tone so they'd still read correctly against near-white:
`--color-surface` lightened to `#F5F1EC` (nav pills/cards need to stay
visibly distinct from an almost-white page background) and `--color-line`
lightened to `#E8E2D8` (the previous tan-ish line color would have looked
too dark/heavy as a hairline against near-white). The `.bg-bg` directional
light-wash and film grain from the previous change are untouched and still
apply on top of the new near-white base.

Verified via direct `getComputedStyle`/DOM inspection (the screenshot tool
hit its known blank-after-scroll quirk again mid-check — resolved same as
before by restarting the preview server) that nav, gallery, and footer all
render with correct contrast against the new background at 1280×800.

## Build-section imagery, Detail-section trim, footer polish (this revision)

- **`FeatureShowcase.tsx`** ("The Build"): the sticky card on the right used
  to be a single static image (the hero poster) with only the caption text
  changing per row. Gave each of the 6 features its own real photo instead
  (`studio-three-quarter`, `studio-rear-three-quarter-1`, `studio-front`,
  `forest-action-1`, `studio-headlight-detail`, `forest-action-2` — one per
  row, matched loosely to what the feature is about, e.g. the action shot
  for the 0–80 km/h stat). Image now crossfades on row change via a new
  `.media-fade` keyframe in `index.css` (`key={activeIndex}` remounts the
  `<img>`, triggering the animation). Card also got bigger: column split
  changed from 50/50 to 40/60 (list/image) and aspect ratio from a cramped
  `4/3` to a taller `4/5` portrait — confirmed via `getBoundingClientRect()`
  the card is now 672×840px at 1280 viewport width, up from roughly
  373×280.
- **`ProductShowcase.tsx`** ("In Detail"): removed the `forest-standing`
  (rider) tile per feedback. The bento grid was designed so this drops out
  cleanly — 5 items now tile a 6-col × 3-row grid exactly (4+2 split across
  two rows, then 3+3 in the third) with no leftover gap or banner needed.
  Updated the "6 FRAMES" counter label to "5 FRAMES".
- **`Footer.tsx`**: the giant background wordmark was a large
  (`clamp(90px,18.5vw,300px)`) outlined/stroked "VAULT" — shrunk to
  `clamp(60px,12vw,190px)` and switched from a `-webkit-text-stroke`
  outline to a plain low-opacity solid fill (`text-[#F4EFE4]/[0.08]`) per
  feedback to make it "fill not the outline." Removed the now-unused
  `.text-outline-light` CSS rule (the dark-surface `.text-outline` variant
  is still used by the marquee, so that one stays). Changed the credit line
  from "DESIGNED BY A.S." to "DESIGNED BY AMAN NAGINA".
- **Not done yet — waiting on a reference**: user mentioned wanting to
  reconsider the hero's video-scroll mechanic and potentially reuse a
  similar scroll-tied treatment in another section (Product Showcase or
  further down the landing page), but said they'd share a reference
  image/video first. No changes made toward this until that reference
  arrives.
- **New tooling-limitation data point**: while debugging a blank screenshot
  after this change, discovered CSS keyframe animations (not just
  `IntersectionObserver` callbacks and `requestAnimationFrame` loops, both
  documented earlier) can get frozen mid-progress in this automation
  environment — the new `.media-fade` crossfade was caught stuck at
  `opacity: 0.125` via `getComputedStyle`, matching the "backgrounded tab
  throttling" theory already suspected for the other two. Verified the
  underlying state was actually correct by force-finishing all animations
  via `document.getAnimations().forEach(a => a.finish())` (wrapped in
  try/catch — the infinite film-grain animation can't be `.finish()`'d and
  throws otherwise) before re-checking computed style. Added to the
  running list of "don't assume a real bug — check computed values and/or
  force-finish animations first" tooling quirks for this environment.

## Build-section width, Specs full-sheet heading, new front-headlight photo (this revision)

- **`FeatureShowcase.tsx`** ("The Build"): widened the sticky image column
  further per feedback — 40/60 (list/image) split changed to 33/67
  (`md:w-1/3` / `md:w-2/3`), and the card's aspect ratio switched from
  portrait `4/5` to a wider `16/11` on desktop so the extra width reads as
  a genuinely wider frame instead of a stretched portrait crop.
- **`SpecsPage.tsx`**: centered the "full sheet" spec-table section
  (`max-w-5xl` → `max-w-6xl mx-auto`, was left-aligned with dead space on
  the right). Added a large centered "Engineered in every line." heading
  directly above "The full sheet" label row — this text previously lived
  as the Detail Gallery's heading further down the page; moved it up front
  (per feedback) and renamed the Detail Gallery heading to "Every surface,
  considered." to avoid the duplicate.
- **New asset — `public/images/studio-front-headlight.jpg`**: a new
  head-on studio photo (headlight ring lit, copper tank shrouds, dark
  charcoal background) provided by the user. Pasted images in chat are
  **not** accessible on disk to the agent — this had to be re-requested as
  a saved file (`~/Downloads/Motorcycle_headlight_fender_tire_2K_*.jpg`)
  before it could be used; copied into the project and downsized via
  `sips` (1.86MB → ~218KB, capped at 2000px wide, quality 82) to match the
  size of the other studio photos.
  - **False start**: initially wired this image into the *Specs page*
    hero, with the old rear-3/4 shot demoted to a smaller band below it.
    User clarified they meant the **landing page** hero, not Specs — this
    was reverted (Specs hero is back to the original single
    `studio-rear-three-quarter-1.jpg`, no second image band).
- **New `IntroHero.tsx`** — the actual landing-page hero, inserted as the
  very first section (`LandingPage.tsx`: `<IntroHero /> <Hero /> ...`).
  Went through two iterations:
  1. First pass: a padded, rounded-card treatment (`rounded-3xl`,
     `aspect-[16/9]`, shadow) matching the Specs hero pattern.
  2. Per follow-up feedback ("photo must fill the full view", "do some
     cool things with text like overlay"), rebuilt as a true full-bleed
     hero: `min-h-[100dvh]`, image `absolute inset-0 object-cover`, no
     padding/card around it. Headline ("Nothing hidden.") uses
     `mix-blend-difference` sitting directly on the photo — inverts
     against whatever's beneath it (dark frame vs. bright headlight ring)
     so the type reads as cut into the image rather than laid over it,
     without needing a heavy scrim for legibility. Kept light top/bottom
     gradient scrims only for nav and CTA-row legibility. CTA button
     upgraded to a nested "button-in-button" arrow chip
     (`bg-black/15` circle that translates on hover) per the
     `high-end-visual-design` skill's component patterns.
  - The existing video-scroll `<Hero />` (3-layer blur compositing,
    real-audio-grain SFX, explode/reassemble scroll animation) was **not
    removed** — just moved to sit directly below `IntroHero` as the
    second section. Its internal eyebrow label was changed from
    "The Vault One" (now used by `IntroHero` instead) to
    "Scroll to explode" to avoid the duplicate tag between the two hero
    sections. `<Nav>` is `position: fixed`, so its DOM ownership staying
    inside `Hero` (now the second component) doesn't affect it visually —
    it still renders pinned to the top of the viewport regardless of
    section order.
  - **Not yet named**: the user explicitly deferred deciding what to call
    this second (video) section and what copy/label it should carry —
    revisit once they decide.
- Verified all of the above at both desktop (1280px) and mobile (375px)
  viewports via the preview tool; used the established
  `.reveal`/`.reveal-mask` force-`is-inview` + `document.getAnimations()
  .forEach(a => { try { a.finish() } catch(e) {} })` workaround to get
  past the IntersectionObserver-never-fires environment limitation before
  screenshotting.

## Brand rename to AUREX, split flanking headline, nav re-center, video-hero text trim (this revision)

- **Brand rename, VAULT → AUREX**, across all user-facing text: `Nav.tsx`
  logo, `Footer.tsx` (wordmark, giant background mark, copyright line),
  `index.html` `<title>`, all `alt` text in `ProductShowcase.tsx` /
  `SpecsPage.tsx` / `IntroHero.tsx`, `AdventureSection.tsx` body copy,
  `Marquee.tsx` phrase list, and `IntroHero.tsx`'s eyebrow tag. Internal
  asset filenames (`vault-hero.mp4`, `vault-hero-audio.wav`, the `vault/`
  project directory itself) were **not** renamed — those are dev-only
  paths, not user-visible.
- **`Nav.tsx`**: logo is now absolutely centered on the viewport
  (`absolute left-1/2 -translate-x-1/2` — works regardless of how wide the
  two side groups are, since `nav` is `fixed` and so is the containing
  block for the absolute child). The nav-links pill and the sound-toggle +
  Reserve cluster sit at the natural flex ends via `justify-between`. Had
  to hide the sound-toggle button below `sm:` — at 375px the centered logo
  pill and the right-side cluster (sound button + Reserve) were physically
  overlapping; dropping the secondary sound toggle on mobile (Reserve
  alone is narrower) fixed the collision without affecting desktop.
- **`IntroHero.tsx`**: headline changed from a single stacked block to two
  words flanking the bike — "Nothing" pinned left, "hidden." pinned right,
  both vertically centered (`inset-y-0 ... flex items-center`), still
  `mix-blend-difference` against the photo. First pass used the same large
  type scale as the old stacked headline and the two words collided in the
  middle at anything under ~1280px wide (confirmed via `window.innerWidth`
  — 941px was already overlapping). Fixed by scaling type down
  significantly at the base/`sm`/`md` breakpoints and only letting it get
  large at `lg`/`xl`. Below `sm` (mobile), flanking doesn't have room at
  all — added a separate mobile-only stacked variant (`sm:hidden`, two
  lines top-to-bottom instead of side-to-side) rather than trying to force
  the flanking layout to fit.
- **`Hero.tsx`** (the video section, now second on the page): removed the
  full headline/paragraph/CTA block per feedback — kept only the small
  "Scroll to explode" label (this section doesn't have a name/role decided
  yet, per the earlier note). Removed the now-unused `Magnetic` import
  since its only usage in this file was the deleted CTA button.
- Verified brand rename, nav centering (incl. the mobile collision fix),
  the flanking headline at 941px/1440px, the mobile stacked fallback at
  375px, and the trimmed video-hero section — all via the preview tool
  with the standard `.reveal`/`is-inview` + `getAnimations().finish()`
  workaround.
- **Still pending**: the new close-up handlebar/headlight photo the user
  shared to potentially replace/compare against the current
  `studio-front-headlight.jpg` hero image — same as before, pasted images
  aren't accessible on disk; waiting on the user to save it and share the
  filename.

## Close-up hero photo trial (rejected), Radian-style nav bar (this revision)

- **New asset — `public/images/studio-front-closeup.jpg`**: the
  previously-pending close-up handlebar/headlight photo, saved by the user
  as `~/Downloads/Front.png` (a PNG despite the visual look of a JPEG —
  converted properly via `sips -s format jpeg`, since just renaming the
  extension left the file as PNG bytes with a `.jpg` name). Compressed to
  2200px wide / quality 82, ~280KB.
  - **Tried as the `IntroHero` hero image, then reverted.** The crop is
    much tighter than the current hero photo (headlight fills most of the
    frame, handlebars nearly touch the edges), which left no clear space
    for the flanking "Nothing" / "hidden." headline — "hidden." landed
    directly on the bright headlight ring and became unreadable, "Nothing"
    crowded into the copper tank shroud. Confirmed via a live swap +
    screenshot, not just visual inspection of the source photo. Kept
    `studio-front-headlight.jpg` as the hero; `studio-front-closeup.jpg`
    is saved and available for a context that doesn't need side margins
    for text (e.g. the Specs page detail gallery) — not yet used anywhere.
- **`Nav.tsx` — full rebuild**, moving away from the floating glass-pill
  nav to an edge-to-edge solid bar, per a Radian-site reference the user
  shared (full-width dark bar, centered wordmark, plain-text links with a
  hover background fill, solid CTA pill). Kept the interaction pattern but
  used the site's own palette rather than Radian's black/yellow: `bg-ink/95
  backdrop-blur-md` bar, `#F4EFE4` (cream) text, `hover:bg-white/10` as the
  "background appears on hover" fill, existing copper CTA pill unchanged.
  Structure: single "The Build" link far left (mirrors the reference's
  single left-side link), centered "AUREX" wordmark (plain text now, no
  pill — the whole bar is already a solid surface), "Specs"/"Support" +
  sound toggle + Reserve pill on the right.
  - **Mobile bug found and fixed**: with the left link and right-side
    text links both hidden below `sm:` and only the Reserve button left
    in the flex flow, `justify-between` has just one flex item to
    position — which CSS resolves to flex-start, not flex-end, so Reserve
    rendered pinned to the **left** on mobile instead of the right. Fixed
    with `ml-auto` on the right-hand button cluster so it stays pinned
    right regardless of how many siblings are visible at a given
    breakpoint.
  - Verified the hover fill by programmatically forcing the hover class
    via `preview_eval` + an injected `<style>` override (can't trigger a
    real `:hover` pseudo-class through the automation tooling) and
    screenshotting — confirmed the light fill renders correctly behind
    "Specs". Also verified the bar reads fine both over the photo hero
    (`IntroHero`) and over the light Specs-page background, and re-checked
    mobile after the `ml-auto` fix.

## IntroHero rebuilt around the Radian reference layout (this revision)

- User flagged a grey box appearing behind the bottom copy/CTA row "only on
  hover" in a screenshot of the previous (flanking-headline) `IntroHero`.
  Root cause not conclusively isolated — the previous layout's full-width
  bottom scrim (`inset-x-0 bottom-0 h-40 ...`) is the only candidate in the
  code, and it wasn't actually hover-gated, so this may have been a
  perception thing (the scrim became more noticeable once the user
  interacted with that row). Moot either way: this revision replaces that
  full-width bottom bar entirely, so the specific element in question no
  longer exists.
- **`IntroHero.tsx` — restructured to match a Radian-site reference** the
  user shared (single bottom-left copy block — eyebrow, two-line headline,
  paragraph, two CTA pills — plus a floating secondary-photo card bottom
  right and a centered "Scroll" cue under the bike), rather than
  reinventing from scratch:
  - **Hero image switched to `studio-front-closeup.jpg`** (the close-up
    handlebar/headlight shot that was rejected two revisions ago for the
    flanking-headline layout). It works now because this layout only needs
    the *left* side of the frame to stay legible — a left-to-right
    gradient vignette (`w-full sm:w-3/5`, ink 75%→transparent) grounds the
    copy block without needing to protect both edges the way the flanking
    layout did. `object-[58%_center]` shifts the crop slightly right so
    the headlight isn't dead-center behind the text.
  - **Headline reverted to a single block**, "Built to go further." — this
    phrase was freed up when it was deleted from `Hero.tsx` in the
    previous revision, so no duplicate copy across the two hero sections.
  - **Secondary CTA promoted from a text link to a real pill button**
    (`bg-[#F4EFE4]` / ink text, same nested-arrow-chip treatment as the
    primary), matching the reference's white "Explore the bike" pill
    instead of the plain arrow-link it was before.
  - **New floating card, bottom-right** (`hidden md:flex` — no room on
    mobile/tablet): a small glass panel (`bg-white/10 backdrop-blur-md`)
    with a 64px thumbnail (reusing `studio-front-headlight.jpg`, the full
    front-elevation shot) and "See the full build / Every angle →",
    linking to `#the-build`. Answers the user's "these sections stay on
    the right side" note — mirrors the reference's floating video
    thumbnail in the same corner, using a photo since there's no release
    video for this project.
  - **Scroll cue** (small "SCROLL" label + bouncing chevron, reused from
    `Hero.tsx`'s own indicator pattern) added bottom-center, `hidden
    sm:flex`.
- Verified full layout at 1280px, mobile (375px, vignette goes full-width
  there since there's no room to spare, floating card and scroll cue
  correctly hidden), using the standard `.reveal`/`is-inview` +
  `getAnimations().finish()` workaround.

## IntroHero refinements + Hero video-section reframe (this revision)

- **`IntroHero.tsx`**:
  - **Left-side vignette is now hover-only**, per feedback that it
    shouldn't sit permanently behind the copy block. Restructured so the
    vignette and the copy block share one `group` wrapper sized to the
    left ~60% of the viewport (`inset-y-0 left-0 w-full sm:w-3/5`); the
    vignette itself is `opacity-0 group-hover:opacity-100`. Added a
    `text-shadow` (inline style, `0 2px 24px rgba(0,0,0,0.55)`) on the
    copy block as a baseline-legibility fallback for when it's *not*
    hovered, since there's no permanent scrim to lean on anymore.
    Nested-arrow CTA hover state had to move from `group`/`group-hover` to
    a named group (`group/cta`, `group-hover/cta`) since the outer
    hover-zone now already claims the unnamed `group`.
  - **Fixed a clipped descender** on "Built to go" / "further." — the
    line-reveal wrapper's `overflow-hidden` was clipping the bottom of
    letters like "g" at `leading-[0.95]`. Loosened to `leading-[1.08]` and
    added `pb-[0.15em] -mb-[0.15em]` on each line's overflow wrapper so
    there's room for descenders without changing the visible line spacing.
  - **Fixed a mid-viewport line-wrap bug** introduced while fixing the
    above: "Built to go" was wrapping to two lines inside its `max-w-lg`
    container around 940px-wide viewports, breaking the mask-reveal
    animation's one-line-per-span assumption. Fixed with `whitespace-nowrap`
    on the `<h1>` and stepping the font size down a notch at the base/`sm`
    breakpoints (`text-[2.5rem] sm:text-[3.25rem] lg:text-[4.5rem]`, was
    `2.75/3.75/4.5`).
  - **Floating card, bottom-right, enlarged into a mini two-photo
    gallery** — replaced the single 64px thumbnail + text-row with two
    96–112px tiles side by side (`studio-headlight-detail.jpg` /
    `forest-action-1.jpg`), each with its own gradient + short overlay
    caption ("Headlamp" / "On the trail"), matching the ProductShowcase
    tile-caption pattern instead of a single label to the side.
- **`Hero.tsx`** (the video section):
  - **Removed the scrim entirely** (`scrimRef` div + its opacity wiring in
    `applyVisuals`) per feedback — the "Scroll to explode" label now relies
    on a `text-shadow` for legibility instead of a background gradient.
  - **Added breathing room + rounded corners around the video card.**
    First attempt inset the sticky container horizontally too
    (`mx-4...mx-16` + `rounded-3xl`, with `stickyRef` + a new
    `getContainerSize()` helper feeding the mask/callout math the
    container's actual `clientWidth`/`clientHeight` instead of
    `window.innerWidth/innerHeight`, since the container was no longer
    viewport-sized). **This reintroduced the hard rectangle seam** the
    3-layer blur system was originally built to eliminate — narrowing the
    container changed its aspect ratio enough to expose an edge case in
    the fixed-percentage feather/ring-width constants. Rather than retune
    those constants against a variable container size, reverted to a
    lower-risk fix: the sticky container stays exactly viewport-width
    (`w-full`, no horizontal margin) — only vertical spacing changed
    (`pt-16 sm:pt-24 / pb-16 sm:pb-24` on a new outer wrapper around the
    unchanged `h-[300vh]` scroll div). `rounded-3xl` still reads clearly
    at the top/bottom edges against that new whitespace, without touching
    width at all, so the mask math needed no changes and the seam is
    gone. `getContainerSize()`/`stickyRef` were kept (harmless now that
    container size again equals viewport size, and more resilient if
    horizontal insetting is revisited later — next time, retune
    `featherPct`/`ringHalf` against the new aspect ratio rather than
    assuming the old constants transfer).
  - Verified via screenshots at several scroll depths (0%, ~50%, ~90%,
    ~fully scrubbed) that the seam is gone, masks/callouts still align
    correctly, and the rounded top/bottom edges + spacing read cleanly
    both entering and leaving the section.

## Sound removed, IntroHero card revert + enlarge, Specs full-screen hero (this revision)

- **Sound removed entirely, site-wide.** `Nav.tsx` lost the
  volume-toggle button and its `soundOn`/`onToggleSound` props;
  `Hero.tsx` lost the `createSfxEngine` import/instance, the
  `soundOn`/`soundOnRef` state, the grain-firing block inside
  `applyVisuals` (`GRAIN_STEP`/`GRAIN_DURATION`/`ACCENT_CUES`,
  `grainAccumulator`, `lastScrubT`), and the `sfxRef.current?.unlock()`
  call. Deleted the now-dead `src/lib/sfx.ts` module (and the empty
  `src/lib/` dir) and `public/video/vault-hero-audio.wav`, since nothing
  referenced either anymore (confirmed via grep before deleting).
- **`IntroHero.tsx`**:
  - Vignette **reverted to always-on** per feedback — the hover-only
    behavior from the previous revision was undone; back to a permanent
    `bg-gradient-to-r from-ink/80 via-ink/35 to-transparent` with no
    `group`/opacity wiring. CTA hover chips reverted from the `group/cta`
    named-group workaround back to plain `group`/`group-hover` now that
    there's no competing outer hover-zone.
  - **Floating card reverted from a 2-photo side-by-side gallery back to
    a single photo**, but now cycling through 4 shots on a 2.6s
    `setInterval` (`CARD_PHOTOS` + `cardIndex` state), crossfading via the
    existing `.media-fade` keyframe and `key={cardIndex}` remount —same
    pattern as `FeatureShowcase`'s per-row image swap. Enlarged
    substantially per feedback: `w-28 h-36` → `w-40 h-52` (`lg:` `w-32
    h-40` → `w-48 h-60`), caption text bumped `11px` → `13px` with more
    padding to match.
  - **Fixed a real clipping bug**, not just the earlier descender issue:
    at full desktop width the right edge of "go" (the "O") was getting
    cut by the line-reveal wrapper's `overflow: hidden`, a subpixel
    rounding gap the earlier descender fix didn't cover on the right
    side. Added matching horizontal padding (`pr-[0.08em] -mr-[0.08em]`)
    alongside the existing vertical fix. Verified at 1920px via
    `getBoundingClientRect` on the `<h1>` directly, not just a screenshot.
- **`SpecsPage.tsx` hero — rebuilt as a full-screen photo hero**,
  matching `IntroHero`'s treatment (`min-h-[100dvh]`, photo
  `absolute inset-0 object-cover`, left-side vignette, overlaid copy),
  replacing the old padded/rounded-card hero. New photo:
  `studio-copper-three-quarter.jpg` (copied from
  `~/Downloads/Copper_adventure-tourer_motorcyc…_2K_202607071402 (1).jpg`,
  compressed via `sips` to ~424KB). Headline and stat figures switched
  from ink to white text with a text-shadow for legibility against the
  photo, same as the landing hero.
  - **Found and fixed a genuine content-loss clipping bug while
    verifying**: "accountable." was rendering as "accountab" with the
    rest silently gone. Root cause — the hero's copy column is now much
    narrower (60%-of-viewport vignette zone, not the old full-width
    section), and "accountable." is a single unbreakable word; when it's
    wider than its `.reveal-mask` container, `white-space: normal` can't
    find a break point so the browser lets it overflow horizontally
    instead of wrapping, and the mask's `overflow: hidden` silently clips
    the overflow rather than showing it. Fixed two ways: reduced the
    `<h1>`'s base/`sm` font sizes (`3.25rem` → `2.5rem` at `sm`) so the
    word fits without needing to break, and added `break-words` as a
    safety net so any future long word wraps visibly instead of vanishing.
  - **Applied the same descender-padding fix from `IntroHero` globally**
    instead of locally: added `padding-bottom: 0.15em; margin-bottom:
    -0.15em` directly to the shared `.reveal-mask` rule in `index.css`,
    since `Reveal`'s `variant="mask"` (used here, in `AdventureSection`,
    and in `ClosingCta`'s "Go further") shares this exact clipping risk
    at large font sizes. Checked all three other usages after the change
    (`ClosingCta`'s "Go / further." in particular, which has descenders
    on both "g" and "f") — all render correctly with no added visual gap.
- Verified: landing hero at 1280px and 1920px (nav has no sound button,
  headline fully intact, card enlarged and rotating), Specs hero at
  ~940px (the width that originally exposed the clipping bug), and the
  ClosingCta/AdventureSection mask-reveal headlines elsewhere on the site
  — all via the standard `.reveal`/`is-inview` +
  `getAnimations().finish()` workaround, `tsc -b --noEmit` clean
  throughout.

## Nav bar transparent-by-default + adaptive text color, wider IntroHero card (this revision)

- **`Nav.tsx`**: removed the permanent `bg-ink/95 backdrop-blur-md` bar —
  the nav is now fully transparent by default; a grey/white fill only
  ever appears on hover of an individual item (logo included now, which
  previously had no hover state at all).
- **Found and fixed a legibility regression this created, before the user
  had to ask.** With no permanent bar, the nav's light cream text (tuned
  for sitting on dark photo/video sections) went almost unreadable over
  the site's light `bg-bg`/`bg-surface` sections — confirmed via
  screenshot on the Specs page's spec-table section, not just guessed at.
  Surfaced this to the user with the screenshot before proceeding (via
  `AskUserQuestion`) rather than silently shipping a half-broken nav;
  they picked adaptive color over leaving it broken or reintroducing a
  permanent scrim.
  - **Implementation**: `Nav` now samples whatever's actually rendered
    behind it on scroll (throttled via `requestAnimationFrame`) —
    temporarily sets its own `pointerEvents: none`, calls
    `document.elementFromPoint(viewportCenterX, 36)` to find the element
    at the nav's vertical center, walks up the DOM for the first
    ancestor with a non-transparent `background-color`, and computes its
    perceived luminance (`0.299r + 0.587g + 0.114b`). Above a `0.6`
    threshold it flips to dark ink text (`text-ink/70`,
    `hover:bg-ink/8`); below it, cream text on a white hover fill, as
    before.
  - Deliberately **generic rather than hardcoded per-section** — no
    `data-theme` attributes needed on `IntroHero`/`Hero`/`Marquee`/etc.
    Works because every section already sets an explicit `bg-ink` or
    `bg-bg`/`bg-surface` class on its own root element, which is exactly
    what the ancestor-walk picks up. Verified across sections that
    weren't specifically mentioned by the user — the dark
    `AdventureSection` further down the landing page, the light
    full-spec-table section on Specs — confirming it generalizes rather
    than only working for the two sections directly discussed.
  - Hit the documented "stale screenshot" tooling quirk again while
    verifying scroll-driven changes (`window.scrollY` updates correctly
    but the screenshot tool kept rendering the pre-scroll frame) — this
    time a full `preview_stop`/`preview_start` didn't fully resolve it on
    its own; a small `scrollBy(0,1)/scrollBy(0,-1)` nudge after
    navigating was needed to force a repaint the screenshot tool would
    actually pick up. Worth remembering alongside the existing
    stop/start remedy.
- **`IntroHero.tsx`**: floating card widened further per feedback —
  `w-40` → `w-64` (`lg:` `w-48` → `w-80`), height unchanged, so it reads
  as a landscape photo card rather than the previous tall portrait crop.

## Small type/opacity polish pass (this revision)

- **`IntroHero.tsx`**: "THE AUREX ONE" eyebrow tag bumped `11px` →
  `13px` and `font-mono` → `font-mono font-semibold` (heavier weight).
  Both CTA buttons' label text bumped `13px` → `16px` (the nested
  arrow-chip size was left unchanged).
- **`SpecsPage.tsx`**: "Every surface, considered." (Detail Gallery
  heading) center-aligned — added `text-center` and `mx-auto` alongside
  its existing `max-w-xl`.
- **`Footer.tsx`**: giant background "AUREX" wordmark opacity raised
  `8%` → `12%` (a 50% relative increase, per "increase opacity to 50%
  more") — still reads as a subtle background texture, just more present
  than before.
- Verified all four on the live preview (landing hero, Specs detail
  gallery, footer) using the standard `scrollBy(0,1)/scrollBy(0,-1)`
  repaint nudge after navigation/scroll.

## Video section removed from the landing page (this revision)

- **`Hero.tsx` (the scroll-scrubbed video section) deleted entirely** —
  removed from `LandingPage.tsx`, the component file deleted, and its
  now-orphaned assets removed: `public/video/vault-hero.mp4`,
  `public/video/vault-hero-poster.jpg` (confirmed via grep that nothing
  else referenced either before deleting). `vault-hero-audio.wav` and
  `src/lib/sfx.ts` were already gone from an earlier revision.
  `mountain-ride.mp4` (used by `AdventureSection`) is untouched.
- **`Nav` had to move** — it was only ever rendered inside `Hero.tsx`
  (safe before because `position: fixed` means DOM ownership doesn't
  affect where it visually sits). Deleting `Hero` would have deleted the
  landing page's nav entirely. Moved the `<Nav loaded={loaded} />` call
  into `IntroHero.tsx` instead, reusing `IntroHero`'s own `loaded` state
  (the same font-ready flag it already uses for its own load-in
  animation) rather than adding a second one.
  - This closes out the whole video-hero saga from earlier in the
    project: 3-layer blur compositing, real-audio-grain SFX, scroll-
    scrubbed explode/reassemble, the hard-seam mask math, the rounded-
    corners regression — all of that is gone now, not just unused.
- Landing page flow is now: `IntroHero` → `Marquee` → `FeatureShowcase`
  ("The Build") → `ProductShowcase` → `AdventureSection` →
  `ClosingCta` → `Footer`.
- Verified: `tsc -b --noEmit` clean, nav still renders and is centered
  correctly on the landing page (now sourced from `IntroHero`), and the
  page flows directly from `IntroHero` into `Marquee`/`FeatureShowcase`
  with no gap or leftover scroll-height from the deleted 300vh wrapper.

## Link/anchor fixes, clipping fix, premium animation pass (this revision)

- **`IntroHero.tsx` "Explore the build" CTA and the floating detail card**:
  both used to anchor-scroll to `#the-build` on the same page, landing
  with the fixed nav overlapping the section's first item (user reported
  it visually "starting from the 2nd point"). Per feedback, both now
  navigate to **`/specs`** instead (`react-router` `Link`, not an anchor)
  — makes more sense anyway, since "explore the build" and "see the full
  build / every angle" both describe the full spec sheet, not a scroll
  position on the landing page.
  - Converting the floating card from `<a href="#the-build">` (itself
    `absolute`-positioned, which incidentally also served as the
    containing block for its `absolute inset-0` image/gradient children)
    to a `<Link>` required restructuring: entrance animation
    (opacity/translate, slow + delayed) now lives on an outer wrapper
    div, hover-lift (translate/shadow, fast) lives on the inner `Link`
    — sharing one `transition` property list between both would have
    either delayed the hover response by the entrance's 520ms or made
    the entrance itself snap in too fast. Had to explicitly re-add
    `relative` to the `Link` since it's no longer the `absolute`-positioned
    element that implicitly established the positioning context for its
    children.
  - **Audited other internal links while in there**: `AdventureSection`'s
    "Our story" and `Footer`'s "Our story" both also point at
    `/#the-build` — semantically odd (no "story" content exists to link
    to) but left alone since there's no better destination yet and
    changing them wasn't requested; flagged here for whenever an
    About/Story page gets built.
  - **Fixed the underlying anchor-behind-nav issue generically**: added
    `scroll-mt-20` to `#the-build` (`FeatureShowcase.tsx`) and `#reserve`
    (`ClosingCta.tsx`) so any remaining same-page anchor links (Nav's
    "The Build", the Reserve CTAs) land with breathing room below the
    fixed nav instead of tucking the section's top edge behind it.
- **Fixed a real clipping bug in `ClosingCta.tsx`**: "First batch — Spring
  2027" was getting clipped at wide/full-screen viewports. Root cause —
  it lived inside the same flex row as "further." within a
  `.reveal-mask` (`overflow: hidden`); at the type's clamp max (180px),
  "further." alone nearly filled the mask's rendered width, leaving no
  room for the label, which doesn't wrap (`whitespace-nowrap`) so it
  overflowed and got clipped rather than pushed to a new line. Fixed by
  moving the label out of the reveal-mask entirely — it's now a sibling,
  absolutely positioned (`left-full` off an `inline-block` wrapper around
  just "further.") instead of sharing the masked flex row. Verified via
  direct `getBoundingClientRect` at 1920px (`fullyVisible: true`, not
  just a screenshot — screenshots at that viewport were hitting the
  known "narrow strip" rendering artifact, confirmed via `innerWidth`/
  `bodyWidth` matching 1920 while the screenshot itself showed a
  ~400px-wide column, so the real check had to be DOM-level).
- **Premium animation pass**:
  - New `src/components/ui/CountUp.tsx` — IntersectionObserver-triggered,
    single rAF tween (ease-out-expo curve, matching the site's shared
    easing), no extra libraries — same architectural pattern as
    `Reveal`/`Magnetic`. Wired into the Specs page hero stats (42 kW,
    140 km, 3.4 sec), which now count up from 0 once scrolled into view.
  - **Shine-sweep hover** added to the two primary copper CTA buttons
    (`IntroHero`'s "Reserve your build slot", `ClosingCta`'s "Configure
    now") — a soft diagonal light band crosses the button on hover via a
    `group-hover:translate-x-full` gradient span. Deliberately *not*
    added to the small persistent Reserve button in `Nav` — it's always
    on screen across every page, and constant shine motion there would
    read as noise rather than a hero moment.
  - **Hover-lift** added to `IntroHero`'s floating detail card
    (`hover:-translate-y-1.5` + a deepened shadow) — appropriate since
    it's a genuinely isolated floating element. Deliberately *not* added
    to the gapless bento grids (`ProductShowcase` tiles, Specs page
    Detail Gallery / Ride Modes) — those are edge-to-edge by design
    (`gap-px bg-ink`), and lifting a tile there would visually break the
    seamless-grid aesthetic those sections were built around.
- Verified via `tsc -b --noEmit` (clean) and direct DOM inspection
  (`getBoundingClientRect`/`getComputedStyle`) throughout, since the
  preview tool's screenshot capture was unreliable this session — stuck
  rendering stale/narrow frames even after a full `preview_stop`/
  `preview_start` restart, while `window.innerWidth`, element positions,
  computed opacity, and background colors all confirmed correct
  rendering underneath. Noting this as a more stubborn instance of the
  already-documented screenshot staleness quirk — a restart didn't clear
  it this time, direct DOM measurement was the reliable fallback.

## Section-label cleanup, Build-section motion/sizing, interactive ride modes (this revision)

- **Numbering removed from two section labels** per feedback:
  `FeatureShowcase.tsx` "01 — The Build" → "The Build",
  `ProductShowcase.tsx` "02 — In Detail" → "In Detail". Left
  `AdventureSection`'s "03 — Beyond the build" and `ClosingCta`'s
  "04 — Reserve" untouched — not mentioned, and changing those wasn't
  asked for.
- **`FeatureShowcase.tsx` ("The Build") list-item motion changed from
  horizontal to vertical** — the active item used to just shift right
  (`translate-x-1.5`) and darken; now inactive items sit offset down
  (`translate-y-2`, dimmed to 70% opacity) and the active one rises to
  `translate-y-0` at full color as its turn comes up while scrolling —
  reads as each name "arriving" from below rather than sliding sideways,
  per feedback ("naming should come from down to up").
  - Confirmed the "photo stays pinned, releases once the last item
    clears" behavior the user described was **already correct** — no new
    code needed. The sticky image column and the taller text column are
    flex siblings (default `align-items: stretch`), so the sticky element
    is bounded by the shared row height and naturally un-sticks once the
    last item scrolls past, standard CSS sticky behavior. Documented this
    inline so it isn't second-guessed or "fixed" again later.
  - **Sticky image card enlarged** to cover more of the right side per
    feedback: dropped the `aspect-[16/11]` cap on desktop in favor of
    `md:h-[85vh]` (was capped by aspect ratio within a shorter column),
    and trimmed the wrapper's vertical padding (`py-8 md:py-12` →
    `py-6 md:py-8`) to give it more room to actually reach that height.
- **Specs page "One chassis, three moods" ride-mode cards made
  interactive** — previously `RIDE_MODES` had a hardcoded `highlight`/
  `flex` per item (Trail always active/wider, no way to change it).
  Converted to `<button>` elements driven by `activeMode` state
  (`useState`, defaults to `'Trail'`): clicking any card makes it the
  active one — background flips to ink/cream, `flex-[1.6]` moves to
  whichever is active (`transition-[flex-grow,flex-basis] duration-500`
  animates the width change), and a new hollow-ring indicator (top-right
  of each card) fills solid when active. Added `hover:bg-ink/5` on
  inactive cards and `aria-pressed`/`cursor-pointer` for real
  affordance — this used to just be static, unclickable content.
  - Verified via a real click simulation (not just visual inspection):
    clicked "Eco", confirmed via `getBoundingClientRect` that it became
    the wider card (346px vs 216px for the other two) and
    `aria-pressed` flipped correctly on all three buttons.
- **Screenshot tool stayed unreliable for this entire turn** — blank/
  stale renders on both pages regardless of restarts. Relied entirely on
  `getBoundingClientRect`/`getComputedStyle`/live click simulation for
  verification instead, including discovering along the way that
  Tailwind v4 applies `translate-y-*` via the standalone CSS `translate`
  property, not `transform` — checking `getComputedStyle(el).transform`
  for translate utilities returns `"none"` even when correctly applied;
  `getComputedStyle(el).translate` is the one that actually reflects it.
  Worth remembering for any future motion-related debugging in this
  Tailwind v4 project.

## FeatureShowcase redesign (design-taste-frontend-v1), In Detail image relocation (this revision)

- **`FeatureShowcase.tsx` ("The Build") redesigned** per feedback to feel
  "cooler," invoking the `design-taste-frontend-v1` skill for direction.
  Applied its taste principles (kinetic progress indicators over flat
  numbering, materiality via mouse-tracked light, typographic depth)
  while deliberately keeping this project's own existing animation
  architecture (`Reveal`/rAF-driven scroll effects) rather than pulling
  in the skill's default stack (Framer Motion, Geist font, Next.js
  RSC) — none of which this Vite SPA uses, and introducing them now
  would fragment the codebase's established, already-premium identity
  documented throughout this file.
  - **Flat "01/02..." index numbers replaced with a kinetic timeline
    rail** — a vertical progress line (`bg-copper`, height driven by the
    same scroll-fraction the sticky image's parallax already computes)
    with a dot per item that fills/grows when active, closer to a
    scrollytelling progress indicator than a plain numbered list.
  - **Active item now shows its `value` tag** (e.g. "Peak power") in a
    small copper label beneath the label, animated in via a
    `grid-template-rows` 0fr→1fr transition (an all-CSS accordion-reveal
    trick — no JS height measurement needed) — adds a second layer of
    typographic hierarchy that was previously only visible on the image
    card's caption.
  - **Giant ghost index number** (`text-outline`, the same utility
    `Marquee.tsx` uses) placed as ambient background texture behind the
    list — ties into the site's existing "engineered/blueprint" visual
    language (corner ticks, mono labels) rather than introducing a new
    motif.
  - **Mouse-tracked spotlight** added to the sticky image card — a soft
    radial light follows the cursor via CSS custom properties
    (`--spot-x`/`--spot-y` set in `onMouseMove`, read by a
    `radial-gradient` overlay), visible only on hover
    (`opacity-0 group-hover:opacity-100`) so it doesn't distract during
    normal scroll.
  - **Flat trailing counter on the image card replaced with a "Live"
    breathing indicator** (`animate-ping` dot + label) — the header
    above the list already shows the `02 / 06` count, so the duplicate
    number on the card was redundant; a pulsing live-status dot reads as
    more premium and ties into the "engineered" data-readout aesthetic.
- **`ProductShowcase.tsx` ("In Detail") — removed the bottom two tiles**
  (`forest-action-1.jpg`/`forest-action-2.jpg`, the "Dust doesn't slow it
  down" / "Built to be pushed" field-test shots) per feedback. The
  remaining 3-item grid retiles cleanly with no gaps — confirmed the
  `md:col-span-4 md:row-span-2` hero tile plus two `md:col-span-2` tiles
  auto-flow into a tidy 2-row bento without needing span adjustments.
  Counter label updated `STUDIO + FIELD — 5 FRAMES` → `STUDIO — 3 FRAMES`.
- **`AdventureSection.tsx` — the two removed tiles relocated here**, per
  "add to below section." The existing 2-image `DUO` (mountain-2/
  mountain-3) became a 4-image `GALLERY`, same `grid-cols-1 sm:grid-cols-2`
  layout naturally tiling into a 2x2 on desktop / stacked column on
  mobile with no layout changes needed — just two more array entries.
- Verified via a full restart-then-DOM-check cycle (the screenshot tool
  was blank/stale again at the start of this turn — a second
  `preview_stop`/`preview_start` did eventually clear it this time,
  unlike last turn) plus direct `getBoundingClientRect`/`getComputedStyle`
  checks on the new timeline rail, ghost number opacity, and "Live"
  indicator before trusting the screenshots.

## Video hero returns (new source clip), site-wide smooth scroll via Lenis (this revision)

- **Asked two clarifying questions before building** (per the user's own
  invitation) rather than guessing on a system with real history here:
  this is functionally a rebuild of the scroll-scrubbed video hero that
  was designed, iterated on through several bugs, and then **fully
  deleted** earlier in this project at explicit user request — worth
  being deliberate this time rather than repeating the cycle. Confirmed:
  (1) smooth-scroll implementation — add **Lenis** rather than hand-roll
  one, since it wraps native scroll (keeps `position: sticky`, anchor
  links, and every existing `getBoundingClientRect`/`window.scrollY`
  read in this codebase working unchanged) rather than replacing it with
  a virtual/transform-based scroll; (2) scope — site-wide, not just this
  section.
- **New source video**: `~/Downloads/aman.MP4` (1920×1080, 10s, 24fps,
  h264+aac). A dark close-up reveal of the headlight (0s) → the headlight
  lights up in a clean studio close-up (~4s) → camera pulls back to a
  full side-profile turntable shot (4s→10s). Re-encoded to
  `public/video/aman-hero.mp4`: scaled to 1600px wide, `-g 1
  -keyint_min 1 -sc_threshold 0` (every frame a keyframe, the same
  scrub-jitter fix used for the original deleted hero video), audio
  stripped (`-an` — sound was removed from the whole site earlier this
  project; no reason to reintroduce it just for this clip). 22MB → 9.9MB
  after scaling. Poster (`aman-hero-poster.jpg`) extracted from frame 0,
  not frame 4 — using the mid-reveal bright frame as the poster would
  have caused a visible flash back to the dark opening the instant
  playback actually starts.
- **`src/lib/lenis.ts` + `src/components/SmoothScroll.tsx`**: a mutable
  module-level ref (not React context — nothing else needed to consume
  it reactively) holds the single app-wide Lenis instance, set by
  `<SmoothScroll/>` (mounted once in `App.tsx`, `autoRaf: true`).
  `ScrollToTop.tsx` now calls `lenisInstance.scrollTo(0, {immediate:
  true})` on route change instead of a raw `window.scrollTo`, so page
  navigation jumps instantly rather than risking a visible one-frame
  fight between Lenis's own position tracking and a manual scroll write.
- **`IntroHero.tsx` rebuilt around the video** — same overall shape as
  the original deleted hero (tall `h-[300vh]` scroll-wrapper + `sticky`
  inner viewport-filling video, releasing naturally once scroll clears
  the wrapper) but meaningfully simpler this time: since the video is
  true full-bleed `object-cover` (no letterboxing, "fill to screen" per
  the request) rather than `object-contain`, **none of the old 3-layer
  progressive-blur/pillarbox-masking system is needed** — that entire
  apparatus existed only to hide the seam between a letterboxed video and
  its background, which doesn't exist here.
  - **Phase A (unattended intro, 0→4s)**: on mount, `video.play()`
    (muted, required for autoplay); a `timeupdate` listener watches for
    `currentTime >= 4`, then pauses and pins it exactly at 4. Deliberately
    ignores scroll entirely during this phase — an impatient early scroll
    just scrolls the page normally past the (still auto-playing) hero
    rather than trying to hijack a video that isn't under scroll control
    yet, which would have been a much harder state machine to get right.
    Falls back to immediately "revealing" if the play() promise rejects
    (rare autoplay-blocked edge case), so the page can't get stuck with a
    permanently hidden nav/headline.
  - **Phase B (revealed, not yet scrolled)**: nav, headline, paragraph,
    both CTAs, and the floating detail card all fade in together
    (`revealed` state gates all of them, including `<Nav loaded=
    {revealed}>` — nav does **not** appear during Phase A, only once the
    intro finishes, per the request).
  - **Phase C (scrolling)**: a scroll listener (native `window`
    `scroll`/`resize`, rAF-scheduled — Lenis dispatches real scroll
    events since it wraps native scroll, so this pattern needed no
    changes) maps wrapper scroll progress `0→1` onto `video.currentTime`
    across `4→duration`, and fades the copy block + floating card out
    over a short progress range (`COPY_FADE_END = 0.06`) rather than a
    hard cutoff. Nav is untouched by this phase — its own `loaded` state
    was already set true in Phase B and nothing here changes it, so it's
    the one thing that stays through scroll, per the request. All writes
    are direct `ref.style.x =` in one rAF loop (no React re-renders per
    scroll frame), matching this codebase's established scroll-driven
    pattern.
  - Removed the now-unused `document.fonts.ready`-gated load-in effect
    the old static-image version used — `revealed` (tied to actual video
    playback) is a more meaningful "ready" signal here than font loading
    was.
- Verified end-to-end via direct state/DOM checks rather than trusting
  screenshots alone: confirmed `video.currentTime === 4` and `paused ===
  true` right after load: scrolled to 75% of the wrapper's range and
  confirmed `video.currentTime` landed exactly at the predicted `4 +
  0.75 × 6 = 8.5`; confirmed copy-block computed opacity was `0` while
  nav's stayed `1` at that same scroll position; scrolled to the
  wrapper's end and confirmed `currentTime === 10` (duration) with
  Marquee already visible directly beneath, confirming the sticky
  hand-off releases correctly; confirmed `document.documentElement
  .classList.contains('lenis')` on both pages. Also checked mobile
  (375px) — intro plays and pauses correctly, full-bleed video, no
  layout issues.
- **Left `studio-front-closeup.jpg` in place** (the previous static hero
  image, now unused by `IntroHero`) rather than deleting it — still a
  clean, usable asset for elsewhere on the site (e.g. the Specs page
  detail gallery), unlike the old hero video/audio files which had no
  plausible reuse and were deleted outright in earlier revisions.

## Video-hero polish: jerk fix + premium entrance cascade (this revision)

- **Fixed the jerk when the intro video stops.** Root cause was the old
  `timeupdate` handler forcibly snapping `video.currentTime = INTRO_END`
  the instant it detected `currentTime >= 4` — since `timeupdate` only
  fires every 4-66ms (browser-dependent), the video was typically already
  a little past 4.000 (e.g. 4.03) when caught, so the forced correction
  was a small **backward** seek right as motion stopped — that snap-back
  was the jerk. Replaced with a `requestAnimationFrame`-polled
  deceleration: `playbackRate` eases from `1` down to `0.05` over the
  last second before `INTRO_END` (`EASE_START = 3`, quadratic ease-out
  curve), so the video glides to a near-standstill on its own before
  `pause()` is even called — no forced correction needed afterward, it
  settles within milliseconds of exactly 4.000 naturally.
- **Found and fixed a real bug while verifying the above, unrelated to
  the jerk itself**: the fix's first version used a local `let
  revealedAlready` flag inside the effect to guard against double-firing
  `reveal()`. That doesn't survive **React StrictMode's dev-mode double
  effect invocation** (mount → cleanup → mount again, same component
  instance) — the second invocation got its own fresh `revealedAlready =
  false` closure, called `video.play()` again independently of the
  first, and the two overlapping tick loops fought each other; observed
  behavior was the video sailing straight through `INTRO_END` and
  climbing indefinitely (`currentTime` past 5s, `playbackRate` stuck at
  the `MIN_RATE` floor, `paused` never becoming `true`). Fixed by
  guarding on `revealedRef.current` (a `useRef`, which — unlike a local
  `let` — **does** persist correctly across StrictMode's replay) instead
  of a local flag. Confirmed via direct polling: before the fix,
  `currentTime` was climbing past 4.5s indefinitely with `paused: false`
  the entire time; after, it lands and stays at exactly `currentTime:
  4.000, paused: true, rate: 1.000` every time.
- **Entrance made into a proper staggered cascade** per feedback ("should
  slowly visible") and the `design-taste-frontend-v1` skill's staggered-
  orchestration principle, instead of the whole copy block fading in as
  one flat unit. Sequence, each independently `revealed`-gated:
  eyebrow tag (`0ms` delay, mask-reveal slide-up) → headline line 1
  (`120ms`) → headline line 2 (`220ms`, a slightly bouncier
  `cubic-bezier(0.22,1,0.36,1)` curve than the rest of the site's
  standard ease-out-expo, as a considered single accent rather than
  applying it everywhere) → paragraph + both CTAs together (`360ms`) →
  floating detail card (`480ms`) → scroll cue (`600ms`). Durations
  lengthened from the old flat `900ms` to `1000-1300ms` per element for
  a more deliberate, unhurried settle.
  - Restructuring note: the outer `copyRef` div is **only** the
    scroll-driven exit controller now (the rAF loop in the Phase B/C
    effect still writes `opacity`/`transform` directly to it as before)
    — it no longer carries its own `revealed`-gated entrance
    class/transition. Entrance now lives entirely on each child's own
    transition, independent of the parent. Two elements animating
    `opacity` in a parent→child chain compose fine (standard CSS
    compositing, not a conflict) — outer controls scroll-exit, inner
    children control staggered entrance.
- Verified: cascade delays confirmed via `getComputedStyle(...)
  .transitionDelay` on each element (`0s / 0.12s / 0.22s / 0.48s` —
  matches the source exactly), video settle behavior confirmed via
  direct polling pre- and post-fix as described above, and the Phase C
  scroll-scrub re-verified unchanged after these edits (75% scroll
  progress still lands `video.currentTime` at exactly `8.5`, matching
  `4 + 0.75 × 6`).

## Reverted the playbackRate deceleration — it made the jerk worse (this revision)

- **The `playbackRate` ramp-down from the previous revision was wrong and
  got reverted entirely.** User feedback: it introduced visible
  stutter/hang, worse than the original small jerk it was meant to fix.
  Root cause — ramping `playbackRate` down to `0.05` right before the
  stop means the browser is decoding/painting the video in extreme slow
  motion for that last second; video decoders and compositors aren't
  well-optimized for that, especially on a 1600px all-intraframe file, so
  it stutters rather than gliding. My own polling-based verification
  (checking `currentTime`/`paused`/`playbackRate` values) couldn't catch
  this — those are correct discrete state checks, not a measure of
  frame-to-frame rendering smoothness, which needs an actual human
  watching real playback. Noting this as a real limitation: **state
  polling proves correctness, not perceived smoothness** — don't
  over-trust it for anything motion/animation-related again.
- **Reverted to the simple version**: full-speed (`rate = 1`) playback
  throughout, plain `timeupdate` listener, `pause()` wherever it catches
  `currentTime >= INTRO_END` (typically 4.00–4.07, browser-dependent) —
  and critically, **no forced `video.currentTime = INTRO_END` correction
  afterward**. That forced backward seek (present in the very first
  version of this hero, before any "jerk fix" was attempted) was the
  actual original small jerk; simply not correcting it removes that
  jerk without introducing the new stutter the rate-ramp caused. Net
  simpler than both prior versions.
  - Kept the `revealedRef`-based StrictMode double-invoke guard from the
    previous revision (that was a genuine correctness fix, unrelated to
    the jerk/stutter — without it the video doesn't reliably stop at
    all) and the autoplay-blocked fallback (`forceTime: true`, an
    instant cold seek before anything has played, which is not a
    snap-back and isn't jerky).
- Re-verified mechanically after reverting: settles cleanly (no runaway,
  observed landing at `4.219` with `paused: true, rate: 1.000` and
  holding — no drift), scroll-scrub phase unaffected (75% progress still
  lands exactly at `8.5`). **Not yet confirmed smooth by the user** —
  told them directly that I can't verify perceived jank from here and
  asked them to check the live result.

## Fixed text-shadow bleeding through before the headline appears (this revision)

- User's actual complaint, clarified after an initial back-and-forth
  where I misread a screenshot: it wasn't the text itself appearing
  early — it was the **text-shadow** (`0 2px 24px rgba(0,0,0,0.55)`,
  applied once on the copy block's outer wrapper and inherited by every
  descendant) rendering visibly before the headline glyphs themselves
  did, reading as fuzzy white smudges over the video during the intro
  and "interfering with the bike appearing."
- **Root cause**: the headline lines (`"Built to go"` / `"further."`)
  hid themselves via `translate-y-full` only — no `opacity`. Translating
  an element fully out of its `overflow-hidden` parent hides the *glyphs*
  correctly, but a large-blur `text-shadow` (24px) can still paint a few
  pixels into the still-visible clipped region even while the source
  text sits translated below the fold, especially at this font's line
  height. Every *other* element in the cascade (eyebrow, paragraph+CTAs)
  already hid via `opacity-0`, which suppresses shadows outright
  regardless of position — they were never affected. Only the headline,
  which used transform-only hiding for its slide-up motion, leaked.
- **Fix**: added `opacity-0` (transitioning to `opacity-100`) alongside
  the existing `translate-y-full`→`translate-y-0` on the headline line
  spans, so the shadow is suppressed by the element's own opacity the
  same way it already was everywhere else — kept the slide-up motion,
  just no longer transform-only.
  - Confirmed via computed `className` on the live (revealed) DOM that
    the compiled utility is exactly `translate-y-0 opacity-100` as
    written — the pre-reveal branch is the same ternary's `else`, which
    React resolves deterministically, so unlike the playback-rate issue
    above this one didn't need to catch a live timing window to have
    real confidence in it — it's a static CSS logic fix, not a runtime
    performance/decode behavior.

## Sticky-image cutoff, ghost-number overlap, ride-mode-toggle-goes-blank - three real bugs (this revision)

- **FeatureShowcase.tsx - sticky image card was getting cut off
  mid-scroll.** Root cause: `overflow-hidden` had been added to the
  `<section>` wrapping both columns (to contain the giant ghost-number
  texture, which can slightly overhang its column). That's a real CSS
  gotcha - any `overflow` other than `visible` on an ancestor between a
  `position: sticky` element and its containing block clips that
  element's sticking range to the ancestor's own box, not just the
  intended overflow content. Since the ancestor here was the whole
  section (only as tall as its content, not the viewport), the sticky
  image got visibly clipped as soon as the section's own box scrolled
  partway past the viewport - which is most of the scroll range, hence
  "half cut" by the time you'd reached partway through the list. Fixed
  by moving `overflow-hidden` down to just the left (list) column, which
  is the only part that actually needs it, leaving the right column's
  sticky containing block unobstructed.
  - Verified with `getBoundingClientRect()` at a scroll position
    correctly inside the sticky range (my first attempt at verifying
    this scrolled to 50% of the section's total height, which
    overshoots the actual sticky range - `stickyRange = sectionHeight -
    viewportHeight`, always shorter than the section itself - and
    landed past the release point instead; redid it against the correct
    range and got `fullyVisible: true`, card top/bottom both cleanly
    inside the viewport).
- **Same section - the ghost index number was overlapping "310 mm
  clearance."** It was anchored `bottom-16` (a fixed distance from the
  column's bottom edge), which put it directly on top of wherever the
  last list item physically sits once that item scrolls into view - a
  guaranteed collision with a bottom-anchored decorative element and the
  literal last row of content. Moved it to `top-1/2 -translate-y-1/2`
  (vertically centered in the column instead) and shrunk it
  220px to 170px / 0.5 to 0.35 opacity, so it stays out of the way of
  every row it might otherwise cross, first and last included.
- **Specs page - clicking Eco or Sport in "One chassis, three moods" made
  everything go blank/black.** This was a real, somewhat subtle bug in
  `Reveal.tsx` itself, not just this one usage: it added its
  `is-inview` class imperatively via `el.classList.add('is-inview')`
  inside the `IntersectionObserver` callback, while also letting
  React manage that same element's `className` reactively via a prop.
  That's fine as long as the `className` prop never changes after mount
  - true everywhere else `Reveal` is used in this codebase, which is why
  this never surfaced before. But the ride-mode cards pass a
  `className` that includes `active ? 'md:flex-[1.6]' : 'md:flex-1'` -
  the first place `Reveal`'s `className` prop is dynamic. Clicking a
  card flips `activeMode` state, which changes the `className` prop on
  all three `<Reveal>`s, and React re-setting `element.className` on
  that re-render silently wiped the imperatively-added `is-inview`
  class, snapping every card back to `.reveal`'s pre-reveal
  `opacity: 0` - reading as everything going blank, with the shared
  `bg-ink` gap color between cards showing through as "black."
  - Fixed at the source (`Reveal.tsx`), not just patched around in
    `SpecsPage.tsx`: `is-inview` is now tracked via `useState` and
    included in the className React computes on every render, instead
    of being poked onto the DOM node outside React's own reconciliation.
    This can't be clobbered by an unrelated `className` prop change
    again, anywhere `Reveal` is or will be used with a dynamic
    className - not a one-off fix scoped to the ride-mode cards.
  - Verified via `getComputedStyle(...).opacity` on all three cards
    immediately after clicking Eco (`1, 1, 1` - none dropped to `0`),
    confirmed `is-inview` present in each `.reveal` element's className,
    and clicked Sport right after to confirm repeated toggling holds up,
    not just a single click.
- **Full UI/UX/psychology audit + fix pass (this revision)**: walked every
  section of both pages at desktop and mobile with real DOM measurements,
  console/network checks, and interaction tests; fixed everything found:
  - **Dead/mislabeled links.** Nav's "Support" link pointed at the same
    place as the Reserve button (mislabeling a sales pitch as support) -
    removed it, leaving only real destinations. `ClosingCta.tsx`'s
    "Configure now" was a dead `<button>` with no handler - now a `<Link
    to="/specs">`. `AdventureSection.tsx`'s "Our story" CTA was relabeled
    "See the build" (it always linked to `#the-build`, but the label
    promised something that doesn't exist on this single-product site).
    Footer's Company column same relabel. The `AdventureSection` and
    `ProductShowcase` (`In Detail`) gallery tiles had hover arrows
    implying a link but went nowhere on click - both now wrap in `<Link
    to="/specs">`, since per-part detail is exactly what the Specs page
    is for.
  - **Footer placeholder links** (`Journal`, `Support`, social icons -
    `href="#"`) used to jump-scroll the page to top on click, reading as
    broken. They now `preventDefault()` and render visibly dimmed
    (`text-[#F4EFE4]/40`, no hover-underline) so the affordance itself
    signals "not built yet" instead of silently doing something
    unexpected.
  - **Mobile nav had no way to reach the Specs page at all** - the
    hamburger menu only ever listed `The Build`. Added `Specs` to the
    mobile menu list alongside it.
  - **IntroHero's scroll cue overlapped the "Explore the build" CTA** at
    typical laptop heights (both centered around the same screen
    position). Moved the cue to `right-6 lg:right-8` instead of
    center-anchored - clear of both the CTA row and the floating photo
    card above it.
  - **Specs hero stats row (`42 kW / 140 km / 3.4 sec`)** wrapped
    awkwardly at the `md` breakpoint specifically (copy column is only a
    fraction of viewport width there). Tightened the gap
    (`gap-x-6 sm:gap-x-8 lg:gap-x-12` instead of a flat `gap-12`) - now
    reads as a clean full stack or 2-then-1 wrap at narrow/medium widths
    (evenly gapped either way) and a single row past `lg`.
  - **No visible keyboard focus indicator anywhere on the site.** Added
    one global `:focus-visible` rule to `index.css` (copper ring,
    3px offset) instead of patching every interactive element
    individually.
  - **`prefers-reduced-motion` was only partially honored** - covered the
    marquee, grain, and `.reveal`/`.reveal-mask` animations, but not
    Lenis smooth-scroll, the video hero's autoplay-then-scroll-scrub
    choreography, or `CountUp`'s tween. Added a shared
    `prefersReducedMotion()` helper (`src/lib/reducedMotion.ts`) and
    wired it into all three: `SmoothScroll.tsx` skips creating the Lenis
    instance entirely (native scroll instead), `IntroHero.tsx` skips
    straight to the revealed state on a static poster frame and skips
    the scroll-driven `video.currentTime` writes (the copy/card fade
    still runs - that's ordinary scroll-linked UI, not simulated
    motion), and `CountUp.tsx` sets the final value instantly instead of
    tweening.
  - **Missing meta description** - added one to `index.html`.
  - **Found while verifying the above**: a global `a { cursor: pointer;
    }` rule in `index.css` was silently overriding the new disabled
    Footer links' `cursor-default` utility, despite the class selector
    having higher specificity - because the plain rule lives outside any
    `@layer`, and unlayered CSS beats layered CSS (where Tailwind's
    utilities live) regardless of specificity. The rule was also fully
    redundant (every `<a>` in this codebase already has an `href`, which
    browsers already render as a pointer cursor by default) - removed it
    rather than fighting the layer ordering.
  - Deleted three unused images confirmed via grep to have zero
    references anywhere in `src/` (`forest-standing.jpg`,
    `studio-front-closeup.jpg`, `studio-front-headlight.jpg`).
  - Verified: `tsc -b --noEmit` clean; mobile hamburger menu opens/closes
    and its Specs link resolves to `/specs` (confirmed via computed
    `opacity`/`aria-hidden` after the transition settles, not just the
    React state); Footer's `Journal`/`Support`/social links no longer
    scroll-jump and read as visibly disabled; gallery tiles across both
    pages navigate to `/specs`; Specs hero stat row confirmed on one line
    past 1400px wide and cleanly wrapped below that; no console errors
    on either page.
- **New photo batch + `/gallery` page + hero video re-encode (this
  revision)**: user supplied ~20 new renders (`~/Downloads/Aurex phtos/`).
  - Replaced the Specs page hero image (`studio-copper-three-quarter.jpg`)
    with a new front 3/4 render, same filename so no code changes needed.
  - Found and fixed a real content bug while cataloging the new batch:
    `studio-rear-three-quarter-1.jpg` and `-2.jpg` were, respectively, a
    duplicate of the front 3/4 shot and byte-identical to
    `studio-three-quarter.jpg` (confirmed via `md5`) - despite being
    labeled "rear three-quarter" in three places (`FeatureShowcase.tsx`,
    `IntroHero.tsx`'s floating card, `SpecsPage.tsx`'s detail gallery).
    The site had never actually shown the rear of the bike. Replaced both
    files in place with two genuine rear three-quarter renders from the
    new batch - zero code changes, all three call sites now show real
    rear angles.
  - Built `src/pages/GalleryPage.tsx` (route `/gallery`, linked from
    `Nav.tsx`'s `RIGHT_LINKS` and `Footer.tsx`'s Explore column) to house
    the rest of the batch: a front/rear hero pair, a full-bleed overhead
    garage shot, and a bento grid of cockpit + machined-detail macros
    (fork, frame, battery case, tank edge, controls). Same `Reveal`/tile
    conventions as `ProductShowcase.tsx`.
  - Hit a false alarm while verifying: `getComputedStyle` reported
    `opacity: 0` on multiple `.reveal.is-inview` elements despite the
    matching CSS rule being present and correctly specified (verified via
    a full matched-rules scan and an isolated test element that DID
    compute to `opacity: 1`). Root cause was stale Vite HMR-injected CSS
    left over from several dev-server restarts earlier in the session,
    not a real bug - a clean `preview_stop` + `preview_start` resolved it
    immediately. Worth remembering for future verification passes on
    this project: if a `getComputedStyle` reading contradicts a rule that
    demonstrably matches and wins on specificity, restart the dev server
    before concluding it's a real bug.
  - **Hero video re-encode**: user asked why the scroll-scrubbed hero
    video looked soft. Root cause: `aman-hero.mp4` was encoded with every
    frame forced to be a keyframe (`-g 1 -keyint_min 1`, done deliberately
    earlier this session to fix scroll-scrub stutter - seeking to
    arbitrary timestamps needs every frame independently decodable).
    All-intraframe throws away inter-frame prediction, so at a given
    bitrate it looks visibly softer than normal GOP encoding - confirmed
    via `ffprobe -show_frames` (240/240 frames were type I) and a direct
    frame-6s comparison. Fixed by keeping every-frame-a-keyframe (still
    needed for scrub smoothness) but re-encoding from the original
    source (`~/Downloads/aman.MP4`, 1920×1080, 14.6 Mbps) at native width
    instead of downscaled to 1600px, `-crf 18 -preset slow` instead of
    ffmpeg's low-effort default: 9.9MB → 28MB, visibly sharper (spoke
    detail, fork machining, tank grain all previously mush). Verified
    scroll-scrub still advances `video.currentTime` correctly post
    re-encode (not just a visual check) and regenerated the poster frame
    from the new file so it matches exactly.
- **IntroHero scroll-scrub snap fix (this revision)**: user reported the
  video "comes forward a little then back" right when scroll starts.
  Root cause: Phase C's scroll-scrub math anchored its p=0 point to the
  `INTRO_END` constant (4s), but Phase A actually pauses wherever
  `timeupdate` catches it - a few ms past that (confirmed via
  `video.currentTime`, landed at 4.2385s in testing). The instant scroll
  started, the first scroll-driven write snapped the video backward from
  4.2385s to exactly 4.0s. Fixed by recording the video's actual paused
  time in a new `pausedAtRef` (set inside `reveal()`, right after
  `video.pause()`) and using that as the scroll-scrub's anchor instead of
  the constant. Verified directly: `pausedAtRef` value and
  `video.currentTime` immediately after the first scroll event are now
  identical (delta 0).
- **Gallery page cleanup (this revision)**: user flagged repeated/
  cropped images after reviewing `/gallery`.
  - The frame/shock/battery-box area had been shot three times in the
    original batch; the gallery used two of them
    (`gallery-frame-detail.jpg` + `gallery-battery-macro.jpg`) side by
    side, which read as a duplicate rather than two intentional angles.
    Dropped `gallery-battery-macro.jpg` (file deleted, confirmed unused
    via grep first).
  - The hero pair's first tile (`gallery-front-dramatic.jpg`, despite its
    name) was actually a close rear three-quarter crop - a third rear
    angle when the page already had two dedicated rear tiles below it.
    Swapped it for `studio-copper-three-quarter.jpg` (the genuine front
    3/4, same photo used on the Specs page hero) so the page opens with
    front + side instead of rear + side. File deleted (confirmed unused).
  - Diagnosed a real crop bug, not just a content-repetition issue: the
    cockpit and front-fork tiles were `md:col-span-3` (quad row), which
    at actual render width came out to ~191×240px - a *portrait*
    container holding a *landscape* (1.5:1) source. `object-cover`'s
    default centered crop was cutting the top off both images (the
    digital dash display, the headlamp ring), confirmed via
    `getBoundingClientRect` math on the live tiles, not guessed. Fixed
    two ways: widened those tiles from `col-span-3` (quad) to
    `col-span-4` (triptych) so the container is closer to square, and
    added a new optional `objectPosition` field to `GalleryItem` (only
    set where needed - `50% 25%`/`50% 30%` on the cockpit/fork tiles) to
    bias the crop toward the subject instead of a blind center crop.
- **`/gallery` page removed, images folded into existing sections (this
  revision)**: user reconsidered the standalone gallery page - a
  single-product concept site reads more premium with photography woven
  into the existing narrative (hero, build breakdown, detail callouts)
  than routed off to a separate photo-dump page. Deleted
  `src/pages/GalleryPage.tsx`, the `/gallery` route in `App.tsx`, and the
  Nav/Footer links.
  - `ProductShowcase.tsx` ("In Detail"): swapped the headlamp-detail and
    front-elevation tiles (both already repeated elsewhere on the page)
    for `gallery-cockpit.jpg` and `gallery-fork-detail.jpg` - genuinely
    new content instead of a fourth appearance of the same two shots.
  - `FeatureShowcase.tsx` (sticky feature list, "Dry weight" item):
    swapped `studio-front.jpg` (used 3x elsewhere already) for
    `gallery-frame-detail.jpg`. Verified the crop math before committing
    to it, not after - this card is a tall portrait (`aspect-[4/5]` →
    `md:h-[85vh]`, ~0.6:1) holding a landscape 1.5:1 source with an
    additional baked-in `scale(1.08)` on the img itself; ran the actual
    computed crop region through `ffmpeg -vf crop=...` and viewed the
    result before trusting it, rather than assuming object-cover center
    would land somewhere reasonable. It did - full frame triangulation,
    weld detail, and the battery box edge, top to bottom.
  - `SpecsPage.tsx` DETAILS ("Every surface, considered"): swapped
    `studio-front.jpg` for `gallery-side-profile.jpg`, relabeled "Front
    elevation" → "Side profile".
  - **Found and fixed a real, pre-existing bug while verifying the
    swap**: the entire DETAILS grid had zero height on desktop (`md:`+)
    and always had, unrelated to this session's edits - confirmed via
    `getBoundingClientRect` showing `h: 0` on all three tiles, including
    the one never touched. Root cause: the grid was missing
    `md:auto-rows-[...]` (present on every other bento grid in this
    codebase, e.g. `ProductShowcase.tsx`), so each tile's
    `md:aspect-auto md:h-full` had no ancestor height to resolve
    against and collapsed to nothing - the whole "Every surface,
    considered." section had been invisible on desktop this entire
    project. Fixed by adding `md:auto-rows-[320px]` to match.
  - Deleted the three gallery-exclusive images that didn't earn a slot
    in the existing narrative (`gallery-overhead.jpg`,
    `gallery-controls-macro.jpg`, `gallery-cockpit-top.jpg` - confirmed
    unused via grep first). Flagged to the user rather than silently
    dropped; open to placing them if a spot comes up.
- **Four fixes across `FeatureShowcase`, `ProductShowcase`, and
  `AdventureSection` (this revision)**:
  - **Ghost index number removed.** `FeatureShowcase.tsx`'s left column
    had a giant `text-outline text-[170px]` digit sitting behind the
    list as ambient texture - at a normal viewport crop it read as
    stray decorative shapes cutting through the text rather than a
    deliberate motif. Deleted the whole block; the "01 / 06" counter
    next to the "The Build" label already conveys position.
  - **Sticky card pin-release timing, a real structural bug, not a
    tuning tweak.** The right column used to pick the "active" image by
    finding whichever of the 6 left-column items had its center closest
    to the viewport's vertical center. The math didn't work: with 6
    items at `min-h-[22vh]` each, the scroll distance between item 1's
    center-crossing and item 6's is ~110vh, but the sticky card's actual
    pin window (wrap height minus one viewport) is only ~30-40vh at a
    typical viewport - roughly a third of what's needed. The card was
    unpinning and scrolling away before the last one or two items ever
    had their turn. Rewrote the tracking to the same scroll-progress
    approach already used in `IntroHero.tsx`'s Phase C: `p = clamp((-
    wrapRect.top) / (wrapHeight - viewportHeight), 0, 1)`,
    `activeIndex = floor(p * FEATURES.length)` clamped to the last
    index. This guarantees full 0..1 coverage across exactly the pin
    window, so item 6 is active for the pin window's last 1/6th and
    only releases once its turn is over. Verified empirically, not just
    by reading the math: scrolled to five points spanning the pin
    range and read the actual rendered caption/image `src` at each -
    the last item's image was still showing at the literal unpin
    scroll position (`y=3682` of `3682`, i.e. `p=1.0`). Removed
    `itemRefs` and its per-item ref callback entirely since nothing
    reads them anymore.
  - **`ProductShowcase.tsx` ("In Detail")**: removed the hover arrow
    (`→`) from each tile - the whole tile is already a link and the
    hover zoom already signals that, the arrow was redundant chrome.
    Expanded from 3 tiles to 6 (added `studio-front.jpg`,
    `gallery-tank-macro.jpg`, `gallery-controls-macro.jpg` as a second
    row) - the latter two were sitting unused on disk from the earlier
    `/gallery` removal, `studio-front.jpg` had become unused for the
    same reason. Re-generated `gallery-controls-macro.jpg` from the
    original source photo (had been deleted in the `/gallery` cleanup,
    needed again here). Updated the "STUDIO — 3 FRAMES" counter to "6
    FRAMES" to match.
  - **`AdventureSection.tsx` gallery trimmed from 4 images to 2** (kept
    `mountain-2.jpg` "Built for the climb" and `forest-action-2.jpg`
    "Built to be pushed" - one wide vista, one intimate action shot,
    rather than two similar mountain shots or two similar forest shots).
    Deleted `mountain-3.jpg` (confirmed fully unused after the trim;
    `forest-action-1.jpg` stayed since `FeatureShowcase.tsx` and
    `IntroHero.tsx` still reference it). Considered alternatives to the
    full-bleed autoplay video above the gallery (smaller player,
    click-to-play thumbnail) but kept it as-is per the user's own
    fallback instruction - full-bleed ambient background video is
    already the tasteful choice for a "lifestyle" section opener on
    sites like this one's references (Rivian, Cake); a smaller/gated
    player would read as a downgrade, not an improvement.
- **Specs page hero swapped to side profile (this revision)**: user
  asked for a second opinion on the hero photo. Recommended the side
  profile over the existing front 3/4 - the page's headline ("Every
  number, accountable.") and stat overlays are a spec-sheet moment, and
  a side elevation is the one angle a reader can trace real dimension
  figures (wheelbase, seat height, ground clearance) against, unlike a
  3/4 angle. User agreed. Swapped `SpecsPage.tsx`'s hero `src` from
  `studio-copper-three-quarter.jpg` to `gallery-side-profile.jpg`, and
  moved the now-freed-up front 3/4 shot into the `DETAILS` gallery slot
  that `gallery-side-profile.jpg` vacated (relabeled "Front elevation" →
  "Front three-quarter") - avoids the same photo appearing twice on one
  page.
- **"Chainless direct-drive" contradicted every product photo (this
  revision)**: user noticed the copy claims an EV-typical direct-drive,
  chainless powertrain, but literally every studio render shows a
  visible chain, sprocket, and chain guide. Considered and rejected
  repositioning the bike as a "hybrid" - nothing in the renders supports
  it (no exhaust, no fuel filler, no ICE cylinder), it would demand a
  much larger rewrite (engine displacement, fuel specs, hybrid range
  logic), and it undermines the whole brand pitch this site is built
  around ("An electric adventure-tourer with nothing hidden"). A chain
  final drive isn't evidence of anything other than a chain final
  drive - real production EVs use it too (Zero, Sur-Ron, Stark Varg).
  Fixed by correcting the copy to match the photography instead, with a
  full sweep (not just the two spots first noticed) to make sure nothing
  was missed:
  - `SpecsPage.tsx` spec table: `Motor` "Direct-drive brushless" →
    "Mid-drive brushless" (a chain implies a mid-drive/reduction layout,
    not a hub motor); `Drive` "Chainless direct-drive" → "Chain final
    drive, single-speed" (keeps the real simplicity claim - no gearbox,
    no clutch - without the false "chainless" part).
  - `SpecsPage.tsx` ICE comparison table: "Moving parts in the
    drivetrain" - our side corrected from the false "1 (direct-drive)"
    to the honest "3 (motor, chain, sprockets)"; ICE side expanded from
    "12+ (chain, sprockets, clutch)" to "...clutch, gearbox)" for a fair
    comparison now that both sides list a chain - the real differentiator
    (no clutch, no multi-ratio gearbox) is what's still doing the work,
    not a chain/no-chain claim that wasn't true.
  - `FeatureShowcase.tsx`: "Direct-drive means immediate response."
    caption → "No gearbox to hesitate through." - same underlying claim
    (nothing between motor and wheel to introduce lag), stated in a way
    that doesn't imply "no chain."
  - `Marquee.tsx`: found in a full-file sweep (not just the two spots
    already known), not obvious from the section it lives in - the
    kinetic type band's phrase list had "42 kW direct drive" sitting
    among otherwise-safe phrases. Changed to "42 kW on tap" (already
    used as a stat label elsewhere on the site, so no new claim
    invented).
  - Verified via a repo-wide case-insensitive grep for `direct-drive`,
    `chainless`, and related terms after the edits - zero matches
    remaining.
- **Real social links + designer credit wired into the footer (this
  revision)**: user provided their actual LinkedIn, Behance, Instagram,
  and personal portfolio (amannagina.com) URLs.
  - Asked for a recommendation on whether to swap one of the `IntroHero`
    CTAs ("Reserve your build slot" / "Explore the build") for an
    outbound link to the portfolio site. Recommended against it: those
    two buttons are the actual product-demo interaction this case study
    exists to show off, and routing a visitor away from the fictional
    product experience right at the top of the page undercuts the whole
    point. The footer's existing "DESIGNED BY AMAN NAGINA" credit line
    is the standard, expected place for this on a case-study project -
    recruiters/visitors already know to check there.
  - `Footer.tsx` `Social` column: replaced the placeholder
    `Instagram`/`YouTube`/`X` (`href="#"`, disabled-styled) with real
    links to Instagram, LinkedIn, and Behance - dropped YouTube/X since
    no real accounts exist for them rather than inventing placeholders.
  - Added `target="_blank" rel="noopener noreferrer"` to the footer's
    generic link-rendering branch, conditioned on `href` starting with
    `http` (`link.href?.startsWith('http')` - the `?.` needed since
    TypeScript can't narrow `href` as defined just from a sibling `to`
    check across the column's mixed-shape link objects) - internal
    `/...` links keep normal same-tab navigation, external ones open in
    a new tab.
  - Made the "DESIGNED BY AMAN NAGINA" legal-row text an actual link to
    `https://amannagina.com/` (previously plain text).
  - Verified via direct DOM inspection (not just visual) that all four
    links resolve to the exact provided URLs with `target="_blank"` set.
- **AdventureSection's video was still downloading eagerly after the
  earlier preload fix (this revision)**: user reported the live site
  taking 4-6s to feel fully loaded. Measured via
  `performance.getEntriesByType('resource')` on the actual deployed
  site rather than guessing - confirmed `mountain-ride.mp4` (9.2MB) was
  still downloading in full on initial load despite the earlier
  `preload="metadata"` fix, because the video also had `autoPlay` set
  unconditionally - autoplay makes browsers buffer enough to sustain
  playback immediately, which overrides the preload hint regardless of
  scroll position. Fixed by removing `autoPlay` and gating actual
  `.play()`/`.pause()` behind an `IntersectionObserver` (same pattern
  as `Reveal.tsx`), `preload` dropped to `"none"`. Re-measured after
  deploy: 0 requests for that file on initial load (was 9.2MB).
  Also measured the hero video (`aman-hero.mp4`, ~28MB) during the same
  investigation - it turned out NOT to be a front-loaded bottleneck
  despite its size: only ~28KB transferred in the first 3s window,
  since a `<video>` element streams progressively via range requests
  rather than downloading the whole file upfront. Left it untouched.
- **GitHub repo renamed to match the ULLR rebrand (this revision)**:
  `aurex-designed-by-aman-nagina` → `ullr-designed-by-aman-nagina` via
  `gh repo rename`, which also auto-updated the local `origin` remote.
  New repo URL: `https://github.com/nagina3469/ullr-designed-by-aman-nagina`.
  GitHub's own redirect keeps the old URL working, so nothing already
  shared there breaks.
  - **Correction, caught on the very next verification pass**: initially
    assumed (and documented here) that the connected Vercel project's
    domain would stay on the old `aurex-designed-by-aman-nagina.vercel.app`
    since no rename endpoint is exposed through this session's Vercel
    MCP tools. That assumption was wrong - Vercel's GitHub integration
    derives the default subdomain from the connected repo's name and
    **did** follow the rename automatically on the very next deploy.
    Caught this only because the routine post-deploy live-site check
    (navigating to the URL that had worked for every previous deploy)
    came back a flat 404 instead of the expected page - if that check
    had been skipped "since nothing code-side changed," this would have
    shipped silently broken. Unlike GitHub, Vercel does **not**
    redirect the old subdomain at all - it just stops resolving.
    **Current, correct live URL**: `https://ullr-designed-by-aman-nagina.vercel.app`.
    The old `aurex-designed-by-aman-nagina.vercel.app` is dead with no
    redirect - anywhere that URL was already shared needs to be updated
    to the new one.
- **Added a "master prompt" section (this revision)**, at the user's
  request, condensing this whole project's tech stack, design system,
  page structure, and hard-won interaction-pattern lessons (scroll-scrub
  jitter fix, sticky-pin timing bug, the Reveal.tsx className-clobber
  bug, eager-media-loading fixes, brand-name SEO-collision check) into
  a single copy-pasteable prompt for regenerating a similar site from
  scratch in a fresh session - see the "Master prompt" section near the
  top of this file, right after the design tokens.
