import type { ColorOption } from '../../../src/contract';

// Strategy: Two inks. Slate fills the buttons; rubric red is the only second ink, for numerals, figures and links.
// contrast:begin (written by options/color/check.mjs --write; WCAG 2 ratios, 8-bit sRGB)
// light on bg, bg-2, bg-3: ink 14.59 15.40 13.56; ink-2 6.97 7.35 6.47; ink-3 5.27 5.57 4.90; accent-2 5.45 5.75 5.07
//       accent-ink on accent 15.40; accent on bg, bg-2, bg-3 14.59 15.40 13.56; focus 14.59 15.40 13.56; line-2 on bg, bg-2 3.35 3.53; line 1.36 1.43 1.26; ink on selection 10.14
//       fields vs bg 1.17 1.39 1.81; ink on fields 12.50 10.51 8.07; ink-2 on field-1, field-2 5.97 5.02
// dark  on bg, bg-2, bg-3: ink 15.87 15.01 16.37; ink-2 8.77 8.29 9.04; ink-3 5.81 5.50 5.99; accent-2 6.88 6.51 7.10
//       accent-ink on accent 15.87; accent on bg, bg-2, bg-3 15.87 15.01 16.37; focus 15.87 15.01 16.37; line-2 on bg, bg-2 3.21 3.03; line 1.44 1.36 1.49; ink on selection 8.59
//       fields vs bg 1.10 1.28 1.64; ink on fields 14.46 12.45 9.67; ink-2 on field-1, field-2 7.98 6.87
// contrast:end
export default {
  id: 'paper-rubric',
  layer: 'color',
  label: 'Paper and rubric',
  summary: 'Direction B’s book: cool paper and slate ink with rubric red as the only second ink, buttons filled with ink, and red kept to numerals and figure labels.',
  origin: 'B',
  refs: [
    { name: 'Rubrication', url: 'https://en.wikipedia.org/wiki/Rubrication', what: 'Red ink reserved for numerals, initials and headings in manuscripts: a second ink with one job.' },
    { name: 'pi.dev', url: 'https://pi.dev', what: 'A developer tool set as a book: slate ink on stone paper (#252f3d on #ebe7e4) with almost no colour.' },
    { name: 'Earendil', url: 'https://earendil.com', what: 'Monochrome paper and ink with no accent at all, so a single red reads loudly.' },
  ],
  light: {
    '--bg': 'oklch(0.972 0.004 240)',
    '--bg-2': 'oklch(0.99 0.003 240)',
    '--bg-3': 'oklch(0.946 0.005 240)',
    '--ink': 'oklch(0.255 0.016 252)',
    '--ink-2': 'oklch(0.445 0.014 250)',
    '--ink-3': 'oklch(0.51 0.012 248)',
    '--line': 'oklch(0.872 0.006 245)',
    '--line-2': 'oklch(0.62 0.01 245)',
    '--accent': 'oklch(0.255 0.016 252)',
    '--accent-ink': 'oklch(0.99 0.003 240)',
    '--accent-2': 'oklch(0.525 0.185 27)',
    '--focus': 'oklch(0.255 0.016 252)',
    '--selection': 'oklch(0.86 0.045 27)',
    '--field-1': 'oklch(0.92 0.006 242)',
    '--field-2': 'oklch(0.865 0.009 245)',
    '--field-3': 'oklch(0.785 0.012 248)',
  },
  dark: {
    '--bg': 'oklch(0.168 0.01 252)',
    '--bg-2': 'oklch(0.198 0.011 252)',
    '--bg-3': 'oklch(0.145 0.009 252)',
    '--ink': 'oklch(0.935 0.006 240)',
    '--ink-2': 'oklch(0.755 0.01 242)',
    '--ink-3': 'oklch(0.645 0.01 245)',
    '--line': 'oklch(0.305 0.012 250)',
    '--line-2': 'oklch(0.5 0.012 248)',
    '--accent': 'oklch(0.935 0.006 240)',
    '--accent-ink': 'oklch(0.168 0.01 252)',
    '--accent-2': 'oklch(0.705 0.15 27)',
    '--focus': 'oklch(0.935 0.006 240)',
    '--selection': 'oklch(0.38 0.08 27)',
    '--field-1': 'oklch(0.215 0.011 250)',
    '--field-2': 'oklch(0.27 0.012 250)',
    '--field-3': 'oklch(0.34 0.012 248)',
  },
} satisfies ColorOption;
