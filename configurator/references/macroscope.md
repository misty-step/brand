# Macroscope (macroscope.com)

Captured 2026-10-29 through Firecrawl's hosted Chrome 156 (SwiftShader WebGL, off this Mac): 1440×900 and 390×844 (DPR 1), fold, four frames over 2.85s, six and five scroll positions, full page, in-page style probe and animation dump; CSS/JS read from source. No dark theme: the CSS has only section-level `.dark` hooks and no `prefers-color-scheme: dark`. Method: `README.md`. Private captures: `~/.cache/tmp/misty-design/refs/macroscope/`.

**The idea in one line:** a halftone photograph of a person working on a mountainside, printed in one periwinkle ink on white, with the product line-up stacked beside the headline. It is the closest reference in this set to "mist".

## Mark
- A black disc with a white lens or wedge cut into it (a scope's eyepiece read as one shape), beside a bold grotesk "Macroscope" wordmark. One colour; reads at nav size (about 24px).
- Product sub-brands get their own lowercase wordmarks ("murmur").

## Type
- **Families:** Geist and Geist Mono (Vercel, OFL), self-hosted as variable subsets (English 25 KB + 27 KB, Latin Extended A), plus a `Geist-Critical` subset (400–500) for first paint.
- **Display:** h1 64 / 500 / line-height 0.98 / tracking −0.058em, two lines ("Command your own / software factory"). 390: 40 / 1.0, still two lines.
- **Card titles:** h2 20 / 560 / 1.25 / −0.031em. **Body:** 15 / 400 / 1.5 / −0.016em. Nav 14–16 with −0.03em.
- **Mono:** Geist Mono at 9–12px for labels and inside drawn product graphics; code inside illustrations goes down to 6.5px.
- **Scale in use (1440):** 27 distinct sizes from 6.5 to 102px, most of them inside illustrations.

## Colour
Light only. Cool navy ink and one periwinkle family; colour arrives as image, not as UI.

| Role | Value | OKLCH | Contrast on #f8f9fc |
|---|---|---|---|
| Ground | #f8f9fc, #ffffff | 98.2% 0.004 | n/a |
| Ink | #191e2d | 23.7% 0.030 270 | 15.8:1 |
| Ink 2 | #3e4a70 | 41.6% 0.066 270 | 8.3:1 |
| Ink 3 | #727a8f | 58.0% 0.034 269 | **4.07:1, fails body AA** |
| Brand | #5b4dff (`--brand-500`), #3616eb (`--brand-700`) | about hue 275 | 5.05:1 |
| Status green | #087443 | 49.2% 0.118 156 | 5.6:1 |
| Washes | #e9e9fb lavender, #aae7e7 aqua | | |
| Dark section | #05070f | 13.0% 0.019 270 | |

Primary buttons are ink (#191e2d, white text 16.6:1), not brand colour. Card surfaces are frosted white with a soft shadow and an inner top highlight: `0 4px 28px rgba(0,0,0,.13), 0 0 0 1.6px rgba(0,0,0,.07), inset 0 1px 0 rgba(255,255,255,.52)`.

## Layout system
- A 1132px container; 12- and 24-column grids with 16–20px gutters; three-column feature rows with 48px gaps.
- Radii: 999px pills for buttons and the nav, 16px cards, 8px and 4px controls, 24px large panels.
- Sections alternate light product stories (UI screenshots on photographic sky gradients) with one dark section for Code Review.
- At 390 the nav becomes a floating dark pill once you scroll.

## Hero pattern
Left: two-line h1, a dark pill "Start Free" (with a GitHub icon) and a light pill "Book Demo", then a pill link "Introducing Murmur · Read the blog →". Right: three frosted cards stacked (Murmur beta, Code Review, Status), each with a small animated line glyph (a dotted sphere, a radar sweep, a target) and one sentence. Behind everything, full-bleed: the duotone halftone photo. 67 words in the first viewport at 1440, 62 at 390.

## Motion and animation
- **Hero entrance (CSS keyframes):** the background image fades in from `scale(1.035)` to `scale(1.015)` over 1100ms; the h1 rises 18px and fades in over 680ms (40ms delay); buttons rise 14px over 620ms at 220 and 260ms; the three cards slide in 18px from the right over 720ms at 180 and 270ms.
- **Glyph loops:** the radar sweeps once per 6s (`radarSweep`, SVG rotate, infinite) with timed flashes and returns; other glyphs ripple. Visible change at rest: 0.18–0.24% per 450ms at 1440, 0.8% at 390.
- **Scroll reveals:** CSS transitions, opacity plus 8–16px rise, 280–320ms, about 42ms stagger, `cubic-bezier(.22,.72,.18,1)`.
- **WebGL:** a Unicorn Studio scene (`unicornStudio.umd.js` v1.4.29 from jsDelivr, 152 KB) mounts a 1093×530 canvas near the footer; it is not `aria-hidden`.
- **Reduced motion:** 95 reduced-motion blocks, each restoring the final state (`opacity: 1; transform: none; animation: none`). Not verified by emulation remotely.
- Most-used curves: `cubic-bezier(.16,1,.3,1)` (expo out) and `cubic-bezier(.4,0,.2,1)`.

## Copy voice
Operator verbs, one-sentence product cards: "Command your own software factory"; "Orchestrate cloud agents that write code and verify their work in isolated sandboxes."; "Review every change for correctness, security, tests, and regressions before it lands."; "See what changed, why it changed, and what needs attention across every repo and team." Pricing heads: "Pay for usage, not seats". Proof is benchmark numbers with units (recall, cost per review) and a customer logo wall.

## Canon read
Training-data default faces (Geist and Geist Mono, the same as live mistystep.io); 27 sizes with text under 12px in illustrations; three `h1`s; ink 3 at 4.07:1; a pill announcement under the buttons and a floating pill nav at 390; infinite glyph loops with no pause control; lavender gradient washes behind screenshots.

## Three moves for Misty Step
1. **A real photograph, printed as two-ink halftone, as the hero ground.** Macroscope's mountainside scene in periwinkle dots reads as mist and altitude without any WebGL. Misty Step already owns a dithered bird-and-hand image; a duotone halftone of it (or of hills in fog) in `--field-1..3` is a still frame that is the design, and the cheapest possible "field". HeroSmith: a full-bleed variant; MotionA/B: an optional slow dot drift layered on the static image, off under reduced motion.
2. **The offer as the hero's right column.** Three stacked cards with a tiny line glyph and one sentence each make the hero both pitch and index. Studio: the free 30-minute call, the $4,500 two-week discovery, the fixed-price build. Stack: core, playbooks, skills. HeroSmith with MarkSmith's glyphs; keep the glyphs still or animate one once.
3. **Reveal tokens worth copying.** 280–320ms, 8–16px travel, about 42ms stagger, `cubic-bezier(.22,.72,.18,1)`, and a reduced-motion rule per element that restores the final state. MotionA/B: use these numbers for the single reveal pattern the canon allows.

## Traps
- **Geist again.** Macroscope, Vercel and today's mistystep.io share it; a halftone hero on Geist will still look like the category.
- **Periwinkle is AI-purple.** Hue 275 sits on the canon's tell list; keep the halftone idea, change the ink.
- **Microscopic fake UI.** 6.5px code inside illustrations and 27 sizes overall.
- **Loops and third-party WebGL.** Radar loops with no pause; a CDN-hosted Unicorn Studio runtime for one footer scene.

## Captures (private)
`fc_desk_t0/t045/t090/t285.png`, `fc_desk_motion_sheet.jpg`, `fc_desk_s01-06.png`, `fc_desk_storyboard.jpg`, `fc_desk_full.png`, `fc_mob_*`, `logo_crop.png`, `hero_illus_crop.png`, `fc_desk.json`, `fc_mob.json`, `source.json`.

## Links
- https://macroscope.com/
