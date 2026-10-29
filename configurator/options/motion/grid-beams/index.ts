import type { MotionOption } from '../../../src/contract';

const S = 'html[data-motion="grid-beams"]';

export default {
  id: 'grid-beams',
  layer: 'motion',
  renderer: 'webgl',
  label: 'Grid beams',
  summary: 'Light climbs the page grid in staircases and lands on one accent step, lighting rails that are otherwise invisible, so the layout itself becomes the motion and there is never a decorative grid at rest.',
  origin: 'new',
  refs: [
    { name: 'Vercel', url: 'https://vercel.com', what: 'The structure stays still and only light moves; here the structure is the page grid, so motion explains the layout instead of decorating it.' },
    { name: 'Linear, via The Linear Look', url: 'https://frontend.horse/articles/the-linear-look/', what: 'Light travelling along a hairline (the animated border highlights) rather than glowing in place, on one quiet line weight.' },
  ],
  // Lazy chunk by contract: the field never loads on the critical path.
  background: { load: () => import('./field') },
  entrance: {
    // The hero arrives from the left along the rails, like a beam (settled by 840 ms); sections only resolve.
    // Hidden states use opacity and transform only: a clip-path on an observed element hides it from the
    // renderer's IntersectionObserver, which then never adds .is-in.
    css: `${S} [data-enter]{opacity:0;transition:opacity .32s cubic-bezier(.23,1,.32,1);transition-delay:calc(min(var(--enter-i,0),3) * 40ms)}
${S} .hero [data-enter]{transform:translateX(-12px);transition:opacity .56s cubic-bezier(.16,1,.3,1),transform .56s cubic-bezier(.16,1,.3,1);transition-delay:calc(min(var(--enter-i,0),4) * 70ms)}
${S} [data-enter].is-in{opacity:1;transform:none}
${S} .s-items>[data-enter]:nth-child(2),${S} .diagram>[data-enter]:nth-child(2){--enter-i:1}
${S} .s-items>[data-enter]:nth-child(3),${S} .diagram>[data-enter]:nth-child(3){--enter-i:2}
${S} .s-items>[data-enter]:nth-child(n+4),${S} .diagram>[data-enter]:nth-child(n+4){--enter-i:3}`,
  },
  interaction: {
    css: `${S} .btn{transition:transform .14s cubic-bezier(.23,1,.32,1),background-color .2s ease,border-color .2s ease,color .2s ease}
${S} .btn:active{transform:scale(.97)}
${S} a.link,${S} .item-link{transition:text-decoration-thickness .15s ease,text-underline-offset .2s cubic-bezier(.23,1,.32,1),color .2s ease,background-color .2s ease}
@media (hover:hover) and (pointer:fine){${S} a.link:hover{text-underline-offset:.3em}}`,
  },
  budget: {
    gzipKB: 6.2,
    frameMs: '0.28 ms median, 0.43 ms p90 per frame at 1440x820, 0.26 ms for a 480x640 panel at DPR 2 (draw plus gl.finish over 120 frames in headless-gl 8.1.6: WebGL 1 on ANGLE, offscreen on this Mac, no browser). In-browser device trace pending the conductor.',
    note: 'Vite production chunks, gzip -9: 2.4 KB for this option plus the 3.8 KB runtime shared by the MotionB options (copy-aware placement and keep-clear mask included). Raw WebGL1, at most 512 axis-aligned quads in one draw, 60 fps cap because beams travel 200 px/s, DPR capped with whole-number upscaling; the lower tier renders at 1 CSS px. Without WebGL the same still is painted once on the CPU (1.1 ms at 1440x820).',
  },
} satisfies MotionOption & { renderer: 'webgl' };
