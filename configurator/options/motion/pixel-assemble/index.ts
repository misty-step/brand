import type { MotionOption } from '../../../src/contract';
import { live } from '../_motion-a/entrance';
import { interactionCss } from '../_motion-a/interaction';

const L = live('pixel-assemble');

// The headline is held for at most 700ms (CSS alone, so it appears even if the script never
// arrives). When the script runs it takes the hold over ([data-ma-pa], same scope plus one
// attribute, so it always outranks the hold), draws the assembly and hands back the real text.
const css = `
@keyframes ma-pa-hold{from,to{opacity:0}}
${L} .hero .hero-title{animation:ma-pa-hold 700ms steps(1,end) backwards}
${L} .hero .hero-title[data-ma-pa]{animation:none}
${L} .hero .hero-title[data-ma-pa="run"]{opacity:0}`;

export default {
  id: 'pixel-assemble',
  layer: 'motion',
  label: 'Pixel assemble',
  summary: 'Once per visit, a dithered cloud of mist pixels over the headline condenses into it in a left-to-right wave, sharpens through one finer mosaic and becomes the real text in about 0.7 s. Then the page is still: the 8-bit moment, spent once.',
  origin: 'new',
  renderer: 'canvas2d',
  refs: [
    { name: 'pi.dev', url: 'https://pi.dev/', what: 'Its P assembles from falling tetrominoes over about 2.5 s, then the page idles at 0 rAF/s, and reduced motion skips the intro. Same contract here: build once, then stillness, in under a third of the time.' },
    { name: 'Omarchy', url: 'https://omarchy.org/', what: 'The wordmark is painted in pixels on load and rebuilt row by row on a theme change, while the h1 keeps the real name for screen readers. Here the pixels become the real h1 itself.' },
    { name: 'Nous Research', url: 'https://nousresearch.com/', what: 'Dithered imagery in the palette\'s own inks: the cloud is drawn in --field-2 and condenses into the headline\'s ink, so no new colour enters the page.' },
  ],
  background: { load: () => import('./assemble') },
  entrance: { css },
  interaction: { css: interactionCss('pixel-assemble', 'pixel') },
  budget: {
    gzipKB: 4.5,
    frameMs: 'Runs about 0.7 s once, then no loop. Pixel moves: 0.07 ms median, 0.30 ms p95 per frame for 3,200 pixels on a 360x225 grid (JavaScriptCore, this Mac); glyph rasterising and putImageData pending conductor (no browser allowed on this Mac)',
    note: 'Measured: 4.5 KB gzip (1.7 option + 2.8 lazy module), vite build. One 2D canvas over the hero, no GPU context, removed when done. The h1 stays real text: CSS holds it at most 700ms, so it appears even if the script never arrives; reduced motion, Pause, scroll, resize and theme change all hand back the finished headline at once.',
  },
} satisfies MotionOption & { renderer: 'webgl' | 'canvas2d' | 'none' };
