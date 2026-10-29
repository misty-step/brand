# Greptile (greptile.com)

Captured 2026-10-29 through Firecrawl's hosted Chrome 156 (SwiftShader WebGL, off this Mac): 1440×900 and 390×844 (DPR 1), fold, four frames over 2.85s, six and five scroll positions, full page, in-page style probe and animation dump; CSS/JS read from source. The CSS carries Tailwind `dark:` variants (36 `.dark` rules) but the home page has no theme control and rendered light; its dark bands are designed sections. Method: `README.md`. Private captures: `~/.cache/tmp/misty-design/refs/greptile/`.

**The idea in one line:** the product is a bug catcher, so the hero is a stippled engraving of a lizard about to eat a fly, on grey paper, beside a wide heavy headline and two interlocking arrow-shaped buttons.

## Mark
- An isometric cube whose faces are cut to form a "G": one dark ink (#3d3b4f), drawn as a solid with a notch. No wordmark beside it in the nav.
- The lizard is the brand's second mark: it appears as the hero image with a mint glow edge.

## Type
- **Families:** Anybody (Etcetera Type Co, OFL; variable weight 100–900 and width) for display; DM Sans (OFL) for body; Space Mono (OFL) for nav, labels and links; Nanum Pen Script (OFL, handwriting) loaded for annotations.
- **Display:** h1 Anybody 96 / 700 / line-height 1.0 / −0.025em, two lines at 1440 ("The AI Code / Reviewer"); 60 / 0.9 and three lines at 390. h2 Anybody 48 / 600 / 1.0 / −0.04em.
- **Body:** DM Sans 16 / 400; lead 24 / 400 / 1.33; quotes 18–20.
- **Labels:** Space Mono 12 / 400, uppercase, +0.05em for the nav (EXAMPLES, PRICING…); bracketed section labels in Space Mono 18 uppercase +0.1em ("[ AGENT ]", "[ YOUR STACK ]"); underlined mono links ("onboard with your agent →").
- **Scale in use (1440):** 9, 10, 11, 12, 13, 14, 16, 18, 20, 24, 30, 36, 48, 96: 14 sizes.

## Colour
Grey paper, one violet-grey ink that doubles as the dark ground, and a mint/lime signal pair.

| Role | Value | OKLCH | Contrast |
|---|---|---|---|
| Ground | #e9e9e9, #eeeeee | 93.4% 0, 94.9% 0 | n/a |
| Ink, and dark-section ground | #3d3b4f | 36.3% 0.034 289 | 8.9:1 on #e9e9e9 |
| Signal (bar, primary button) | #28e99f | 82.8% 0.178 161 | ink on it 6.8:1 |
| Headings on dark | #c5ffd6 mint | 95.0% 0.080 154 | 9.6:1 on #3d3b4f |
| Second signal | #ecffa3 lime (glow) | 96.5% 0.117 118 | |
| Grid lines | `--grid-color: rgba(16,185,129,.08)` | | |

No radii anywhere and no shadows: everything is square, flat, hairline or dashed.

## Layout system
- A 1600px maximum, 64px side margins at 1440; 12 columns with 32px gutters.
- The hero is enclosed in a dashed hairline frame with corner ticks, over a faint emerald grid; sections are bands separated by hairlines, alternating grey paper and violet-grey.
- Section grammar: bracketed mono label, Anybody heading, one sentence, then three cards of wireframe illustrations (blue squares in perspective grids, tori, line terrain) or real artefacts.
- "Catch them all" shows real issues Greptile found in public repos (NVIDIA, Meta PyTorch, Solana) with stars, forks, file paths, diff lines and a "See PR" link.

## Hero pattern
Mint announcement bar on top ("Greptile raised a $50M Series B…"); left, the two-line Anybody h1, then a one-sentence sub at 24px, two interlocking arrow-shaped buttons (dark "Contact sales" with a pointed left end nests into mint "Start now"), and an underlined mono link "onboard with your agent →". Right, bleeding off the bottom edge, the stippled lizard with a fly above its snout. A mono strip at the fold: "OVER 22,000+ TEAMS USE GREPTILE". 54 words in the first viewport at 1440, 41 at 390.

## Motion and animation
- **Hero:** the lizard's mint edge pulses (`lizard-glow`, 6s linear infinite, stacked `drop-shadow` filters); the fly and the hero canvas (993×993, not `aria-hidden`) animate. Visible change 2.1–3.7% per 450ms at 1440; 0% at 390.
- **Elsewhere:** bar charts grow with `scaleY(0→1)` over 700ms at 80ms stagger (`cubic-bezier(0,0,.2,1)`); a `float-sphere` drift on a 40s loop; marquee, marching-ants dashed borders, `ping`, `pulse`, `grid-pulse`, `wave-shift`, `spotlight`, and an `effort-glitch` pixel jitter driven by `@property` custom properties. lottie-web (about 315 KB) drives some illustrations.
- **Reduced motion:** only 4 reduced-motion blocks (toasts, the pixel glitch, Tailwind `motion-safe` hovers). The glow, drift, marquee and lottie loops have no reduced-motion handling in CSS. `scroll-behavior: smooth` on `html`.
- Heavy third-party load: GTM, Meta pixel (427 KB), LinkedIn, an OpenAI ads SDK and others.

## Copy voice
Cheeky, confident, developer-native: "The AI Code Reviewer" (the definite article claims the category); "AI agents that review and test pull requests with full context of the codebase."; the lead testimonial keeps a censored swear ("Honestly the only AI reviewer that doesn't annoy the s**t out of me."); "Catch them all"; "Greptile is building the code validation layer so you can get back to shipping." The page title claims "Merge 4X Faster, Catch 3X More Bugs".

## Canon read
Training-data default faces (DM Sans, Space Mono); tracked uppercase mono labels and bracketed eyebrows; a decorative grid background; continuous loops with almost no reduced-motion handling and no pause control; a three-line h1 at 390; an announcement bar.

## Three moves for Misty Step
1. **A subject pun drawn in one engraving technique.** The lizard eats a bug because the product catches bugs; the stipple engraving keeps it serious. Misty Step's equivalent is already on the live site: the dithered bird and hand. Re-draw it (or a figure stepping through mist) as one stippled or halftone image with a single accent edge, and animate one small detail once at most. HeroSmith and MotionA/B.
2. **Interlocking shaped buttons.** Primary and secondary actions cut with `clip-path` so one nests into the other: square, flat, unmistakable. For a brand named Step, a stepped or notched pair is a natural fit. LayoutA/B: keep the hit area rectangular, draw focus with an inset outline or `filter: drop-shadow` because `outline` ignores `clip-path`, and keep 44px height at 390.
3. **Real artefacts as proof.** "Catch them all" lists actual findings in named public repos with paths, diffs and links. Misty Step can do the same with its own facts: the replayed trial tasks with their 2/6, 4/6, 5/6 outcomes and caveats, and the five real projects with hosts from `facts.ts`. Copywriter and LayoutA/B (`evidence` and `work` sections).

## Traps
- **Default faces and costume mono.** DM Sans and Space Mono are on the canon list; tracked uppercase mono nav and bracketed labels are tells.
- **Mint on violet-grey drifts toward "acid accent on near-black"** in the dark bands.
- **Loops without an off switch:** glow, drift, marquee, marching ants and lottie, four reduced-motion rules in total; filter-based glow animation is expensive.
- **Unsourced speed claims in the title** ("4X", "3X"). Misty Step's rule is no number without its denominator.

## Captures (private)
`fc_desk_t0/t045/t090/t285.png`, `fc_desk_motion_sheet.jpg`, `fc_desk_s01-06.png`, `fc_desk_storyboard.jpg`, `fc_desk_full.png`, `fc_mob_*`, `logo_crop.png`, `buttons_crop.png`, `fc_desk.json`, `fc_mob.json`, `source.json`.

## Links
- https://www.greptile.com/
