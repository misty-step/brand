import type { MotionOption } from '../../../src/contract';
import { heroEntranceCss } from '../_motionb/entrance';

const S = 'html[data-motion="field-mesh"]';

export default {
  id: 'field-mesh',
  layer: 'motion',
  renderer: 'webgl',
  label: 'Field ribbon',
  summary: 'One slow ribbon of the palette field colours twisting through the hero, posterised into three flat tones on a 2 px grid: Stripe’s one indulgence as a screenprint in steps, never a glowing gradient.',
  origin: 'new',
  refs: [
    { name: 'Stripe', url: 'https://stripe.com', what: 'Precision with one indulgence: a single ribbon through the hero, behind otherwise quiet type, with a still of the same frame when WebGL is missing.' },
    { name: 'Stripe gradient, reverse engineered (Kevin Hufnagl via Bram.us)', url: 'https://www.bram.us/2021/10/13/how-to-create-the-stripe-website-gradient-effect/', what: 'A surface moved by layered waves on incommensurate periods, so the motion never visibly loops.' },
  ],
  // Lazy chunk by contract: the field never loads on the critical path.
  background: { load: () => import('./field') },
  entrance: {
    // The hero settles like cloth, timed by CSS from render: h1, sub and action settle by 560 ms.
    // Sections only resolve.
    css: `${S} [data-enter]{opacity:0;transition:opacity .45s cubic-bezier(.23,1,.32,1);transition-delay:calc(min(var(--enter-i,0),3) * 40ms)}
${heroEntranceCss(S, { name: 'mb-field-mesh-hero', from: 'opacity:0;transform:translateY(16px)', ms: 460, ease: 'cubic-bezier(.16,1,.3,1)', stagger: 50 })}
${S} [data-enter].is-in{opacity:1;transform:none}
${S} .s-items>[data-enter]:nth-child(2),${S} .diagram>[data-enter]:nth-child(2){--enter-i:1}
${S} .s-items>[data-enter]:nth-child(3),${S} .diagram>[data-enter]:nth-child(3){--enter-i:2}
${S} .s-items>[data-enter]:nth-child(n+4),${S} .diagram>[data-enter]:nth-child(n+4){--enter-i:3}`,
  },
  interaction: {
    css: `${S} .btn{transition:transform .2s cubic-bezier(.23,1,.32,1),background-color .24s ease,border-color .24s ease,color .24s ease}
${S} .btn:active{transform:scale(.98)}
${S} a.link,${S} .item-link{transition:text-decoration-thickness .24s ease,text-underline-offset .24s cubic-bezier(.23,1,.32,1),color .24s ease,background-color .24s ease}`,
  },
  budget: {
    gzipKB: 6.5,
    frameMs: '0.25 ms median, 0.30 ms p90 per frame at 1440x820, 0.21 ms for a 480x640 panel at DPR 2 (draw plus gl.finish over 120 frames in headless-gl 8.1.6: WebGL 1 on ANGLE, offscreen on this Mac, no browser). In-browser device trace pending the conductor.',
    note: 'Vite production chunks, gzip -9: 2.4 KB for this option plus the 4.1 KB runtime shared by the MotionB options (copy-aware placement and keep-clear included). Raw WebGL1, one fullscreen triangle at one cell per 2 CSS px (3 and 4 px on lower tiers), 30 fps cap. Without WebGL the same still is painted once on the CPU (10.7 ms at 1440x820, 4.6 ms for a 480x640 panel).',
  },
} satisfies MotionOption & { renderer: 'webgl' };
