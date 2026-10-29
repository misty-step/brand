import type { MotionOption } from '../../../src/contract';

const S = 'html[data-motion="event-horizon"]';

export default {
  id: 'event-horizon',
  layer: 'motion',
  renderer: 'webgl',
  label: 'Event horizon',
  summary: 'A black hole in stipple, its disc shearing slowly round an empty shadow: the single light in a void from Grok, drawn with the same pixels as the rest of the brand, and an engraved plate in the light theme.',
  origin: 'new',
  refs: [
    { name: 'xAI and Grok, as recorded by Palate', url: 'https://palatemcp.com/gallery/xai', what: 'A near-black void whose only light source is one self-lit form, its light bleeding from one side; the type sits in the dark around it and nothing else glows.' },
    { name: 'Jean-Pierre Luminet, 1979', url: 'https://arxiv.org/abs/1902.11196', what: 'The first computed image of a black hole was inked by hand as dots on white paper: stipple density carries brightness, which is how the light theme is drawn.' },
    { name: 'James et al., Interstellar lensing (2015)', url: 'https://arxiv.org/abs/1502.03808', what: 'The geometry: a thin disc seen nearly edge on, its far side lensed into an arc over the shadow and a thinner one beneath it, brighter on the approaching side.' },
  ],
  // Lazy chunk by contract: the field never loads on the critical path.
  background: { load: () => import('./field') },
  entrance: {
    // The hero comes into focus like light settling (settled by 880 ms); sections only resolve.
    css: `${S} [data-enter]{opacity:0;transition:opacity .4s cubic-bezier(.23,1,.32,1);transition-delay:calc(min(var(--enter-i,0),3) * 40ms)}
${S} .hero [data-enter]{filter:blur(6px);transition:opacity .6s cubic-bezier(.16,1,.3,1),filter .6s cubic-bezier(.16,1,.3,1);transition-delay:calc(min(var(--enter-i,0),4) * 70ms)}
${S} [data-enter].is-in{opacity:1;filter:none}
${S} .s-items>[data-enter]:nth-child(2),${S} .diagram>[data-enter]:nth-child(2){--enter-i:1}
${S} .s-items>[data-enter]:nth-child(3),${S} .diagram>[data-enter]:nth-child(3){--enter-i:2}
${S} .s-items>[data-enter]:nth-child(n+4),${S} .diagram>[data-enter]:nth-child(n+4){--enter-i:3}`,
  },
  interaction: {
    css: `${S} .btn{transition:transform .16s cubic-bezier(.23,1,.32,1),background-color .24s ease,border-color .24s ease,color .24s ease}
${S} .btn:active{transform:scale(.97)}
${S} a.link,${S} .item-link{transition:text-decoration-thickness .24s cubic-bezier(.23,1,.32,1),text-decoration-color .24s ease,color .24s ease,background-color .24s ease}`,
  },
  budget: {
    gzipKB: 6.7,
    frameMs: '0.25 ms median, 0.52 ms p90 per frame at 1440x820, 0.21 ms for a 480x640 panel at DPR 2 (draw plus gl.finish over 120 frames in headless-gl 8.1.6: WebGL 1 on ANGLE, offscreen on this Mac, no browser). In-browser device trace pending the conductor.',
    note: 'Vite production chunks, gzip -9: 2.9 KB for this option plus the 3.8 KB runtime shared by the MotionB options (copy-aware placement and keep-clear mask included). Raw WebGL1, one fullscreen triangle at one stipple cell per 2 CSS px (3 and 4 px on lower tiers), 30 fps cap. Without WebGL the same still is painted once on the CPU (18.6 ms at 1440x820, 8.4 ms for a 480x640 panel).',
  },
} satisfies MotionOption & { renderer: 'webgl' };
