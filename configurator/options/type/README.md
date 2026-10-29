# Type options

Nine type systems for the configurator's `type` layer, plus LabCore's plain `baseline-type` control. Each option sets the four roles (display, body, UI, mono), the scale and the display setting as tokens, and self-hosts Latin-subset woff2 files with their OFL texts beside them in `fonts/`.

| id | Display | Body and UI | Mono | Origin | Fonts |
| --- | --- | --- | --- | --- | --- |
| `precise-grotesk` | Wix Madefor Display 530, -0.03em | Wix Madefor Text | JetBrains Mono | new (Linear) | 66.9 KB |
| `geist-pixel` | Geist Pixel Square, sizes snapped to its grid | Geist | Geist Mono | new (Vercel, Omarchy, pi) | 54.1 KB |
| `light-ledger` | Mona Sans 300, renamed Misty Ledger Sans | same face at 350 | Source Code Pro, renamed Misty Ledger Code | new (Stripe) | 70.3 KB |
| `book-italic` | Brygada 1918 italic 430 | Brygada 1918 roman | Commit Mono | new (pi, Earendil) | 89.8 KB |
| `mono-console` | Martian Mono, width 87.5, 580 | Host Grotesk body; Martian Mono UI | Martian Mono | new (Greptile, Macroscope) | 53.2 KB |
| `industrial-condensed` | Sofia Sans Extra Condensed 720, capitals | Sofia Sans | Kode Mono | new (Brass Hands, Grok) | 87.2 KB |
| `a-tiling` | Schibsted Grotesk 640, -0.035em | Schibsted Grotesk | Chivo Mono | A | 69.0 KB |
| `b-atelier` | Literata 400 on its opsz axis | Literata | Departure Mono (code and figures) | B | 106.6 KB |
| `c-steps` | Archivo width 112, 740; Bitcount pixel digits | Archivo | Fragment Mono | C | 75.5 KB |

Each `index.ts` names what the option learns from each reference, and its `license` field lists every face.

## Token notes for other layers

- `--font-display` can be a pixel face, a mono or condensed capitals. Use it for h1, h2, h3, the brand name and large figures, never for small labels or UI text. `--display-transform` (capitals in `industrial-condensed`) is for h1, and h2 if a layout wants it.
- `--display-advance` is an optional extension token (LabCore's README documents it; the base default is .5). It holds the average advance per character of the display setting, in em, measured from the font with its weight, tracking and transform. Heroes size the h1 as `min(var(--step-5), 100cqi / (chars × var(--display-advance) × .6))` to keep it on two lines. Options declare it through `TypeOption & { tokens: TypeOption['tokens'] & { '--display-advance'?: string } }`, so `src/contract.ts` stays canonical.
- `geist-pixel` snaps its display steps with CSS `round(nearest, clamp(...), 13.1579px)`. Geist Pixel Square is drawn on a 38/1000 em grid, so every multiple of 13.158px puts each pixel on whole device pixels at DPR 2.
- `book-italic` registers the Brygada italic file as its own family in normal style, so `--font-display` alone sets headlines in italic.
- `c-steps` puts a digits-and-slash Bitcount face in the display stack through `unicode-range`. Large figures set in `--font-display` (LayoutA's step numbers and counts) turn pixel; letters stay Archivo.
- `b-atelier` keeps Departure Mono out of the UI role. Round B set it at 22px for nav and controls only, but here `--font-ui` also sets small labels and full-width buttons, where the pixel mono ran wide and off its 11px grid. Its small step is 16.5px (1.5 grid pixels), so code is crisp at DPR 2.
- Every TrueType font carries the 7-byte `prep` and `gasp` that gftools writes for unhinted fonts. Without them FreeType autohints the font, and under full hinting (headless Chrome on Linux) 't' and 'g' render a pixel wide at 16px, which reads as gaps inside words.

## Licences

Every face is SIL OFL 1.1, and each OFL text sits in its option's `fonts/` folder. Mona Sans reserves the name "Mona" and Source Code Pro reserves "Source". Because instancing and subsetting make a modified version, those two files are renamed inside the font and in CSS (Misty Ledger Sans, Misty Ledger Code). The GitHub repositories for Commit Mono and Departure Mono report MIT for their site code; the font releases used here ship OFL texts, which are the ones copied.

## Rebuild

`index.ts` files and fonts are generated. Edit `_build/options.json` (copy, references, tokens, sizes in px at 390 and 1440) or `_build/plan.json` (sources, axis ranges), then:

```sh
cd configurator/options/type/_build
./fetch.sh                                   # pinned google/fonts, vercel/geist-font and release zips into .src
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/python build_fonts.py              # instance + Latin subset + woff2 into .out
.venv/bin/python gen_options.py              # rewrite ../<id>/index.ts, fonts/, OFL texts
.venv/bin/python check.py                    # browser-free checks; exits non-zero on failure
```

`check.py` checks families, weights, files, glyph coverage, licences and the canon's size floors. It also simulates h1 word wrap from the font's own advances across five headlines at 350, 820 and 1100px columns. Builds keep each source's timestamps, so the pinned sources rebuild to byte-identical woff2 files.

## Known limits

- The contract has one `--body-weight` for both themes, so the lighter dark-theme body weights that rounds A, B and C used are not carried over.
- The renderer emits woff2-only `@font-face` rules, so no option ships a metric-matched local fallback.
- `mono-console` and `c-steps` have the widest display faces. On a 390px phone, headlines over about 46 (mono) and 52 (Archivo 112) characters need a third line even at the heroes' 24px floor.
