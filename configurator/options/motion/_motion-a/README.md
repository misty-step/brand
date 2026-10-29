# MotionA shared helpers

Helpers for the motion options `still`, `quiet`, `dither-mist`, `terraces`, `voxel-stairs` and `pixel-assemble`. No `index.ts` lives here, so the option registry ignores this directory.

- `field.ts`: the lifecycle the three fields share. Live mode is one WebGL canvas drawn at one field pixel per cell (2 or 4 CSS px at any DPR) and upscaled with nearest-neighbour filtering. It has adaptive tiers (frame rate sampled over 2 s, step down below 50 fps, a still after the last tier), its own IntersectionObserver and visibility guard, a local spring for a fine pointer, and keep-clear boxes that thin the field behind the hero's text on full and page hosts. Still mode computes the same composition on the CPU into a 2D canvas, in idle slices of at most 8 ms. It runs under reduced motion, Save-Data, no WebGL, and after a lost context or a failed shader compile, and it never creates a GPU context.
- `color.ts`: resolves `ctx.colors` (raw computed strings, usually `oklch()`) through a 1x1 canvas, and finds the opaque ground behind the host so fields match a panel that sits on `--bg-2`.
- `entrance.ts`: the hero's focal pieces in reading order. It uses `[data-enter]` with `--enter-i` when the hero marks them, and contract classes otherwise. It also provides the `live()` scope, so reduced motion and Pause always show the finished page.
- `interaction.ts`: press and hover micro-interactions in two flavours. `smooth` presses to scale 0.97; `pixel` drops 2px and flips colour in `steps(3)`. Colour moves only for a fine pointer, and tabs never animate.
- `bench.html` + `bench.ts`: a frame-cost bench for a machine where a browser is allowed. Run `npm run dev` and open `/options/motion/_motion-a/bench.html`. For each field and host it reports one draw plus a 1px readback (median and p95 over 120 frames) and the CPU still time.

Every field's CPU still mirrors its fragment shader line for line (same constants, same order). If you change one, change the other.
