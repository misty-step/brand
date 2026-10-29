import type { ColorOption } from '../../../src/contract';

// Strategy: Full palette, terminal style. Cyan fills the action, blue is the second ink, cyan and blue tint the field; no terracotta anywhere near the paper.
// contrast:begin (written by options/color/check.mjs --write; WCAG 2 ratios, 8-bit sRGB)
// light on bg, bg-2, bg-3: ink 16.74 18.62 15.00; ink-2 9.31 10.36 8.35; ink-3 6.42 7.14 5.75; accent-2 5.72 6.36 5.12
//       accent-ink on accent 6.03; accent on bg, bg-2, bg-3 5.43 6.03 4.86; focus 3.99 4.43 3.57; line-2 on bg, bg-2 3.22 3.59; line 1.25 1.39 1.12; ink on selection 14.36
//       fields vs bg 1.12 1.32 1.72; ink on fields 15.00 12.65 9.75; ink-2 on field-1, field-2 8.35 7.04
// dark  on bg, bg-2, bg-3: ink 15.00 13.48 15.68; ink-2 9.31 8.37 9.73; ink-3 5.19 4.67 5.43; accent-2 6.77 6.08 7.07
//       accent-ink on accent 6.70; accent on bg, bg-2, bg-3 6.70 6.02 7.01; focus 6.70 6.02 7.01; line-2 on bg, bg-2 3.75 3.37; line 1.28 1.15 1.34; ink on selection 9.12
//       fields vs bg 1.28 1.65 2.32; ink on fields 11.69 9.12 6.48; ink-2 on field-1, field-2 7.26 5.66
// flag: light: probe reads --bg as a warm cream ground
// contrast:end
export default {
  id: 'flexoki',
  layer: 'color',
  label: 'Flexoki',
  summary: 'The Flexoki light and dark pair from the studio’s own terminal, worn as the brand: paper and inky black, cyan for the action, blue as the second ink, and the same tokens re-skinning the field.',
  origin: 'new',
  refs: [
    { name: 'Flexoki', url: 'https://stephango.com/flexoki', what: 'Exact Flexoki tones (MIT): base-50 #F2F0E5 ground, paper #FFFCF0 panels, black #100F0F ink, cyan-700 and cyan-400 fills, blue-600 and blue-300 as the second ink, cyan-150 and blue-200 in the field. Secondary text sits one step darker (base-800, base-700) and night blue one step lighter (blue-300) to hold AA on every surface.' },
    { name: 'Omarchy', url: 'https://omarchy.org', what: 'A terminal theme as the whole brand: one token contract (ground, surface, text, brand, field dim, mid and lit) re-skins page and canvas alike; its flexoki-light site theme uses the same blue-600 (#205ea6) as its brand.' },
  ],
  light: {
    '--bg': 'oklch(0.954 0.015 98.3)',
    '--bg-2': 'oklch(0.99 0.016 95.2)',
    '--bg-3': 'oklch(0.917 0.015 98.3)',
    '--ink': 'oklch(0.17 0.002 17.3)',
    '--ink-2': 'oklch(0.365 0.004 67.7)',
    '--ink-3': 'oklch(0.453 0.005 91.5)',
    '--line': 'oklch(0.881 0.014 97.5)',
    '--line-2': 'oklch(0.617 0.008 88.7)',
    '--accent': 'oklch(0.483 0.075 187.6)',
    '--accent-ink': 'oklch(0.99 0.016 95.2)',
    '--accent-2': 'oklch(0.482 0.131 254.8)',
    '--focus': 'oklch(0.554 0.086 186.7)',
    '--selection': 'oklch(0.898 0.047 171)',
    '--field-1': 'oklch(0.917 0.015 98.3)',
    '--field-2': 'oklch(0.855 0.065 176.4)',
    '--field-3': 'oklch(0.782 0.062 235.9)',
  },
  dark: {
    '--bg': 'oklch(0.17 0.002 17.3)',
    '--bg-2': 'oklch(0.223 0.002 67.7)',
    '--bg-3': 'oklch(0.135 0.002 17.3)',
    '--ink': 'oklch(0.917 0.015 98.3)',
    '--ink-2': 'oklch(0.772 0.013 96.5)',
    '--ink-3': 'oklch(0.617 0.008 88.7)',
    '--line': 'oklch(0.273 0.002 67.7)',
    '--line-2': 'oklch(0.538 0.008 97.4)',
    '--accent': 'oklch(0.67 0.1 186.6)',
    '--accent-ink': 'oklch(0.17 0.002 17.3)',
    '--accent-2': 'oklch(0.681 0.085 239.8)',
    '--focus': 'oklch(0.67 0.1 186.6)',
    '--selection': 'oklch(0.337 0.047 188.8)',
    '--field-1': 'oklch(0.273 0.002 67.7)',
    '--field-2': 'oklch(0.337 0.047 188.8)',
    '--field-3': 'oklch(0.427 0.115 254.6)',
  },
} satisfies ColorOption;
