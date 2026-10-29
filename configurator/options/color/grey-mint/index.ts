import type { ColorOption } from '../../../src/contract';

// Strategy: Restrained. Mint fills the action with ink text; deep emerald carries links and focus by day; the ink itself becomes the night ground.
// contrast:begin (written by options/color/check.mjs --write; WCAG 2 ratios, 8-bit sRGB)
// light on bg, bg-2, bg-3: ink 8.93 9.68 8.29; ink-2 6.70 7.27 6.22; ink-3 5.51 5.98 5.12; accent-2 5.19 5.63 4.82
//       accent-ink on accent 6.84; accent on bg, bg-2, bg-3 1.31 1.42 1.21; line-2 on bg, bg-2 3.28 3.56; line 1.24 1.35 1.15; ink on selection 8.26
//       fields vs bg 1.11 1.28 1.45; ink on fields 8.03 6.95 6.17; ink-2 on fields 6.03 5.22 4.63; focus on bg, bg-2, bg-3, fields 5.19 5.63 4.82 4.67 4.04 3.59
// dark  on bg, bg-2, bg-3: ink 9.91 8.47 11.42; ink-2 7.41 6.33 8.54; ink-3 5.55 4.74 6.40; accent-2 9.63 8.23 11.10
//       accent-ink on accent 6.84; accent on bg, bg-2, bg-3 6.84 5.85 7.88; line-2 on bg, bg-2 3.75 3.20; line 1.51 1.29 1.74; ink on selection 5.28
//       fields vs bg 1.14 1.30 1.46; ink on fields 8.70 7.64 6.78; ink-2 on fields 6.51 5.71 5.07; focus on bg, bg-2, bg-3, fields 8.43 7.21 9.72 7.40 6.50 5.77
// contrast:end
export default {
  id: 'grey-mint',
  layer: 'color',
  label: 'Grey paper and mint',
  summary: 'Grey paper and one violet-grey ink that becomes the night ground, with a mint signal on the action: the flat, engraved register of a code-review tool.',
  origin: 'new',
  refs: [
    { name: 'Greptile', url: 'https://greptile.com', what: 'Grey paper (#e9e9e9) and one violet-grey ink (#3d3b4f) that is also its dark-section ground, a mint signal (#28e99f) on the primary button with ink text, mint headings (#c5ffd6) on dark, emerald hairlines, and no radii or shadows. Its stippled lizard is ink on paper, so the field here is ink tints on grey. The night sits at L 0.36, lighter than the other palettes, because that is Greptile’s own dark.' },
  ],
  light: {
    '--bg': 'oklch(0.934 0 0)',
    '--bg-2': 'oklch(0.962 0 0)',
    '--bg-3': 'oklch(0.91 0 0)',
    '--ink': 'oklch(0.363 0.034 289.1)',
    '--ink-2': 'oklch(0.43 0.025 289)',
    '--ink-3': 'oklch(0.475 0.02 289)',
    '--line': 'oklch(0.865 0.004 289)',
    '--line-2': 'oklch(0.6 0.02 289)',
    '--accent': 'oklch(0.828 0.178 160.6)',
    '--accent-ink': 'oklch(0.363 0.034 289.1)',
    '--accent-2': 'oklch(0.475 0.105 160)',
    '--focus': 'oklch(0.475 0.105 160)',
    '--selection': 'oklch(0.9 0.07 161)',
    '--field-1': 'oklch(0.9 0.006 289)',
    '--field-2': 'oklch(0.855 0.012 289)',
    '--field-3': 'oklch(0.82 0.02 289)',
  },
  dark: {
    '--bg': 'oklch(0.363 0.034 289.1)',
    '--bg-2': 'oklch(0.4 0.036 289)',
    '--bg-3': 'oklch(0.325 0.032 289)',
    '--ink': 'oklch(0.965 0.03 154)',
    '--ink-2': 'oklch(0.87 0.025 160)',
    '--ink-3': 'oklch(0.785 0.02 165)',
    '--line': 'oklch(0.46 0.035 289)',
    '--line-2': 'oklch(0.68 0.03 289)',
    '--accent': 'oklch(0.828 0.178 160.6)',
    '--accent-ink': 'oklch(0.363 0.034 289.1)',
    '--accent-2': 'oklch(0.95 0.08 153.9)',
    '--focus': 'oklch(0.9 0.12 160)',
    '--selection': 'oklch(0.5 0.07 165)',
    '--field-1': 'oklch(0.395 0.04 289)',
    '--field-2': 'oklch(0.425 0.045 289)',
    '--field-3': 'oklch(0.455 0.05 289)',
  },
} satisfies ColorOption;
