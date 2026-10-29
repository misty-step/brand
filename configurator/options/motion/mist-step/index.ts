import type { MotionOption } from '../../../src/contract';
import { heroEntranceCss } from '../_motionb/entrance';

const S = 'html[data-motion="mist-step"]';

export default {
  id: 'mist-step',
  layer: 'motion',
  renderer: 'canvas2d',
  label: 'Mist step',
  summary: 'The company name as navigation: in-page links teleport through half a second of pixel mist instead of scrolling, and the hero keeps a still bank of the same mist that clears once on arrival.',
  origin: 'A',
  refs: [
    { name: 'Misty Step, D&D 5e SRD', url: 'https://5thsrd.org/spellcasting/spells/misty_step/', what: 'The brief for the transition: silvery mist, a short teleport, to a place you can see. Only in-page jumps step, and destinations already on screen just move.' },
    { name: 'Omarchy', url: 'https://omarchy.org', what: 'A state change can carry the brand: its theme switch is a wipe and a pixel rebuild of the wordmark, so the transition is the signature and the rest of the page stays still.' },
  ],
  // Lazy chunk by contract: the module never loads on the critical path.
  background: { load: () => import('./field') },
  entrance: {
    // The hero steps up into place in three 3 px steps at 10 fps, timed by CSS from render: h1, sub
    // and action settle by 440 ms. Sections only resolve.
    css: `${S} [data-enter]{opacity:0;transition:opacity .24s steps(3,jump-none);transition-delay:calc(min(var(--enter-i,0),3) * 40ms)}
${heroEntranceCss(S, { name: 'mb-mist-step-hero', from: 'opacity:0;transform:translateY(9px)', ms: 300, ease: 'steps(3,jump-start)', stagger: 70 })}
${S} [data-enter].is-in{opacity:1;transform:none}
${S} .s-items>[data-enter]:nth-child(2),${S} .diagram>[data-enter]:nth-child(2){--enter-i:1}
${S} .s-items>[data-enter]:nth-child(3),${S} .diagram>[data-enter]:nth-child(3){--enter-i:2}
${S} .s-items>[data-enter]:nth-child(n+4),${S} .diagram>[data-enter]:nth-child(n+4){--enter-i:3}`,
  },
  interaction: {
    css: `${S} .btn{transition:transform .12s cubic-bezier(.23,1,.32,1),background-color .2s ease,border-color .2s ease,color .2s ease}
${S} .btn:active{transform:scale(.97)}
${S} a.link,${S} .item-link{transition:text-decoration-thickness .15s ease,color .2s ease,background-color .2s ease}`,
  },
  budget: {
    gzipKB: 6.6,
    frameMs: 'No ambient loop. A step paints 0.15 to 1.0 ms per frame for 500 ms (1440x900 at one cell per 6 CSS px, measured in Bun) after a 1.1 to 1.4 ms threshold map; the one-off hero arrival paints 0.2 to 1.2 ms per frame for 640 ms.',
    note: 'Vite production chunks, gzip -9: 2.5 KB for this option plus the 4.1 KB runtime shared by the MotionB options (copy-aware placement and keep-clear included). Canvas 2D only, so there is no GL context to hold or release. The hero bank is painted once per size or theme; reduced motion, Pause motion, a nearby destination or a modified click keep the renderer\'s instant jump. Focus moves to the destination heading.',
  },
} satisfies MotionOption & { renderer: 'canvas2d' };
