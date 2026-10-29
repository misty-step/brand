# Earendil (earendil.com)

Not re-captured for this library (no browser under the 2026-10-29 rule). These notes are re-cut by layer from the 2026-10-28 Inspiration pass (`~/.cache/tmp/misty-design/Inspiration/moodboard.md` §3), which captured earendil.com in OMP's headless Chromium with software GL at 1440×900 @1× and 390×844 @2×, night and day scenes, the menu, a reading page, motion and reduced motion. Its source was saved as `Inspiration/earendil_script.js` (a copy of `https://earendil.com/static/script.js`, fetched 2026-10-28); line numbers below refer to that copy. The DesignCanon brief (§G) adds its own take-and-leave list. Private captures: `Inspiration/earendil_*`, `Inspiration/detail_earendil_footerbar.png`.

Earendil makes pi (see `pi.md`) and Lefos.

**The idea in one line:** one sentence over a raymarched sea. The whole first viewport is a WebGL ocean under a night or day sky, a single italic sentence in the middle, and four tiny pixel-mono labels in the corners.

## Mark
- A single white glyph at the top left: a tall pointed spire over a rounded base, like a flame or a star, about 32px. Its reflection is drawn into the WebGL sea.
- No wordmark in the hero; "EARENDIL INC." sits as a corner label in pixel mono.

## Type
- **Statement:** PlantinNow italic (commercial) at 35.6/40.9, 22/25.3 on phones; links inside it (Pi, Lefos, open) are underlined.
- **Chrome:** everything else in Departure Mono (OFL) at 15/24, uppercase: `MENU`, `EARENDIL INC.`, `EN`, `AUTO` and the menu items.
- **Reading pages:** Plantin at 20/32 in a 760px measure, with bold-italic run-in heads.

## Colour
Monochrome with no accent at all. An `AUTO` appearance button switches between a night scene (stars) and a day scene (an overcast sea).
- Night: sky #303030, sea #3d3d3d, white text at 95%.
- Day: #dedede and #d6d6d6.
- Texture: paper images (`/static/paper.png`, 119 KB; `paper-dark.png`, 102 KB) and film grain, instead of any colour.

## Layout system
- One viewport organised by its four corners: logo top left, `MENU` top right, company name bottom left, language and theme bottom right. The statement sits in the centre.
- The menu is a right-aligned list in two groups (company and products).
- Reading pages: a 760px column over the same scene, slowed down (see Motion).

## Hero pattern
The sentence is the hero: "Earendil crafts tools to harness AI with Pi and Lefos. Built in the open, shaped by the humans who use them." No button; the links inside the sentence are the actions. The DesignCanon probe found no `h1`.

## Motion and animation
- **Scene:** a fixed, full-viewport WebGL ocean, raymarched (32 steps on "high"), with the logo's reflection and click ripples (up to 10, each lasting 12s; :2481–2486).
- **Resolution:** 0.4× on HiDPI screens and 0.68× on low-DPI (:1409–1416); measured a 979×612 canvas for a 1440×900 viewport.
- **Adaptive quality:** drops a tier below 28 fps and climbs above 55 (:1456–1459).
- **Reading pages:** the shader drops to 15 fps at half resolution (:1436–1438); measured canvas 490×306.
- **Reduced motion:** "keeps the ocean alive as a quiet ambient surface rather than freezing it": waves slow to 0.15×, grain to 0.75×, easing over 3s (:1425–1435).
- **Measured:** 0.6–1.4% pixel change per 500ms at night, about 5% by day; main thread 1.6%; 60 rAF/s.
- **Gaps:** it never pauses, there is no pause control, and the canvas is not `aria-hidden` (DesignCanon dry run).

## Copy voice
Calm, humane, literary: "Earendil crafts tools to harness AI with Pi and Lefos. Built in the open, shaped by the humans who use them."; values "We not I", "Craft Beauty", "Be Charming", "Technology is the Means, not the End"; "…we wield the hammer, the hammer does not wield us."

## Canon read (DesignCanon brief §G)
Take: a living backdrop rendered at 0.25–0.4 scale with adaptive quality tiers; the contrast between a serif and a pixel mono; restraint. Leave: a fixed full-viewport WebGL layer behind all content that draws 60 times a second and never stops offscreen; reduced motion that only slows the field; no pause control; a canvas that is not `aria-hidden`; no `h1`; mono caps labels; `transition: all`.

## Three moves for Misty Step
1. **One sentence and four corners.** A viewport organised by its corners (mark, menu, name, theme) with one statement in the middle, links inside the sentence as the actions. For mistystep.io this is a hero and layout pairing: HeroSmith sets the statement (as a real `h1`, with one real `.btn-primary` added to meet the contract), LayoutA/B places nav and footer items in the corners.
2. **Field engineering worth copying exactly, with the canon's stops added.** Render at 0.4–0.68× resolution, step quality tiers at 28 and 55 fps, and drop to 15 fps at half resolution behind reading text. MotionA/B: keep those numbers, then add what Earendil lacks: stop offscreen and on hidden tabs, a still frame under reduced motion (not 0.15×), `aria-hidden`, and the lab's pause control.
3. **Light and dark as two weathers, not an inversion.** Night sea and overcast day sea are two composed scenes from one shader. For a company called Misty Step the obvious pair is mist by day and mist by night; Colorist's `--field-1..3` per theme and MotionA/B's `update(ctx)` make it a palette swap of the same scene.

## Traps
- **A sea behind everything.** The canon forbids a fixed full-viewport field behind reading content; keep the field to the hero or stop it on reading pages.
- **Starfield.** The night scene has stars, which the canon lists under CRT costume; mist does not need them.
- **No headline element and no button.** Beautiful, and a probe failure; the lab contract requires `h1.hero-title` and a primary action.
- **Licensing.** Plantin is commercial; Departure Mono is OFL.
- **Uppercase mono labels at 15px** in every corner are the canon's tracked-caps tell.

## Links
- https://earendil.com/
- https://earendil.com/static/script.js (scene source, saved privately as `Inspiration/earendil_script.js`)
