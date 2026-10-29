import type { ColorOption } from '../../../src/contract';

// Strategy: No hue. Value does all the work; ink is the only fill; the one hue is the keyboard focus ring.
// contrast:begin (written by options/color/check.mjs --write; WCAG 2 ratios, 8-bit sRGB)
// light on bg, bg-2, bg-3: ink 17.18 17.78 15.73; ink-2 8.10 8.38 7.42; ink-3 5.50 5.69 5.04; accent-2 17.18 17.78 15.73
//       accent-ink on accent 17.78; accent on bg, bg-2, bg-3 17.18 17.78 15.73; line-2 on bg, bg-2 3.49 3.61; line 1.23 1.27 1.13; ink on selection 12.34
//       fields vs bg 1.12 1.31 1.62; ink on fields 15.31 13.07 10.61; ink-2 on fields 7.22 6.16 5.00; focus on bg, bg-2, bg-3, fields 5.09 5.27 4.66 4.54 3.87 3.14
// dark  on bg, bg-2, bg-3: ink 16.91 15.60 17.31; ink-2 7.66 7.07 7.84; ink-3 6.12 5.65 6.27; accent-2 16.91 15.60 17.31
//       accent-ink on accent 16.91; accent on bg, bg-2, bg-3 16.91 15.60 17.31; line-2 on bg, bg-2 3.30 3.04; line 1.31 1.21 1.34; ink on selection 10.02
//       fields vs bg 1.09 1.24 1.57; ink on fields 15.46 13.59 10.79; ink-2 on fields 7.00 6.16 4.89; focus on bg, bg-2, bg-3, fields 7.92 7.31 8.11 7.24 6.37 5.06
// contrast:end
export default {
  id: 'mono',
  layer: 'color',
  label: 'Monochrome',
  summary: 'Greyscale from #fafafa to #171717 with ink as the only fill and one blue kept for keyboard focus, so the studio is carried by its work and words rather than a colour.',
  origin: 'new',
  refs: [
    { name: 'Vercel', url: 'https://vercel.com', what: 'Geist’s own greys at zero chroma: #fafafa ground, #171717 ink, #4d4d4d and #666 secondaries; #0a0a0a, #ededed, #a1a1a1 and #8f8f8f at night; and its one functional hue, the focus-ring blue (blue-700 #0070f7 or the deeper blue-900 #0068d6 by day, #52a8ff at night). The deeper blue is used here so the ring holds 3:1 over the field.' },
    { name: 'Grok', url: 'https://x.ai/grok', what: 'A brand with no accent at all: #0a0a0a ground, white type, a white primary button with dark text, and secondary text as white at 70%.' },
  ],
  light: {
    '--bg': 'oklch(0.985 0 0)',
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
    '--focus': 'oklch(0.534 0.187 256.7)',
    '--selection': 'oklch(0.875 0 0)',
    '--field-1': 'oklch(0.945 0 0)',
    '--field-2': 'oklch(0.895 0 0)',
    '--field-3': 'oklch(0.83 0 0)',
  },
  dark: {
    '--bg': 'oklch(0.145 0 0)',
    '--bg-2': 'oklch(0.195 0 0)',
    '--bg-3': 'oklch(0.125 0 0)',
    '--ink': 'oklch(0.945 0 0)',
    '--ink-2': 'oklch(0.709 0 0)',
    '--ink-3': 'oklch(0.65 0 0)',
    '--line': 'oklch(0.27 0 0)',
    '--line-2': 'oklch(0.5 0 0)',
    '--accent': 'oklch(0.945 0 0)',
    '--accent-ink': 'oklch(0.145 0 0)',
    '--accent-2': 'oklch(0.945 0 0)',
    '--focus': 'oklch(0.717 0.152 251)',
    '--selection': 'oklch(0.34 0 0)',
    '--field-1': 'oklch(0.2 0 0)',
    '--field-2': 'oklch(0.25 0 0)',
    '--field-3': 'oklch(0.32 0 0)',
  },
} satisfies ColorOption;
