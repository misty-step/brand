# R2 mist engine

Shared by the round-2 motion options `r2-mist-ground`, `r2-mist-drift`, `r2-mist-halftone`, `r2-mist-strata` and `r2-mist-silver`. No `index.ts` lives here, so the option registry ignores this directory. Each option is a variant: ten tunable defaults plus a fixed `Look`.

- `option.ts` loads with the option. It holds the ten Tune params (screen, cell, inks, density, fog height, ink depth, wind, turbulence, pattern travel, misty step) and their ranges, the `Look` type (entrance, wake, lift, feather, wisps, horizon), the hero entrances, the void-and-cluster blue-noise generator and `mistOption()`, which turns a variant into a `MotionOption` with `origin: 'r2'` and `params`.
- `engine.ts` is the lazy chunk. It is one WebGL1 program and one fullscreen triangle, drawn at one canvas pixel per cell. A cell is 2 to 6 CSS px, rounded to whole device pixels, and the canvas is upscaled nearest-neighbour.

## The field

- Three banks. The far bank is a thin broken band on the horizon, the mid bank is one floating layer, and the ground bank is densest at the bottom edge. Clear air separates them. Each bank is a soft horizontal band of stretched, domain-warped value noise. The banks drift right at 0.28, 0.55 and 1 times the wind (18 CSS px/s at wind 1) for parallax. Wisps rise off the mid and ground banks and lean downwind. A one-cell horizon line fades in and out along its length and hides behind the far bank.
- Screens. Each bank is thresholded through the chosen screen: blue noise (64 x 64 void-and-cluster, built once per page in idle slices of at most 6 ms), Bayer 8, Bayer 4, a 45 degree clustered-dot halftone, a horizontal line screen, or a stipple that never merges. Every bank reads the screen at its own offset. With pattern travel above 0, that offset slides with the bank in whole cells, so the dots move with the mist instead of the mist moving through a fixed screen. The nearest inked bank takes the cell.
- Inks. The inks come from the palette's own ramp: `--bg`, `--field-1..3`, then at most 45% of the way on toward `--ink`. Ink depth picks the deepest one. Light grounds go about half a step deeper, because pale cells on a pale ground wash out. With one ink every bank shares it; with two the ground bank is deepest; with three each bank has its own.

## Behaviour

- Keep-clear. The hero's title, sub, actions and proof are measured as boxes, and the mist thins within 110 px of them.
- Entrance. On the first live frame a light veil hangs over the hero's words. Over 1.5 s it clears from the words outward, then everywhere. The words themselves land by CSS within 700 ms, through the variant's own mask: blue-noise dissolve, drifting cells, growing halftone dots, a thickening line screen, or a short step.
- Pointer. A fine pointer parts the mist and pushes it aside. Its last twelve positions form a wake that drifts downwind, widens and refills over about two seconds.
- Scroll. Scrolling the hero away lifts the banks by up to 30% of the fog height and thins them by up to 60%.
- Misty step. Every 6 to 30 s, set by the misty step param (0 is off), a ragged patch away from the words glitters for half a second and vanishes. The same patch of mist reappears 150 to 260 px away, mostly downwind, and glitters. Both places then relax back into the field within about two seconds.
- Lifecycle. The engine draws at 30, 20 or 12 fps. It samples the page frame rate in 2 s windows and steps down below 45 fps; below the last tier it holds the frame. It stops offscreen and in hidden tabs through its own IntersectionObserver and visibility listener, as well as the lab's pause. Reduced motion draws one finished frame (no veil, wake, lift or step) and stops; theme and Tune changes redraw that frame. A lost context is restored and redrawn. `update()` re-reads the palette only when the colours change and clamps every Tune value to its param's range.
