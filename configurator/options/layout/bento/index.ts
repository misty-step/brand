import type { LayoutOption } from '../../../src/contract';

// Bento: a centred product grid. Split section heads (claim left, explanation
// right) sit over full-width hairline boards, bottom-anchored tiles and wide
// panels that hold the real artefacts (commands, the core file, the trial bars).
// Pill controls, 12px tiles, elevation by lightness, no shadows.
// Geometry and token roles only: no families, no literal colours, no transitions
// (the motion layer owns those).
const S = 'html[data-layout="bento"]';

const css = String.raw`
${S} {
  --page-max: 1200px;
  --gutter: clamp(20px, 4vw, 48px);
  --edge: max(var(--gutter), calc((100% - var(--page-max)) / 2));
  --radius: 12px;
  --rule: 1px;
  --nav-h: 64px;
  --pill: 999px;
  --tile-pad: clamp(20px, 2.2vw, 28px);
  --tile-gap: 16px;
  --section-space: clamp(96px, 11vw, 160px);
  scroll-padding-top: calc(var(--nav-h) + 24px);
}

/* ---- Navigation: one sticky bar, one hairline under it ---- */
${S} .nav {
  position: sticky; top: 0; z-index: 40;
  display: flex; align-items: center; gap: 24px;
  min-height: var(--nav-h); padding-inline: var(--edge);
  background: var(--bg);
  border-bottom: var(--rule) solid var(--line);
}
${S} .nav-links { display: flex; align-items: center; gap: 2px; margin-left: 8px; }
${S} .nav-links .link {
  padding-inline: 14px; border-radius: var(--pill);
  font-family: var(--font-ui); font-size: var(--step--1); font-weight: 500;
  color: var(--ink-2); text-decoration: none;
}
${S} .nav-actions { margin-left: auto; gap: 8px; }
${S} .theme-toggle { border-radius: var(--pill); background: transparent; border: var(--rule) solid var(--line); color: var(--ink-2); }

/* ---- Buttons: pills ---- */
${S} .btn {
  min-height: 48px; padding: 0 22px; gap: 8px;
  border: var(--rule) solid transparent; border-radius: var(--pill);
  font-family: var(--font-ui); font-size: var(--step-0); font-weight: 560; line-height: 1.2;
  text-decoration: none;
}
${S} .btn-primary { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
${S} .btn-quiet { background: var(--bg-2); color: var(--ink); border-color: var(--line-2); }
${S} .btn-sm { min-height: 44px; padding: 0 18px; font-size: var(--step--1); }
${S} .actions { gap: 12px; }

${S} a.link { text-decoration-color: var(--line-2); text-decoration-thickness: 1px; text-underline-offset: 0.24em; }

/* ---- Section frame: centred column, split head ---- */
${S} .s { padding: var(--section-space) var(--edge) 0; }
${S} main > .s:last-child { padding-bottom: var(--section-space); }
${S} .s-head {
  display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  align-items: end; column-gap: clamp(24px, 4vw, 64px); row-gap: 16px;
  margin-bottom: clamp(40px, 5vw, 64px);
}
${S} .s-head:not(:has(.s-intro)) { grid-template-columns: minmax(0, 1fr); }
${S} .s-title { font-size: var(--step-3); line-height: 1.08; letter-spacing: var(--display-tracking); max-width: 18em; color: var(--ink); }
${S} .s-intro { margin: 0; max-width: 46ch; font-size: var(--step-0); color: var(--ink-2); }

/* One tile surface: hairline border, raised fill, no shadow, never nested */
${S} .s-work .item-link, ${S} .s-diagram .node, ${S} .s-evidence .bars, ${S} .s-evidence .limits,
${S} .s-install .tabpanel, ${S} .s-code .codefig {
  border: var(--rule) solid var(--line); border-radius: var(--radius); background: var(--bg-2);
}

${S} .item-title, ${S} .node-label {
  font-family: var(--font-ui); font-size: var(--step-1); font-weight: 600; line-height: 1.25;
  letter-spacing: 0; color: var(--ink);
}
${S} .item-body, ${S} .node-body { font-size: var(--step-0); color: var(--ink-2); }
${S} .s-steps .item-label, ${S} .node-count, ${S} .bar-value {
  font-family: var(--font-display); font-size: var(--step-3); font-weight: var(--display-weight);
  line-height: 1; letter-spacing: var(--display-tracking); font-variant-numeric: tabular-nums;
}

/* ---- Steps: one board, columns split by hairlines, the numeral as the picture ---- */
${S} .s-steps .s-items {
  display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr);
  border-block: var(--rule) solid var(--line);
}
${S} .s-steps .item {
  display: flex; flex-direction: column; gap: 8px;
  min-height: clamp(260px, 24vw, 320px);
  padding: var(--tile-pad) var(--tile-pad) calc(var(--tile-pad) + 8px);
}
${S} .s-steps .item:first-child { padding-left: 0; }
${S} .s-steps .item:last-child { padding-right: 0; }
${S} .s-steps .item + .item { border-left: var(--rule) solid var(--line); }
${S} .s-steps .item-label { margin-bottom: auto; padding-bottom: 32px; color: var(--ink-3); }
${S} .s-steps .item-terms { font-size: var(--step-0); font-weight: 600; color: var(--ink); font-variant-numeric: tabular-nums; }
${S} .s-steps .item-body { max-width: 40ch; }

/* ---- Points: an index of plain rows ---- */
${S} .s-points .s-items { border-top: var(--rule) solid var(--line); }
${S} .s-points .item {
  display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  column-gap: clamp(24px, 4vw, 64px); row-gap: 6px; align-items: baseline;
  padding: 24px 0 26px; border-bottom: var(--rule) solid var(--line);
}
${S} .s-points .item-body { max-width: 52ch; }

/* ---- Work: bottom-anchored tiles; a three-project group becomes one large tile beside two ---- */
${S} .s-work {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: var(--tile-gap); row-gap: clamp(32px, 4vw, 48px); align-items: start;
}
${S} .s-work > .s-head, ${S} .s-work > .group { grid-column: 1 / -1; }
${S} .s-work > .group:has(.s-items > .item:only-child) { grid-column: auto; }
${S} .s-work > .s-head { margin-bottom: 0; }
${S} .group-label {
  margin: 0 0 12px; font-family: var(--font-ui); font-size: var(--step--1); font-weight: 500;
  line-height: 1.4; letter-spacing: 0; color: var(--ink-2);
}
${S} .s-work .s-items { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: var(--tile-gap); }
${S} .s-work .s-items:has(> .item:nth-child(3):last-child) { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: minmax(200px, auto); }
${S} .s-work .s-items:has(> .item:nth-child(3):last-child) > .item:first-child { grid-row: span 2; }
${S} .s-work .item { display: flex; min-width: 0; }
${S} .s-work .item-link {
  display: flex; flex-direction: column; gap: 6px; width: 100%;
  min-height: 200px; padding: var(--tile-pad); color: var(--ink); text-decoration: none;
}
${S} .s-work .item-host {
  order: -1; margin-bottom: auto; padding-bottom: 40px;
  font-family: var(--font-ui); font-size: var(--step--1); font-variant-numeric: tabular-nums; color: var(--ink-3); overflow-wrap: anywhere;
}
${S} .s-work .item-body { max-width: 44ch; }
${S} .s-work .s-items:has(> .item:nth-child(3):last-child) > .item:first-child .item-title {
  font-family: var(--font-display); font-size: var(--step-3); font-weight: var(--display-weight);
  line-height: 1.05; letter-spacing: var(--display-tracking);
}

/* ---- Diagram: the method in three rows (always loaded, on demand, the outside check) ---- */
${S} .diagram { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: var(--tile-gap); }
${S} .node {
  grid-column: span 2;
  display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-rows: 1fr auto;
  grid-template-areas: "label count" "body body";
  align-items: end; column-gap: 16px; row-gap: 6px;
  min-height: 188px; padding: var(--tile-pad);
}
${S} .node[data-node="core"]:has(+ .node[data-node="misty"]),
${S} .node[data-node="core"] + .node[data-node="misty"] { grid-column: span 3; }
${S} .node[data-node="oracle"] {
  grid-column: 1 / -1; min-height: 0;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr) auto; grid-template-rows: auto;
  grid-template-areas: "label body count"; align-items: baseline; column-gap: clamp(24px, 4vw, 64px);
  border-color: var(--line-2);
}
${S} .node-count { grid-area: count; align-self: start; color: var(--ink-2); }
${S} .node-label { grid-area: label; margin: 0; }
${S} .node-label a.link { text-decoration-color: var(--line-2); }
${S} .node-body { grid-area: body; max-width: 44ch; }
${S} .node[data-node="oracle"] .node-label { display: flex; align-items: center; gap: 12px; }
${S} .node[data-node="oracle"] .node-label::before {
  content: ""; flex: none; width: 10px; height: 10px; border-radius: 3px; background: var(--accent-2);
}

/* ---- Install: a segmented harness switch over one wide command panel ---- */
${S} .s-install .tabs {
  display: flex; flex-wrap: wrap; gap: 4px; width: fit-content; max-width: 100%;
  margin: 0 0 var(--tile-gap); padding: 4px;
  border: var(--rule) solid var(--line); border-radius: calc(var(--radius) + 4px); background: var(--bg-2);
}
${S} .s-install .tab {
  min-height: 40px; padding: 0 16px; border: var(--rule) solid transparent;
  border-radius: var(--radius); background: transparent; color: var(--ink-2);
  font-family: var(--font-ui); font-size: var(--step--1); font-weight: 500; line-height: 1.2;
}
${S} .s-install .tab[aria-selected="true"] { background: var(--bg); color: var(--ink); border-color: var(--line-2); }
${S} .s-install .tabpanel {
  display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "code copy" "note note";
  overflow: hidden; background: var(--bg-3);
}
${S} .s-install .code {
  grid-area: code; margin: 0; padding: clamp(20px, 2.4vw, 32px);
  border: 0; background: transparent; white-space: pre; overflow-wrap: normal; overflow-x: auto;
  font-size: var(--step--1); line-height: 1.8;
}
${S} .s-install .copy {
  grid-area: copy; align-self: start; margin: 14px 14px 0 0; min-height: 40px; padding: 0 16px;
  border: var(--rule) solid var(--line-2); border-radius: var(--pill); background: var(--bg-2); color: var(--ink);
  font-family: var(--font-ui); font-size: var(--step--1); font-weight: 500;
}
${S} .s-install .note {
  grid-area: note; margin: 0; max-width: none; padding: 14px clamp(20px, 2.4vw, 32px);
  border-top: var(--rule) solid var(--line); background: var(--bg-2);
  font-size: var(--step--1); color: var(--ink-2);
}
${S} .s-install .tabpanel:not(:has(.code)) .note { border-top: 0; padding-block: 24px; }

/* ---- Evidence: a bars tile beside a limits tile ---- */
${S} .s-evidence { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: var(--tile-gap); }
${S} .s-evidence > .s-head { grid-column: 1 / -1; }
${S} .s-evidence .bars {
  grid-column: 1 / span 7; grid-row: span 2; align-content: center;
  margin: 0; gap: 28px; padding: calc(var(--tile-pad) + 8px) var(--tile-pad);
}
${S} .s-evidence .bar {
  grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "label value" "track track";
  row-gap: 10px; column-gap: 16px; align-items: baseline;
}
${S} .bar-label { grid-area: label; font-family: var(--font-ui); font-size: var(--step-0); color: var(--ink); }
${S} .bar[data-highlight="true"] .bar-label { font-weight: 600; }
${S} .bar-value { grid-area: value; color: var(--ink-2); }
${S} .bar[data-highlight="true"] .bar-value { color: var(--ink); }
${S} .bar-track { grid-area: track; height: 10px; border-radius: var(--pill); background: var(--bg-3); overflow: hidden; }
${S} .bar-fill { border-radius: var(--pill); background: var(--ink-3); }
${S} .bar[data-highlight="true"] .bar-fill { background: var(--accent-2); }
${S} .s-evidence .limits {
  grid-column: 8 / -1; margin: 0; padding: var(--tile-pad); list-style: none;
  display: grid; gap: 0; max-width: none; color: var(--ink-2); font-size: var(--step--1);
}
${S} .s-evidence .limits li { position: relative; padding: 10px 0 10px 18px; border-top: var(--rule) solid var(--line); }
${S} .s-evidence .limits li:first-child { border-top: 0; padding-top: 0; }
${S} .s-evidence .limits li::before {
  content: ""; position: absolute; left: 0; top: calc(10px + 0.62em); width: 6px; height: 6px; border-radius: 50%; background: var(--ink-3);
}
${S} .s-evidence .limits li:first-child::before { top: 0.62em; }
${S} .s-evidence > .link { grid-column: 8 / -1; align-self: start; justify-self: start; font-size: var(--step--1); }

/* ---- Code: the core file as one wide panel ---- */
${S} .s-code .codefig { display: grid; grid-template-columns: minmax(0, 1fr); overflow: hidden; background: var(--bg-3); }
${S} .s-code .code {
  margin: 0; padding: clamp(20px, 3vw, 40px); border: 0; background: transparent;
  font-size: var(--step--1); line-height: 1.8; max-width: none;
}
${S} .s-code figcaption {
  margin: 0; max-width: none; padding: 14px clamp(20px, 3vw, 40px);
  border-top: var(--rule) solid var(--line); background: var(--bg-2);
  font-size: var(--step--1); color: var(--ink-2);
}

/* ---- Closing: one centred statement, the claim and then its terms ---- */
${S} .s-cta { text-align: center; }
${S} .s-cta .s-title { margin-inline: auto; max-width: 16em; font-size: var(--step-3); line-height: 1.08; letter-spacing: var(--display-tracking); color: var(--ink); }
${S} .s-cta .s-intro { margin: 20px auto 0; max-width: 46ch; font-size: var(--step-1); line-height: 1.4; color: var(--ink-2); }
${S} .s-cta .actions { justify-content: center; margin-top: 40px; letter-spacing: 0; }

/* ---- Footer ---- */
${S} .foot {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 32px;
  padding: 28px var(--edge) 88px; border-top: var(--rule) solid var(--line);
}
${S} .foot-line { font-size: var(--step--1); color: var(--ink-2); }
${S} .foot-links { display: flex; flex-wrap: wrap; gap: 0 4px; margin-right: -10px; }
${S} .foot-links .link { padding-inline: 10px; font-family: var(--font-ui); font-size: var(--step--1); color: var(--ink-2); text-decoration: none; }
${S} .motion-toggle {
  border-radius: var(--pill); border: var(--rule) solid var(--line-2); padding-inline: 18px;
  background: var(--bg-2); color: var(--ink); font-family: var(--font-ui); font-size: var(--step--1);
}

/* ---- Focus stays visible inside clipped panels ---- */
${S} .code:focus-visible { outline: 2px solid var(--focus); outline-offset: -4px; }
${S} .s-install .tab:focus-visible, ${S} .s-install .copy:focus-visible { outline-offset: 2px; }

/* ---- Hover, fine pointers only. Static states; motion owns any transition. ---- */
@media (hover: hover) and (pointer: fine) {
  ${S} .nav-links .link:hover { color: var(--ink); background: var(--bg-2); }
  ${S} .theme-toggle:hover { color: var(--ink); border-color: var(--line-2); }
  ${S} .btn-quiet:hover { background: var(--bg-3); }
  ${S} .btn-primary:hover { background: color-mix(in oklch, var(--accent) 86%, var(--ink-2)); border-color: transparent; }
  ${S} .s-work .item-link:hover { border-color: var(--line-2); }
  ${S} .s-work .item-link:hover .item-title { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.2em; }
  ${S} .s-install .tab:hover { color: var(--ink); }
  ${S} .s-install .copy:hover { border-color: var(--ink-3); }
  ${S} a.link:hover { text-decoration-color: currentColor; }
  ${S} .foot-links .link:hover { color: var(--ink); text-decoration: underline; }
}

/* ---- Narrow desktop: the evidence tiles stack, the method keeps two rows of halves ---- */
@media (max-width: 1020px) {
  ${S} .nav-links { display: none; }
  ${S} .s-evidence .bars, ${S} .s-evidence .limits, ${S} .s-evidence > .link { grid-column: 1 / -1; grid-row: auto; }
  ${S} .node, ${S} .node[data-node="core"]:has(+ .node[data-node="misty"]), ${S} .node[data-node="core"] + .node[data-node="misty"] { grid-column: span 3; }
  ${S} .node[data-node="oracle"] { grid-column: 1 / -1; }
}

/* ---- Phone: its own composition, one column, the nav on one row ---- */
@media (max-width: 700px) {
  ${S} { --gutter: 20px; --nav-h: 60px; --tile-pad: 20px; --tile-gap: 12px; --section-space: 88px; }
  ${S} .nav { gap: 12px; }
  ${S} .nav-links, ${S} .nav-actions .btn { display: none; }
  ${S} .s-head, ${S} .s-head:not(:has(.s-intro)) { grid-template-columns: minmax(0, 1fr); margin-bottom: 32px; }
  ${S} .s-steps .s-items { grid-auto-flow: row; grid-auto-columns: auto; }
  ${S} .s-steps .item, ${S} .s-steps .item:first-child, ${S} .s-steps .item:last-child { min-height: 0; padding: 24px 0 28px; }
  ${S} .s-steps .item + .item { border-left: 0; border-top: var(--rule) solid var(--line); }
  ${S} .s-steps .item-label { margin-bottom: 8px; padding-bottom: 0; }
  ${S} .s-points .item { grid-template-columns: minmax(0, 1fr); padding: 20px 0 22px; }
  ${S} .s-work { grid-template-columns: minmax(0, 1fr); }
  ${S} .s-work > .group:has(.s-items > .item:only-child) { grid-column: 1 / -1; }
  ${S} .s-work .s-items:has(> .item:nth-child(3):last-child) { grid-template-columns: minmax(0, 1fr); grid-auto-rows: auto; }
  ${S} .s-work .s-items:has(> .item:nth-child(3):last-child) > .item:first-child { grid-row: auto; }
  ${S} .s-work .s-items:has(> .item:nth-child(3):last-child) > .item:first-child .item-title {
    font-family: var(--font-ui); font-size: var(--step-1); font-weight: 600; line-height: 1.25; letter-spacing: 0;
  }
  ${S} .s-work .item-link { min-height: 0; }
  ${S} .s-work .item-host { padding-bottom: 20px; }
  ${S} .diagram { grid-template-columns: minmax(0, 1fr); }
  ${S} .node, ${S} .node[data-node="core"]:has(+ .node[data-node="misty"]), ${S} .node[data-node="core"] + .node[data-node="misty"], ${S} .node[data-node="oracle"] {
    grid-column: 1 / -1; min-height: 0;
    grid-template-columns: minmax(0, 1fr) auto; grid-template-rows: auto; grid-template-areas: "label count" "body body"; align-items: end;
  }
  ${S} .s-install .tabs { display: grid; grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); width: auto; }
  ${S} .s-install .tab { min-height: 44px; padding: 0 10px; }
  ${S} .s-install .tabpanel { grid-template-columns: minmax(0, 1fr); grid-template-areas: "code" "copy" "note"; }
  ${S} .s-install .code { padding: 18px 18px 8px; }
  ${S} .s-install .copy { justify-self: start; margin: 0 0 16px 18px; min-height: 44px; }
  ${S} .s-install .note { padding-inline: 18px; }
  ${S} .s-evidence .bars { padding: 24px 20px; gap: 24px; }
  ${S} .s-code .code { padding: 20px 18px; }
  ${S} .s-code figcaption { padding-inline: 18px; }
  ${S} .s-cta { text-align: left; }
  ${S} .s-cta .s-title, ${S} .s-cta .s-intro { margin-inline: 0; }
  ${S} .s-cta .actions { flex-direction: column; align-items: stretch; }
  ${S} .s-cta .actions .btn { width: 100%; }
  ${S} .foot { flex-direction: column; align-items: flex-start; padding-top: 24px; }
  ${S} .foot-links { margin-left: -10px; margin-right: 0; }
}
`;

export default {
  id: 'bento',
  layer: 'layout',
  label: 'Bento',
  summary: 'A centred product grid of hairline boards and bottom-anchored tiles, so the real artefacts (the priced steps, the projects, the install commands, the core file, the trial) read as product surfaces instead of marketing cards.',
  origin: 'new',
  refs: [
    { name: 'Linear', url: 'https://linear.app/', what: 'The section grammar (a two-line claim on the left, a short grey paragraph on the right, then a full-width panel), a three-column board divided only by hairlines, pill buttons with 12px panels, elevation by lightness steps instead of shadows, and a centred closing statement.' },
    { name: 'Vercel', url: 'https://vercel.com/', what: 'The "Recently shipped" bento of one large tile beside two stacked ones with titles anchored to the tile foot, hairline borders with no shadow, a twelve-column grid, and a sticky 64px bar with one hairline under it.' },
  ],
  css,
} satisfies LayoutOption;
