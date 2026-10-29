// The hero entrance shared by the MotionB options: one focal sequence timed by CSS alone. It is a
// keyframe animation that starts when the hero is rendered, so it never waits on the renderer's
// IntersectionObserver (.is-in), a frame, WebGL, the mist bank or fonts. The h1, sub and primary
// action (--enter-i 0, 1, 2) reach their final state by 2 * stagger + ms after render, which every
// option keeps at or under 560 ms (the lab requires 700); the proof and visual (3, 4) follow by
// 660 ms. Reduced motion and Pause motion show the final state through the renderer's !important
// rules, which outrank animations. The animation keeps running under Pause, invisibly, so resuming
// after a paused load never replays the entrance. Sections keep their .is-in reveal.
// Not an option: this directory has no index.ts.

export interface HeroEntrance {
  /** keyframes name, unique to the option */
  name: string;
  /** declarations of the starting state; the end state is the element's own (visible, in place) */
  from: string;
  /** per element, ms */
  ms: number;
  ease: string;
  /** ms between --enter-i steps */
  stagger: number;
}

export function heroEntranceCss(scope: string, e: HeroEntrance): string {
  return `${scope} .hero [data-enter]{opacity:1;animation:${e.name} ${e.ms}ms ${e.ease} backwards;animation-delay:calc(min(var(--enter-i,0),4) * ${e.stagger}ms);animation-play-state:running!important}
@keyframes ${e.name}{from{${e.from}}}`;
}
