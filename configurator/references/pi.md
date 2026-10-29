# pi (pi.dev)

Not re-captured for this library (no browser under the 2026-10-29 rule). These notes are re-cut by layer from the 2026-10-28 Inspiration pass (`~/.cache/tmp/misty-design/Inspiration/moodboard.md` §2), which captured pi.dev in OMP's headless Chromium with software GL: 1440×900 @1× and 390×844 @2×, light and dark via the site's own toggle, intro and idle motion, reduced motion, docs. Numbers below are from that pass. Private captures: `Inspiration/pi_*`, `Inspiration/detail_pi_hero.png`, `Inspiration/pi_1440_logo_detail_light.png`.

pi is the coding-agent harness made by Earendil, and one of the harnesses mistystack ships an adapter for, so it is both a reference and a neighbour.

**The idea in one line:** a developer tool set in book typography. The only pixel work is the logo, which assembles once from falling blocks, and then the page does not move.

## Mark
- A pixel "P" built from Tetris-like tetrominoes in coral #f09082, blue #4d9abf and yellow #f1be58 (plus a cyan bar in light mode), drawn on a 2D canvas (`#heroLogo`, `image-rendering: pixelated`).
- The same pixel P sits small in the nav. One authored pixel object, used twice.

## Type
- **Reading face:** Plantin MT Pro (the PlantinNow variable, upright and italic; commercial) carries everything you read. h1 47.7px italic; h2 49.5px italic, −1.98px tracking (about −0.04em), line-height about 0.96; body 22/34 at weight 450, 19.4/28.8 on phones.
- **Chrome face:** Departure Mono (Helena Zhang, OFL), a pixel monospace, for the nav, tabs and bracketed buttons such as `[ COPY ]`, at 13–14.4px, uppercase and tracked.
- **Commands:** Commit Mono (OFL) at about 17px.
- Three families, each with one job: serif to read, pixel mono for chrome, mono for commands.

## Colour
Two composed themes behind a three-state footer toggle (system / light / dark; `data-theme-mode=system`, storage key `pi:theme`).

| Role | Dark | Light |
|---|---|---|
| Ground | #161d27 | warm stone #ebe7e4 |
| Panels | #212730, #142433 | n/a |
| Ink | #d5d8db; dimmed states at 36–84% alpha | #252f3d |
| Accent | #6a9fcc | #4b607c |

The background is a CSS pixel grid on `body::before`: 1px lines every 4px at 0.8% alpha. It reads as dots in dark mode and graph paper in light. The logo's tetromino colours are the only saturated colour on the page.

## Layout system
- One centred 828px column built from 1px hairline-boxed panels.
- Docs use three columns (nav / text / "On this page") with ⌘K search and a version label.
- Phones: a 3×4 dot "burger" and the pixel P in the nav.

## Hero pattern
The pixel P assembles in the hero, then the nav, the install box and the stage rise in together. The install box (a real command with `[ COPY ]`) is the primary action; it sits above the fold.

## Motion and animation
- **Intro:** the P assembles from falling tetrominoes over about 2.5s, then `hero-rise-fade` (1540ms) brings in the nav, install box and stage.
- **Then still:** 0.1% main thread and 0 rAF/s at idle.
- **Scroll:** a sticky asciinema terminal plays a real recording for each feature section; recordings load on demand, but `default.cast` alone is 6 MB.
- **Reduced motion:** adds an `is-intro-skip` class and leaves a static page (0% change).

## Copy voice
Opinionated and honest: "There are many agent harnesses but this one is *yours*"; "Adapt Pi to your workflows, not the other way around."; "Primitives, not features"; a "What we didn't build" list with struck-through reversals (~~No MCP~~ → "Now with MCP+Codemode", "No sub-agents", "No permission popups", "No plan mode"); "and it can play doom".

## Three moves for Misty Step
1. **Assemble once, then stillness.** The mark builds itself in about 2.5s and the page never moves again; reduced motion skips straight to the built mark. MarkSmith: `animateIn` on `.brand-mark` that assembles the mark from its own grid cells (steps, not tetrominoes) and does nothing under reduced motion; MotionA/B can keep the rest of the page still.
2. **Each face has one job.** A reading serif for everything you read, a pixel mono only for chrome and buttons, a plain mono for commands. TypeSetter: direction B (Literata with Departure Mono, both OFL) is the closest licensed port; keep the pixel mono at 16px or above and in sentence case to stay inside the canon.
3. **An honest "what we didn't build" list, with real recordings.** Strike-through reversals and plain non-features read as confidence. Copywriter and LayoutA/B: a `points` section of deliberate non-features for mistystack, and real session recordings with a poster frame and a size budget (not 6 MB).

## Traps
- **Licensing.** Plantin is commercial; only the OFL faces (Departure Mono, Commit Mono) can ship.
- **Tracked uppercase pixel mono at 13–14px** in nav and buttons is the canon's "tracked caps micro-label" tell.
- **Italic serif display by reflex** is on the tell list; pi earns it with a reading voice, a pitch page may not.
- **Game props.** The Tetris logo works because pi says "and it can play doom"; Misty Step's pixels need their own reason (steps, stacking, the terminal), not a game reference.
- **Payload.** A 6 MB recording behind a sticky terminal.

## Links
- https://pi.dev/
- https://github.com/earendil-works/pi
