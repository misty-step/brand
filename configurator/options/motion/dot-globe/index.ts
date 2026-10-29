import type { MotionOption } from '../../../src/contract';

const S = 'html[data-motion="dot-globe"]';

export default {
  id: 'dot-globe',
  layer: 'motion',
  label: 'Dotted globe',
  summary: 'The world as square points that turn once every four minutes while one accent traveller crosses it a short hop at a time, the way a misty step covers ground: never in one leap.',
  origin: 'new',
  refs: [
    { name: 'Stripe: designing the globe', url: 'https://stripe.com/blog/globe', what: 'A sunflower (Fibonacci) lattice keeps dot spacing even from pole to pole, land-only dots draw continents without borders, and arcs travel between points.' },
    { name: 'Cloudflare network', url: 'https://www.cloudflare.com/network/', what: 'A network told as real places (data centres in cities in more than 100 countries) rather than decoration, so every point here comes from a real coastline.' },
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
    gzipKB: 7.9,
    frameMs: 'Main-thread JS 0.002 ms median, 0.015 ms p95 per frame (600 frames in Bun, GL stubbed). GPU time pending the conductor: no browser may run on this Mac.',
    note: 'One lazy chunk: field, shared runtime and 2.1 KB of land bits. Raw WebGL1, two point draws, 30 fps cap, DPR capped with whole-number upscaling. Tiers drop the ocean dots, then render at 1 CSS px. Without WebGL the same still is painted once on the CPU (3.6 ms at 1440x820).',
  },
} satisfies MotionOption;
