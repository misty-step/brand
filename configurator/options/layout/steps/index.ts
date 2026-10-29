import type { LayoutOption } from '../../../src/contract';

// Steps (ported from the previous round's Direction C). The step is the unit:
// the offer is a staircase of treads sharing one floor, the method is a level
// map rising to the outside check, and tinted bands rise on a stepped edge so
// the page climbs as you scroll. One 4px unit throughout: heavy 4px rules,
// stepped 4px button corners, pixel-framed evidence bars. Geometry and token
// roles only: no families, no literal colours, no transitions (motion owns them).
const S = 'html[data-layout="steps"]';

const css = String.raw`
${S} {
  --page-max: 1376px;
  --gutter: clamp(16px, 2.22vw, 32px);
  --edge: max(var(--gutter), calc((100% - var(--page-max)) / 2));
  --radius: 0px;
  --rule: 4px;
  --px: 4px;
  --nav-h: 76px;
  --col-gap: 24px;
  --section-space: 144px;
  --rise-edge: 48px;
  --band-pad: 96px;
  scroll-padding-top: 24px;
}

/* ---- Masthead ---- */
${S} .nav {
  display: flex; align-items: center; gap: 24px;
  min-height: var(--nav-h); padding-inline: var(--edge);
}
${S} .nav-links { display: flex; align-items: center; gap: 4px; margin-left: auto; }
${S} .nav-links .link {
  padding-inline: 12px; font-family: var(--font-ui); font-size: var(--step--1); font-weight: 520;
  color: var(--ink); text-decoration: none;
}
${S} .nav-actions { gap: 8px; margin-left: 8px; }
${S} .theme-toggle { border-radius: 0; background: var(--bg); border: 1px solid var(--line-2); color: var(--ink); }

/* ---- Buttons: one 4px pixel cut from each corner of the primary action. clip-path would also
   clip an outside focus ring, so that button draws its ring inside its own shape. ---- */
${S} .btn {
  min-height: 56px; padding: 0 28px; gap: 12px; border: 0; border-radius: 0;
  font-family: var(--font-ui); font-size: var(--step-0); font-weight: 650; line-height: 1.1;
  text-decoration: none;
}
${S} .btn-primary {
  color: var(--accent-ink); background: var(--accent);
  clip-path: polygon(
    var(--px) 0, calc(100% - var(--px)) 0, calc(100% - var(--px)) var(--px), 100% var(--px),
    100% calc(100% - var(--px)), calc(100% - var(--px)) calc(100% - var(--px)), calc(100% - var(--px)) 100%, var(--px) 100%,
    var(--px) calc(100% - var(--px)), 0 calc(100% - var(--px)), 0 var(--px), var(--px) var(--px)
  );
}
${S} .btn-primary:focus-visible { outline: 2px solid var(--accent-ink); outline-offset: -6px; }
${S} .btn-quiet {
  min-height: 44px; padding: 0 2px; background: none; color: var(--ink);
  text-decoration: underline; text-decoration-color: var(--line-2); text-decoration-thickness: 1px; text-underline-offset: 0.28em;
}
${S} .btn-sm { min-height: 44px; padding: 0 18px; font-size: var(--step--1); }
${S} .actions { gap: 16px 28px; }

${S} a.link { text-decoration-thickness: 1px; text-decoration-color: var(--line-2); text-underline-offset: 0.22em; }

/* ---- Sections on a twelve-column grid; bands rise on a stepped edge ---- */
${S} .s {
  position: relative;
  display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--col-gap); align-items: start;
  padding: var(--section-space) var(--edge) 0;
}
${S} .s > * { grid-column: 1 / -1; min-width: 0; }
${S} .s-head { grid-column: 1 / span 6; margin-bottom: 56px; }
${S} .s-title { font-size: var(--step-3); line-height: 1.06; letter-spacing: var(--display-tracking); max-width: 14em; color: var(--ink); }
${S} .s-intro { margin-top: 16px; max-width: 40ch; font-size: var(--step-0); color: var(--ink-2); }

${S} .s-points, ${S} .s-cta {
  margin-top: calc(var(--section-space) + var(--rise-edge));
  padding-block: var(--band-pad) calc(var(--band-pad) + 24px);
  background: var(--bg-2);
}
${S} .s-points::before, ${S} .s-cta::before {
  content: ""; position: absolute; left: 0; right: 0; top: calc(-1 * var(--rise-edge)); height: var(--rise-edge);
  background: inherit;
  clip-path: polygon(0 100%, 0 66.666%, 33.333% 66.666%, 33.333% 33.333%, 66.666% 33.333%, 66.666% 0, 100% 0, 100% 100%);
}

${S} .item-title, ${S} .node-label {
  font-family: var(--font-ui); font-size: var(--step-1); font-weight: 680; line-height: 1.25;
  letter-spacing: 0; color: var(--ink);
}
${S} .item-body { color: var(--ink-2); }
${S} .s-steps .item-label, ${S} .node::before, ${S} .bar-value {
  font-family: var(--font-display); font-size: var(--step-3); font-weight: var(--display-weight);
  line-height: 1.02; letter-spacing: 0; font-variant-numeric: tabular-nums; color: var(--ink);
}

/* ---- Steps: the offer as a staircase, treads on one floor rising left to right ---- */
${S} .s-steps .s-items { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); align-items: end; }
${S} .s-steps .item {
  --rise: 0px;
  margin-top: var(--rise); align-self: stretch;
  display: flex; flex-direction: column; gap: 4px;
  padding: 28px 32px 40px;
  background: var(--bg-2); border-top: var(--rule) solid var(--ink);
}
${S} .s-steps .item + .item { box-shadow: inset 1px 0 0 var(--line); }
${S} .s-steps .item:nth-last-child(2) { --rise: 64px; }
${S} .s-steps .item:nth-last-child(3) { --rise: 128px; }
${S} .s-steps .item:nth-last-child(4) { --rise: 192px; }
${S} .s-steps .item:nth-last-child(5) { --rise: 256px; }
${S} .s-steps .item:first-child { border-top-color: var(--accent-2); }
${S} .s-steps .item-label { display: block; margin-bottom: 12px; }
${S} .s-steps .item-terms { font-weight: 650; color: var(--ink); font-variant-numeric: tabular-nums; }
${S} .s-steps .item-body { margin-top: 8px; max-width: 30em; }

/* ---- Points (a band): the lead on the left, ruled statements on the right ---- */
${S} .s-points > .s-head { grid-column: 1 / span 4; margin: 0; }
${S} .s-points > .s-items { grid-column: 6 / -1; display: grid; gap: 16px; }
${S} .s-points .item { display: grid; gap: 8px; padding: 24px 0 28px; border-top: var(--rule) solid var(--ink); }
${S} .s-points .item-body { max-width: 36em; }

/* ---- Work: groups under heavy rules, projects as rows ---- */
${S} .s-work > .s-head { margin-bottom: 40px; }
${S} .s-work > .group {
  display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--col-gap); align-items: start;
  padding-top: 16px; border-top: var(--rule) solid var(--ink);
}
${S} .s-work > .group + .group { margin-top: 40px; }
${S} .group-label {
  grid-column: 1 / span 3; margin: 0;
  font-family: var(--font-ui); font-size: var(--step-1); font-weight: 680; line-height: 1.25; letter-spacing: 0; color: var(--ink);
}
${S} .group > .s-items { grid-column: 4 / -1; }
${S} .s-work .item + .item { border-top: 1px solid var(--line); }
${S} .s-work .item-link {
  display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 5fr) minmax(0, 4fr);
  column-gap: var(--col-gap); row-gap: 6px; align-items: baseline;
  padding: 4px 0 20px; color: var(--ink); text-decoration: none;
}
${S} .s-work .item + .item .item-link { padding-top: 20px; }
${S} .s-work .item-host { font-family: var(--font-ui); font-size: var(--step--1); font-variant-numeric: tabular-nums; color: var(--ink-2); overflow-wrap: anywhere; }

/* ---- Diagram: a level map rising to the outside check ---- */
${S} .diagram { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); align-items: end; counter-reset: level; }
${S} .node {
  --rise: 0px;
  counter-increment: level;
  margin-top: var(--rise); align-self: stretch;
  display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "num num" "label count" "body body";
  align-content: start; column-gap: 10px; row-gap: 8px;
  padding: 24px 24px 32px;
  background: var(--bg-2); border-top: var(--rule) solid var(--accent-2);
}
${S} .node + .node { box-shadow: inset 1px 0 0 var(--line); }
${S} .node::before { content: counter(level); grid-area: num; margin-bottom: 4px; }
${S} .node:nth-last-child(2) { --rise: 48px; }
${S} .node:nth-last-child(3) { --rise: 96px; }
${S} .node:nth-last-child(4) { --rise: 144px; }
${S} .node:nth-last-child(5) { --rise: 192px; }
${S} .node:nth-last-child(6) { --rise: 240px; }
${S} .node:nth-last-child(7) { --rise: 288px; }
${S} .node-label { grid-area: label; margin: 0; align-self: center; }
${S} .node-label a.link { text-decoration-color: var(--line-2); }
${S} .node-count {
  grid-area: count; align-self: center; display: inline-grid; place-items: center;
  min-width: 32px; height: 32px; padding: 0 6px; border: 2px solid var(--ink);
  font-family: var(--font-ui); font-size: var(--step-0); font-weight: 650; line-height: 1; font-variant-numeric: tabular-nums; color: var(--ink);
}
${S} .node-body { grid-area: body; font-size: var(--step--1); color: var(--ink-2); max-width: 30em; }
${S} .node[data-node="oracle"] { background: var(--ink); border-top-width: 8px; padding-top: 20px; }
${S} .node[data-node="oracle"]::before, ${S} .node[data-node="oracle"] .node-label,
${S} .node[data-node="oracle"] .node-label a.link, ${S} .node[data-node="oracle"] .node-body { color: var(--bg); }
${S} .node[data-node="oracle"] .node-label a.link { text-decoration-color: var(--bg); }
${S} .node[data-node="oracle"] .node-count { border-color: var(--bg); color: var(--bg); }
${S} .node[data-node="oracle"] a:focus-visible { outline-color: var(--bg); }

/* ---- Install: tabs with a 4px marker, the harness note beside its command ---- */
${S} .s-install .tabs { display: flex; flex-wrap: wrap; gap: 0; margin: 0; border-bottom: 1px solid var(--line-2); }
${S} .s-install .tab {
  min-height: 52px; padding: 0 20px; border: 0; border-radius: 0; background: none;
  font-family: var(--font-ui); font-size: var(--step-0); font-weight: 600; line-height: 1; color: var(--ink-2);
}
${S} .s-install .tab[aria-selected="true"] { background: none; color: var(--ink); box-shadow: inset 0 -4px 0 var(--accent-2); }
${S} .s-install .tabpanel {
  display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--col-gap); row-gap: 16px;
  align-items: start; padding-top: 32px;
}
${S} .s-install .note { grid-column: 1 / span 4; grid-row: 1; margin: 0; max-width: none; font-size: var(--step-0); color: var(--ink-2); }
${S} .s-install .code {
  grid-column: 5 / -1; grid-row: 1 / span 2; margin: 0;
  padding: 16px 20px 20px; border: 0; border-top: var(--rule) solid var(--ink); background: var(--bg-3);
  white-space: pre; overflow-wrap: normal; overflow-x: auto; font-size: var(--step--1); line-height: 1.7;
}
${S} .s-install .copy {
  grid-column: 1 / span 4; grid-row: 2; justify-self: start; margin: 0; min-height: 44px; padding: 0 16px;
  border: 1px solid var(--line-2); border-radius: 0; background: var(--bg); color: var(--ink);
  font-family: var(--font-ui); font-size: var(--step--1); font-weight: 600;
}
${S} .s-install .tabpanel:not(:has(.code)) .note { grid-column: 1 / span 8; }

/* ---- Evidence: pixel-framed bars, the figure beside each ---- */
${S} .s-evidence > .bars { display: grid; gap: 0; margin: 0; }
${S} .s-evidence .bar {
  grid-template-columns: minmax(0, 4fr) minmax(0, 5fr) minmax(0, 3fr); column-gap: var(--col-gap); align-items: center;
  padding: 20px 0; border-top: 1px solid var(--line);
}
${S} .s-evidence .bar:first-child { border-top: var(--rule) solid var(--ink); }
${S} .bar-label { font-family: var(--font-ui); font-size: var(--step-1); font-weight: 680; line-height: 1.25; color: var(--ink); }
${S} .bar-track { height: 40px; border: var(--rule) solid var(--ink); background: none; }
${S} .bar-fill { background: var(--ink-3); }
${S} .bar[data-highlight="true"] .bar-fill { background: var(--accent-2); }
${S} .bar-value { justify-self: start; }
${S} .s-evidence > .limits {
  grid-column: 1 / span 7; margin: 32px 0 0; padding: 0; list-style: none;
  display: grid; gap: 12px; max-width: none; font-size: var(--step--1); color: var(--ink-2);
}
${S} .s-evidence .limits li { position: relative; padding-left: 20px; }
${S} .s-evidence .limits li::before { content: ""; position: absolute; left: 0; top: 0.55em; width: 8px; height: 8px; background: var(--ink); }
${S} .s-evidence > .link { grid-column: 1 / span 7; justify-self: start; margin-top: 16px; font-size: var(--step--1); }

/* ---- Code: the core under its file bar, beside the lead ---- */
${S} .s-code > .s-head { grid-column: 1 / span 4; margin: 0; }
${S} .s-code > .codefig {
  grid-column: 5 / -1; display: flex; flex-direction: column-reverse;
  border-top: var(--rule) solid var(--ink); background: var(--bg-3);
}
${S} .s-code figcaption {
  margin: 0; max-width: none; padding: 12px 20px; border-bottom: 1px solid var(--line);
  font-size: var(--step--1); color: var(--ink-2);
}
${S} .s-code .code { margin: 0; padding: 16px 20px 24px; border: 0; background: transparent; font-size: var(--step--1); line-height: 1.7; }

/* ---- Closing (a band): the claim left, the terms and the action right ---- */
${S} .s-cta > .s-title { grid-column: 1 / span 6; grid-row: 1 / span 2; max-width: 12em; }
${S} .s-cta > .s-intro { grid-column: 7 / -1; grid-row: 1; margin: 0; max-width: 36em; color: var(--ink-2); }
${S} .s-cta > .actions { grid-column: 7 / -1; grid-row: 2; margin-top: 32px; }

/* ---- Footer ---- */
${S} .foot {
  display: flex; flex-wrap: wrap; align-items: center; gap: 8px 24px;
  margin-top: var(--section-space); padding: 20px var(--edge) 88px; border-top: var(--rule) solid var(--ink);
}
${S} .foot-line { font-size: var(--step--1); font-weight: 650; color: var(--ink); }
${S} .foot-links { display: flex; flex-wrap: wrap; gap: 0 4px; margin-left: auto; margin-right: -10px; }
${S} .foot-links .link { padding-inline: 10px; font-family: var(--font-ui); font-size: var(--step--1); color: var(--ink); text-decoration: none; }
${S} .motion-toggle {
  border-radius: 0; border: 1px solid var(--line-2); background: var(--bg); color: var(--ink);
  font-family: var(--font-ui); font-size: var(--step--1); font-weight: 600;
}

${S} .code:focus-visible { outline: 2px solid var(--focus); outline-offset: -2px; }

@media (hover: hover) and (pointer: fine) {
  ${S} .nav-links .link:hover, ${S} .foot-links .link:hover {
    text-decoration: underline; text-decoration-thickness: 2px; text-decoration-color: var(--accent-2);
  }
  ${S} .btn-primary:hover { background: color-mix(in oklch, var(--accent) 86%, var(--ink-2)); }
  ${S} .btn-quiet:hover, ${S} a.link:hover { text-decoration-color: var(--accent-2); text-decoration-thickness: 2px; }
  ${S} .theme-toggle:hover, ${S} .s-install .copy:hover { background: var(--bg-2); }
  ${S} .s-install .tab:hover { color: var(--ink); }
  ${S} .s-work .item-link:hover .item-title { text-decoration: underline; text-decoration-thickness: 2px; text-decoration-color: var(--accent-2); text-underline-offset: 0.2em; }
}

/* ---- Narrow desktop: the level map stacks into a stair going down and right ---- */
@media (max-width: 1020px) {
  ${S} .nav-links { display: none; }
  ${S} .nav-actions { margin-left: auto; }
  ${S} .diagram { grid-auto-flow: row; grid-auto-columns: auto; }
  ${S} .node:nth-child(n) { --rise: 0px; box-shadow: none; }
  ${S} .node:nth-child(2) { margin-left: 12px; }
  ${S} .node:nth-child(3) { margin-left: 24px; }
  ${S} .node:nth-child(4) { margin-left: 36px; }
  ${S} .node:nth-child(5) { margin-left: 48px; }
  ${S} .node:nth-child(n+6) { margin-left: 60px; }
  ${S} .node { grid-template-columns: auto minmax(0, 1fr) auto; grid-template-areas: "num label count" "num body body"; column-gap: 16px; padding: 18px 20px 22px; }
  ${S} .node::before { margin: 0; }
  ${S} .s-install .note, ${S} .s-install .copy, ${S} .s-install .code, ${S} .s-install .tabpanel:not(:has(.code)) .note { grid-column: 1 / -1; grid-row: auto; }
  ${S} .s-code > .s-head, ${S} .s-code > .codefig { grid-column: 1 / -1; }
  ${S} .s-code > .s-head { margin-bottom: 40px; }
}

/* ---- Phone: re-composed, not shrunk ---- */
@media (max-width: 700px) {
  ${S} { --nav-h: 64px; --section-space: 96px; --rise-edge: 36px; --band-pad: 72px; --col-gap: 16px; }
  ${S} .nav { gap: 8px; }
  ${S} .nav-links, ${S} .nav-actions .btn { display: none; }
  ${S} .nav-actions { margin-left: auto; }
  ${S} .s > *, ${S} .s-head, ${S} .s-points > .s-head, ${S} .s-points > .s-items, ${S} .s-cta > .s-title, ${S} .s-cta > .s-intro, ${S} .s-cta > .actions, ${S} .s-evidence > .limits, ${S} .s-evidence > .link { grid-column: 1 / -1; grid-row: auto; }
  ${S} .s-head { margin-bottom: 40px; }
  ${S} .s-points > .s-head { margin-bottom: 32px; }
  ${S} .s-steps .s-items { grid-auto-flow: row; grid-auto-columns: auto; }
  ${S} .s-steps .item:nth-child(n) { --rise: 0px; padding: 20px 20px 28px; box-shadow: none; }
  ${S} .s-steps .item-label { margin-bottom: 4px; }
  ${S} .s-work > .group > .group-label, ${S} .s-work > .group > .s-items { grid-column: 1 / -1; }
  ${S} .s-work .group-label { margin-bottom: 8px; }
  ${S} .s-work .item-link { grid-template-columns: minmax(0, 1fr); }
  ${S} .node:nth-child(n) { margin-left: 0; }
  ${S} .node:nth-child(2) { margin-left: 8px; }
  ${S} .node:nth-child(3) { margin-left: 16px; }
  ${S} .node:nth-child(4) { margin-left: 24px; }
  ${S} .node:nth-child(n+5) { margin-left: 32px; }
  ${S} .s-install .tab { padding: 0 14px; }
  ${S} .s-evidence .bar { grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "label value" "track track"; row-gap: 12px; }
  ${S} .bar-label { grid-area: label; }
  ${S} .bar-value { grid-area: value; }
  ${S} .bar-track { grid-area: track; height: 28px; }
  ${S} .s-cta > .actions { flex-direction: column; align-items: stretch; }
  ${S} .s-cta > .actions .btn-primary { width: 100%; }
  ${S} .s-cta > .actions .btn-quiet { align-self: flex-start; }
  ${S} .foot-links { margin-left: -10px; margin-right: 0; }
  ${S} .s-code .code, ${S} .s-install .code { padding: 14px 16px 18px; }
  ${S} .s-code figcaption { padding-inline: 16px; }
}
`;

export default {
  id: 'steps',
  layer: 'layout',
  label: 'Steps',
  summary: 'The previous round\'s Direction C system: the offer as a staircase of priced treads on one floor, the method as a level map rising to the Oracle, tinted bands that rise on a stepped edge, and one 4px unit for every rule, corner and bar, because the name, the offer and the method are all sequences of steps.',
  origin: 'C',
  refs: [
    { name: 'Omarchy', url: 'https://omarchy.org/', what: 'Square buttons and one strict grid unit carried through every piece of chrome, so the pixel reads as a material of the page rather than a theme laid on top of it.' },
    { name: 'Greptile', url: 'https://www.greptile.com/', what: 'Flat, square buttons cut into a shape (its interlocking arrow pair), done here as one 4px notch at each corner while the hit area stays rectangular and the focus ring stays whole.' },
  ],
  css,
} satisfies LayoutOption;
