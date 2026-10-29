# Layout options

A layout is the page system. It styles the nav, every section type, the contents list when it opts in, the footer, the buttons and the motion toggle. It is CSS only (`LayoutOption.css`), scoped under `html[data-layout="<id>"]`, and it consumes tokens: no font families, no literal colours, and no transitions or press transforms, which belong to the motion layer. It leaves `.hero` to the hero option.

| id | Label | Origin | Structure | Radius | Beyond the six page tokens |
| --- | --- | --- | --- | --- | --- |
| `tiling` | Tiled workspace | A | Each section is a master pane (its heading) beside a stack of panes, with gaps that show the ground. A sticky bar numbers the workspaces. From 1024px a fixed status line holds the footer, the pause control and the keys that work for whatever has focus. The focused pane takes `--focus`. The method diagram is the tile layout, with the Oracle across a wider gap. | 0 | `--t-top` 56px bar, `--t-bar` 44px status line, `--t-gap` 8px, `--t-pad`, `--t-ws` |
| `book` | Book | B | A running head, the hero as title page, the renderer's contents list as a contents page, then chapters on the reading measure. Numerals in `--accent-2` hang in the margin, and a three-square dinkus opens each chapter. Steps and work are contents pages with dot leaders; code and commands break out of the measure as figures. | 0 | `--b-wide` breakout, `--b-chapter` spacing, `--b-tracks` content grid |
| `corners` | Corners | new | No panels. Chrome sits at the corners of the viewport. From 1024px each section is a scene with a display-size title on one side and its content toward the opposite corner, alternating down the page, with a centred closing statement. Pill buttons and a pill harness chooser. | 24px boxes, pill controls | `--c-scene`, `--c-gap`, `--c-content` 62rem |
| `ledger` | Ledger | new | A specification sheet. Sections are lettered, ruled sheets (A, B, C). Rows and cells carry coordinates (A1, A2), field names sit in a key column beside their values, and the contents list becomes the sheet index. Sheets are opaque. | 0 | `--l-ref` key column, `--l-pad`, `--l-gap`, `--l-sheet`, `--l-cell`, `--l-frame` |
| `bento` | Bento | new | A centred 1200px column with split heads (claim left, grey paragraph right). Steps form a hairline board and projects are bottom-anchored tiles (a 3-item group is 1 large and 2 stacked). The method runs in rows of 2, 3 and 1 tiles; install, core and evidence are wide panels. Two-tone centred closing. | 12px tiles, pill controls | `--pill`, `--tile-pad`, `--tile-gap`, `--section-space`; sticky 64px nav |
| `editorial` | Editorial | new | An asymmetric 12-column 1280px grid. A two-tone lede hangs in columns 1 to 5 under a 2px rule and stays sticky. A reading column of ruled entries fills columns 7 to 12, with numerals hung in the alley. Captioned figures; two-tone closing. | 4px | `--col-gap`, `--section-space`, `--row-pad`; unboxed 96px masthead |
| `console` | Console | new | A framed 1280px column of opaque square panels between hairline rails, so a page-level field shows only beside the frame, with sunken gutter strips between panels. Cells share borders. Projects are table rows with hosts, the harness list sits beside its command and the core file sits under a file header. | 0 | `--pad` (panel inset, included in `--edge`), `--band`, `--frame`, `--head-pad`; sticky 56px nav |
| `steps` | Steps | C | A 1376px 12-column grid. The offer is a staircase of treads on one floor and the method a rising level map with the goal inverted. Bands rise on a three-step edge; bars sit in pixel frames. | 0, with 4px stepped button corners | `--px` 4px unit, `--col-gap`, `--section-space`, `--rise-edge`, `--band-pad`; `--rule` is 4px |
| `baseline-layout` | Plain document | baseline | The intentionally plain control. | n/a | n/a |

## Page tokens every layout sets

Heroes read these with fallbacks, so a hero lines up with whatever layout is picked. Set them on `html[data-layout="<id>"]`, with phone values inside `@media (max-width: 700px)`.

| Token | Meaning |
| --- | --- |
| `--page-max` | The content width cap. |
| `--gutter` | The side margin, and the bleed heroes use on phones. At least 16px. |
| `--edge` | `max(var(--gutter), calc((100% - var(--page-max)) / 2))`: inline padding for full-width boxes, so hero copy starts where the layout's content starts. |
| `--radius` | The corner language for boxes. |
| `--rule` | The border width. |
| `--nav-h` | The block size of the chrome a full-viewport hero has to fit beside. In `tiling` from 1024px it is the 56px bar plus the 44px fixed status line. |

`main` stays full width with no padding; heroes pad `.hero` with `var(--edge)`.

## Notes on the four LayoutB systems

- **Text over motion fields.** `corners` is the only one of the four that leaves a page-level field visible behind running text, so it sets text only in `--ink` and `--ink-2`, the two inks every palette keeps at 4.5:1 or more over `--field-1..3`. In `tiling` the panes and bars are opaque and the field shows only in the gaps. `book` chapters and `ledger` sheets are opaque paper.
- **Contents.** `book` and `ledger` opt into the renderer's `nav.toc` (hidden by default in `base.css`). Both number every section, the closing one included, so a chapter or sheet number always matches its contents entry.
- **Generated text.** Coordinates, chapter numerals, workspace numbers and figure numbers come from CSS counters. Field names in `ledger` ("Harness", "Command", "Note", "Source", "Lines"), the book's "Contents" label, the `[ ]` around the book's Copy control and the tiling key hints use `content: "…" / ""`, so assistive technology does not read them twice. Each label sits next to a control or region that already names itself. Pseudo-element boxes use `box-sizing: border-box`, because the base `*` rule does not reach `::before` and `::after`.
- **Key hints.** The tiling status line only names keys that work in the renderer: Tab moves focus, Enter activates the focused link or button, and ← → switches harness tabs. It shows only for a fine pointer at 1024px and wider. Workspace numbers in the bar are filled index chips, not outlined key caps, because no number keys are bound.
- **Mono.** All four LayoutB systems set step numbers, counts, bar values, coordinates and hosts in `--font-mono` with tabular figures. The probe reports mono outside code as a WARN; these are figures and paths, which the canon allows. Of LayoutA's four, only `console` does the same; `bento`, `editorial` and `steps` use `--font-ui` with tabular figures and set large figures in `--font-display`.
- **Closing actions.** Each layout sets `justify-content` on `.s-cta .actions` itself, so a hero that aligns its own `.actions` cannot move the closing buttons.
- **Code.** Install commands never wrap (`white-space: pre`); only their block scrolls sideways, so a copyable command never appears split across lines. The always-on core figure wraps at spaces, because it is nine sentences of prose read on a phone.
- **Pause control.** At phone widths the layouts leave the renderer's placement of `.motion-toggle` alone and restyle only its surface; `tiling` docks it in the status line from 1024px and `corners` sets its corner from 701px.

## Checks

```sh
node options/layout/check.mjs            # every layout option; no browser
node options/color/check.mjs --pairs     # text and background token pairs against all palettes
npx tsc --noEmit
```

`check.mjs` imports each option, parses its CSS with postcss and fails on a rule outside the option's scope, literal colours or font families, transitions, animations, keyframes, `:active` transforms, text under 12px, missing or non-https references, a mismatched id, or a dash in the picker copy. It also notes uppercase, literal letter-spacing and custom properties that are neither contract tokens nor defined by the option. Rendered checks (390 and 1440, light and dark, reduced motion, the design-canon probe) run through LabCore's headless pass.
