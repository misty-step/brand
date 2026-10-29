# Misty Step reference library (lab-007)

Per-layer notes on the owner's named references, written for the option builders. One file per site, each with mark, type, colour, layout, hero, motion (how it is built, how it handles reduced motion) and copy voice, then three moves for Misty Step and the traps. Text and links only in the repo; screenshots, recordings and probe JSON stay in the private library at `~/.cache/tmp/misty-design/refs/<site>/`.

| Site | Notes | The idea in one line |
|---|---|---|
| Macroscope | `macroscope.md` | A two-ink halftone photo of someone working on a mountainside, with the product line-up beside the headline. |
| Greptile | `greptile.md` | A stippled lizard about to eat a fly (it catches bugs), wide heavy type, interlocking arrow buttons. |
| Grok / x.ai | `grok.md` | One question and one input (grok.com); a live-word headline over real-looking product sessions (x.ai). |
| Vercel | `vercel.md` | The logo is the hero and the motion is light: a triangle casting a moving soft shadow. |
| Stripe | `stripe.md` | Light-weight type and navy hairlines, with one WebGL ribbon of colour through the hero. |
| Cloudflare | `cloudflare.md` | One drenched orange panel with a dot-matrix texture and a rising glow. |
| Linear | `linear.md` | The product is the illustration: the app rendered in HTML, quiet grey type on near-black. |
| Omarchy | `omarchy.md` | The site wears the OS theme system; a drawn pixel logotype in a canvas field of pixel cells. |
| Brass Hands | `brasshands.md` | Brand identity as field equipment: seals, spec plates, stippled 1-bit glyphs, condensed type. |
| pi.dev, earendil.com | `~/.cache/tmp/misty-design/Inspiration/moodboard.md` §2–3 | Book serif plus a pixel mono; one sentence over a raymarched sea. Cited below from that write-up. |

## How these were captured
- **Linear and Vercel:** a headless Chrome 156 on this Mac, driven over CDP (Linear with SwiftShader WebGL, Vercel with the Mac's GPU through ANGLE Metal), before the 2026-10-29 browser stop. Matrix: 1440×900 @1× and 390×844 @2× touch, `prefers-color-scheme` light and dark with storage cleared per state, a reload under `prefers-reduced-motion: reduce`, scroll storyboards (a screenshot every 0.92 viewport after a 900ms settle), and a screencast of the load. Measures: visible change (share of greyscale pixels moving more than 10/255 between frames 450ms apart), main thread (CDP `TaskDuration` per second over 3s), rAF and WebGL draws per second (DesignCanon `init.js`), offscreen cost at the page bottom, and the DesignCanon `probe.js` at 1440 and 390.
- **Stripe, Macroscope, Greptile, Grok/x.ai, Cloudflare, brasshands.com:** after the stop, through Firecrawl's hosted Chrome 156 (SwiftShader, off this Mac, 18 requests): 1440×900 and 390×844 at DPR 1, a fold, frames at 0, 0.45, 0.9 and 2.85s (a frame sequence instead of a video), five or six scroll positions, a full-page shot, the same in-page style probe and an animation dump (`document.getAnimations()` with keyframes). Dark themes were captured only where a toggle or class could be set (x.ai, grok.com); reduced motion could not be emulated remotely and is read from CSS and JS instead.
- **Omarchy:** reused the 2026-10-28 Inspiration captures and write-up.
- **Brass Hands:** brasshands.com as above, plus Dribbble (24 shots reviewed), the Webflow profile, the store and portal (text), and the X account through xAI's X search.
- **Source reads:** shipped HTML, CSS and JS fetched and scanned for `prefers-reduced-motion`, `@keyframes`, `requestAnimationFrame`, `IntersectionObserver`, `visibilitychange`, WebGL, three.js, GSAP, Lenis, Framer Motion, Rive, Lottie and `@font-face`.
- **Caveats:** performance numbers come from one Mac or a remote SwiftShader box and are relative, not field data. Pages change; these are 2026-10-29 states, logged out. Contrast ratios are computed from sampled computed colours on flat grounds, not over images or video. Anything not measured is said to be unverified in the notes.

## Cross-reference by layer
Each table names what the reference does and the move it suggests for an option in that layer. "Best" marks the strongest one or two sources.

### Mark
| Site | What it does | Move for Misty Step |
|---|---|---|
| Vercel (best) | The triangle alone in the nav and as the lit hero object; never recoloured | Make the mark the object that motion lights; never animate the mark itself |
| Brass Hands (best) | Bar-built monograms, bitmap glyphs, seals; "shipping container test" | A mark from stacked bars or steps that survives stencil, 16px, one colour |
| Omarchy | A drawn pixel logotype banded in four tones of the brand colour; sr-only h1 text | A pixel wordmark in tint-to-shade bands of `--accent` |
| Greptile | An isometric cube cut into a G, plus a mascot as second mark | A second, subject-literal image mark (the bird) beside the symbol |
| Macroscope | A disc with a lens cut; one ink | Pure silhouette marks read at 16px |
| Linear | A circle cut by diagonal bands, monochrome | Thick internal cuts keep a symbol legible small |
| Stripe, Cloudflare, x.ai | Wordmark-led (Stripe), cloud plus tracked wordmark (Cloudflare), swept X (x.ai) | Wordmark-only is an option when the name carries it |

### Type
| Site | Families and display setting | Move |
|---|---|---|
| Vercel (best for restraint) | Geist Sans/Mono (OFL); 64/400, −0.06em; six sizes; `ss11` | At most six sizes; tune with OpenType features |
| Linear (best for tokens) | Inter (OFL) with `cv01, ss03`; 64/510, −0.022em; tracking token per size | Per-step tracking tokens and an in-between weight (510) |
| Stripe | Söhne (commercial); display and body at weight 300 | A light-weight display in an OFL variable face |
| Greptile | Anybody (OFL, width axis) 96/700; DM Sans; Space Mono | A wide heavy display; avoid DM Sans and Space Mono defaults |
| Brass Hands | Condensed serif display over mono; bitmap caps | A condensed serif display option |
| Macroscope, x.ai, grok.com | Geist again; custom xVf; Universal Sans at five sizes | grok.com's five sizes prove how little is needed |
| pi.dev, Earendil (moodboard) | Plantin book serif plus Departure Mono (OFL) pixel mono for chrome | Book serif for reading, pixel mono only for chrome and figures |

Licensing: Söhne, Berkeley Mono, Universal Sans, xVf, STK Bureau Sans, Apercu Mono and Construct Mono are commercial; only OFL/Apache faces go in the repo.

### Colour
| Site | Strategy and anchors | Move |
|---|---|---|
| Cloudflare (best for tokens) | Drenched hero panel #ff5e1f, then restrained; tokens written as `light-dark()` in OKLCH | One drenched panel; write both themes in one declaration |
| Vercel | Monochrome; two composed themes (#fafafa/#171717, #000/#ededed) | No hue in the hero at all is a valid option |
| Linear | Dark only; #08090a ground, +3% L elevation steps, white-alpha hairlines | Elevation by lightness, no shadows on dark |
| Stripe | Navy ink #061b31, blurple #533afd, gradient only in the wave | Tint neutrals toward the ink hue |
| Macroscope | Navy ink, periwinkle halftone image; colour arrives as image | Let the field or image carry colour, keep UI neutral |
| Greptile | Grey paper #e9e9e9, violet-grey ink #3d3b4f that doubles as the dark ground, mint signal | Ink-as-ground for dark bands |
| x.ai, grok.com | Warm greys (hue about 70), one hot accent on small surfaces | A warm-neutral ladder with a tiny accent footprint |
| Omarchy | 22 themes on one 11-token contract | Themes are tokens; the field reads the same tokens |

Contrast failures seen: Linear ink 4 (3.45:1), Vercel ink 3 (3.1:1), Stripe ink 4 (3.44:1), Macroscope ink 3 (4.07:1), x.ai ink 3 (3.6:1), white on Cloudflare orange (3.06:1).

### Layout system
| Site | System | Move |
|---|---|---|
| Linear (best) | Title-left / paragraph-right sections, full-width product vignettes masked into the ground | Two-column section grammar with masked artefacts |
| Vercel | Edge-to-edge 1448px, 24px margins, 12 columns; short page | Wide margins-light layout; fewer sections |
| Stripe | 1266px container with visible guide rails; bento; house shadow | Faint drawn grid as structure (one divider language) |
| Greptile | Dashed hairline frame with corner ticks, bands alternating paper and ink; zero radius | Square, flat, band-based sections |
| Brass Hands | Hairline frame with four corner cells and side rails (Fellow comp) | A "spec frame" layout, used with restraint |
| Cloudflare | Inset rounded hero panel, hairline cell grid below | Inset hero slab, plain sections after |
| Omarchy | 1152px, 3 columns at 32px, square buttons with 1px borders | Square controls with hairline borders |
| pi.dev (moodboard) | One centred 828px column of hairline-boxed panels | A single reading column for the stack docs |

### Hero
| Site | Pattern | Move |
|---|---|---|
| Vercel (best) | Two-word h1 left, lit mark centre, three short lines right; 32 words | Claim, object, three lines (call, discovery, build from `facts.ts`) |
| grok.com (best for stack) | One question and an input | The live install picker as the hero visual |
| Macroscope | h1 and buttons left, three product cards right, halftone photo behind | The offer as the hero's right column |
| Linear | Left h1, live product UI full width below | A real artefact in DOM, masked, no chrome |
| Greptile | Heavy h1, stippled mascot bleeding off the edge, agent link | A subject pun image in one engraving style |
| Stripe | Two-tone long h1 with a footnote, WebGL wave behind | Footnoted precision (with Misty Step's real caveats) |
| Cloudflare | Centred h1 in a drenched panel, one button | Drenched panel hero |
| Brass Hands | Condensed serif line, one mono sentence, treated image | Poster hero option |
| Omarchy | Pixel logotype as headline, density-vignetted field | Pixel wordmark hero |

### Motion and animation
| Site | How it is built | Reduced motion | Move |
|---|---|---|---|
| Vercel (best) | 2D global illumination in a Worker on `OffscreenCanvas` (WebGPU or WebGL2); 1.6% main thread | Static render when `reduce`, or no Worker/WebGL2 | Copy the fallback chain; render off-thread |
| Stripe (best for governance) | three.js wave; static WebP per breakpoint cross-fades to canvas; shared loop manager pauses hidden/offscreen and steps a 0–3 quality level | CSS motion opt-in via `no-preference`; wave check not found | Still frame first; one governor for every loop |
| Linear | WAAPI blur, fade and rise per line, 1000ms, 100ms stagger; no canvas | Loads finished (0% change) | Per-line entrance, but cap at 800ms and drop the blur |
| Macroscope | CSS keyframe entrance 620–1100ms; reveals 280–320ms, 42ms stagger | 95 rules restoring final state | Reveal tokens worth copying |
| Omarchy | 2D canvas pixel field, View Transition theme wipe | Static field, one rAF loop left running | Field reads tokens; density vignette |
| Earendil (moodboard) | Raymarched WebGL at 0.4–0.68× resolution, adaptive tiers, 15 fps behind reading pages | Slows to 0.15× (not adopted) | Resolution and frame-rate tiers |
| Greptile, Cloudflare, x.ai, Brass Hands | Glow filters, marquees, video loops, scripted tiles, film grain | 4, 13, 17 and 2 rules | What not to do: loops with no pause |

### Copy voice
| Site | Voice | Move |
|---|---|---|
| Stripe (best for precision) | Numerate and footnoted | Claims with denominators and footnotes |
| Linear | Product nouns, two-noun section heads | Plain section heads ("Intake and integrations") |
| Vercel | Category nouns; one-sentence proof with a named customer | One proof sentence per section, from facts only |
| Greptile, Omarchy | Cheeky, internet-native, names real people and money | Personality only where it is true |
| grok.com | One question | Ask the visitor one question |
| Cloudflare | Scale stated plainly; a utility nav action ("Under attack?") | A specific nav action for the visitor in trouble |
| Brass Hands | Mission-briefing cosplay ("Engage design ops") | Avoid |
| pi.dev (moodboard) | Opinionated, honest, "What we didn't build" | An honest non-features list for mistystack |

## Brass Hands: verdict
**Keep it, for three layers only: mark, one hero pattern, and the steps illustrations.** Full evidence in `brasshands.md`.
- **Mark:** the strongest pixel and stencil marks in the whole reference set (the bar-built Synthetic S, the RE-IND bitmap glyph and seal, the stippled Cadrian C), plus a useful stated test: "Every brand should pass the shipping container test."
- **Hero:** one composition worth an option: a condensed serif line, one mono sentence and a single stippled, character-dithered or documentary image (the "Fellow" and "American dynamism" comps).
- **Steps:** an AI consulting client's process cards (Signal, Transform, Deploy, Refine, Measure, Repeat), each a stippled 1-bit glyph, map directly onto Misty Step's offer and its `steps` section.
- **Not for layout, motion, colour or copy:** the studio's own site has no headline, one type size and autoplay video with animated grain (61–68% of pixels changing per 450ms, two reduced-motion rules); its palette signals defense tech; its voice ("Status: Deployed in sector", "Engage command for mission briefing") is costume for a consultancy that sells a free 30-minute call and fixed-price builds; much of the portfolio is unbuilt Dribbble comps.

## Patterns that repeat across the set
1. **Agents are addressed directly.** Vercel ("Built by you, or your agents" with "Onboard your agent") and Greptile ("onboard with your agent") both give agents their own action. stack.mistystep.io's readers are often agent harnesses: a copyable install line is the right second action.
2. **Real artefacts beat illustrations.** Linear renders its app in HTML, Greptile lists real bugs in named repos, x.ai scripts real-looking sessions. Misty Step has real ones: the trial tasks with 2/6, 4/6 and 5/6 outcomes and caveats, five projects with hosts, verbatim install commands.
3. **The still frame is designed.** Stripe ships a WebP of its wave's first frame; Vercel renders a static GI frame under reduced motion; Macroscope's hero is a static halftone. With browsers off this Mac, the still frame is also what the lab's checks will see.
4. **Geist is everywhere.** Vercel, Macroscope and today's mistystep.io share it; choosing it now needs a written argument.
5. **Nobody ships a pause control.** None of the nine sites has one; the canon requires it for anything moving longer than 5s.

## Files
`linear.md`, `vercel.md`, `stripe.md`, `macroscope.md`, `greptile.md`, `grok.md`, `cloudflare.md`, `omarchy.md`, `brasshands.md`, and this `README.md`.
