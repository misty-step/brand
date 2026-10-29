# Hero options

Each hero renders the inner HTML of `section.hero` and styles it under `html[data-hero="<id>"]`. They consume tokens only; the type, colour, layout, mark and motion layers stay swappable.

| id | Structure | Motion host | Origin |
| --- | --- | --- | --- |
| `stage` | Centred statement and actions over a wide stage: the mark in the field (studio), the real `rules/core.md` (stack) | panel | new |
| `spread` | Statement on the left page, a full-height field plate bleeding off the right edge | panel | B |
| `horizon` | Full-bleed field like a landscape: statement high with sentence and actions on one line, the field as the ground below, proof in the lower corner. On phones the field host is resized to a band above the statement, so ground-anchored fields stand on the band's floor | full | new |
| `source` | Statement beside a real artefact in mono: verbatim core lines (studio), exact install lines per harness with Copy (stack) | panel | new |
| `treads` | The three priced steps (studio) or the method path (stack) rise as treads standing in the field | panel | C |
| `wordmark` | The brand wordmark across the full width, a rule, then the statement in two columns | full | new |
| `plate` | One ruled nameplate: inverted name band, statement, field window and a spec row of real terms or counts | panel | new |
| `tiles` | Unequal panes split by hairline gaps: statement, the name resting in a field pane, the offer or method strip | panel | A |

Every value shown beyond the copy layer's `hero` content (prices, counts, commands, core lines, harness names, links) is read from `src/content/facts.ts` at render time.

## Hooks other layers can rely on

- **Scope:** every rule sits under `html[data-hero="<id>"] .hero`, so generic classes the hero reuses (`.actions`, `.code`, `.copy`) never restyle the page's sections.
- **Entrance:** the focal pieces carry `data-enter` and an inline `--enter-i` order: 0 h1, 1 sub, 2 actions, 3 proof, 4 the artefact or visual, 5 a spec row. In `wordmark` the big name also carries index 0, so it enters with the h1 and fields that measure open space treat it as content to keep clear. Hero CSS never transforms `[data-enter]` elements; transforms belong to the motion layer.
- **Layout tokens:** heroes read `--edge` (inline padding), `--gutter` (phone bleed), `--nav-h` (full-screen heroes), `--radius` and `--rule`, each with a fallback for layouts that do not set them.
- **Headline fit:** at render the hero finds the headline's best two-line word break and puts the longer line's length on the h1 as `--h2`, in average characters: the larger of its character count (exact for monospaced faces) and its width under a generic proportional model (Helvetica advances, so a line full of m and w counts long). CSS sizes the h1 to `min(var(--step-5), 100cqi / (--h2 x --display-advance x 1.1))` with a 22px floor; its parent is an inline-size container. `--display-advance` is the type option's measured mean advance per character. If the best split fits, a greedy wrap fits in two lines too. Treads sizes its prices the same way, and the big set name in `wordmark` and `tiles` uses the single-line length.
- **Field fallback:** where a panel would be empty without a background (`spread`, `plate`), the mark stands in it at native sizes and hides once the motion layer mounts anything into the slot (`:has(.hero-visual > *)`). Pixel marks are requested at each breakpoint's size rather than scaled, so cells stay whole pixels.
- **No script:** `source` switches harnesses with native radio buttons and `:has()`; its Copy buttons use the renderer's `.copy` handler. Heroes never use `role="tab"`, which the renderer reserves for the install section.

## Checks

Browser-free checks, run on 2026-10-29 with scripts kept outside this repository:

- `tsc --noEmit`.
- A server-side render of every hero for both pages against every copy and mark option: one `h1.hero-title`, `p.hero-sub`, `.actions > a.btn.btn-primary`, a motion slot only on panel heroes, every selector inside `section.hero`, CSS that parses, no literal colours or font families, no repeated attribute on a tag, every `data-enter` ordered, no dashes in rendered text.
- A wrap simulation with each type option's real display face (fontTools advances and tracking): every headline from every copy option in every hero's column at 320, 390 and 1440. On 2026-10-29: two lines in every case at 390 and 1440 across 9 type options, 16 headlines and 8 heroes; the remaining 42 of 3,645 cases are at 320 with the two widest display faces (Martian Mono, Archivo Steps) held at the 22px floor, where three lines are allowed and nothing overflows.
- Colorist's `check.mjs --pairs` lint: no unguaranteed text/background token pair.
