import type { LayoutOption } from '../../../src/contract';

// Editorial: an asymmetric twelve-column page. Each section opens with a
// hanging head (the title, then a standfirst in the second ink) set in the left
// five columns under a heavy rule, sticky while the reading column on the right
// scrolls. Lists are ruled like a printed index, numerals hang in the alley,
// figures carry captions, and the closing runs the claim on into its terms.
// The display face appears only at the type layer's display steps (1, 3 and up).
// Geometry and token roles only: no families, no literal colours, no transitions.
const S = 'html[data-layout="editorial"]';

const css = String.raw`
${S} {
  --page-max: 1280px;
  --gutter: clamp(20px, 5vw, 72px);
  --edge: max(var(--gutter), calc((100% - var(--page-max)) / 2));
  --radius: 4px;
  --rule: 1px;
  --nav-h: 96px;
  --col-gap: clamp(16px, 2.4vw, 32px);
  --section-space: clamp(112px, 13vw, 192px);
  --row-pad: clamp(20px, 2vw, 28px);
  scroll-padding-top: 24px;
}

/* ---- Masthead: tall, unboxed, links on the right ---- */
${S} .nav {
  display: flex; align-items: center; gap: 32px;
  min-height: var(--nav-h); padding-inline: var(--edge);
}
${S} .nav-links { display: flex; align-items: center; gap: 4px 24px; margin-left: auto; }
${S} .nav-links .link {
  font-family: var(--font-ui); font-size: var(--step-0); font-weight: 500;
  color: var(--ink); text-decoration: none;
}
${S} .nav-actions { gap: 12px; }
${S} .nav-links + .nav-actions { margin-left: 8px; }
${S} .theme-toggle { border-radius: var(--radius); background: transparent; border: var(--rule) solid var(--line-2); color: var(--ink); }

/* ---- Buttons: quiet rectangles, one small radius ---- */
${S} .btn {
  min-height: 52px; padding: 0 24px; gap: 10px;
  border: var(--rule) solid transparent; border-radius: var(--radius);
  font-family: var(--font-ui); font-size: var(--step-0); font-weight: 600; line-height: 1.2;
  text-decoration: none;
}
${S} .btn-primary { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
${S} .btn-quiet { background: transparent; color: var(--ink); border-color: var(--line-2); }
${S} .btn-sm { min-height: 44px; padding: 0 18px; font-size: var(--step--1); }
${S} .actions { gap: 12px 16px; }

${S} a.link { text-decoration-thickness: 1px; text-decoration-color: var(--line-2); text-underline-offset: 0.24em; }

/* ---- The page grid: head hung left, reading column right, numerals in the alley.
   The head spans every row and the last row is flexible, so a tall head grows only that
   row and never opens gaps between the entries of the reading column. ---- */
${S} .s {
  display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); grid-template-rows: repeat(4, auto) 1fr;
  column-gap: var(--col-gap); align-items: start;
  padding: var(--section-space) var(--edge) 0;
}
${S} .s > * { grid-column: 7 / -1; min-width: 0; }
${S} .s > :not(.s-head) + :not(.s-head) { margin-top: clamp(32px, 3.5vw, 48px); }
${S} .s > .s-head {
  grid-column: 1 / span 5; grid-row: 1 / -1;
  position: sticky; top: 32px;
  padding-top: 22px; border-top: calc(var(--rule) * 2) solid var(--ink);
}
${S} .s-head .s-title { font-size: var(--step-3); line-height: 1.04; letter-spacing: var(--display-tracking); max-width: 12em; color: var(--ink); }
${S} .s-head .s-intro {
  margin-top: 20px; max-width: 34ch;
  font-size: var(--step-1); line-height: 1.35; text-wrap: pretty; color: var(--ink-2);
}

/* The first rule of every reading column lines up with the lede's rule */
${S} .s-steps .s-items, ${S} .s-points .s-items, ${S} .diagram, ${S} .s-evidence .bars,
${S} .s-work .group, ${S} .s-install .tabs, ${S} .s-code .codefig {
  border-top: var(--rule) solid var(--ink);
}

/* Shared type roles */
${S} .item-title, ${S} .node-label {
  font-family: var(--font-display); font-size: var(--step-1); font-weight: var(--display-weight);
  line-height: 1.2; letter-spacing: var(--display-tracking); color: var(--ink);
}
${S} .item-body, ${S} .node-body { font-size: var(--step-0); color: var(--ink-2); max-width: var(--measure); }
${S} .s-steps .item-label {
  font-family: var(--font-display); font-size: var(--step-3); font-weight: var(--display-weight);
  line-height: 1; letter-spacing: var(--display-tracking); font-variant-numeric: tabular-nums;
}
${S} .node-count, ${S} .bar-value {
  font-family: var(--font-display); font-size: var(--step-1); font-weight: var(--display-weight);
  line-height: 1.2; letter-spacing: var(--display-tracking); font-variant-numeric: tabular-nums;
}

/* ---- Steps: ruled entries, numerals hung in the alley ---- */
${S} .s-steps .item {
  position: relative; display: grid; gap: 8px;
  padding: var(--row-pad) 0 calc(var(--row-pad) + 8px);
  border-bottom: var(--rule) solid var(--line);
}
${S} .s-steps .item-label { position: absolute; right: calc(100% + var(--col-gap)); top: var(--row-pad); color: var(--ink-3); }
${S} .s-steps .item-terms { font-size: var(--step-0); font-weight: 600; color: var(--ink); font-variant-numeric: tabular-nums; }
${S} .s-steps .item-body { margin-top: 4px; }

/* ---- Points: term and definition on one line ---- */
${S} .s-points .item {
  display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  column-gap: var(--col-gap); row-gap: 6px; align-items: baseline;
  padding: var(--row-pad) 0; border-bottom: var(--rule) solid var(--line);
}
${S} .s-points .item-title {
  font-family: var(--font-ui); font-size: var(--step-0); font-weight: 600; line-height: 1.4;
  letter-spacing: 0; color: var(--ink);
}

/* ---- Work: a printed index, one group after another ---- */
${S} .group-label {
  margin: 0; padding: 14px 0; border-bottom: var(--rule) solid var(--line);
  font-family: var(--font-ui); font-size: var(--step--1); font-weight: 600; line-height: 1.4;
  letter-spacing: 0; color: var(--ink-2);
}
${S} .s-work .item-link {
  display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  grid-template-areas: "title body" "title host";
  column-gap: var(--col-gap); row-gap: 6px; align-items: baseline;
  padding: var(--row-pad) 0; border-bottom: var(--rule) solid var(--line);
  color: var(--ink); text-decoration: none;
}
${S} .s-work .item-title { grid-area: title; }
${S} .s-work .item-body { grid-area: body; }
${S} .s-work .item-host {
  grid-area: host; font-family: var(--font-ui); font-size: var(--step--1); font-variant-numeric: tabular-nums; color: var(--ink-3);
  overflow-wrap: anywhere;
}

/* ---- Diagram: the method as a contents list with counts ---- */
${S} .node {
  display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 3fr) minmax(2em, auto);
  grid-template-areas: "label body count";
  column-gap: var(--col-gap); row-gap: 6px; align-items: baseline;
  padding: var(--row-pad) 0; border-bottom: var(--rule) solid var(--line);
}
${S} .node-label { grid-area: label; margin: 0; }
${S} .node-label a.link { text-decoration-color: var(--line-2); }
${S} .node-body { grid-area: body; }
${S} .node-count { grid-area: count; justify-self: end; color: var(--ink-2); }
${S} .diagram > .node:last-child { border-bottom: calc(var(--rule) * 2) solid var(--ink); }

/* ---- Install: text tabs over a set command ---- */
${S} .s-install .tabs {
  display: flex; flex-wrap: wrap; gap: 0 28px; margin: 0;
  border-bottom: var(--rule) solid var(--line-2);
}
${S} .s-install .tab {
  min-height: 52px; min-width: 44px; padding: 0; border: 0; border-radius: 0; background: none;
  font-family: var(--font-ui); font-size: var(--step-0); font-weight: 500; line-height: 1.2;
  color: var(--ink-2);
}
${S} .s-install .tab[aria-selected="true"] { background: none; color: var(--ink); box-shadow: inset 0 -2px 0 var(--accent-2); }
${S} .s.s-install > .tabpanel { margin-top: 0; }
${S} .s-install .tabpanel {
  display: grid; grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas: "code code" "note copy";
  column-gap: var(--col-gap); row-gap: 16px; align-items: start; padding-top: 28px;
}
${S} .s-install .code {
  grid-area: code; margin: 0; padding: clamp(20px, 2.4vw, 32px);
  border: 0; border-radius: var(--radius); background: var(--bg-3);
  white-space: pre; overflow-wrap: normal; overflow-x: auto;
  font-size: var(--step--1); line-height: 1.8;
}
${S} .s-install .copy {
  grid-area: copy; margin: 0; min-height: 44px; padding: 0 18px;
  border: var(--rule) solid var(--line-2); border-radius: var(--radius); background: transparent; color: var(--ink);
  font-family: var(--font-ui); font-size: var(--step--1); font-weight: 600;
}
${S} .s-install .note { grid-area: note; margin: 0; font-size: var(--step--1); color: var(--ink-2); max-width: var(--measure); }
${S} .s-install .tabpanel:not(:has(.code)) { grid-template-areas: "note note"; }

/* ---- Evidence: a ruled table of bars, caveats set as footnotes ---- */
${S} .s-evidence .bars { display: grid; gap: 0; margin: 0; }
${S} .s-evidence .bar {
  grid-template-columns: minmax(0, 4fr) minmax(0, 5fr) minmax(3em, 2fr);
  column-gap: var(--col-gap); align-items: center;
  padding: 18px 0; border-bottom: var(--rule) solid var(--line);
}
${S} .bar-label { font-family: var(--font-ui); font-size: var(--step-0); color: var(--ink); }
${S} .bar[data-highlight="true"] .bar-label { font-weight: 600; }
${S} .bar-track { height: 8px; background: var(--bg-3); }
${S} .bar-fill { background: var(--ink-3); }
${S} .bar[data-highlight="true"] .bar-fill { background: var(--accent-2); }
${S} .bar-value { justify-self: end; color: var(--ink); }
${S} .s-evidence .limits {
  display: grid; gap: 10px; margin: 0; padding: 0; list-style: none;
  font-size: var(--step--1); color: var(--ink-2); max-width: var(--measure);
}
${S} .s-evidence .limits li { position: relative; padding-left: 28px; }
${S} .s-evidence .limits li::before {
  content: ""; position: absolute; left: 0; top: 0.75em; width: 14px; border-top: var(--rule) solid var(--line-2);
}
${S} .s-evidence > .link { justify-self: start; font-size: var(--step--1); }
${S} .s.s-evidence > .limits + .link { margin-top: 16px; }

/* ---- Code: a figure in the reading column, caption beneath ---- */
${S} .s-code .codefig { grid-column: 6 / -1; padding-top: 28px; }
${S} .s-code .code {
  margin: 0; padding: clamp(24px, 3vw, 40px); border: 0; border-radius: var(--radius); background: var(--bg-3);
  font-size: var(--step--1); line-height: 1.8; max-width: none;
}
${S} .s-code figcaption { margin-top: 14px; font-size: var(--step--1); color: var(--ink-2); max-width: var(--measure); }

/* ---- Closing: the widest statement on the page, its terms beneath. A block, not a grid;
   the right padding keeps it to nine columns. ---- */
${S} .s-cta {
  display: block; position: relative;
  padding: calc(var(--section-space) + 30px) calc(var(--edge) + (100% - 2 * var(--edge)) / 4) var(--section-space) var(--edge);
}
${S} .s-cta::before {
  content: ""; position: absolute; left: var(--edge); right: var(--edge); top: var(--section-space);
  border-top: calc(var(--rule) * 2) solid var(--ink);
}
${S} .s-cta > .s-title { max-width: 14em; font-size: var(--step-4); line-height: 1.02; letter-spacing: var(--display-tracking); color: var(--ink); }
${S} .s-cta > .s-intro { margin-top: 24px; max-width: 46ch; font-size: var(--step-1); line-height: 1.4; color: var(--ink-2); }
${S} .s.s-cta > .actions { margin-top: 40px; letter-spacing: 0; }

/* ---- Footer: the same rule, the same columns ---- */
${S} .foot {
  display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--col-gap); row-gap: 8px;
  align-items: baseline; padding: 0 var(--edge) 96px;
}
${S} .foot::before { content: ""; grid-column: 1 / -1; margin-bottom: 20px; border-top: var(--rule) solid var(--ink); }
${S} .foot-line { grid-column: 1 / span 5; font-size: var(--step-0); color: var(--ink); }
${S} .foot-links { grid-column: 7 / -1; display: flex; flex-wrap: wrap; gap: 0 24px; }
${S} .foot-links .link { font-family: var(--font-ui); font-size: var(--step--1); color: var(--ink-2); }
${S} .motion-toggle {
  border-radius: var(--radius); border: var(--rule) solid var(--line-2); background: var(--bg);
  color: var(--ink); font-family: var(--font-ui); font-size: var(--step--1);
}

${S} .code:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
${S} .s-install .tab:focus-visible { outline-offset: 2px; }

@media (hover: hover) and (pointer: fine) {
  ${S} .nav-links .link:hover { text-decoration: underline; text-decoration-thickness: 1px; }
  ${S} .theme-toggle:hover, ${S} .s-install .copy:hover, ${S} .btn-quiet:hover { background: var(--bg-2); }
  ${S} .btn-primary:hover { background: color-mix(in oklch, var(--accent) 86%, var(--ink-2)); border-color: transparent; }
  ${S} .s-work .item-link:hover .item-title { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.16em; }
  ${S} .s-install .tab:hover { color: var(--ink); }
  ${S} a.link:hover { text-decoration-color: currentColor; }
}

/* ---- Narrow desktop: the alley closes, numerals move inside the column ---- */
@media (max-width: 1020px) {
  ${S} .s > * { grid-column: 6 / -1; }
  ${S} .s > .s-head { grid-column: 1 / span 5; }
  ${S} .s-cta { padding-right: var(--edge); }
  ${S} .nav-links { display: none; }
  ${S} .nav-links + .nav-actions, ${S} .nav-actions { margin-left: auto; }
  ${S} .s-steps .item { grid-template-columns: 2em minmax(0, 1fr); column-gap: 12px; }
  ${S} .s-steps .item > * { grid-column: 2; }
  ${S} .s-steps .item-label { position: static; grid-column: 1; grid-row: 1 / span 2; }
}

/* ---- Phone: one column, each head above its list, rules kept ---- */
@media (max-width: 700px) {
  ${S} { --gutter: 20px; --nav-h: 64px; --section-space: 88px; --row-pad: 18px; }
  ${S} .nav { gap: 12px; }
  ${S} .nav-links, ${S} .nav-actions .btn { display: none; }
  ${S} .nav-actions { margin-left: auto; }
  ${S} .s { grid-template-columns: minmax(0, 1fr); grid-template-rows: none; }
  ${S} .s > *, ${S} .s > .s-head { grid-column: 1 / -1; }
  ${S} .s > .s-head { grid-row: auto; position: static; margin-bottom: 32px; }
  ${S} .s-points .item, ${S} .s-work .item-link { grid-template-columns: minmax(0, 1fr); grid-template-areas: "title" "body" "host"; }
  ${S} .node { grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "label count" "body body"; }
  ${S} .s-evidence .bar { grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "label value" "track track"; row-gap: 10px; }
  ${S} .bar-label { grid-area: label; }
  ${S} .bar-value { grid-area: value; }
  ${S} .bar-track { grid-area: track; }
  ${S} .s-install .tabs { gap: 0 20px; }
  ${S} .s-install .tab { min-height: 48px; }
  ${S} .s-install .tabpanel { grid-template-columns: minmax(0, 1fr); grid-template-areas: "code" "copy" "note"; }
  ${S} .s-install .copy { justify-self: start; }
  ${S} .s-install .tabpanel:not(:has(.code)) { grid-template-areas: "note"; }
  ${S} .s-install .code, ${S} .s-code .code { padding: 18px; }
  ${S} .s-code .codefig { grid-column: 1 / -1; }
  ${S} .s-cta > .s-title { font-size: var(--step-3); }
  ${S} .s.s-cta > .actions { flex-direction: column; align-items: stretch; }
  ${S} .s.s-cta > .actions .btn { width: 100%; }
  ${S} .foot { grid-template-columns: minmax(0, 1fr); }
  ${S} .foot-line, ${S} .foot-links { grid-column: 1 / -1; }
}
`;

export default {
  id: 'editorial',
  layer: 'layout',
  label: 'Editorial',
  summary: 'An asymmetric twelve-column page: each section opens with a hanging head (a title and its standfirst) under a heavy rule, beside a wide reading column of ruled entries, so the offer and the method read like a carefully set report rather than a feature grid.',
  origin: 'new',
  refs: [
    { name: 'Stripe', url: 'https://stripe.com/', what: 'A twelve-column grid with narrow gutters under a container of about 1266px, small 4px radii, long even section spacing, the closing set as a two-tone sentence (the claim in ink running on into its explanation in a lighter ink), and caveats set as footnotes beside the claim they qualify.' },
    { name: 'Making Software', url: 'https://www.makingsoftware.com/', what: 'A reference book on the web: a reading column beside figure plates, a table of contents with counts, and a caption under every figure; here the method becomes a contents list with counts and the core file a captioned figure.' },
  ],
  css,
} satisfies LayoutOption;
