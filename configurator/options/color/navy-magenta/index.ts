import type { ColorOption } from '../../../src/contract';

// Strategy: Restrained UI, saturated signature. Navy carries the text and the night; magenta appears only on the primary action, links and focus.
// contrast:begin (written by options/color/check.mjs --write; WCAG 2 ratios, 8-bit sRGB)
// light on bg, bg-2, bg-3: ink 16.45 17.17 15.12; ink-2 8.05 8.40 7.39; ink-3 5.21 5.44 4.79; accent-2 5.87 6.12 5.39
//       accent-ink on accent 5.21; accent on bg, bg-2, bg-3 4.99 5.21 4.59; line-2 on bg, bg-2 3.19 3.33; line 1.18 1.23 1.09; ink on selection 13.47
//       fields vs bg 1.13 1.31 1.65; ink on fields 14.56 12.51 9.98; ink-2 on fields 7.12 6.12 4.88; focus on bg, bg-2, bg-3, fields 5.10 5.33 4.69 4.52 3.88 3.10
// dark  on bg, bg-2, bg-3: ink 16.74 15.43 17.57; ink-2 10.08 9.30 10.58; ink-3 6.52 6.01 6.84; accent-2 8.86 8.17 9.30
//       accent-ink on accent 5.01; accent on bg, bg-2, bg-3 3.65 3.37 3.83; line-2 on bg, bg-2 3.57 3.29; line 1.33 1.23 1.40; ink on selection 10.19
//       fields vs bg 1.10 1.29 1.66; ink on fields 15.27 12.95 10.11; ink-2 on fields 9.20 7.80 6.09; focus on bg, bg-2, bg-3, fields 8.86 8.17 9.30 8.09 6.86 5.35
// contrast:end
export default {
  id: 'navy-magenta',
  layer: 'color',
  label: 'Navy and magenta',
  summary: 'A light-first page inked in deep navy rather than black, with one saturated magenta on the primary action and a navy night instead of grey: confident the way a payments company has to be.',
  origin: 'new',
  refs: [
    { name: 'Stripe', url: 'https://stripe.com', what: 'Navy ink (#061b31) and slate secondaries (#3c4f69, #50617a) instead of black and grey, the blue-grey neutral ramp (#f8fafd, #e5edf5, #d4dee9) for wells and fields, and a navy dark ground. The signature is the magenta of Stripe’s gradient and accent modes (#ee30fb, #ef008f), not its blurple, which the slate and indigo option already covers.' },
  ],
  light: {
    '--bg': 'oklch(0.982 0.004 255)',
    '--bg-2': 'oklch(0.996 0.001 255)',
    '--bg-3': 'oklch(0.952 0.01 250)',
    '--ink': 'oklch(0.22 0.05 252)',
    '--ink-2': 'oklch(0.42 0.045 255)',
    '--ink-3': 'oklch(0.52 0.04 258)',
    '--line': 'oklch(0.925 0.012 250)',
    '--line-2': 'oklch(0.64 0.035 258)',
    '--accent': 'oklch(0.56 0.22 354)',
    '--accent-ink': 'oklch(0.996 0.001 255)',
    '--accent-2': 'oklch(0.52 0.205 354)',
    '--focus': 'oklch(0.555 0.22 354)',
    '--selection': 'oklch(0.92 0.04 350)',
    '--field-1': 'oklch(0.94 0.012 250)',
    '--field-2': 'oklch(0.89 0.02 252)',
    '--field-3': 'oklch(0.82 0.03 255)',
  },
  dark: {
    '--bg': 'oklch(0.18 0.04 254)',
    '--bg-2': 'oklch(0.22 0.045 254)',
    '--bg-3': 'oklch(0.15 0.035 254)',
    '--ink': 'oklch(0.96 0.006 250)',
    '--ink-2': 'oklch(0.8 0.03 258)',
    '--ink-3': 'oklch(0.68 0.04 260)',
    '--line': 'oklch(0.29 0.04 255)',
    '--line-2': 'oklch(0.53 0.04 258)',
    '--accent': 'oklch(0.565 0.22 354)',
    '--accent-ink': 'oklch(0.99 0.003 255)',
    '--accent-2': 'oklch(0.78 0.13 354)',
    '--focus': 'oklch(0.78 0.13 354)',
    '--selection': 'oklch(0.36 0.1 354)',
    '--field-1': 'oklch(0.225 0.045 254)',
    '--field-2': 'oklch(0.28 0.05 255)',
    '--field-3': 'oklch(0.35 0.055 256)',
  },
} satisfies ColorOption;
