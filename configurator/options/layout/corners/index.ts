import type { LayoutOption } from '../../../src/contract';

// Corners. An immersive canvas: no panels, no page frame. Chrome retreats to the corners of
// the viewport, and on wide screens every section is a full-height scene with a display-size
// title in one corner and its content in the opposite one, alternating down the page, so a
// motion field behind the page shows through the open middle. Text sits only in --ink and
// --ink-2, the two inks every palette keeps legal over every field colour.
// Tokens only: no font families, no literal colours, no transitions (motion owns those).
const css = String.raw`
html[data-layout="corners"] {
  --page-max: 1600px;
  --gutter: clamp(20px, 4.4vw, 64px);
  --edge: max(var(--gutter), calc((100% - var(--page-max)) / 2));
  --radius: 24px;
  --rule: 1px;
  --nav-h: 88px;
  --c-scene: clamp(88px, 9vw, 144px);
  --c-gap: clamp(24px, 3vw, 48px);
  --c-content: 62rem;

  /* Corner chrome: brand top left; parts, theme and the call top right; pause bottom right. */
  .nav {
    display: flex; align-items: center; gap: 32px;
    height: var(--nav-h);
    padding-inline: var(--edge);
  }
  .brand { margin-right: auto; }
  .brand-name { font-size: var(--step-0); }
  .nav-links { display: flex; gap: 28px; }
  .nav-links .link {
    font-family: var(--font-ui); font-size: var(--step--1);
    color: var(--ink-2); text-decoration: none;
  }
  .nav-actions { gap: 12px; }
  .theme-toggle { border-radius: 999px; background: transparent; border-color: var(--line-2); }
  .btn { border-radius: 999px; padding-inline: 26px; }
  .btn-sm { padding-inline: 18px; }
  .btn-quiet { border-color: var(--line-2); color: var(--ink); }
  .motion-toggle {
    right: var(--gutter); bottom: clamp(16px, 2.2vw, 32px);
    border-radius: 999px; padding-inline: 18px;
    background: var(--bg-2); color: var(--ink); font-size: var(--step--1);
  }
  .motion-toggle::before {
    content: ""; display: inline-block; width: 10px; height: 12px; margin-right: 10px;
    border-inline: 3px solid currentColor; vertical-align: -1px;
  }
  .motion-toggle[aria-pressed="true"]::before { border: 0; background: currentColor; clip-path: polygon(0 0, 100% 50%, 0 100%); }

  /* Scenes. Display-size titles; content blocks capped so lines stay readable. */
  .s {
    display: flex; flex-direction: column; align-items: flex-start; gap: 40px;
    padding: var(--c-scene) var(--edge);
  }
  .s-head { width: min(100%, 52rem); }
  .s-title { font-size: var(--step-4); line-height: var(--display-leading); }
  .s-intro { margin-top: 24px; max-width: 40ch; font-size: var(--step-1); line-height: 1.45; color: var(--ink-2); }
  .s > :not(.s-head, .tabs, .s-title, .s-intro, .actions, .link) { width: min(100%, var(--c-content)); }

  /* Steps and commitments: a row along the scene's lower edge, each under a hairline. */
  :is(.s-steps, .s-points) .s-items {
    display: grid; gap: 36px var(--c-gap);
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
  }
  :is(.s-steps, .s-points) .item {
    display: grid; align-content: start; gap: 10px;
    padding-top: 20px; border-top: var(--rule) solid var(--line-2);
  }
  .item-label {
    font-family: var(--font-mono); font-size: var(--step-1); line-height: 1;
    font-variant-numeric: tabular-nums; color: var(--ink-2);
  }
  .s-steps .item-label { margin-bottom: 14px; }
  .item-terms { font-family: var(--font-ui); color: var(--ink); }

  /* Work: an index of large names, one column per group. */
  .s-work .group { display: grid; align-content: start; }
  .group-label {
    padding-bottom: 12px; border-bottom: var(--rule) solid var(--line-2);
    font-family: var(--font-ui); font-size: var(--step--1); font-weight: 400;
    line-height: 1.4; letter-spacing: normal; color: var(--ink-2);
  }
  .s-work .s-items { display: grid; }
  .s-work .item-link { display: grid; gap: 6px; padding-block: 18px; }
  .s-work .item-title {
    font-family: var(--font-display); font-size: var(--step-2); font-weight: var(--display-weight);
    letter-spacing: var(--display-tracking); line-height: 1.1;
  }
  .s-work .item-body { color: var(--ink-2); }
  .item-host { font-family: var(--font-mono); font-size: var(--step--1); color: var(--ink-2); overflow-wrap: anywhere; }

  /* The method as one line across the scene; the Oracle steps away from the chain. */
  .s-diagram .diagram {
    width: 100%;
    display: grid; gap: 32px clamp(16px, 2vw, 32px);
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr));
  }
  .node {
    display: grid; align-content: start; grid-template-columns: minmax(0, 1fr) auto; column-gap: 12px;
    padding-top: 20px; border-top: var(--rule) solid var(--line-2);
  }
  .node-label { grid-column: 1; grid-row: 1; margin: 0 0 10px; font-size: var(--step-1); }
  .node-count { grid-column: 2; grid-row: 1; font-family: var(--font-mono); font-size: var(--step-1); line-height: 1.3; color: var(--ink-2); font-variant-numeric: tabular-nums; }
  .node-body { grid-column: 1 / -1; }
  .node[data-node="oracle"] { border-top: 2px solid var(--ink); padding-top: 19px; }

  /* Install: a pill chooser and a large soft well for the command. */
  .s-install .tabs {
    display: inline-flex; flex-wrap: wrap; gap: 4px;
    margin: 0; padding: 4px;
    border: var(--rule) solid var(--line-2); border-radius: 28px;
  }
  .s-install .tab {
    min-height: 44px; padding: 8px 18px;
    border: 0; border-radius: 999px;
    background: transparent; color: var(--ink-2);
    font-family: var(--font-ui); font-size: var(--step--1);
  }
  .tabpanel { display: grid; gap: 16px; }
  :is(.tabpanel, .codefig) .code {
    border: 0; border-radius: var(--radius); background: var(--bg-2);
    padding: clamp(22px, 2.6vw, 36px);
  }
  .tabpanel .code { font-size: var(--step-0); }
  .tabpanel .copy { justify-self: start; margin: 0; border-radius: 999px; padding-inline: 22px; background: transparent; font-family: var(--font-ui); font-size: var(--step--1); }
  .tabpanel .note { margin: 0; }

  /* Evidence: hairline bars with large values, the limits in two columns beneath. */
  .bars { margin: 0; gap: 0; }
  .bar {
    grid-template-columns: minmax(0, 14rem) minmax(0, 1fr) 4.5rem; gap: 24px;
    padding-block: 16px; border-top: var(--rule) solid var(--line-2);
  }
  .bar-track { height: 4px; border-radius: 999px; background: var(--bg-3); overflow: hidden; }
  .bar-fill { border-radius: 999px; background: var(--ink-2); }
  .bar[data-highlight="true"] .bar-fill { background: var(--accent); }
  .bar-value { font-family: var(--font-mono); font-size: var(--step-1); text-align: right; }
  .limits {
    margin: 0; padding: 0; max-width: none; list-style: none;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); gap: 14px var(--c-gap);
    font-size: var(--step--1);
  }
  .codefig { display: grid; gap: 14px; }

  /* The last scene: the one centred statement. */
  .s-cta { align-items: center; justify-content: center; text-align: center; min-height: min(80svh, 48rem); }
  .s-cta .s-title { font-size: var(--step-5); max-width: 16ch; }
  .s-cta .s-intro { margin: 0; }
  .s-cta .actions { justify-content: center; margin-top: 8px; }

  /* The final viewport's lower corners: the line left, the links right. */
  .foot {
    display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 32px;
    padding: 32px var(--edge) 40px;
  }
  .foot-line { font-family: var(--font-ui); font-size: var(--step--1); color: var(--ink-2); }
  .foot-links { display: flex; flex-wrap: wrap; gap: 0 28px; }
  .foot-links .link { font-family: var(--font-ui); font-size: var(--step--1); color: var(--ink-2); text-decoration: none; }

  @media (hover: hover) and (pointer: fine) {
    .nav-links .link:hover, .foot-links .link:hover { color: var(--ink); text-decoration: underline; text-decoration-thickness: 1px; }
    .s-install .tab:hover { color: var(--ink); }
    .s-work .item-link:hover .item-title { text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: .14em; }
    .btn-quiet:hover, .tabpanel .copy:hover { border-color: var(--ink); }
  }
  .s-install .tab[aria-selected="true"] { background: var(--accent); color: var(--accent-ink); }

  /* Wide screens: full-height scenes, title and content on opposite corners, alternating. */
  @media (min-width: 1024px) {
    .s:not(.s-cta) { min-height: min(92svh, 62rem); gap: 48px; }
    .s:not(.s-cta) > .s-head { margin-bottom: auto; }
    .s:nth-child(odd of .s:not(.s-cta)) > :not(.s-head, .group) { align-self: flex-end; }
    .s:nth-child(even of .s:not(.s-cta)) > .s-head { align-self: flex-end; }
    .s-work {
      display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
      grid-template-rows: auto 1fr auto; column-gap: var(--c-gap); row-gap: 48px;
    }
    .s-work > .s-head { grid-column: 1 / -1; grid-row: 1; margin: 0; }
    .s-work:nth-child(even of .s:not(.s-cta)) > .s-head { justify-self: end; }
    .s-work > .group { grid-row: 3; width: auto; }
    .node[data-node="oracle"] { margin-left: clamp(16px, 2vw, 32px); }
  }

  @media (max-width: 900px) {
    .nav-actions .btn { display: none; }
  }

  @media (max-width: 700px) {
    --nav-h: 64px;
    .nav { gap: 12px; }
    .nav-links { display: none; }
    /* On phones the chooser becomes free chips, so a wrapped row never strands one pill. */
    .s-install .tabs { gap: 8px; padding: 0; border: 0; border-radius: 0; }
    .s-install .tab { border: var(--rule) solid var(--line-2); }
    .s-install .tab[aria-selected="true"] { border-color: var(--accent); }
    .s { gap: 32px; }
    .s-title { font-size: var(--step-3); }
    .s-cta { min-height: 0; }
    .s-cta .s-title { font-size: var(--step-4); }
    .s-diagram .diagram { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px 20px; }
    .bar { grid-template-columns: minmax(0, 1fr) 3.5rem; row-gap: 10px; }
    .bar-label { grid-column: 1; }
    .bar-value { grid-column: 2; grid-row: 1; }
    .bar-track { grid-column: 1 / -1; }
    .motion-toggle { right: 12px; bottom: 12px; }
  }
}
`;

export default {
  id: 'corners',
  layer: 'layout',
  label: 'Corners',
  summary: 'An immersive canvas: chrome retreats to the corners and each section becomes a full-height scene with a display-size title in one corner and its content in the opposite one, so the field and the words share the whole screen.',
  origin: 'new',
  refs: [
    { name: 'Grok', url: 'https://grok.com/', what: 'One statement per screen with almost nothing else in view (the logged-out home is one question and an input), pill buttons and pill choosers, and chrome reduced to small type at the top.' },
    { name: 'Earendil', url: 'https://earendil.com/', what: 'Chrome pushed into the corners of the viewport around one idea per screen, with the living backdrop left open in the middle.' },
  ],
  css,
} satisfies LayoutOption;
