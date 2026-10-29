import type { ColorOption } from '../../../src/contract';

// Strategy: No hue. Value does all the work; ink is the only fill; the one hue is the keyboard focus ring.
// contrast:begin (written by options/color/check.mjs --write; WCAG 2 ratios, 8-bit sRGB)
// light on bg, bg-2, bg-3: ink 17.03 17.78 15.73; ink-2 8.03 8.38 7.42; ink-3 5.45 5.69 5.04; accent-2 17.03 17.78 15.73
//       accent-ink on accent 17.78; accent on bg, bg-2, bg-3 17.03 17.78 15.73; line-2 on bg, bg-2 3.46 3.61; line 1.22 1.27 1.13; ink on selection 12.34
//       fields vs bg 1.11 1.30 1.69; ink on fields 15.31 13.07 10.06; ink-2 on fields 7.22 6.16 4.75; focus on bg, bg-2, bg-3, fields 5.20 5.43 4.80 4.67 3.99 3.07
// dark  on bg, bg-2, bg-3: ink 16.81 15.60 17.31; ink-2 9.49 8.81 9.77; ink-3 5.93 5.50 6.10; accent-2 16.81 15.60 17.31
//       accent-ink on accent 16.81; accent on bg, bg-2, bg-3 16.81 15.60 17.31; line-2 on bg, bg-2 3.28 3.04; line 1.30 1.21 1.34; ink on selection 10.02
//       fields vs bg 1.09 1.24 1.56; ink on fields 15.46 13.59 10.79; ink-2 on fields 8.73 7.67 6.09; focus on bg, bg-2, bg-3, fields 7.97 7.40 8.21 7.33 6.44 5.12
// contrast:end
export default {
  id: 'mono',
  layer: 'color',
  label: 'Monochrome',
  summary: 'Greyscale from #f9f9f9 to #171717 with ink as the only fill and one blue kept for keyboard focus, so the studio is carried by its work and words rather than a colour.',
  origin: 'new',
  refs: [
    { name: 'Vercel', url: 'https://vercel.com', what: 'Geist neutrals at zero chroma (#fafafa ground, #171717 ink, #666 secondary; #ededed and #8f8f8f at night) and its one functional hue, the blue focus ring, taken one step deeper by day so it holds 3:1 over the field.' },
    { name: 'Grok', url: 'https://x.ai/grok', what: 'A brand with no accent at all: #0a0a0a ground, white type, a white primary button with dark text, and secondary text as white at 70%.' },
  ],
  light: {
    '--bg': 'oklch(0.982 0 0)',
    '--bg-2': 'oklch(0.996 0 0)',
    '--bg-3': 'oklch(0.956 0 0)',
    '--ink': 'oklch(0.205 0 0)',
    '--ink-2': 'oklch(0.42 0 0)',
    '--ink-3': 'oklch(0.51 0 0)',
    '--line': 'oklch(0.915 0 0)',
    '--line-2': 'oklch(0.62 0 0)',
    '--accent': 'oklch(0.205 0 0)',
    '--accent-ink': 'oklch(0.996 0 0)',
    '--accent-2': 'oklch(0.205 0 0)',
    '--focus': 'oklch(0.53 0.201 259)',
    '--selection': 'oklch(0.875 0 0)',
    '--field-1': 'oklch(0.945 0 0)',
    '--field-2': 'oklch(0.895 0 0)',
    '--field-3': 'oklch(0.815 0 0)',
  },
  dark: {
    '--bg': 'oklch(0.15 0 0)',
    '--bg-2': 'oklch(0.195 0 0)',
    '--bg-3': 'oklch(0.125 0 0)',
    '--ink': 'oklch(0.945 0 0)',
    '--ink-2': 'oklch(0.77 0 0)',
    '--ink-3': 'oklch(0.645 0 0)',
    '--line': 'oklch(0.27 0 0)',
    '--line-2': 'oklch(0.5 0 0)',
    '--accent': 'oklch(0.945 0 0)',
    '--accent-ink': 'oklch(0.15 0 0)',
    '--accent-2': 'oklch(0.945 0 0)',
    '--focus': 'oklch(0.72 0.15 251)',
    '--selection': 'oklch(0.34 0 0)',
    '--field-1': 'oklch(0.2 0 0)',
    '--field-2': 'oklch(0.25 0 0)',
    '--field-3': 'oklch(0.32 0 0)',
  },
} satisfies ColorOption;
