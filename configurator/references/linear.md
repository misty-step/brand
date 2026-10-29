# Linear (linear.app)

Captured 2026-10-29 in a dedicated headless Chrome 156 (SwiftShader WebGL), 1440×900 @1× and 390×844 @2× touch, `prefers-color-scheme` light and dark, plus `prefers-reduced-motion: reduce`. Measurement method and caveats: `README.md`. Private captures: `~/.cache/tmp/misty-design/refs/linear/`.

**The idea in one line:** the product is the illustration. The home page renders Linear's own app (sidebar, issue, agent chat) as live HTML, and everything around it is quiet grey type on near-black.

## Mark
- A circle cut by four parallel diagonal bands, used beside a set wordmark "Linear" (white on the dark nav). One colour, no gradient on the site chrome.
- It survives at nav size (about 20px) because the bands are thick relative to the circle. Monochrome only; the brand never tints the mark.

## Type
- **Families:** Inter Variable (rsms, OFL) for everything you read, with OpenType alternates `cv01, ss03` switched on site-wide; Berkeley Mono (U.S. Graphics, commercial licence) for code, issue IDs and some labels. Two families total.
- **Display:** h1 64px / weight 510 / line-height 1.0 / tracking −0.022em, two lines at 1440 (`The product development / system for teams and agents`). At 390 the same h1 drops to 38px / 1.1 and wraps to 4 lines.
- **Section heads:** h2 48px / 510 / 1.0 / −0.022em, `text-wrap: balance`.
- **Body:** 15px / 400 / 1.6 / −0.011em (`--text-regular: .9375rem / 1.6`). Secondary copy is the same size in grey, not smaller.
- **Weights:** 510 and 590 instead of 500/600: a variable-font "house cut" of a common face.
- **Scale in use (1440):** 10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 32, 48, 64, 72px: 14 sizes. Most text is 12–15px UI copy inside the product mock.
- **Tokens:** type is fully tokenised on `:root` (422 custom properties), with a letter-spacing token per size (`--text-regular-letter-spacing: -.011em`, `--text-tiny-letter-spacing: -.015em`).

## Colour
Dark only. The marketing page ignores `prefers-color-scheme` (light vs dark capture differ by 1.65%, all of it the animating demo). `<meta name=theme-color content=#08090a>`, `data-theme=dark`.

| Role | Value | OKLCH | Contrast on ground |
|---|---|---|---|
| Ground | #08090a | 13.9% 0.003 | n/a |
| Raised 1 / 2 / 3 | #0f1011 / #161718 / #191a1b | 17.2% / 20.4% / 21% | n/a |
| Ink | #f7f8f8 | 97.8% 0 | 18.7:1 |
| Ink 2 | #d0d6e0 | 87.4% 0.015 261 | 13.6:1 |
| Ink 3 | #8a8f98 | 64.9% 0.015 262 | 6.1:1 |
| Ink 4 | #62666d | 50.9% 0.012 262 | **3.45:1, fails AA for body** |
| Hairline | rgba(255,255,255,.08) on 66 elements; .05 and .12 variants | | |
| Accent | #5e6ad2 (brand indigo), `--color-accent: #7170ff` | 56.7% 0.159 275 | 4.24:1 |
| One-off | #e4f222 acid yellow testimonial card | 92% 0.201 114 | 16.2:1 with ground ink |

- Neutrals carry a faint blue cast (hue 261–262 at chroma 0.012–0.015), the ground is near-neutral. Elevation is lightness steps of about +3% L, never shadow.
- Selection colour is derived with `color-mix(in lch, #5e6ad2, black 10%)`; `color-mix()` appears 90 times in the CSS.
- Strategy (canon terms): Restrained. The accent covers well under 1% of any viewport; colour lives in status icons inside the product mock.

## Layout system
- Container: content edge at x=78 on a 1440 viewport (about 1282px measure for the hero), full-bleed dark ground.
- Section grammar: a two-column split, title left (48px) and a short paragraph right (15px grey), then a full-width product vignette. Repeated for "Intake and integrations", "Planning and monitoring", "AI and automations", "Build, review, and ship".
- Product vignettes are masked into the ground with soft edge fades (no device frame, no browser chrome).
- Feature index: plain text lists with `+` toggles in 3 columns divided by a single hairline.
- Radii: pills (9999px) for buttons and chips, 8px and 12px for panels, 4px for small controls. Hairline borders, no drop shadows except a few inset rings.
- Sticky header with `#0b0b0bcc` backdrop (blurred glass).

## Hero pattern
Left-aligned two-line h1, a one-line grey sub at 15px, and a right-aligned "New / Loops →" changelog link on the same baseline. Below, at full container width, the live product UI with an agent chat panel that plays a scripted exchange. Only one primary action, the white pill "Sign up" in the nav; the hero itself has no button. 390: h1 4 lines, product mock cropped to the left half.

## Motion and animation
- **Entrance (WAAPI, `element.animate`):** each h1 line, then the sub, animates `opacity 0→1`, `filter: blur(10px)→blur(0)` and `translateY(20%)→0` over 1000ms with `ease` (`cubic-bezier(.25,.1,.25,1)`), delays 400 / 500 / 600ms (100ms stagger by line). The "New / Loops" link follows at 2000ms. The product frame fades in over 1500ms after 1300ms (`cubic-bezier(.455,.03,.515,.955)`). Full settle is about 3.0s after navigation. Recording: `linear/1440_dark_load.mp4` and its contact sheet.
- **Ambient:** no canvas, no WebGL, no video. Small SVG dot-matrix glyphs loop with CSS keyframes (`grid-dot-<r>-<c>-upDown`, 2800ms linear, infinite). Data-viz vignettes (a cyan beeswarm over a roadmap) are SVG/DOM.
- **Cost at rest (hero in view):** 7.8% main thread, 0 rAF/s, 60 style recalcs/s from the CSS loops; visible change 0–0.09% per 450ms.
- **Reduced motion:** 48 `prefers-reduced-motion` media rules across 66 same-origin sheets. Under `reduce` the page loads in its finished state (first frame differs from the settled normal page by 0.09%), visible change 0%, main thread 0.2%.
- **Built with:** Next.js, CSS modules, 230 `@keyframes`, `@property` (26), view-transition rules (15). Drawer easing `cubic-bezier(.32,.72,0,1)` (the Vaul/iOS sheet curve) is the most-used curve.
- No pause control (canon probe FAIL: continuous motion over 5s with no control).

## Copy voice
Product-noun plain, confident, short: "The product development system for teams and agents"; "Purpose-built for planning and building products. Designed for the AI era."; "A new species of product tool."; section heads are two nouns ("Intake and integrations", "Build, review, and ship"); close: "Built for the future. Available today." Customer proof is named quotes from named companies (real logos, OpenAI, Vercel, Ramp). Leans on "Purpose-built" twice in one viewport.

## Canon probe (DesignCanon `probe.js`, 1440 dark and 390)
FAIL motion (no pause control), FAIL typography (text under 12px; 12 distinct sizes at 1440; h1 4 lines at 390; prose at 13px), FAIL tells (`transition: all`; mono outside code; radial wash; glass), FAIL contrast (ink 4 at 3.45:1), WARN first viewport (157 words at 1440, 241 at 390), WARN copy (buzzwords, arrows glued to links, stock CTA labels), FAIL targets at 390.

## Three moves for Misty Step
1. **Real artefact as the hero visual, built in DOM and masked into the ground.** Linear's mock is HTML with selectable text, faded at its edges with a mask instead of a drawn browser frame. For stack.mistystep.io render a real mistystack session or the install tabs (real commands, real file names) inside `.hero-visual`; for mistystep.io render a real one-process ledger from `facts.ts`. HeroSmith: a `panel` host whose edges fade via `mask-image`, no chrome.
2. **Two-tone manifesto paragraph as a section opener.** One h2 at display size where the claim is `--ink` and the elaboration continues in `--ink-2` in the same sentence flow ("A new species of product tool. Purpose-built for…"). Hierarchy without an eyebrow, icon or card. LayoutA/B: style `.s-title` + `.s-intro` inline as one paragraph block; keep it a whole-sentence split, never one accented word.
3. **A tokenised type ramp with tracking per step and an in-between weight.** Linear runs display at 510, −0.022em, line-height 1.0, and body at 15/1.6, −0.011em, all as tokens. TypeSetter: give each option a per-step tracking value (`--display-tracking`) and a non-stock variable weight so a common face reads as a house cut.

## Traps
- **The Linear look is the 2021–2025 SaaS default.** Inter + near-black + indigo (#5e6ad2, hue 275, on the canon's AI-palette list) is exactly what the competitor test catches. Take the structure, not the palette or the face.
- **Dark only.** It ignores the system theme; Misty Step must ship two composed themes.
- **A 3-second blur reveal.** 1000ms per line with 10px blur and delays to 2000ms breaks the canon's 1.2s settle; large blurred text also costs paint. If borrowed, cap at 400–800ms total and drop the blur on phones.
- **Density and contrast.** 14 sizes, 10px text, 157 words above the fold, ink 4 at 3.45:1.
- **Licensing.** Berkeley Mono is commercial; use an OFL mono (JetBrains Mono, Commit Mono, Departure Mono) in the public repo.
- **Loops without a stop.** Infinite CSS dot loops and a scripted demo with no pause control.

## Captures (private)
`sheet_1440_folds.jpg` (dark | light), `sheet_390_folds.jpg`, `1440_dark_storyboard.jpg` (12 positions over 9960px), `390_dark_storyboard.jpg` (8 positions over 5876px), `1440_dark_m0-4.png` (idle motion), `1440_dark_reduced_f0.png`, `1440_dark_load.mp4` (+ `.contact.png`), `data.json` (style probe, canon probe, source scan).

## Links
- https://linear.app/
