import type { MotionOption } from '../../../src/contract';
import { focal, focalOrder, live } from '../_motion-a/entrance';
import { interactionCss } from '../_motion-a/interaction';

const S = 'html[data-motion="quiet"]';
const L = live('quiet');
const OUT = 'cubic-bezier(.23,1,.32,1)';
// The one reveal is reserved for sequences whose order is the content: the offer's steps,
// the stack's route and the trial's bars. Headings, work and points never move.
const SEQ = ':is(.s-steps .item,.s-diagram .node)[data-enter]';

const css = `
@keyframes ma-quiet-rise{from{opacity:0;translate:0 12px}}
@keyframes ma-quiet-fade{from{opacity:0}}
${focalOrder(S)}
${S} .hero .hero-visual{--ma-name:ma-quiet-fade;--ma-dur:400ms}
${focal(L)}{animation:var(--ma-name,ma-quiet-rise) var(--ma-dur,560ms) cubic-bezier(.16,1,.3,1) backwards;animation-delay:calc(min(var(--ma-i),4) * 60ms)}
${L} ${SEQ}:not(.is-in){opacity:0;translate:0 8px}
${S} ${SEQ}{transition:opacity 300ms ${OUT},translate 300ms ${OUT}}
${S} ${SEQ}:nth-child(2){transition-delay:50ms}
${S} ${SEQ}:nth-child(3){transition-delay:100ms}
${S} ${SEQ}:nth-child(n+4){transition-delay:150ms}
${S} .s-evidence .bar-fill{clip-path:inset(0 0 0 0);transition:clip-path 300ms ${OUT}}
${L} .s-evidence:has(.s-head:not(.is-in)) .bar-fill{clip-path:inset(0 100% 0 0)}
${S} .s-evidence .bar:nth-child(2) .bar-fill{transition-delay:50ms}
${S} .s-evidence .bar:nth-child(n+3) .bar-fill{transition-delay:100ms}`;

export default {
  id: 'quiet',
  layer: 'motion',
  label: 'Quiet',
  summary: 'One entrance, then stillness: headline, line, actions and visual rise 12px in reading order and settle by 0.8 s; after that only ordered things (the offer steps, the route, the trial bars) arrive in order. No background.',
  origin: 'new',
  renderer: 'none',
  refs: [
    { name: 'Macroscope', url: 'https://macroscope.com/', what: 'Its hero rises (h1 18px over 680ms, buttons 14px at 220 and 260ms) on an expo ease-out, and its scroll reveals are 8 to 16px over about 300ms with a 42ms stagger. Quiet is that grammar, cut to one reveal pattern.' },
    { name: 'Linear', url: 'https://linear.app/', what: 'Its hero rises piece by piece (opacity, 20% travel, 100ms stagger), but over 1000ms with a 10px blur and a 3 s settle. Quiet keeps the order, drops the blur and settles in 0.8 s.' },
    { name: 'Emil Kowalski', url: 'https://emilkowal.ski/ui/you-dont-need-animations', what: 'Every animation needs a purpose and UI motion stays under 300ms; a marketing page may spend one longer focal moment. Here order is the purpose, so only sequences stagger.' },
  ],
  entrance: { css },
  interaction: { css: interactionCss('quiet', 'smooth') },
  budget: { gzipKB: 1.9, frameMs: '0 ms: no background module and no animation loop', note: 'Measured: 1.9 KB gzip option module (CSS plus lab metadata), vite build. Focal sequence 560ms + 4 x 60ms stagger = 0.8 s from first paint; reveals 300ms with at most 150ms of stagger. Reduced motion and Pause show the finished page.' },
} satisfies MotionOption & { renderer: 'webgl' | 'canvas2d' | 'none' };
