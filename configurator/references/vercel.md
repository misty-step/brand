# Vercel (vercel.com)

Captured 2026-10-29 in a headless Chrome 156 on this Mac's GPU (ANGLE Metal), before the browser stop: 1440×900 @1× and 390×844 @2× touch, light and dark via `prefers-color-scheme`, reduced motion, and an 8s load recording. Source read from the shipped HTML, CSS and JS. Method: `README.md`. Private captures: `~/.cache/tmp/misty-design/refs/vercel/`.

**The idea in one line:** the logo is the hero, and the motion is light. A black triangle sits in the middle of the first screen while a renderer moves a soft light around it, so the only thing that animates is the brand's own shape casting a shadow.

## Mark
- The solid equilateral triangle, alone in the nav at about 20px (no wordmark beside it on the home page), and large in the centre of the hero.
- Same black triangle in both themes: in dark it is backlit (a glow behind it), in light it casts a soft shadow. The mark never changes colour; the light does.

## Type
- **Families:** Geist Sans variable and Geist Mono (Vercel, OFL 1.1). The five Geist Pixel faces (Square, Grid, Circle, Triangle, Line) are preloaded on the home page, but no visible text in the captured states uses them.
- **Display:** h1 64px / 400 / line-height 1.0 / tracking −0.06em ("Agentic / Infrastructure", two words on two lines). h2 56 / 450 / 1.0 / −0.06em.
- **Lead and body:** proof sentences 24 / 450 / 1.33 / −0.04em in grey; UI 14 / 400–500; small 13.
- **Scale in use (1440):** 13, 14, 16, 24, 56, 64: six sizes, far apart. At 390: 13, 14, 16, 24, 32, 48, and the h1 is 48 / 1.17.
- **OpenType:** `font-feature-settings: "calt" 0, "rlig", "ss11"` site-wide (contextual alternates off, stylistic set 11 on).
- **Fluid tokens:** `--text-fluid-24-32: clamp(1.5rem, .6429rem + 1.4286vi, 2rem)` and similar; 575 custom properties on `:root`.

## Colour
Two composed themes that follow the system (light vs dark folds differ by 98.7%). Monochrome by design: no hue anywhere in the hero.

| Role | Light | Dark | Contrast |
|---|---|---|---|
| Page (`--ds-background-200`) | #fafafa | #000000 | n/a |
| Surface (`--ds-background-100`) | #ffffff | #0a0a0a | n/a |
| Ink (`gray-1000`) | #171717 | #ededed | 17.2:1 / 17.9:1 |
| Ink 2 (`gray-900`) | #4d4d4d | #a1a1a1 | 8.1:1 / 8.1:1 |
| Ink 3 (`gray-700`) | #8f8f8f | #8f8f8f | **3.1:1 on light, fails body AA** / 6.5:1 |
| Hairline | rgba(0,0,0,.1) | white alpha | |
| Accent (links, focus) | blue-700 #0070f7 | | 4.3:1 on #fafafa |

Tokens are HSL components (`--ds-gray-900-value: 0, 0%, 30%`) so alpha variants can be derived; CSS also uses `oklch()` 172 times and `color-mix()` 226 times. Strategy in canon terms: Restrained to the point of none: the only colour on the home page is inside customer screenshots.

## Layout system
- Edge-to-edge: a 1448px maximum with 24px side margins at 1440, so the h1 starts at x=24. A 12-column grid with 20px gutters.
- Dashed guide lines (`gridSystem`, `dashedGuide` classes) and hairline section rules.
- Radii: pills (9999px) for the hero buttons, 6px for nav buttons, 4–8px for small controls, 20px for large panels.
- Short page (5333px at 1440): hero, three customer stories (big h2, the customer's real product screenshot, one proof sentence, four feature links), "Recently shipped", a closing CTA, a mega footer.

## Hero pattern
Three columns on one baseline band: left, the two-word h1 with two pill buttons ("Deploy now" solid ink, "Talk to sales" outline); centre, the lit triangle; right, three short lines ("For coding agents / To ship apps and agents / Automated by agents") in place of a paragraph. A customer logo strip sits at the bottom of the first viewport. Only 32 words in the 1440 first viewport, 26 at 390. At 390 the columns stack and the h1 stays at two lines.

## Motion and animation
- **Hero renderer:** a 2D global-illumination scene (radiance probes and cascades, an SDF occluder triangle, contact AO, a click interaction) running in a Web Worker on an `OffscreenCanvas`, with WebGPU or WebGL2 (`heroRenderer` = `webgpu | webgl | static`). It falls back to a static render when Worker, OffscreenCanvas or WebGL2 are missing, and when `prefers-reduced-motion: reduce` matches ("Reduced motion is enabled."). Device pixel ratio is capped at 1.5 in one branch. Source: the hero chunk (`…/chunks/3ur1jvez-2e16.js`, 32 KB) plus the worker.
- **Cost at rest:** 1.6% main thread, 0 rAF/s on the main thread (rendering is off-thread); visible change 0.02–0.05% per 450ms in light, a slow drift of the shadow. No staged text entrance: the page arrives composed at about 1.2s; one 200ms `fade-in`.
- **Reduced motion:** visible change 0%, main thread 0%; the reduced first frame differs from the animated one by 0.82% (the static render).
- **CSS:** 28 reduced-motion rules, 73 keyframes; most-used curves `cubic-bezier(.4,0,.2,1)` and the drawer curve `cubic-bezier(.32,.72,0,1)`.
- No pause control (canon WARN at 1440, FAIL at 390 for continuous motion).

## Copy voice
Noun-phrase category claims and agent-first framing: "Agentic Infrastructure"; "Build agents on infrastructure that thinks like them"; "Ship apps that scale from zero to millions instantly"; "Host platforms that serve every customer". Proof is one sentence with a named customer and a scale: "Notion powers millions of agent conversations daily on Vercel." Closing: "Built by you, or your agents", with "Deploy now" beside a second action labelled "Onboard your agent" (behaviour not verified).

## Canon probe (1440 light, 390 light)
FAIL zoom blocked (`maximum-scale=1`), FAIL typography (display tracking −0.06em, 11px text, 14px prose), FAIL tells (`transition: all`, transitions on layout properties, grid-line background, mono outside code), FAIL contrast (ink 3 at 3.1:1), FAIL hidden at rest (32.8%, mostly menu and tab content), WARN canvas labelling.

## Three moves for Misty Step
1. **The mark as the lit object.** Put the Misty Step mark in the hero and animate the light around it (soft shadow, mist catching light), never the mark itself. MotionA/B: build an SDF of the mark from MarkSmith's SVG, move one light on a period of 8s or more, render off the main thread when `OffscreenCanvas` exists, and copy Vercel's fallback chain exactly: no worker, no WebGL2 or reduced motion means a static render of the same composition.
2. **Claim, object, three lines.** A two-word or two-line h1, the mark in the centre, and three short lines on the right instead of a paragraph. Misty Step's three lines exist in `facts.ts`: the free 30-minute call, the $4,500 two-week discovery, the fixed-price build. HeroSmith: a triptych hero that keeps the first viewport under about 40 words.
3. **A CTA addressed to agents on the stack page.** "Built by you, or your agents" with a second action for agents is the right shape for stack.mistystep.io, where the reader is often an agent harness. Copywriter and LayoutA/B: pair the human action with a copyable install line from `facts.ts` (the `install` section already carries the real commands).

## Traps
- **Geist is the live mistystep.io face and a canon training-data default.** The restraint is worth copying; the face needs a written argument or a replacement.
- **−0.06em display tracking** is past the canon floor (−0.04em); Geist survives it at 64px, most faces will not.
- **Monochrome plus one triangle only works because the triangle is famous.** A lesser-known mark in an empty hero reads as a placeholder; give it a job (light, mist, steps).
- **Payload you do not use:** five Geist Pixel faces preloaded and invisible. If a pixel face is chosen, load it only where it renders.
- **Zoom blocked and ink 3 at 3.1:1.** Both are canon floor failures.

## Captures (private)
`sheet_1440_folds.jpg` (light | dark), `sheet_390_folds.jpg`, `1440_light_storyboard.jpg` (7 positions over 5333px), `390_light_storyboard.jpg`, `1440_light_m0-4.png`, `1440_light_reduced_f0.png`, `1440_light_load.mp4` (+ `.contact.jpg`), `data.json`.

## Links
- https://vercel.com/
- https://vercel.com/font (Geist, Geist Mono, Geist Pixel)
