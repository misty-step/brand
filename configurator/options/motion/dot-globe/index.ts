import type { MotionOption } from '../../../src/contract';

const S = 'html[data-motion="dot-globe"]';

export default {
  id: 'dot-globe',
  layer: 'motion',
  renderer: 'webgl',
  label: 'Dotted globe',
  summary: 'The world in square points, turning once every four minutes and crossed by one accent traveller a short hop at a time, the way a misty step covers ground.',
  origin: 'new',
  refs: [
    { name: 'Stripe: designing the globe', url: 'https://stripe.com/blog/globe', what: 'A sunflower (Fibonacci) lattice keeps dot spacing even from pole to pole, land-only dots draw continents without borders, and arcs travel between points.' },
    { name: 'Cloudflare', url: 'https://www.cloudflare.com', what: 'A faint dot matrix with a horizon rising at the foot of the hero under "Region: Earth": here the dots are the Earth itself, and on phones the globe rises as that horizon.' },
    { name: 'Natural Earth', url: 'https://www.naturalearthdata.com/', what: 'Public-domain 1:50m land polygons, baked into one bit per lattice point (4 KB for both lattices).' },
  ],
  // Lazy chunk by contract: the field never loads on the critical path.
  background: { load: () => import('./field') },
  entrance: {
    // One focal sequence in the hero (settled by 760 ms); sections only resolve, with no travel.
    css: `${S} [data-enter]{opacity:0;transition:opacity .36s cubic-bezier(.23,1,.32,1);transition-delay:calc(min(var(--enter-i,0),3) * 40ms)}
${S} .hero [data-enter]{transform:translateY(10px);transition:opacity .52s cubic-bezier(.16,1,.3,1),transform .52s cubic-bezier(.16,1,.3,1);transition-delay:calc(min(var(--enter-i,0),4) * 60ms)}
${S} [data-enter].is-in{opacity:1;transform:none}
${S} .s-items>[data-enter]:nth-child(2),${S} .diagram>[data-enter]:nth-child(2){--enter-i:1}
${S} .s-items>[data-enter]:nth-child(3),${S} .diagram>[data-enter]:nth-child(3){--enter-i:2}
${S} .s-items>[data-enter]:nth-child(n+4),${S} .diagram>[data-enter]:nth-child(n+4){--enter-i:3}`,
  },
  interaction: {
    css: `${S} .btn{transition:transform .14s cubic-bezier(.23,1,.32,1),background-color .2s ease,border-color .2s ease,color .2s ease}
${S} .btn:active{transform:scale(.97)}
${S} a.link,${S} .item-link{transition:text-decoration-thickness .15s ease,text-underline-offset .2s cubic-bezier(.23,1,.32,1),color .2s ease,background-color .2s ease}
@media (hover:hover) and (pointer:fine){${S} a.link:hover{text-underline-offset:.32em}}`,
  },
  budget: {
    gzipKB: 8.8,
    frameMs: '0.44 ms median, 0.80 ms p90 per frame at 1440x820, 0.28 ms for a 480x640 panel at DPR 2 (draw plus gl.finish over 120 frames in headless-gl 8.1.6: WebGL 1 on ANGLE, offscreen on this Mac, no browser). In-browser device trace pending the conductor.',
    note: 'Vite production chunks, gzip -9: 5.4 KB for this option (its land bits included) plus the 3.4 KB runtime shared by the MotionB options. Raw WebGL1, two point draws, 30 fps cap, DPR capped with whole-number upscaling. Tiers drop the ocean dots, then render at 1 CSS px. Without WebGL the same still is painted once on the CPU (3.6 ms at 1440x820).',
  },
} satisfies MotionOption & { renderer: 'webgl' };
