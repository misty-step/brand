# Hero options

Each hero renders the inner HTML of `section.hero` and styles it under `html[data-hero="<id>"]`. They consume tokens only; the type, colour, layout, mark and motion layers stay swappable.

| id | Structure | Motion host | Origin |
| --- | --- | --- | --- |
| `stage` | Centred statement and actions over a wide stage: the mark in the field (studio), the real `rules/core.md` (stack) | panel | new |
| `spread` | Statement on the left page, a full-height field plate bleeding off the right edge | panel | B |
| `horizon` | Full-bleed field, headline low on the left, sentence and actions on its baseline, proof in the corner | full | new |
| `source` | Statement beside a real artefact in mono: verbatim core lines (studio), exact install lines per harness with Copy (stack) | panel | new |
| `treads` | The three priced steps (studio) or the method path (stack) rise as treads standing in the field | panel | C |
| `wordmark` | The brand wordmark across the full width, a rule, then the statement in two columns | full | new |
| `plate` | One ruled nameplate: inverted name band, statement, field window and a spec row of real terms or counts | panel | new |
| `tiles` | Unequal panes split by hairline gaps: statement, the name resting in a field pane, the offer or method strip | panel | A |

Every value shown beyond the copy layer's `hero` content (prices, counts, commands, core lines, harness names, links) is read from `src/content/facts.ts` at render time.

## Hooks other layers can rely on

- **Entrance:** the focal pieces carry `data-enter` and an inline `--enter-i` order: 0 h1, 1 sub, 2 actions, 3 proof, 4 the artefact or visual, 5 a spec row. Hero CSS never transforms `[data-enter]` elements; transforms belong to the motion layer.
- **Layout tokens:** heroes read `--edge` (inline padding), `--gutter` (phone bleed), `--nav-h` (full-screen heroes), `--radius` and `--rule`, each with a fallback for layouts that do not set them.
- **Headline fit:** the h1 carries its length as `--hl`. Its size is `min(var(--step-5), 100cqi / (--hl x --display-advance x 0.6))` with a 24px floor, so headlines up to about 42 characters stay on two lines in whatever column the hero gives them (its parent is an inline-size container). `--display-advance` is the type option's measured average advance per character.
- **Field fallback:** where a panel would be empty without a background (`spread`, `plate`), the mark sits in it and hides once the motion layer mounts anything into the slot (`:has(.hero-visual > *)`).
- **No script:** `source` switches harnesses with native radio buttons and `:has()`; its Copy buttons use the renderer's `.copy` handler. Heroes never use `role="tab"`, which the renderer reserves for the install section.

## Checks

`tsc --noEmit`, plus a server-side render of every hero for both pages against every copy and mark option: one `h1.hero-title`, `p.hero-sub`, `.actions > a.btn.btn-primary`, a motion slot only on panel heroes, CSS that parses and is scoped under its `data-hero` id, no literal colours or font families, no dashes in rendered text.
