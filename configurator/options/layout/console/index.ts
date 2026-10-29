import type { LayoutOption } from '../../../src/contract';

// Console: a framed, square, dense system. Below the hero the page is one
// column of panels inside two hairline rails, separated by sunken gutter
// strips. Each panel has a header row; bodies are cells with shared borders,
// table rows with compact metadata, a harness list beside its command, and the
// core file under a file header. Geometry and token roles only: no families,
// no literal colours, no transitions (the motion layer owns those).
const S = 'html[data-layout="console"]';

const css = String.raw`
${S} {
  --page-max: 1280px;
  --gutter: clamp(16px, 3vw, 40px);
  --pad: clamp(16px, 1.8vw, 24px);
  --band: clamp(16px, 2vw, 24px);
  --frame: min(var(--page-max), calc(100% - 2 * var(--gutter)));
  --edge: calc(max(var(--gutter), calc((100% - var(--page-max)) / 2)) + var(--pad));
  --radius: 0px;
  --rule: 1px;
  --nav-h: 56px;
  --head-pad: clamp(28px, 3.4vw, 44px);
  scroll-padding-top: calc(var(--nav-h) + 16px);
}

/* ---- Navigation: a dense sticky bar aligned to the panel text ---- */
${S} .nav {
  position: sticky; top: 0; z-index: 40;
  display: flex; align-items: center; gap: 20px;
  min-height: var(--nav-h); padding-inline: var(--edge);
  background: var(--bg); border-bottom: var(--rule) solid var(--line);
}
${S} .nav-links { display: flex; align-items: center; gap: 0; margin-left: 12px; }
${S} .nav-links .link {
  padding-inline: 12px; font-family: var(--font-ui); font-size: var(--step--1); font-weight: 500;
  color: var(--ink-2); text-decoration: none;
}
${S} .nav-actions { margin-left: auto; gap: 8px; }
${S} .theme-toggle { border-radius: 0; background: transparent; border: var(--rule) solid var(--line-2); color: var(--ink); }

/* ---- Buttons: square, flat ---- */
${S} .btn {
  min-height: 48px; padding: 0 20px; gap: 8px;
  border: var(--rule) solid transparent; border-radius: 0;
  font-family: var(--font-ui); font-size: var(--step-0); font-weight: 600; line-height: 1.2;
  text-decoration: none;
}
${S} .btn-primary { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
${S} .btn-quiet { background: transparent; color: var(--ink); border-color: var(--line-2); }
${S} .btn-sm { min-height: 44px; padding: 0 16px; font-size: var(--step--1); }
${S} .actions { gap: 8px; }

${S} a.link { text-decoration-color: var(--line-2); text-decoration-thickness: 1px; text-underline-offset: 0.24em; }

/* ---- The frame: opaque panels between two rails, sunken gutters between panels.
   A page-level motion field shows only beside the frame, never behind the reading. ---- */
${S} main > .s {
  width: var(--frame); margin-inline: auto; padding: 0;
  border: var(--rule) solid var(--line); border-top: 0;
  background-color: var(--bg);
}
${S} main > :not(.s) + .s { border-top: var(--rule) solid var(--line); }
${S} main > .s + .s {
  padding-top: var(--band);
  background-image: linear-gradient(var(--bg-3) var(--band), var(--line) var(--band) calc(var(--band) + var(--rule)), transparent calc(var(--band) + var(--rule)));
  background-repeat: no-repeat;
}
${S} .s-head {
  display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  align-items: end; column-gap: var(--pad); row-gap: 12px;
  padding: var(--head-pad) var(--pad) clamp(20px, 2.4vw, 28px);
  border-bottom: var(--rule) solid var(--line);
}
${S} .s-head:not(:has(.s-intro)) { grid-template-columns: minmax(0, 1fr); }
${S} .s-title { font-size: var(--step-3); line-height: 1.05; letter-spacing: var(--display-tracking); max-width: 18em; color: var(--ink); }
${S} .s-intro { margin: 0; max-width: 56ch; font-size: var(--step-0); color: var(--ink-2); }

${S} .item-title, ${S} .node-label {
  font-family: var(--font-ui); font-size: var(--step-0); font-weight: 600; line-height: 1.35;
  letter-spacing: 0; color: var(--ink);
}
${S} .item-body, ${S} .node-body { font-size: var(--step-0); color: var(--ink-2); }

/* Small figures and tags: mono, square, one hairline */
${S} .s-steps .item-label, ${S} .node-count {
  display: inline-grid; place-items: center; min-width: 28px; height: 28px; padding: 0 7px;
  border: var(--rule) solid var(--line-2);
  font-family: var(--font-mono); font-size: var(--step--1); line-height: 1; font-variant-numeric: tabular-nums;
  color: var(--ink-2);
}

/* ---- Steps: one row of cells with shared borders ---- */
${S} .s-steps .s-items { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); }
${S} .s-steps .item {
  display: grid; grid-template-columns: auto minmax(0, 1fr); column-gap: 14px; row-gap: 6px;
  align-content: start; padding: 24px var(--pad) 32px;
}
${S} .s-steps .item + .item { border-left: var(--rule) solid var(--line); }
${S} .s-steps .item > * { grid-column: 2; }
${S} .s-steps .item-label { grid-column: 1; grid-row: 1; }
${S} .s-steps .item-title { align-self: center; }
${S} .s-steps .item-terms { font-size: var(--step-0); font-weight: 500; color: var(--ink); font-variant-numeric: tabular-nums; }
${S} .s-steps .item-body { margin-top: 4px; max-width: 46ch; }

/* ---- Points: rules in force, one per row ---- */
${S} .s-points .item {
  display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
  column-gap: var(--pad); row-gap: 4px; align-items: baseline; padding: 18px var(--pad);
}
${S} .s-points .item + .item { border-top: var(--rule) solid var(--line); }
/* Markers hang in the padding, so the heading stays one run of text (headings can hold nowrap spans) */
${S} .s-points .item-title { position: relative; padding-left: 20px; }
${S} .s-points .item-title::before { content: ""; position: absolute; left: 0; top: calc(0.675em - 4px); width: 8px; height: 8px; background: var(--accent-2); }

/* ---- Work: a table of projects with their hosts ---- */
${S} .s-work .group + .group { border-top: var(--rule) solid var(--line); }
${S} .group-label {
  margin: 0; padding: 10px var(--pad); border-bottom: var(--rule) solid var(--line); background: var(--bg-2);
  font-family: var(--font-ui); font-size: var(--step--1); font-weight: 600; line-height: 1.4; letter-spacing: 0;
  color: var(--ink-2);
}
${S} .s-work .item + .item { border-top: var(--rule) solid var(--line); }
${S} .s-work .item-link {
  display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 6fr) minmax(0, 3fr);
  column-gap: var(--pad); row-gap: 4px; align-items: baseline;
  min-height: 56px; padding: 16px var(--pad); color: var(--ink); text-decoration: none;
}
${S} .s-work .item-host {
  justify-self: end; text-align: right;
  font-family: var(--font-mono); font-size: var(--step--1); color: var(--ink-3); overflow-wrap: anywhere;
}

/* ---- Diagram: the method as a grid of cells with shared borders ---- */
${S} .diagram { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); overflow: hidden; }
${S} .node {
  display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "label count" "body body";
  align-content: start; column-gap: 12px; row-gap: 8px;
  min-height: 152px; padding: 22px var(--pad) 26px;
  box-shadow: var(--rule) 0 0 var(--line), 0 var(--rule) 0 var(--line);
}
${S} .node-label { grid-area: label; margin: 0; align-self: center; }
${S} .node-label a.link { text-decoration-color: var(--line-2); }
${S} .node-count { grid-area: count; align-self: center; }
${S} .node-body { grid-area: body; max-width: 40ch; }
${S} .node[data-node="oracle"] { background: var(--bg-2); }
${S} .node[data-node="oracle"] .node-label { position: relative; padding-left: 18px; }
${S} .node[data-node="oracle"] .node-label::before { content: ""; position: absolute; left: 0; top: calc(50% - 4px); width: 8px; height: 8px; background: var(--accent-2); }

/* ---- Install: the harness list beside its command ---- */
${S} .s-install { display: grid; grid-template-columns: minmax(168px, 3fr) minmax(0, 9fr); grid-template-areas: "head head" "tabs panel"; }
${S} .s-install > .s-head { grid-area: head; }
${S} .s-install .tabs {
  grid-area: tabs; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0; margin: 0; padding: 8px 0;
  border-right: var(--rule) solid var(--line);
}
${S} .s-install .tab {
  display: flex; align-items: center; width: 100%; min-height: 44px; padding: 0 var(--pad);
  border: 0; border-radius: 0; background: none; text-align: left;
  font-family: var(--font-ui); font-size: var(--step--1); font-weight: 500; line-height: 1.2; color: var(--ink-2);
}
${S} .s-install .tab[aria-selected="true"] { background: var(--bg-2); color: var(--ink); box-shadow: inset 2px 0 0 var(--accent-2); }
${S} .s-install .tabpanel {
  grid-area: panel; display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "code copy" "note note";
  align-content: start; min-width: 0; background: var(--bg-3);
}
${S} .s-install .code {
  grid-area: code; margin: 0; padding: var(--pad); border: 0; background: transparent;
  white-space: pre; overflow-wrap: normal; overflow-x: auto; font-size: var(--step--1); line-height: 1.8;
}
${S} .s-install .copy {
  grid-area: copy; align-self: start; margin: 12px 12px 0 0; min-height: 36px; padding: 0 12px;
  border: var(--rule) solid var(--line-2); border-radius: 0; background: var(--bg-2); color: var(--ink);
  font-family: var(--font-ui); font-size: var(--step--1); font-weight: 600;
}
${S} .s-install .note {
  grid-area: note; margin: 0; max-width: none; padding: 12px var(--pad);
  border-top: var(--rule) solid var(--line); background: var(--bg);
  font-size: var(--step--1); color: var(--ink-2);
}
${S} .s-install .tabpanel:not(:has(.code)) .note { border-top: 0; background: transparent; padding-block: var(--pad); }

/* ---- Evidence: bars and caveats side by side, every number with its denominator ---- */
${S} .s-evidence {
  display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  grid-template-areas: "head head" "bars limits" "bars link";
}
${S} .s-evidence > .s-head { grid-area: head; }
${S} .s-evidence .bars {
  grid-area: bars; align-content: center; margin: 0; gap: 8px; padding: var(--pad);
  border-right: var(--rule) solid var(--line);
}
${S} .s-evidence .bar { grid-template-columns: minmax(0, 4fr) minmax(0, 6fr) auto; column-gap: 16px; align-items: center; min-height: 44px; }
${S} .bar-label { font-family: var(--font-ui); font-size: var(--step--1); color: var(--ink); }
${S} .bar[data-highlight="true"] .bar-label { font-weight: 600; }
${S} .bar-track { height: 8px; background: var(--bg-3); box-shadow: inset 0 0 0 var(--rule) var(--line); }
${S} .bar-fill { background: var(--ink-3); }
${S} .bar[data-highlight="true"] .bar-fill { background: var(--accent-2); }
${S} .bar-value { min-width: 3ch; text-align: right; font-family: var(--font-mono); font-size: var(--step--1); font-variant-numeric: tabular-nums; color: var(--ink); }
${S} .s-evidence .limits {
  grid-area: limits; display: grid; gap: 10px; margin: 0; padding: var(--pad) var(--pad) 12px; list-style: none;
  max-width: none; font-size: var(--step--1); color: var(--ink-2);
}
${S} .s-evidence .limits li { position: relative; padding-left: 18px; }
${S} .s-evidence .limits li::before { content: ""; position: absolute; left: 0; top: 0.6em; width: 6px; height: 6px; border: var(--rule) solid var(--line-2); }
${S} .s-evidence > .link { grid-area: link; align-self: end; justify-self: start; margin: 0 var(--pad) calc(var(--pad) - 10px); font-size: var(--step--1); }

/* ---- Code: the core file under its file header ---- */
${S} .s-code .codefig { display: flex; flex-direction: column-reverse; margin: 0; }
${S} .s-code figcaption {
  margin: 0; max-width: none; padding: 12px var(--pad);
  border-bottom: var(--rule) solid var(--line); background: var(--bg-2);
  font-size: var(--step--1); color: var(--ink-2);
}
${S} .s-code .code { margin: 0; padding: var(--pad); border: 0; background: var(--bg-3); font-size: var(--step--1); line-height: 1.8; white-space: pre-wrap; overflow-wrap: anywhere; overflow-x: visible; }

/* ---- Closing: one panel row, the claim left, the actions right ---- */
${S} .s-cta {
  display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); grid-template-areas: "title actions" "intro actions";
  column-gap: var(--pad);
}
${S} .s-cta > .s-title { grid-area: title; padding: var(--head-pad) var(--pad) 0; }
${S} .s-cta > .s-intro { grid-area: intro; margin: 0; max-width: 56ch; padding: 14px var(--pad) var(--head-pad); color: var(--ink-2); }
${S} .s-cta > .actions { grid-area: actions; align-self: center; justify-self: end; margin: 0; padding: 0 var(--pad); }

/* ---- Footer: the rails run to the end ---- */
${S} .foot {
  width: var(--frame); margin-inline: auto;
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 4px 24px;
  padding: 16px var(--pad); margin-bottom: 88px; border: var(--rule) solid var(--line); border-top: 0;
}
${S} .foot-line { font-size: var(--step--1); color: var(--ink-2); }
${S} .foot-links { display: flex; flex-wrap: wrap; gap: 0; margin-right: -10px; }
${S} .foot-links .link { padding-inline: 10px; font-family: var(--font-ui); font-size: var(--step--1); color: var(--ink-2); text-decoration: none; }
${S} .motion-toggle {
  border-radius: 0; border: var(--rule) solid var(--line-2); background: var(--bg-2); color: var(--ink);
  font-family: var(--font-ui); font-size: var(--step--1);
}

${S} .code:focus-visible { outline: 2px solid var(--focus); outline-offset: -3px; }
${S} .s-install .tab:focus-visible { outline-offset: -3px; }

@media (hover: hover) and (pointer: fine) {
  ${S} .nav-links .link:hover { color: var(--ink); text-decoration: underline; }
  ${S} .theme-toggle:hover, ${S} .btn-quiet:hover, ${S} .s-install .copy:hover { background: var(--bg-3); }
  ${S} .btn-primary:hover { background: color-mix(in oklch, var(--accent) 86%, var(--ink-2)); border-color: transparent; }
  ${S} .s-work .item-link:hover { background: var(--bg-2); }
  ${S} .s-work .item-link:hover .item-title { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.2em; }
  ${S} .s-install .tab:hover { color: var(--ink); background: var(--bg-2); }
  ${S} a.link:hover { text-decoration-color: currentColor; }
  ${S} .foot-links .link:hover { color: var(--ink); text-decoration: underline; }
}

/* ---- Narrow desktop ---- */
@media (max-width: 1020px) {
  ${S} .nav-links { display: none; }
  ${S} .s-work .item-link { grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); }
  ${S} .s-work .item-host { grid-column: 2; justify-self: start; text-align: left; }
  ${S} .diagram { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  ${S} .s-evidence { grid-template-columns: minmax(0, 1fr); grid-template-areas: "head" "bars" "limits" "link"; }
  ${S} .s-evidence .bars { border-right: 0; border-bottom: var(--rule) solid var(--line); }
}

/* ---- Phone: the frame goes edge to edge, panels stack ---- */
@media (max-width: 700px) {
  ${S} { --gutter: 20px; --pad: 20px; --band: 16px; --frame: 100%; --edge: var(--pad); --nav-h: 56px; --head-pad: 32px; }
  ${S} .nav { gap: 12px; }
  ${S} .nav-links, ${S} .nav-actions .btn { display: none; }
  ${S} .s-evidence .bar { grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "label value" "track track"; row-gap: 8px; min-height: 0; padding-block: 6px; }
  ${S} .bar-label { grid-area: label; }
  ${S} .bar-value { grid-area: value; }
  ${S} .bar-track { grid-area: track; }
  ${S} main > .s, ${S} .foot { border-inline: 0; }
  ${S} .s-head, ${S} .s-head:not(:has(.s-intro)) { grid-template-columns: minmax(0, 1fr); }
  ${S} .s-steps .s-items { grid-auto-flow: row; grid-auto-columns: auto; }
  ${S} .s-steps .item + .item { border-left: 0; border-top: var(--rule) solid var(--line); }
  ${S} .s-points .item { grid-template-columns: minmax(0, 1fr); }
  ${S} .s-work .item-link { grid-template-columns: minmax(0, 1fr); }
  ${S} .s-work .item-host { grid-column: 1; }
  ${S} .diagram { grid-template-columns: minmax(0, 1fr); }
  ${S} .node { min-height: 0; box-shadow: 0 var(--rule) 0 var(--line); }
  ${S} .s-install { grid-template-columns: minmax(0, 1fr); grid-template-areas: "head" "tabs" "panel"; }
  ${S} .s-install .tabs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); padding: 0; border-right: 0; border-bottom: var(--rule) solid var(--line); }
  ${S} .s-install .tab { padding: 0 var(--pad); }
  ${S} .s-install .tabpanel { grid-template-columns: minmax(0, 1fr); grid-template-areas: "code" "copy" "note"; }
  ${S} .s-install .copy { justify-self: start; margin: 0 0 16px var(--pad); min-height: 44px; padding: 0 16px; }
  ${S} .s-cta { grid-template-columns: minmax(0, 1fr); grid-template-areas: "title" "intro" "actions"; }
  ${S} .s-cta > .s-intro { padding-bottom: 24px; }
  ${S} .s-cta > .actions { justify-self: stretch; flex-direction: column; align-items: stretch; padding-bottom: var(--head-pad); }
  ${S} .s-cta > .actions .btn { width: 100%; }
  ${S} .foot { flex-direction: column; align-items: flex-start; }
  ${S} .foot-links { margin-left: -10px; margin-right: 0; }
}
`;

export default {
  id: 'console',
  layer: 'layout',
  label: 'Console',
  summary: 'A framed, square, dense system: panels between two hairline rails with sunken gutters between them, cells with shared borders, project rows with their hosts, the harness list beside its command and the core file under its file header, for a studio that ships engineering tools.',
  origin: 'new',
  refs: [
    { name: 'Greptile', url: 'https://www.greptile.com/', what: 'A square, flat, hairline-only system with no radii and no shadows, sections as bands separated by rules, rows of cells sharing their borders, and real artefacts shown with their compact metadata (repository, file path, diff lines, a link to the source).' },
    { name: 'Macroscope', url: 'https://macroscope.com/', what: 'The product line-up set as an index of one-sentence rows (a name and the one job it does), used here for the projects and for the parts of the method, each row carrying its host or count as compact metadata.' },
  ],
  css,
} satisfies LayoutOption;
