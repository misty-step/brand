import type { ColorOption } from '../../../src/contract';

// Strategy: Restrained. Tangerine is the one fill and always carries dark text; rust is its text-safe shade.
// contrast:begin (written by options/color/check.mjs --write; WCAG 2 ratios, 8-bit sRGB)
// light on bg, bg-2, bg-3: ink 16.26 17.13 14.93; ink-2 7.89 8.31 7.24; ink-3 5.33 5.62 4.90; accent-2 5.42 5.71 4.98
//       accent-ink on accent 6.68; accent on bg, bg-2, bg-3 2.44 2.56 2.24; line-2 on bg, bg-2 3.38 3.56; line 1.23 1.30 1.13; ink on selection 12.92
//       fields vs bg 1.11 1.27 1.57; ink on fields 14.68 12.77 10.34; ink-2 on fields 7.12 6.19 5.02; focus on bg, bg-2, bg-3, fields 4.85 5.11 4.45 4.38 3.81 3.08
// dark  on bg, bg-2, bg-3: ink 16.53 15.31 17.20; ink-2 9.90 9.17 10.31; ink-3 6.14 5.69 6.39; accent-2 9.26 8.57 9.63
//       accent-ink on accent 7.91; accent on bg, bg-2, bg-3 7.91 7.32 8.23; line-2 on bg, bg-2 3.47 3.21; line 1.31 1.21 1.36; ink on selection 9.60
//       fields vs bg 1.09 1.27 1.61; ink on fields 15.13 13.04 10.25; ink-2 on fields 9.07 7.81 6.14; focus on bg, bg-2, bg-3, fields 9.21 8.53 9.59 8.43 7.27 5.71
// contrast:end
export default {
  id: 'tangerine',
  layer: 'color',
  label: 'Warm grey and tangerine',
  summary: 'Warm stone greys with one tangerine fill that carries dark text: an infrastructure palette that reads as dependable and awake rather than playful.',
  origin: 'new',
  refs: [
    { name: 'Cloudflare', url: 'https://www.cloudflare.com', what: 'Its Kumo brand token #f6821f, chosen over the redder UI orange #ff5e1f, which would sit beside safety orange. Like the site, it carries dark text (#1f1f1f on-accent; white on #ff5e1f is only 3.06:1). Near-black #262626 ink, the warm off-white and beige tones in its stylesheet (#fffbf5, #f0e3de) for the neutrals, and Kumo’s OKLCH light-dark() pairs (dark neutrals at 15 to 17% L) for the night. The ground stays just under the warm-cream threshold so the page reads as stone.' },
  ],
  light: {
    '--bg': 'oklch(0.975 0.003 70)',
    '--bg-2': 'oklch(0.993 0.002 70)',
    '--bg-3': 'oklch(0.945 0.012 70)',
    '--ink': 'oklch(0.215 0.004 60)',
    '--ink-2': 'oklch(0.42 0.008 60)',
    '--ink-3': 'oklch(0.51 0.01 60)',
    '--line': 'oklch(0.905 0.008 70)',
    '--line-2': 'oklch(0.62 0.012 65)',
    '--accent': 'oklch(0.72 0.172 54)',
    '--accent-ink': 'oklch(0.215 0.004 60)',
    '--accent-2': 'oklch(0.52 0.143 45)',
    '--focus': 'oklch(0.545 0.145 48)',
    '--selection': 'oklch(0.9 0.06 65)',
    '--field-1': 'oklch(0.94 0.014 70)',
    '--field-2': 'oklch(0.895 0.022 68)',
    '--field-3': 'oklch(0.83 0.032 65)',
  },
  dark: {
    '--bg': 'oklch(0.17 0.004 60)',
    '--bg-2': 'oklch(0.21 0.005 60)',
    '--bg-3': 'oklch(0.14 0.004 60)',
    '--ink': 'oklch(0.95 0.006 75)',
    '--ink-2': 'oklch(0.79 0.008 70)',
    '--ink-3': 'oklch(0.66 0.01 65)',
    '--line': 'oklch(0.28 0.006 60)',
    '--line-2': 'oklch(0.52 0.01 60)',
    '--accent': 'oklch(0.74 0.165 56)',
    '--accent-ink': 'oklch(0.17 0.004 60)',
    '--accent-2': 'oklch(0.78 0.13 60)',
    '--focus': 'oklch(0.78 0.14 58)',
    '--selection': 'oklch(0.36 0.07 55)',
    '--field-1': 'oklch(0.215 0.008 60)',
    '--field-2': 'oklch(0.27 0.014 58)',
    '--field-3': 'oklch(0.34 0.022 56)',
  },
} satisfies ColorOption;
