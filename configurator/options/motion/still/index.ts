import type { MotionOption } from '../../../src/contract';
import { interactionCss } from '../_motion-a/interaction';

export default {
  id: 'still',
  layer: 'motion',
  label: 'Still',
  summary: 'Nothing moves until you touch it: a press gives way to 0.97 in 90ms, colour eases in 160ms only under a mouse, keyboard and tabs change instantly. Stillness for a studio that sells certainty.',
  origin: 'new',
  renderer: 'none',
  refs: [
    { name: 'Emil Kowalski', url: 'https://emilkowal.ski/ui/you-dont-need-animations', what: 'Frequency decides: keyboard-initiated and many-times-a-day actions get no animation, a press answers with a subtle scale down, and UI motion stays under 300ms.' },
    { name: 'Linear', url: 'https://linear.app/', what: 'Measured 2026-10-29: buttons press to scale(0.97) on :active, nav colours move in 100ms, hover rules sit behind (any-hover: hover). Feedback this small reads as quality, not motion.' },
    { name: 'Vercel', url: 'https://vercel.com/', what: 'No staged text entrance: the home page arrives composed, with one 200ms fade. Confidence shown by not performing.' },
    { name: 'pi.dev', url: 'https://pi.dev/', what: 'After its one intro the page holds still (0 rAF/s, 0.1% main thread at idle) and links and tabs change colour in 140ms: a still page can still feel alive under the hand.' },
  ],
  entrance: { css: 'html[data-motion="still"] [data-enter]{opacity:1;translate:none}' },
  interaction: { css: interactionCss('still', 'smooth') },
  budget: { gzipKB: 1.3, frameMs: '0 ms: no background module and no animation loop', note: 'Measured: 1.3 KB gzip is the option module (CSS strings plus lab metadata) in a vite build. No entrance, no ambient frames; transitions run only on press, hover and theme change.' },
} satisfies MotionOption & { renderer: 'webgl' | 'canvas2d' | 'none' };
