// The hero's focal pieces, in reading order. Heroes mark them with [data-enter] and an inline
// --enter-i (0 = h1, then sub, actions, proof, visual); heroes that do not are ordered by class.
// The focal sequence plays once when the hero renders; it never waits for scroll.

const PIECES = ['.hero-title', '.hero-sub', '.actions', '.hero-proof', '.hero-visual'];

/** Selector for the focal pieces under scope `s` (an html[data-motion] selector). */
export const focal = (s: string) =>
  `${s} .hero [data-enter],${s} .hero:not(:has([data-enter])) :is(${PIECES.join(',')})`;

/** Assigns --ma-i (sequence index) to every focal piece. */
export const focalOrder = (s: string) =>
  `${s} .hero [data-enter]{--ma-i:var(--enter-i,0)}\n` +
  PIECES.map((p, i) => `${s} .hero:not(:has([data-enter])) ${p}{--ma-i:${i}}`).join('\n');

/** Animations only run when motion is allowed; reduced motion and the pause control show the finished page. */
export const live = (id: string) => `html[data-motion="${id}"]:not([data-reduced-motion="1"]):not([data-paused="1"])`;
