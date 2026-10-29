import type { LayoutOption } from '../../../src/contract';

// Ledger. The page is a specification sheet: every section is a ruled sheet with a letter
// (A, B, C), every row and cell carries a coordinate (A1, A2), field names sit in a key column
// beside their values, and the contents list becomes the sheet index. Hairlines appear only
// where they separate real cells. Sheets are opaque so coordinates in --accent-2 stay legible
// over any motion field. Tokens only: no font families, no literal colours, no transitions.
const css = String.raw`
html[data-layout="ledger"] {
  --page-max: 1440px;
  --gutter: clamp(16px, 2.6vw, 40px);
  --edge: max(var(--gutter), calc((100% - var(--page-max)) / 2));
  --radius: 0px;
  --rule: 1px;
  --nav-h: 64px;
  --l-ref: 8rem;
  --l-pad: clamp(16px, 1.7vw, 26px);
  --l-gap: clamp(72px, 9vw, 136px);
  --l-sheet: min(100% - 2 * var(--gutter), var(--page-max));
  --l-cell: var(--rule) solid var(--line);
  --l-frame: var(--rule) solid var(--line-2);

  /* Header: one ruled row of cells, brand, parts, actions. */
  .nav {
    display: flex; align-items: stretch;
    min-height: var(--nav-h);
    padding-inline: var(--edge);
    border-bottom: var(--l-frame);
  }
  .brand { padding-right: var(--l-pad); border-right: var(--l-cell); }
  .brand-name { font-size: var(--step-0); }
  .nav-links { display: flex; }
  .nav-links .link {
    min-height: 100%; padding-inline: var(--l-pad);
    border-right: var(--l-cell);
    font-family: var(--font-ui); font-size: var(--step--1);
    color: var(--ink-2); text-decoration: none;
  }
  .nav-actions { margin-left: auto; padding-left: var(--l-pad); gap: 12px; border-left: var(--l-cell); }
  .theme-toggle { background: transparent; border-color: var(--line-2); }
  .btn { border-radius: 0; }
  .btn-quiet { border-color: var(--line-2); color: var(--ink); }
  .motion-toggle { border-radius: 0; background: var(--bg); font-size: var(--step--1); }

  /* Shared cell vocabulary. */
  :is(.s-head, .s-cta)::before,
  :is(.s-points .item, .s-work .item-link, .node, .bar)::before,
  .s-steps .item-label,
  .toc a.link::before,
  .limits li::before {
    font-family: var(--font-mono); font-variant-numeric: tabular-nums;
    line-height: 1.3; color: var(--accent-2);
  }
  .tabpanel::before, .tabpanel::after, .s-install .tabs::before, .codefig::before, .codefig::after, .s-evidence > .link::before {
    font-family: var(--font-ui); font-size: var(--step--1); line-height: 1.4; color: var(--ink-2);
  }

  /* Sheets: opaque ruled boxes on the ground, lettered in order. */
  main { counter-reset: sheet; padding-bottom: var(--l-gap); }
  .s, .toc, .foot { width: var(--l-sheet); margin: var(--l-gap) auto 0; background: var(--bg); }
  .s {
    display: grid; grid-template-columns: var(--l-ref) minmax(0, 1fr);
    border: var(--l-frame);
    counter-increment: sheet; counter-reset: row;
  }
  .s > * { grid-column: 1 / -1; }

  /* Sheet head: letter | title | intro. */
  .s-head {
    display: grid; grid-template-columns: var(--l-ref) minmax(0, 7fr) minmax(0, 5fr);
    border-bottom: var(--l-frame);
  }
  .s-head::before, .s-cta::before {
    content: counter(sheet, upper-alpha);
    grid-column: 1; grid-row: 1 / span 2;
    padding: var(--l-pad); border-right: var(--l-cell);
    font-size: var(--step-1);
  }
  .s-title { grid-column: 2; padding: calc(var(--l-pad) * 2.5) var(--l-pad) var(--l-pad); }
  .s-head:not(:has(.s-intro)) .s-title { grid-column: 2 / -1; }
  .s-intro { grid-column: 3; grid-row: 1; align-self: end; margin: 0; padding: var(--l-pad); }

  /* Steps: ref | step | terms | description. */
  .s-steps { grid-template-columns: var(--l-ref) minmax(0, 3fr) minmax(0, 3fr) minmax(0, 6fr); }
  :is(.s-steps, .s-points, .s-work) > .s-items, .s-work > .group, .s-work .s-items, .s-work .item, .s-work .item-link,
  :is(.s-steps, .s-points) .item {
    grid-column: 1 / -1; display: grid; grid-template-columns: subgrid;
  }
  :is(.s-steps, .s-points, .s-work) .item + .item { border-top: var(--l-cell); }
  .s-steps .item > *, .s-points .item > *, .s-work .item-link > *, .s-points .item::before, .s-work .item-link::before { padding: var(--l-pad); }
  .s-steps .item-label { grid-column: 1; border-right: var(--l-cell); }
  .s-steps .item-label::before { content: counter(sheet, upper-alpha); }
  .s-steps .item-title { grid-column: 2; }
  .item-terms { grid-column: 3; border-left: var(--l-cell); color: var(--ink); font-variant-numeric: tabular-nums; }
  .s-steps .item-body { grid-column: 4; border-left: var(--l-cell); }

  /* Commitments: ref | commitment | what it means. */
  .s-points { grid-template-columns: var(--l-ref) minmax(0, 5fr) minmax(0, 7fr); }
  .s-points .item, .s-work .item, .node, .bar { counter-increment: row; }
  .s-points .item::before, .s-work .item-link::before, .node::before, .bar::before { content: counter(sheet, upper-alpha) counter(row); }
  .s-points .item::before { grid-column: 1; border-right: var(--l-cell); }
  .s-points .item-title { grid-column: 2; }
  .s-points .item-body { grid-column: 3; border-left: var(--l-cell); }

  /* Work: a register. Each group is a category row; each product a row that is its link. */
  .s-work { grid-template-columns: var(--l-ref) minmax(0, 3fr) minmax(0, 5fr) minmax(0, 4fr); }
  .group-label {
    grid-column: 1 / -1; padding: 10px var(--l-pad);
    border-bottom: var(--l-cell); background: var(--bg-2);
    font-family: var(--font-ui); font-size: var(--step--1); font-weight: 400;
    line-height: 1.4; letter-spacing: normal; color: var(--ink-2);
  }
  .s-work .group + .group .group-label { border-top: var(--l-cell); }
  .s-work .item-link::before { grid-column: 1; border-right: var(--l-cell); }
  .s-work .item-title { grid-column: 2; font-family: var(--font-display); font-size: var(--step-1); font-weight: var(--display-weight); line-height: 1.2; }
  .s-work .item-body { grid-column: 3; border-left: var(--l-cell); color: var(--ink-2); }
  .item-host { grid-column: 4; border-left: var(--l-cell); font-family: var(--font-mono); font-size: var(--step--1); color: var(--ink-2); overflow-wrap: anywhere; }

  /* The method as a labelled grid of cells, each with its coordinate and count. */
  .diagram { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .node {
    display: grid; align-content: start; grid-template-columns: auto minmax(0, 1fr) auto; column-gap: 14px;
    min-height: 9.5rem; padding: var(--l-pad);
    border-left: var(--l-cell);
  }
  .node:nth-child(3n + 1) { border-left: 0; }
  .node:nth-child(n + 4) { border-top: var(--l-cell); }
  .node::before { grid-column: 1; grid-row: 1; }
  .node-label { grid-column: 2; grid-row: 1; margin: 0; font-size: var(--step-1); line-height: 1.25; }
  .node-count { grid-column: 3; grid-row: 1; font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
  .node-body { grid-column: 2 / -1; margin-top: 10px; }
  .node[data-node="oracle"] { background: var(--bg-2); }

  /* Install: key | value rows. Harness, Command, Note. */
  .s-install .tabs {
    position: relative; display: flex; flex-wrap: wrap;
    margin: 0; gap: 0; padding-left: var(--l-ref);
    border-bottom: var(--l-cell);
  }
  .s-install .tabs::before {
    content: "Harness"; content: "Harness" / "";
    position: absolute; inset: 0 auto 0 0; width: var(--l-ref);
    padding: 12px var(--l-pad); border-right: var(--l-cell);
  }
  .s-install .tab {
    min-height: 48px; padding: 10px var(--l-pad);
    border: 0; border-right: var(--l-cell);
    background: transparent; color: var(--ink-2);
    font-family: var(--font-ui); font-size: var(--step--1);
  }
  .s-install .tab[aria-selected="true"] { background: var(--accent); color: var(--accent-ink); }
  .s-install .tab:focus-visible { outline-offset: -4px; }
  .tabpanel { display: grid; grid-template-columns: var(--l-ref) minmax(0, 1fr) auto; }
  .tabpanel:has(.code)::before { content: "Command"; content: "Command" / ""; grid-column: 1; grid-row: 1; padding: var(--l-pad); border-right: var(--l-cell); }
  .tabpanel::after { content: "Note"; content: "Note" / ""; grid-column: 1; grid-row: 2; padding: var(--l-pad); border-right: var(--l-cell); border-top: var(--l-cell); }
  .tabpanel .code { grid-column: 2; grid-row: 1; margin: 0; border: 0; padding: var(--l-pad); }
  .tabpanel .copy {
    grid-column: 3; grid-row: 1; align-self: stretch; margin: 0; min-width: 7rem;
    border: 0; border-left: var(--l-cell); background: transparent;
    font-family: var(--font-ui); font-size: var(--step--1);
  }
  .tabpanel .note { grid-column: 2 / -1; grid-row: 2; margin: 0; max-width: none; padding: var(--l-pad); border-top: var(--l-cell); }
  .tabpanel:not(:has(.code))::after, .tabpanel:not(:has(.code)) .note { grid-row: 1; border-top: 0; }

  /* Evidence: ref | arm | bar | passed, then numbered notes and the source row. */
  .bars {
    display: grid; grid-template-columns: var(--l-ref) minmax(0, 13rem) minmax(0, 1fr) 6rem;
    margin: 0; gap: 0;
  }
  .bar { grid-column: 1 / -1; grid-template-columns: subgrid; gap: 0; align-items: stretch; }
  .bar + .bar { border-top: var(--l-cell); }
  .bar::before { grid-column: 1; padding: var(--l-pad); border-right: var(--l-cell); }
  .bar-label { grid-column: 2; padding: var(--l-pad); }
  .bar-track { grid-column: 3; align-self: center; height: 10px; margin-inline: var(--l-pad); background: var(--bg-3); box-shadow: inset 0 0 0 var(--rule) var(--line); }
  .bar-fill { background: var(--ink-3); }
  .bar[data-highlight="true"] .bar-fill { background: var(--accent); }
  .bar-value { grid-column: 4; padding: var(--l-pad); border-left: var(--l-cell); font-family: var(--font-mono); text-align: right; }
  .limits {
    margin: 0; padding: 0; max-width: none; list-style: none; gap: 0;
    border-top: var(--l-frame); counter-reset: note;
    font-size: var(--step--1);
  }
  .limits li {
    position: relative; counter-increment: note;
    padding: 14px var(--l-pad) 14px calc(var(--l-ref) + var(--l-pad));
  }
  .limits li + li { border-top: var(--l-cell); }
  .limits li::before {
    content: "N" counter(note);
    position: absolute; inset: 0 auto 0 0; width: var(--l-ref);
    padding: 14px var(--l-pad); border-right: var(--l-cell);
  }
  .s-evidence > .link {
    position: relative; grid-column: 2 / -1;
    padding: 10px var(--l-pad); border-top: var(--l-frame);
  }
  .s-evidence > .link::before {
    content: "Source"; content: "Source" / "";
    position: absolute; top: -1px; bottom: 0; right: 100%; width: var(--l-ref);
    display: flex; align-items: center; padding-inline: var(--l-pad);
    border-top: var(--l-frame); border-right: var(--l-cell);
  }

  /* Code: a sheet figure, source row first, then the lines. */
  .codefig { display: grid; grid-template-columns: var(--l-ref) minmax(0, 1fr); margin: 0; }
  .codefig::before { content: "Source"; content: "Source" / ""; grid-column: 1; grid-row: 1; padding: var(--l-pad); border-right: var(--l-cell); border-bottom: var(--l-cell); }
  .codefig::after { content: "Lines"; content: "Lines" / ""; grid-column: 1; grid-row: 2; padding: var(--l-pad); border-right: var(--l-cell); }
  .codefig figcaption { grid-column: 2; grid-row: 1; margin: 0; max-width: none; padding: var(--l-pad); border-bottom: var(--l-cell); }
  .codefig .code { grid-column: 2; grid-row: 2; margin: 0; border: 0; padding: var(--l-pad); }

  /* Closing sheet: letter | title | terms and actions. */
  .s-cta { grid-template-columns: var(--l-ref) minmax(0, 7fr) minmax(0, 5fr); }
  .s-cta > .s-title { grid-column: 2; grid-row: 1 / span 2; }
  .s-cta > .s-intro { grid-column: 3; grid-row: 1; align-self: end; border-left: var(--l-cell); }
  .s-cta > .actions { grid-column: 3; grid-row: 2; margin: 0; padding: 0 var(--l-pad) var(--l-pad); border-left: var(--l-cell); }

  /* Index: the contents list as lettered cells matching the sheets. */
  .toc { display: block; }
  .toc > ol { display: flex; flex-wrap: wrap; gap: var(--rule); border: var(--l-frame); background: var(--line); counter-reset: idx; }
  .toc li { flex: 1 1 14rem; counter-increment: idx; background: var(--bg); }
  .toc a.link {
    display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: baseline; gap: 14px;
    width: 100%; min-height: 64px; padding: var(--l-pad);
    text-decoration: none;
  }
  .toc a.link::before { content: counter(idx, upper-alpha); }
  .toc a.link:focus-visible { outline-offset: -4px; }

  /* Footer: the last ruled row. */
  .foot {
    display: flex; flex-wrap: wrap; align-items: stretch;
    border: var(--l-frame); margin-bottom: 40px;
  }
  .foot-line { display: flex; align-items: center; margin-right: auto; padding: 12px var(--l-pad); font-size: var(--step--1); color: var(--ink-2); }
  .foot-links { display: flex; flex-wrap: wrap; }
  .foot-links .link { padding-inline: var(--l-pad); border-left: var(--l-cell); font-size: var(--step--1); color: var(--ink-2); text-decoration: none; }

  @media (hover: hover) and (pointer: fine) {
    .nav-links .link:hover, .foot-links .link:hover, .s-install .tab:hover { color: var(--ink); }
    .s-work .item-link:hover, .toc a.link:hover { background: var(--bg-2); }
    .s-install .tab[aria-selected="true"]:hover { color: var(--accent-ink); }
    .btn-quiet:hover, .tabpanel .copy:hover { border-color: var(--ink); }
  }

  @media (max-width: 900px) {
    .s-head { grid-template-columns: var(--l-ref) minmax(0, 1fr); }
    .s-intro { grid-column: 2; grid-row: 2; align-self: start; padding-top: 0; }
    .s-head:not(:has(.s-intro)) .s-title { grid-column: 2; }
    .diagram { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .node:nth-child(3n + 1) { border-left: var(--l-cell); }
    .node:nth-child(odd) { border-left: 0; }
    .node:nth-child(n + 3) { border-top: var(--l-cell); }
  }

  @media (max-width: 700px) {
    --l-ref: 3.5rem;
    --nav-h: 60px;
    .nav-links, .nav-actions .btn { display: none; }
    .s-steps, .s-points, .s-work { grid-template-columns: var(--l-ref) minmax(0, 1fr); }
    .s-steps .item > :not(.item-label), .s-points .item > *, .s-work .item-link > * { grid-column: 2; border-left: 0; }
    .s-steps .item-label, .s-points .item::before, .s-work .item-link::before { grid-row: 1 / span 3; }
    .s-steps .item > :not(.item-label), .s-points .item > *, .s-work .item-link > * { padding-block: 6px; }
    .s-steps .item > .item-title, .s-points .item > .item-title, .s-work .item-link > .item-title { padding-top: var(--l-pad); }
    :is(.s-steps .item, .s-points .item, .s-work .item-link) > :last-child { padding-bottom: var(--l-pad); }
    .diagram { grid-template-columns: minmax(0, 1fr); }
    .node, .node:nth-child(3n + 1), .node:nth-child(odd) { border-left: 0; }
    .node + .node { border-top: var(--l-cell); }
    .node { min-height: 0; }
    .s-install .tabs { padding-left: 0; }
    .s-install .tabs::before, .tabpanel::before, .tabpanel::after, .codefig::before, .codefig::after, .s-evidence > .link::before { display: none; }
    .tabpanel { grid-template-columns: minmax(0, 1fr) auto; }
    .tabpanel .code { grid-column: 1; }
    .tabpanel .copy { grid-column: 2; min-width: 5.5rem; }
    .tabpanel .note { grid-column: 1 / -1; }
    .codefig { grid-template-columns: minmax(0, 1fr); }
    .codefig figcaption, .codefig .code { grid-column: 1; }
    .s-evidence > .link { grid-column: 1 / -1; }
    .bars { grid-template-columns: var(--l-ref) minmax(0, 1fr) 4rem; }
    .bar-label { grid-column: 2; grid-row: 1; }
    .bar-value { grid-column: 3; grid-row: 1; }
    .bar::before { grid-row: 1 / span 2; }
    .bar-track { grid-column: 2 / -1; grid-row: 2; margin: 0 var(--l-pad) var(--l-pad); }
    .limits li { padding-left: calc(var(--l-ref) + var(--l-pad)); }
    .s-cta { grid-template-columns: var(--l-ref) minmax(0, 1fr); }
    .s-cta::before { grid-row: 1 / span 3; }
    .s-cta > .s-title { grid-row: 1; }
    .s-cta > .s-intro { grid-column: 2; grid-row: 2; padding-top: 0; border-left: 0; }
    .s-cta > .actions { grid-column: 2; grid-row: 3; border-left: 0; }
    .foot { padding-bottom: 0 !important; margin-bottom: 88px; }
    .foot-line { width: 100%; }
    .foot-links { width: 100%; border-top: var(--l-cell); }
    .foot-links .link:first-child { border-left: 0; }
  }
}
`;

export default {
  id: 'ledger',
  layer: 'layout',
  label: 'Ledger',
  summary: 'A specification sheet: each section is a lettered, ruled sheet, every row and cell carries a coordinate, field names sit in a key column beside their values and the contents become the sheet index, which suits a studio that prices every step and shows its record.',
  origin: 'new',
  refs: [
    { name: 'Brass Hands', url: 'https://dribbble.com/brasshands', what: 'Spec-sheet comps: labelled rows with field names beside their values, unit numbers and capability tables, and pages held inside a hairline frame. The status and mission language is left behind.' },
    { name: 'Cloudflare', url: 'https://www.cloudflare.com/', what: 'Below the hero, hairline cell borders frame every section, so the page reads as one ruled structure rather than floating cards.' },
  ],
  css,
} satisfies LayoutOption;
