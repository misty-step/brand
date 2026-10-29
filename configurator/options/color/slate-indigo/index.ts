import type { ColorOption } from '../../../src/contract';

// Strategy: Restrained. Indigo fills the primary action and marks links and focus; slate does everything else.
// contrast:begin (written by options/color/check.mjs --write; WCAG 2 ratios, 8-bit sRGB)
// light on bg, bg-2, bg-3: ink 13.82 14.41 12.90; ink-2 8.75 9.13 8.17; ink-3 5.01 5.23 4.68; accent-2 5.99 6.25 5.59
//       accent-ink on accent 5.00; accent on bg, bg-2, bg-3 4.79 5.00 4.47; focus 4.79 5.00 4.47; line-2 on bg, bg-2 3.22 3.36; line 1.23 1.28 1.15; ink on selection 10.74
//       fields vs bg 1.12 1.30 1.66; ink on fields 12.35 10.62 8.30; ink-2 on field-1, field-2 7.82 6.72
// dark  on bg, bg-2, bg-3: ink 17.84 16.59 18.26; ink-2 13.32 12.39 13.64; ink-3 6.34 5.90 6.49; accent-2 7.79 7.24 7.98
//       accent-ink on accent 4.82; accent on bg, bg-2, bg-3 3.93 3.66 4.02; focus 7.79 7.24 7.98; line-2 on bg, bg-2 3.29 3.06; line 1.27 1.18 1.30; ink on selection 11.16
//       fields vs bg 1.10 1.25 1.61; ink on fields 16.29 14.26 11.08; ink-2 on field-1, field-2 12.16 10.65
// contrast:end
export default {
  id: 'slate-indigo',
  layer: 'color',
  label: 'Slate and indigo',
  summary: 'Near-black slate stepped by lightness, never by shadow, with indigo kept to the primary action, links and focus: the quiet register of a tool engineers live in all day.',
  origin: 'new',
  refs: [
    { name: 'Linear', url: 'https://linear.app', what: 'Its stylesheet tokens: ground #08090a with about +3% lightness per raised level, ink #f7f8f8, secondary #d0d6e0 and #8a8f98 at hue 262, brand indigo #5e6ad2 and link #828fff; the light theme follows the light tokens in the same file (#282a30 ink, #f4f2f4 wells). The marketing site’s button is white; indigo as the fill comes from the app.' },
  ],
  light: {
    '--bg': 'oklch(0.982 0.002 286)',
    '--bg-2': 'oklch(0.996 0.001 286)',
    '--bg-3': 'oklch(0.958 0.004 286)',
    '--ink': 'oklch(0.28 0.012 272)',
    '--ink-2': 'oklch(0.4 0.015 262)',
    '--ink-3': 'oklch(0.53 0.014 285)',
    '--line': 'oklch(0.915 0.004 286)',
    '--line-2': 'oklch(0.64 0.012 280)',
    '--accent': 'oklch(0.55 0.16 275)',
    '--accent-ink': 'oklch(0.996 0.001 286)',
    '--accent-2': 'oklch(0.5 0.16 275)',
    '--focus': 'oklch(0.55 0.16 275)',
    '--selection': 'oklch(0.9 0.045 277)',
    '--field-1': 'oklch(0.945 0.006 280)',
    '--field-2': 'oklch(0.895 0.012 278)',
    '--field-3': 'oklch(0.82 0.022 276)',
  },
  dark: {
    '--bg': 'oklch(0.145 0.004 265)',
    '--bg-2': 'oklch(0.19 0.006 270)',
    '--bg-3': 'oklch(0.12 0.003 265)',
    '--ink': 'oklch(0.965 0.002 250)',
    '--ink-2': 'oklch(0.87 0.015 262)',
    '--ink-3': 'oklch(0.66 0.015 262)',
    '--line': 'oklch(0.26 0.008 270)',
    '--line-2': 'oklch(0.5 0.012 270)',
    '--accent': 'oklch(0.55 0.16 275)',
    '--accent-ink': 'oklch(0.985 0.002 270)',
    '--accent-2': 'oklch(0.72 0.13 277)',
    '--focus': 'oklch(0.72 0.13 277)',
    '--selection': 'oklch(0.33 0.07 277)',
    '--field-1': 'oklch(0.2 0.012 272)',
    '--field-2': 'oklch(0.255 0.018 274)',
    '--field-3': 'oklch(0.33 0.03 276)',
  },
} satisfies ColorOption;
