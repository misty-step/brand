# Grok (grok.com) and x.ai

Grok's brand lives in two places: grok.com is the product (a chat app whose logged-out home is one question and a composer), and x.ai (now branded SpaceXSI) carries the marketing, including the Grok product page at x.ai/grok. Captured 2026-10-29 through Firecrawl's hosted Chrome 156 (off this Mac): x.ai and grok.com at 1440×900 and 390×844 (DPR 1) with fold, motion frames, scroll positions, full page and style probe; dark themes captured by clicking x.ai's "Switch to dark mode" toggle and by setting grok.com's `dark` class; x.ai/grok at 1440. Method: `README.md`. Private captures: `~/.cache/tmp/misty-design/refs/xai/`, `refs/grok/`, `refs/grok_sheet.jpg` (x.ai dark | grok dark | x.ai/grok).

**The idea in one line:** the product's own surfaces are the marketing. grok.com greets you with one sentence and an input; x.ai's hero is a sentence with one live word, sitting over a bento of real-looking product sessions (chat, a coding agent, a bot routine).

## Mark
- **x.ai / SpaceXSI:** an "X" with a long swept stroke, black on light, white on dark; the footer sets a SPACEX wordmark.
- **grok.com:** a small circular glyph (a ring cut by a diagonal) at the top left, monochrome.
- Neither mark is coloured; colour is reserved for small product accents (an orange "sunset", a lavender "twilight").

## Type
- **x.ai:** `xVf`, a custom variable sans (weights 200–800, 68 KB woff2), with Geist Mono (OFL) for code and labels. h1 60 / 450 / line-height 1.0 / −0.01em, centred; h2 48 / 500; body 16–18 / 400 / 1.63; nav 13–14 / 500. Scale: 10, 10.5, 11, 12, 13, 14, 16, 18, 24, 30, 48, 60 (12 sizes). At 390 the h1 is 36 / 1.1.
- **grok.com:** Universal Sans Text and Display (400 and 550, with italics; commercial) for the UI, X-VF, X-VF Display and X Mono loaded, IBM Plex Mono and Geist Mono for code, KaTeX faces for maths, Vazirmatn for Arabic script. The home page uses five sizes: 13, 14, 15, 16, 24; the only heading is 24 / 550 / 1.35 / −0.02em.
- **Live word:** x.ai's h1 ends with a word that cycles ("build", "search", …), each letter a span, underlined by an 800ms wipe and a 3s shimmer.

## Colour
Both sites ship composed light and dark themes. grok.com declares `theme-color` #f9f8f7 (light) and #1e1f22 (dark) and switches with the system; x.ai has a toggle.

| Role | x.ai light | grok.com light | Notes |
|---|---|---|---|
| Ground | #ffffff, ivory #f9f8f6 | #f9f8f7 (warm off-white) | dark: near-black grounds, white ink |
| Ink | #0a0a0a (19.8:1) | #050505 | |
| Ink 2 / 3 | #59534d (7.6:1), #8d867e (**3.6:1**) | #636363 (5.7:1) | warm greys, hue about 70 |
| Accent | `--accent` / `--color-sunset` hsl(22 100% 51.6%) orange; product tiles on #e04a26 | `--grok-accent` lab(54.7 6.5 −70), a saturated blue | used on tiles and the send button only |

x.ai names its palette (ink, nimbus, breeze, steel, ivory, twilight, evenfall, sunset, midnight, pewter, jet). grok.com's CSS is built on `lab()` and `color-mix()` (1092 uses) with `@property` (225).

## Layout system
- **x.ai:** a 1280px container, centred hero, then a bento of product tiles (Chat, Build, Bot, then Imagine and Voice), a developer band ("One API. Every modality.") with a code card on an orange textured panel, three stats, news cards, two plan cards, a mega footer. Short page: 3789px. Pills for buttons, 16px tiles.
- **grok.com:** one viewport. A 752px column centred, one question, one composer with a model picker ("Fast"), sign-in links top right, legal line at the bottom.

## Hero pattern
- **x.ai:** a "New · Meet Grok 4.7 · Our new model ↗" pill, the two-line h1 with the live last word, one sentence ("Reasoning, code, voice, images, and video. Trained on the world's largest supercluster."), two pills ("Get API Access", "View Documentation"), then the product tiles playing scripted sessions. 274 words in the first viewport at 1440 because the tiles carry transcripts.
- **grok.com:** "What should we explore?" and an input. Nothing else above the fold; 34 words.
- **x.ai/grok:** "AI that is useful for everyone." centred, one sentence, "Try Grok" and "Get SuperGrok".

## Motion and animation
- **x.ai:** the tiles animate continuously (typed transcripts, a three-dot `cli-dot-loader` at 660ms, scrolling chat); 6–11% of pixels change per 450ms at 1440. A `border-beam` shimmer, `fadeSlideUp`, `tilePopIn`, `barGrow`, and a set of `baby-grok-bot-*` keyframes for the Bot tile. 17 reduced-motion blocks, including ones that stop the dot loader and the border beam.
- **grok.com:** almost still (0–0.07% change); an 800ms underline wipe, a scroll-driven `scroll-feather-y` fade on the composer, View Transitions in the app (130 references). 36 reduced-motion blocks.
- No canvas in grok.com; two small canvases on x.ai.

## Copy voice
Short, declarative, maximal claims: "Frontier AI models for everything you build."; "Trained on the world's largest supercluster."; "One API. Every modality."; "AI that is useful for everyone."; grok.com asks one question: "What should we explore?". Proof is scale (queries per day, GPUs, days to build Colossus).

## Canon read
x.ai: a "New" pill above the h1, a cycling word (the canon bans typewriter or scramble text), drawn terminal chrome with traffic lights in the Build tile, 274 first-viewport words, ink 3 at 3.6:1, continuous tile motion with no pause control. grok.com is the opposite case: almost nothing on the page, which passes the five-second test by construction.

## Three moves for Misty Step
1. **One question and one input as a hero.** grok.com's home is a prompt; stack.mistystep.io could open with the one live thing the canon asks for: pick your harness, see the exact install line from `facts.ts`. HeroSmith: a hero whose `.hero-visual` is a real control (harness tabs and a copyable command), not an illustration.
2. **Product sessions as tiles, scripted from real runs.** x.ai's tiles show a chat, a coding-agent session and a bot routine playing out. For Misty Step, replay real mistystack sessions (a skill loading, an Oracle check before work) as text in DOM; animate the transcript once, end on the final state, and show the final state under reduced motion.
3. **Warm neutrals instead of grey.** Both sites tint their greys warm (hue about 70) and keep one hot accent for small surfaces. Colorist: a warm-neutral ladder with a single small accent footprint reads calm without being cold.

## Traps
- **Scale talk Misty Step cannot match.** "Largest supercluster" style proof only works with the numbers; Misty Step's proof is small, real and caveated.
- **Cycling hero word and drawn terminal chrome** are canon tells.
- **Third-party and commercial faces** (xVf, X-VF, Universal Sans) cannot ship; the restraint can.
- **Busy first viewport on x.ai** (274 words) against an empty one on grok.com: the empty one is the lesson.

## Captures (private)
`xai/fc_desk_*`, `xai/fc_mob_*`, `xai/fc_deskdark_*`, `xai/fc_deskgrok_*`, `grok/fc_desk_*`, `grok/fc_mob_*`, `grok/fc_deskdark_*`, `refs/grok_sheet.jpg`, `source.json` in both folders.

## Links
- https://grok.com/
- https://x.ai/
- https://x.ai/grok
