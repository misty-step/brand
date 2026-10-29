import type { LayoutOption } from '../../../src/contract';

// Book. The page is set as a short book: a running head, a title page (the hero), then
// chapters in one reading column. Chapter numerals hang in the margin in the second ink,
// a three-square dinkus opens each chapter, the offer and the work read as contents pages
// with dot leaders, and code and the trial table break out of the measure as figures.
// Tokens only: no font families, no literal colours, no transitions (motion owns those).
const leader = 'linear-gradient(90deg, var(--ink-3) 0 2px, transparent 2px) 0 0 / 8px 2px repeat-x';

const css = String.raw`
html[data-layout="book"] {
  --page-max: 1160px;
  --gutter: clamp(20px, 5vw, 56px);
  --edge: max(var(--gutter), calc((100% - var(--page-max)) / 2));
  --radius: 0px;
  --rule: 1px;
  --nav-h: 72px;
  --b-wide: 7rem;
  --b-chapter: clamp(96px, 11vw, 168px);
  --b-tracks:
    [full-start] minmax(var(--gutter), 1fr)
    [wide-start] minmax(0, var(--b-wide))
    [col-start] min(var(--measure), 100% - 2 * var(--gutter))
    [col-end] minmax(0, var(--b-wide))
    [wide-end] minmax(var(--gutter), 1fr) [full-end];

  /* Running head: the book's title on the left, its parts on the right. */
  .nav {
    display: flex; align-items: center; gap: 28px;
    min-height: var(--nav-h);
    padding-inline: var(--edge);
    border-bottom: var(--rule) solid var(--line);
  }
  .brand { margin-right: auto; }
  .brand-name { font-size: var(--step-0); }
  .nav-links { display: flex; gap: 28px; }
  .nav-links .link {
    display: inline-flex; align-items: center; min-height: 44px;
    font-family: var(--font-ui); font-size: var(--step--1);
    color: var(--ink-2); text-decoration: none;
  }
  .nav-actions { gap: 12px; }
  .theme-toggle { border-color: transparent; background: transparent; }

  /* Ink buttons: the primary is printed in ink; the quiet one is an underlined phrase. */
  .btn { border-radius: 0; }
  .btn-primary { background: var(--ink); color: var(--bg); }
  .btn-quiet {
    border-color: transparent; padding-inline: 4px; color: var(--ink);
    text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: .22em;
  }

  /* Chapters: one column on the reading measure, with room either side for figures.
     Every section is a chapter, numbered to match the contents page. */
  main { counter-reset: chapter fig; }
  /* Chapters are opaque paper: nothing moves behind the reading column. */
  .s, .foot, .toc { display: grid; grid-template-columns: var(--b-tracks); background: var(--bg); }
  .s { padding-top: var(--b-chapter); counter-increment: chapter; }
  .s > * { grid-column: col; }
  .s::before {
    content: ""; grid-column: col; justify-self: center;
    width: 28px; height: 4px; margin-bottom: clamp(48px, 5vw, 72px);
    background: linear-gradient(90deg, var(--ink-3) 0 4px, transparent 4px 12px, var(--ink-3) 12px 16px, transparent 16px 24px, var(--ink-3) 24px 28px);
  }
  .s-title { position: relative; }
  .s-intro { margin-top: 20px; }
  .s-title::before {
    content: counter(chapter);
    margin-right: .4em;
    font-family: var(--font-mono); font-weight: 400; letter-spacing: 0;
    font-variant-numeric: tabular-nums; color: var(--accent-2);
  }
  :is(.s-steps .s-items, .s-points .s-items, .diagram, .bars) { margin-top: 40px; border-top: 2px solid var(--ink); }

  /* Contents: the renderer's section list, opted in as the page after the title page. */
  .toc { padding-top: var(--b-chapter); }
  .toc::before {
    content: "Contents"; content: "Contents" / "";
    grid-column: col; margin-bottom: 12px;
    font-family: var(--font-ui); font-size: var(--step--1); color: var(--ink-2);
  }
  .toc > ol { grid-column: col; counter-reset: toc; border-top: 2px solid var(--ink); }
  .toc li {
    counter-increment: toc;
    display: grid; grid-template-columns: 2.25rem minmax(0, 1fr); align-items: baseline;
    border-bottom: var(--rule) solid var(--line);
  }
  .toc li::before {
    content: counter(toc);
    font-family: var(--font-mono); font-variant-numeric: tabular-nums; color: var(--accent-2);
  }
  .toc a.link { min-height: 52px; padding-block: 12px; text-decoration: none; }

  /* The offer as a contents page: number, step, dot leader, then its terms. */
  .s-steps .item {
    display: grid; align-items: baseline;
    grid-template-columns: 2.25rem minmax(0, 1fr) auto;
    grid-template-areas: "label title terms" ". body body";
    padding-block: 22px 26px;
    border-bottom: var(--rule) solid var(--line);
  }
  .item-label {
    grid-area: label;
    font-family: var(--font-mono); font-variant-numeric: tabular-nums; color: var(--accent-2);
  }
  .s-steps .item-title { grid-area: title; display: flex; align-items: baseline; min-width: 0; }
  .s-steps .item-title::after {
    content: ""; flex: 1 1 0; min-width: 24px; height: 2px; margin-inline: 14px 12px;
    background: ${leader};
  }
  .item-terms { grid-area: terms; font-variant-numeric: tabular-nums; color: var(--ink); }
  .s-steps .item-body { grid-area: body; margin-top: 10px; }

  /* Commitments: a ruled list, title over its sentence. */
  .s-points .item {
    display: grid; gap: 8px;
    padding-block: 22px 24px;
    border-bottom: var(--rule) solid var(--line);
  }

  /* Work: an index. Each product runs a leader to the host where you will find it. */
  .s-work .group { margin-top: 48px; }
  .s-work .s-head + .group { margin-top: 40px; }
  .group-label {
    padding-bottom: 10px; border-bottom: 2px solid var(--ink);
    font-family: var(--font-ui); font-size: var(--step--1); font-weight: 400;
    line-height: 1.4; letter-spacing: normal; color: var(--ink-2);
  }
  .s-work .item { border-bottom: var(--rule) solid var(--line); }
  .s-work .item-link {
    display: grid; align-items: baseline;
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas: "title leader host" "body body body";
    padding-block: 18px 20px;
  }
  .s-work .item-link::after {
    content: ""; grid-area: leader; align-self: baseline;
    min-width: 24px; height: 2px; margin-inline: 14px 12px;
    background: ${leader};
  }
  .s-work .item-title {
    grid-area: title;
    font-family: var(--font-display); font-size: var(--step-1); font-weight: var(--display-weight); line-height: 1.2;
  }
  .item-host { grid-area: host; font-family: var(--font-mono); font-size: var(--step--1); color: var(--ink-2); }
  .s-work .item-body { grid-area: body; margin-top: 6px; color: var(--ink-2); }

  /* The method as an outline. Counts sit where page numbers would; the Oracle is set apart. */
  .diagram { counter-reset: node; }
  .node {
    counter-increment: node;
    display: grid; align-items: baseline;
    grid-template-columns: 2.25rem minmax(0, 1fr) auto;
    grid-template-areas: "num label count" ". body body";
    padding-block: 18px 20px;
    border-bottom: var(--rule) solid var(--line);
  }
  .node::before {
    content: counter(node); grid-area: num;
    font-family: var(--font-mono); font-variant-numeric: tabular-nums; color: var(--accent-2);
  }
  .node-label { grid-area: label; display: flex; align-items: baseline; min-width: 0; margin: 0; }
  .node:has(.node-count) .node-label::after {
    content: ""; flex: 1 1 0; min-width: 24px; height: 2px; margin-inline: 14px 12px;
    background: ${leader};
  }
  .node-count { grid-area: count; font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
  .node-body { grid-area: body; margin-top: 6px; }
  .node[data-node="oracle"] { margin-top: 28px; border-top: 2px solid var(--ink); }

  /* Install: harness names as a line of text tabs; the command breaks out as a figure. */
  .s-install .tabs { margin: 36px 0 0; gap: 4px 24px; }
  .s-install .tab {
    min-height: 44px; padding: 8px 0;
    border: 0; border-bottom: 2px solid transparent;
    background: transparent; color: var(--ink-2);
    font-family: var(--font-ui); font-size: var(--step-0);
  }
  .s-install .tab[aria-selected="true"] { background: transparent; color: var(--ink); border-bottom-color: var(--ink); }
  .tabpanel { grid-column: full; display: grid; grid-template-columns: subgrid; margin-top: 20px; }
  .tabpanel > * { grid-column: col; }
  :is(.tabpanel, .codefig) > .code { grid-column: wide; }
  .s .code { border: 0; border-top: 2px solid var(--ink); padding: clamp(20px, 2.4vw, 32px); }
  /* Commands never wrap; only their block scrolls. The core file wraps at spaces: it is prose. */
  .tabpanel .code { white-space: pre; overflow-wrap: normal; }
  .codefig .code { overflow-wrap: normal; }
  .tabpanel .copy {
    justify-self: start; margin-top: 12px; min-height: 44px; padding: 8px 0;
    border: 0; background: transparent; color: var(--ink);
    font-family: var(--font-ui); font-size: var(--step--1);
  }
  .tabpanel .copy::before { content: "[\2002"; content: "[\2002" / ""; color: var(--ink-3); }
  .tabpanel .copy::after { content: "\2002]"; content: "\2002]" / ""; color: var(--ink-3); }
  .tabpanel .note { margin-top: 8px; }

  /* Evidence: a ruled table, then its limits as notes under a short rule. */
  .bars { gap: 0; margin-bottom: 0; }
  .bar {
    grid-template-columns: minmax(0, 12rem) minmax(0, 1fr) 3rem; gap: 20px;
    padding-block: 16px; border-bottom: var(--rule) solid var(--line);
  }
  .bar-track { height: 6px; background: var(--bg-3); }
  .bar-fill { background: var(--ink-3); }
  .bar[data-highlight="true"] .bar-fill { background: var(--accent); }
  .bar-value { font-family: var(--font-mono); text-align: right; }
  .limits {
    margin: 28px 0 0; padding: 0; max-width: none;
    list-style: none; gap: 10px;
    font-size: var(--step--1);
  }
  .limits::before { content: ""; width: 4rem; margin-bottom: 6px; border-top: var(--rule) solid var(--line-2); }
  .limits li { padding-left: 1.4em; text-indent: -1.4em; }
  .limits li::before {
    content: ""; display: inline-block; width: 4px; height: 4px;
    margin-right: calc(1.4em - 4px); vertical-align: .3em; background: var(--ink-3);
  }
  .s-evidence > .link { justify-self: start; display: inline-flex; align-items: center; min-height: 44px; margin-top: 16px; }

  /* Code: a numbered figure that breaks out of the column; its caption stays on the measure. */
  .codefig { grid-column: full; display: grid; grid-template-columns: subgrid; margin-top: 36px; counter-increment: fig; }
  .codefig > * { grid-column: col; }
  .codefig figcaption { margin-top: 14px; }
  .codefig figcaption::before { content: "Fig. " counter(fig) "\2002"; font-family: var(--font-mono); color: var(--accent-2); }

  /* The closing chapter: its actions get the room a last page gives them. */
  .s-cta .actions { justify-content: flex-start; margin-top: 32px; }

  /* Colophon. */
  .foot { padding-block: var(--b-chapter) 48px; }
  .foot > * { grid-column: col; }
  .foot-line { padding-top: 24px; border-top: var(--rule) solid var(--line); font-size: var(--step--1); color: var(--ink-2); }
  .foot-links { display: flex; flex-wrap: wrap; gap: 0 24px; margin-top: 4px; }
  .foot-links .link { display: inline-flex; align-items: center; min-height: 44px; font-size: var(--step--1); color: var(--ink-2); }
  .motion-toggle { border-radius: 0; background: var(--bg); font-size: var(--step--1); }

  @media (hover: hover) and (pointer: fine) {
    .nav-links .link:hover, .foot-links .link:hover, .s-install .tab:hover { color: var(--ink); }
    .s-work .item-link:hover .item-title { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: .18em; }
    .tabpanel .copy:hover { text-decoration: underline; text-underline-offset: .22em; }
    .toc a.link:hover { text-decoration: underline; text-decoration-thickness: 1px; }
    .btn-quiet:hover { text-decoration-thickness: 2px; }
  }

  @media (min-width: 1024px) {
    .s-title::before { position: absolute; right: 100%; margin-right: 1.25rem; }
  }

  @media (max-width: 900px) {
    .nav-actions .btn { display: none; }
  }

  @media (max-width: 700px) {
    --nav-h: 60px;
    .nav { gap: 12px; }
    .nav-links { display: none; }
    .s-steps .item { grid-template-columns: 2rem minmax(0, 1fr); grid-template-areas: "label title" ". terms" ". body"; }
    .s-steps .item-title::after { display: none; }
    .item-terms { margin-top: 4px; }
    .s-work .item-link { grid-template-columns: minmax(0, 1fr); grid-template-areas: "title" "body" "host"; }
    .s-work .item-link::after { display: none; }
    .item-host { margin-top: 8px; overflow-wrap: anywhere; }
    .node { grid-template-columns: 2rem minmax(0, 1fr) auto; }
    .bar { grid-template-columns: minmax(0, 1fr) 3rem; row-gap: 10px; }
    .bar-label { grid-column: 1; }
    .bar-value { grid-column: 2; grid-row: 1; }
    .bar-track { grid-column: 1 / -1; }
    .s-install .tabs { gap: 0 20px; }
  }
}
`;

export default {
  id: 'book',
  layer: 'layout',
  label: 'Book',
  summary: 'A short book: one reading column, chapters with hanging numerals in the second ink, the offer and the work set as contents pages with dot leaders, and figures that break out of the measure, so a method-driven studio reads like its own manual.',
  origin: 'B',
  refs: [
    { name: 'pi', url: 'https://pi.dev/', what: 'A developer tool set in book typography: one centred column, bracketed text controls and a page that stays still while you read.' },
    { name: 'Earendil', url: 'https://earendil.com/', what: 'Reading pages on one narrow measure with small chrome at the edges and nothing moving behind the text.' },
    { name: 'Making Software', url: 'https://www.makingsoftware.com/', what: 'Book apparatus in place of web chrome: a contents page with dot leaders, figure numbers and pixel rules.' },
  ],
  css,
} satisfies LayoutOption;
