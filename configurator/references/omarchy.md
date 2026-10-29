# Omarchy (omarchy.org)

Reused captures from the 2026-10-28 Inspiration pass (`~/.cache/tmp/misty-design/Inspiration/omarchy_*`, measured in OMP's headless Chromium with software GL) and its write-up (`Inspiration/moodboard.md` §1). Re-read for this library on 2026-10-29; numbers below are from those captures. Method and caveats: `README.md`.

**The idea in one line:** the website wears the operating system's own theme system. A drawn pixel logotype sits in a canvas field of pixel cells, and switching the site theme is the same act as switching the OS theme.

## Mark
- **Symbol:** a small square-in-square "window" glyph (outline square with a notched inner square) at nav left, about 22px, drawn on the pixel grid.
- **Logotype:** a custom pixel blackletter-ish "OMARCHY" painted into the hero canvas, about 900px wide at 1440. Its colour is four horizontal tonal bands of the theme's brand colour, light at the top to dark at the bottom (Tokyo Night: #daecc6, #9ece6a, #678549, #39482e). The `h1` keeps the words for assistive tech (`<span class="sr-only">Omarchy: </span>`).
- The pixel logotype returns as the phone sticky-header logo, the manual masthead and in footer and meetup art: one drawn asset, many placements.

## Type
- **Families:** JetBrains Mono Variable (OFL) carries body, nav and UI; Geist Variable (OFL) sets section heads. Both self-hosted.
- **Scale (1440):** visible tagline 30px / 500 JetBrains Mono, −0.75px; section heads `h2`/`h3` 28 / 600 Geist, −0.7px; `h4` 18 / 500; body 15 / 24.4 mono; nav 14; small 11–13. On phones `h1` and `h2` drop to 24.
- About 8 sizes packed close together (11–15, 18, 28, 30): the logotype supplies all the scale contrast.

## Colour
22 site themes mirror the OS themes; an inline `<head>` script picks one at random from a pool chosen by `prefers-color-scheme` (light pool of 5: catppuccin-latte, flexoki-light, lupine, rose-pine, white; dark pool of 17) and stores it as `omarchy-site-theme`. Every theme fills one token contract: `--t-bg-deep / bg / surface / surface-2 / border-subtle / border-strong / text / text-secondary / text-muted / brand / brand-soft`.

| Theme | Ground | Surface | Text (primary / secondary / muted) | Brand |
|---|---|---|---|---|
| Tokyo Night | #1a1b26 (deep #13141c) | #1f2230 | #c0caf5 / #a9b1d6 / #8b93b8 | #9ece6a |
| Flexoki Light | #fffcf0 | n/a | #100f0f | #205ea6 |
| White | #fff | n/a | #000 | #6e6e6e |

Borders 1px #24283b and #414868. Brand colour fills the primary button and the logotype bands only.

## Layout system
- 1152px container (Tailwind `max-w-6xl`), 3-column grids with 32px gaps, a 2-column grid with an 80px gap.
- Square everything: 0 radius buttons and panels with 1px borders. (Many pill radii exist on avatars and dots.)
- Sticky header; a music mini-player pinned bottom-left with album art and a mute state.
- Sections: calm mono text plus real screenshots and photos (the OS, a Quattro rally car painting, community photos). Built with Astro and Tailwind.

## Hero pattern
Centred stack inside a full-viewport pixel field: a bordered announcement box ("SpaceXSI joins as a Founding Corporate Patron with $1.5 million in Grok tokens →"), the giant pixel logotype, the tagline "Beautiful, fun & agentic Linux by DHH", a two-line sub, then two square buttons (filled brand "Get Omarchy" with a download icon; outlined "See it in action" with a play icon). The field gets denser toward the bottom edge and the corners, which keeps the centre clear for text.

## Motion and animation
- **Field:** 2D canvas (`alpha:false`, `pointer-events:none`) of pixel squares that flicker and rise: 3–5% of pixels change every 400ms. Two rAF loops at about 118/s; main thread 28–45% while the hero is in view; script time drops from 25% to 1% when scrolled away (it pauses offscreen). A second canvas rises in the footer (`footer-rise`).
- **Logotype:** drawn in pixels on load; rebuilds row by row after a theme change.
- **Theme switch:** a diagonal View Transition wipe (`theme-split-wipe`) between palettes, opened from a palette button that shows the OS's coverflow theme picker.
- **Typewriter:** the first section heading types out ("We can fix everything") with a caret.
- **Reduced motion:** 14 reduced-motion rules kill the keyframes and the field is static (0.01% change), but one rAF loop keeps forcing a layout every frame (60/s). No pause control.

## Copy voice
Cheeky, personal, internet-native: "Beautiful, fun & agentic Linux by DHH"; "The malleable OS for the age of agents. Vibe your way through every alteration, tweak, or trouble."; "A plugin for every dream, every desire"; "Backed by the oligarchy"; "It takes a village to raise a distro". It names real people and real money (patron amounts, download counts) because they exist.

## Canon read (from the DesignCanon dry run)
Take the pixel-block wordmark, the pixel-cell field on a strict grid and theme switching. Leave mono running text at 13px and 11px text, tracked caps, glass, loops at about 120 frames per second with no pause control, and metadata at about 1.9:1 contrast.

## Three moves for Misty Step
1. **A drawn pixel logotype as the one focal object, banded in four tones of the accent.** Draw "Misty Step" (or the mark plus name) on an integer grid as SVG `rect`s with `shape-rendering: crispEdges`, colour each row band from a tint-to-shade ramp of `--accent`, and keep the real words in an sr-only `h1` span. MarkSmith: `wordmark()` returns the SVG; HeroSmith: a hero that sets it large with the headline beneath.
2. **Themes are tokens, and the field reads the same tokens.** Omarchy's 11-token contract re-skins canvas, logotype and CSS together; a theme flip is a View Transition wipe, not a fade. For the lab this is already the contract: MotionA/B must re-derive every colour in `update(ctx)` from `--field-1..3` and `--accent`, and Colorist's field ramp can copy Omarchy's four-step tint/shade structure.
3. **Density, not opacity, as the vignette.** The pixel field is sparse in the centre and dense at the bottom edge and corners, so text over it stays legible without a scrim. MotionA/B: weight cell probability by distance from the text block; it also gives a calm still frame for reduced motion.

## Traps
- **The Tokyo Night look is a generated-UI default.** One acid green on near-black is on the design-studio list; copying Omarchy's palette makes Misty Step look like a theme, not a company.
- **Mono as running text.** JetBrains Mono paragraphs at 13–15px read dense; the canon allows mono for code, commands and figures only.
- **Announcement chip above the hero, big-number stat band, typewriter heading.** All three are on the canon's tell list.
- **Cost and control.** 28–45% main thread for an ambient field, a layout-forcing rAF loop under reduced motion, no pause control, about 2 MB of images on the home page.
- **Retro cosplay without a reason.** Omarchy's pixels come from its TUI and themes; Misty Step's need their own reason (steps, stacking, the terminal).

## Captures (private, in `Inspiration/`)
`omarchy_1440_hero_{tokyonight,whitetheme,flexoki}.png`, `omarchy_1440_scroll.jpg`, `omarchy_1440_manual.png`, `omarchy_390_hero_dark_random.png`, `omarchy_390_hero_light_lupine.png`, `omarchy_390_scroll.jpg`, `omarchy_1440_motion_sheet.jpg`, `omarchy_1440_reduced_f0.png`, `omarchy_1440_themepicker.png`, `omarchy_1440_themeswitch_sheet.jpg`, `detail_omarchy_wordmark.png`, `omarchy_probe_{1440,390,manual_1440}.json`.

## Links
- https://omarchy.org/
- https://omarchy.org/manual/ (the manual, linked from the nav)
