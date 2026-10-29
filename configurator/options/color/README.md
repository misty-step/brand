# Colour options

Twelve palettes, each a composed light theme and a composed dark theme in OKLCH role tokens (`ColorTokens` in `src/contract.ts`). Nine are new, at least one for every named reference. Three port the previous round's directions (`origin` A, B, C).

| id | Label | Origin | Strategy | Grounded in |
| --- | --- | --- | --- | --- |
| `mono` | Monochrome | new | No hue; ink is the only fill; one blue focus ring | Vercel (Geist), Grok |
| `slate-indigo` | Slate and indigo | new | Restrained indigo on near-black slate | Linear |
| `navy-magenta` | Navy and magenta | new | Navy ink and night, one saturated magenta | Stripe |
| `tangerine` | Warm grey and tangerine | new | One tangerine fill with dark text | Cloudflare |
| `flexoki` | Flexoki | new | Terminal theme: cyan fill, blue second ink | Flexoki, Omarchy |
| `olive-safety` | Olive and safety orange | new | Safety orange for action and focus only; olive second ink | Brass Hands |
| `navy-periwinkle` | Navy and periwinkle | new | Colour as image: ink buttons, one periwinkle ink in the field and links | Macroscope |
| `grey-mint` | Grey paper and mint | new | Mint fill with ink text; the ink is the night ground | Greptile |
| `overcast` | Overcast | new | No hue; mid-scale sky and sea grounds | Earendil |
| `fog-sodium` | Fog and sodium | A | Amber marks only the active thing | Direction A |
| `paper-rubric` | Paper and rubric | B | Ink-filled buttons, rubric red second ink | Direction B |
| `stone-green` | Stone and signal green | C | Green on the action and the goal | Direction C |

`baseline-color` (Plain neutral) is the lab's control, not a direction. It follows the same guarantees: its fields were lightened, and its dark `--bg-3` now sits below `--bg`.

## What every palette guarantees, in both themes

Layouts, heroes, marks and motion can rely on these without knowing which palette is picked.

- `--bg` is the page. `--bg-2` is raised (panels, cards, nav) and is always lighter than `--bg`. `--bg-3` is sunken (code, wells, bar tracks) and is always darker than `--bg`.
- `--ink`, `--ink-2` and `--ink-3` are all text: each is at least 4.5:1 on `--bg`, `--bg-2` and `--bg-3`. `--ink-3` is the faint floor, still AA.
- `--line` is a decorative hairline (about 1.1 to 1.6:1). `--line-2` is for control borders and strong rules: at least 3:1 on `--bg` and `--bg-2`.
- `--accent` is a fill (primary button, selected tab, highlighted bar, active marker). Text on it uses `--accent-ink`, at least 4.5:1. Never set text in `--accent`: in several palettes it is a light fill (amber, tangerine, safety orange).
- `--accent-2` is the coloured text ink (links, figures, counts, labels): at least 4.5:1 on all three surfaces. In `mono` it is the ink itself; in `paper-rubric` it is the rubric red.
- `--focus` is at least 3:1 on all three surfaces and on every field, so a ring stays visible over the busiest frame.
- `--selection` keeps `--ink` at least 4.5:1 on top of it.
- `--field-1..3` are the colours handed to motion: a ramp from `--bg` toward `--ink` (darker on light, lighter on dark), `field-1` faintest and `field-3` strongest, each step at least 1.08 times the previous step's contrast with `--bg`. `--ink` and `--ink-2` stay at least 4.5:1 on every field, so a hero can set its headline and sub over the busiest frame. `--ink-3` and `--accent-2` are not guaranteed over a field. Fields may carry hue (`flexoki` tints them cyan and blue) but always step monotonically away from `--bg`. A highlight lighter than `--bg` is not in the ramp; derive it from `--bg` if a field needs one.
- Every value is `oklch(L C H)` with `L` from 0 to 1, no alpha, and inside sRGB, so the measured ratios are what the browser paints. Motion code receives these strings unchanged from `getComputedStyle`; a 1×1 canvas `fillStyle` round trip or the conversion in `check.mjs` turns them into RGB.
- No surface is pure `#fff` or `#000`. Dark grounds sit at L 0.145 to 0.18, with two deliberate exceptions taken from their references: `overcast` (0.31, Earendil's night sky) and `grey-mint` (0.36, Greptile's ink as ground). Dark inks sit at L 0.92 to 0.97.

## Choosing between `--accent` and `--accent-2` in a mark or a field

- `--accent` is the palette's fill. In `mono`, `paper-rubric`, `navy-periwinkle` and `overcast` it is the ink itself, because those palettes fill buttons with ink. In `fog-sodium`, `tangerine`, `olive-safety` and `grey-mint` it is a light fill, 1.3 to 2.8:1 on the light ground. A highlight pixel in `--accent` reads as a lamp but can vanish into the body.
- `--accent-2` is the signature ink at text contrast everywhere. It is red in `paper-rubric` (Direction B's rubric beak), periwinkle in `navy-periwinkle`, the ink in `mono` and `overcast`, and elsewhere the palette's text-safe signature shade (olive in `olive-safety`, blue in `flexoki`, emerald by day and mint at night in `grey-mint`). Use it for any highlight that must survive a 16px favicon.
- `MotionCtx.accent` is `--accent`. A focal cell in a field can use it, but it may equal `--ink` (in `mono`, `paper-rubric`, `navy-periwinkle` and `overcast`).

## Checking

```sh
node options/color/check.mjs          # verify every palette with a contrast block
node options/color/check.mjs --write  # also rewrite the measured ratios into each index.ts
node options/color/check.mjs --pairs  # also lint the other layers' CSS for unguaranteed text/background pairs
```

The script imports each `index.ts` (Node strips the types), converts OKLCH to 8-bit sRGB, measures WCAG 2 contrast and fails on any broken guarantee above. It also reports what the design-canon probe will flag. The one flag today is `flexoki` light: the probe reads Flexoki's paper (`#F2F0E5`) as a warm cream ground. That is the theme's identity, and the palette keeps every orange and red away from it so the cream-and-terracotta look never forms.

`--pairs` reads `src/preview/base.css` and every other layer's `index.ts`. It finds rules that set both a text colour and a background from these tokens, and reports any pair outside the guarantees with its worst ratio across every checked palette, the baseline included. It also reports any text set in `--accent`. It sees same-rule pairs only, so it is a lint and not a rendered measurement. Rendered checks (the canon probe and screenshots in four states per palette) are pending: per the conductor's browser rule, only LabCore runs them.
