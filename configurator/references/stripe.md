# Stripe (stripe.com)

Captured 2026-10-29 through Firecrawl's hosted Chrome 156 (SwiftShader WebGL, off this Mac): 1440×900 and 390×844 (DPR 1), a fold, four frames over 2.85s, six scroll positions per width, a full-page shot, and an in-page style probe. Stripe's marketing site has no dark theme (no `prefers-color-scheme: dark`, `.dark` or `data-theme` hooks in its CSS), so light only. Reduced motion could not be emulated remotely; it is read from source. Method: `README.md`. Private captures: `~/.cache/tmp/misty-design/refs/stripe/`.

**The idea in one line:** precision with one indulgence. Everything is light-weight type, navy ink and hairlines, except a single WebGL ribbon of colour that sweeps through the hero and tints the headline where it passes.

## Mark
- The lowercase "stripe" wordmark alone in the nav (no symbol), in the brand blurple. The wordmark carries the brand; colour and the wave do the rest.

## Type
- **Families:** Söhne Variable (`sohne-var`, Klim Type Foundry, commercial; weights 1–1000) with `ss01` on everywhere; Source Code Pro Medium (OFL) for code.
- **Weight is the signature:** display and body are both weight **300**. h1 48 / 300 / 1.15 / −0.02em; h2 32 / 300 / 1.1 / −0.02em; the stats title 56 / 300 / 1.03 / −0.025em; body 16 / 300; leads 22 and 26 / 300.
- **Scale in use (1440):** 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 26, 32, 48, 56: 16 sizes, most of the small ones inside product mocks.
- **390:** the h1 drops to 34 / 1.03 and is re-authored to its first sentence only ("Financial infrastructure to grow your revenue.").

## Colour
Light only. Navy-tinted neutrals and one blurple, with a full-spectrum gradient reserved for the hero wave and illustrations.

| Role | Value | OKLCH | Contrast on #fff |
|---|---|---|---|
| Ground | #ffffff; washes #f8fafd, #e5edf5 | 100%; 98.4%; 94.2% 0.014 248 | n/a |
| Ink (headings) | #061b31 | 21.9% 0.051 252 | 17.4:1 |
| Ink 2 | #50617a | 48.8% 0.045 258 | 6.3:1 |
| Ink 3 | #64748d | 55.5% 0.044 259 | 4.75:1 |
| Ink 4 | #7d8ba4 | n/a | **3.44:1, fails body AA** |
| Accent (blurple) | #533afd | 52.1% 0.268 277 | 6.2:1; white on it 6.2:1 |
| Dark sections | #0d1738, #122054 | 21.7% 0.066 268 | n/a |

The token system (`--hds-color-*`, 721 custom properties) has named accent families (ruby, magenta, lemon and more) for illustrations. Borders are 1px #e5edf5.

## Layout system
- A 1266px container with visible vertical guide rails at its edges and hairline horizontals under the logo band: the grid is drawn, faintly, as part of the look.
- A 12-column grid with 16px gutters; bento cards in four columns for products; stats in a four-up row.
- Small radii only: 4px and 6px (180 elements), 8px rarely.
- The house shadow: `rgba(50,50,93,.25) 0 30px 45px -30px, rgba(0,0,0,.1) 0 18px 36px -18px` (a long, offset, navy-tinted drop).
- Long page: 15041px at 1440, 20832px at 390.

## Hero pattern
A live ticker as the line above the h1 ("Global GDP running on Stripe: 1.74053628%", counting), then a long two-tone h1 (claim in ink, the rest in slate, with a footnote superscript after "banking,¹"), a blurple "Get started ›" (4px radius) and an outlined "Sign up with Google". The WebGL wave enters from the top right and runs behind the right half; headline segments it crosses are recoloured violet. A cycling customer-logo band sits on a hairline below. A chat card ("12 sales reps available") pops in at the bottom right. First viewport: 120 words at 1440, 70 at 390.

## Motion and animation
- **Wave:** a three.js shader ribbon (`single-wave`), mounted only when WebGL is supported. Each breakpoint ships a static WebP of the same wave (`wave-fallback-{desktop,tablet,mobile}-{1x,2x}.webp` with an 8×6 blur placeholder); the static image fades out over 250ms once the canvas has drawn.
- **Governor:** one shared render-loop manager suspends every loop on `visibilitychange`, an IntersectionObserver (20px margin) pauses offscreen, and frame times feed an estimated refresh rate and a performance warning level from 0 to 3 that each loop receives (`onPerformanceWarning`). WebGL is created with `powerPreference: "high-performance"`, `antialias: false`, `setPixelRatio(dpr)`.
- **Measured (remote SwiftShader):** 9.6–13.1% of hero pixels change per 450ms, the wave plus the logo band swapping logos.
- **Elsewhere:** lazy graphics fade in over 500ms (`cubic-bezier(.33,1,.68,1)`); the stats section turns from dark to light on scroll (1200ms colour transitions, `cubic-bezier(.65,0,.35,1)`); the payment mocks roll values like an odometer (WAAPI, 1420ms after a 4s delay); the nav reads scroll position through a scroll-driven `detect-scroll` animation (`animation-timeline`).
- **Reduced motion:** CSS transitions are opt-in, written inside `@media (prefers-reduced-motion: no-preference)` (88 occurrences). No reduced-motion check appears in the wave's code (`chunk 52`); Framer Motion's `useReducedMotion` hook is present in the app bundle. Whether the wave stops under `reduce` was not verified.
- **Weight:** three.js chunks of about 224 KB and 314 KB raw. Most-used curve: `cubic-bezier(.25,1,.5,1)` (52 uses).

## Copy voice
Precise, numerate, footnoted: "Financial infrastructure to grow your revenue. Accept payments, handle business banking,¹ and implement custom revenue models—from your first transaction to your billionth." Section heads are two-tone sentences ("Flexible solutions for every business model. Grow your business with the most comprehensive set of payments and financial tools."). Proof is numbers with labels (135+, $1.9T, 99.999%, 200M+) and named customer stories (Hertz, URBN, Instacart, Le Monde).

## Canon read (from the probe data; the canon runner was not used remotely)
h1 four lines and about 170 characters at 1440 (canon: two lines, about 50 characters); 16 type sizes with 8–11px text; ink 4 at 3.44:1; continuous motion (wave, logo band, chat card) with no pause control; a commercial face.

## Three moves for Misty Step
1. **Ship the still frame of the field, then cross-fade to the live canvas.** Stripe's wave has a per-breakpoint WebP of its own first frame and swaps to WebGL only after the canvas draws. MotionA/B: render the field's still frame from the same shader (or a hand-made SVG/PNG of it) as the no-WebGL, no-JS and reduced-motion state, so the swap is invisible and the fallback looks designed. This is also what the lab's headless checks will see.
2. **One governor for every loop.** Pause on hidden tab, pause offscreen, measure median frame time, step a 0–3 quality level with hysteresis, and let every scene listen. It is the contract's background rule written as a component; MotionA/B can lift the shape directly.
3. **Footnoted precision.** Stripe puts a superscript footnote inside its h1. Misty Step's facts need caveats (the trial is 5/6 over six replayed tasks, directional only): a claim with a footnote to its denominator is more truthful and more confident than a bare number. Copywriter and LayoutA/B: style `sup` and a footnote line in the `evidence` and `points` sections.

## Traps
- **The Stripe gradient is the most copied hero of the decade.** A multicolour wave, blurple (hue 277, on the canon's AI-palette list) and navy ink read as "fintech template" on anyone else.
- **Long h1.** Four lines at 1440 work for Stripe's authority; the canon caps marketing headlines at two lines.
- **Motion that never stops:** wave, cycling logos and a chat pop-up, none with a pause control.
- **Commercial face.** Söhne cannot ship in the public repo; a light-weight display needs an OFL variable face that holds up at 300.
- **Weight:** about 540 KB of three.js for two scenes.

## Captures (private)
`fc_desk_t0/t045/t090/t285.png` (fold and motion frames), `fc_desk_motion_sheet.jpg`, `fc_desk_s01-06.png`, `fc_desk_storyboard.jpg`, `fc_desk_full.png`, the same set as `fc_mob_*`, `fc_desk.json` and `fc_mob.json` (style probe, animations), `source.json` (CSS/JS scan).

## Links
- https://stripe.com/
