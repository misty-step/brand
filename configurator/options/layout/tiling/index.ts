import type { LayoutOption } from '../../../src/contract';

// Tiled workspace. Every section is a master pane (its heading) beside a stack of panes,
// separated by the ground the way a tiling window manager leaves gaps between windows.
// A sticky top bar numbers the workspaces; on wide screens a fixed status line carries the
// footer, the pause control and the keys that work for whatever has focus right now.
// Tokens only: no font families, no literal colours, no transitions (motion owns those).
const css = String.raw`
html[data-layout="tiling"] {
  --page-max: 1520px;
  --gutter: clamp(16px, 1.7vw, 24px);
  --edge: max(var(--gutter), calc((100% - var(--page-max)) / 2));
  --radius: 0px;
  --rule: 1px;
  --t-top: 56px;
  --t-bar: 44px;
  --t-gap: 8px;
  --t-pad: clamp(20px, 2.1vw, 32px);
  --t-ws: clamp(80px, 8.4vw, 128px);
  --nav-h: var(--t-top);
  scroll-padding-top: calc(var(--t-top) + var(--t-gap));

  /* Top bar: brand, numbered workspaces, theme and the one call to action. */
  .nav {
    position: sticky; top: 0; z-index: 30;
    display: flex; align-items: center; gap: 4px;
    min-height: var(--t-top);
    padding-inline: var(--edge);
    background: var(--bg);
    border-bottom: var(--rule) solid var(--line);
  }
  .brand { gap: 10px; margin-right: 20px; }
  .brand-name { font-size: var(--step-0); }
  .nav-links { display: flex; align-self: stretch; counter-reset: ws; }
  .nav-links .link {
    counter-increment: ws;
    display: inline-flex; align-items: center; gap: 10px;
    min-height: 44px; padding-inline: 12px;
    font-family: var(--font-ui); font-size: var(--step--1);
    color: var(--ink-2); text-decoration: none;
    box-shadow: inset 0 -2px 0 transparent;
  }
  .nav-links .link::before {
    content: counter(ws);
    display: inline-grid; place-items: center;
    min-width: 24px; height: 24px; padding-inline: 6px;
    border: var(--rule) solid var(--line-2);
    font-family: var(--font-mono); font-size: var(--step--1); line-height: 1;
    font-variant-numeric: tabular-nums; color: var(--ink);
  }
  .nav-actions { margin-left: auto; gap: 8px; }
  .theme-toggle { background: transparent; border-color: var(--line-2); }
  .btn { border-radius: 0; }
  .btn-quiet { color: var(--ink); }

  /* Workspaces: each section is a master pane and a stack, on a capped container. */
  main { padding-bottom: var(--t-ws); }
  .s {
    width: min(100% - 2 * var(--gutter), var(--page-max));
    margin: var(--t-ws) auto 0;
    display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--t-gap);
  }
  :is(.s-head, .s-items > .item, .group-label, .diagram > .node, .tabpanel, .bars, .limits, .s-evidence > .link, .codefig, .s-cta) {
    background: var(--bg-2);
    border: var(--rule) solid var(--line);
  }
  :is(.s-items > .item, .diagram > .node, .tabpanel, .bars, .s-evidence > .link, .codefig):focus-within {
    border-color: var(--focus);
    box-shadow: inset 0 0 0 1px var(--focus);
  }
  .s-head { padding: var(--t-pad); }
  .s-title { max-width: 18ch; }
  .s-intro { margin-top: 20px; }

  /* Steps: one wide pane per step, the step number set as a key. */
  .s-steps .s-items { display: grid; gap: var(--t-gap); }
  .s-steps .item {
    display: grid; align-content: start;
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-areas: "label title" "label terms" ". body";
    column-gap: 20px; row-gap: 6px;
    padding: var(--t-pad);
  }
  .item-label {
    grid-area: label; align-self: start;
    display: inline-grid; place-items: center;
    min-width: 32px; height: 32px; padding-inline: 8px;
    border: var(--rule) solid var(--line-2);
    font-family: var(--font-mono); font-size: var(--step--1); line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .s-steps .item-title { grid-area: title; }
  .item-terms { grid-area: terms; font-family: var(--font-ui); color: var(--ink); }
  .s-steps .item-body { grid-area: body; margin-top: 12px; }

  /* Points: three panes side by side in the stack. */
  .s-points .s-items {
    display: grid; gap: var(--t-gap);
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
  }
  .s-points .item { display: grid; align-content: start; gap: 12px; padding: var(--t-pad); }

  /* Work: a label strip per group, each product its own pane; the pane is the link. */
  .s-work .group { display: grid; gap: var(--t-gap); grid-template-columns: minmax(0, 1fr); }
  .s-work .group + .group { margin-top: var(--t-gap); }
  .group-label {
    padding: 12px clamp(20px, 1.7vw, 24px);
    font-family: var(--font-ui); font-size: var(--step--1); font-weight: inherit;
    line-height: 1.4; letter-spacing: normal; color: var(--ink-2);
  }
  .s-work .s-items {
    display: grid; gap: var(--t-gap);
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  }
  .s-work .item { container-type: inline-size; }
  .item-link { display: flex; flex-direction: column; gap: 10px; height: 100%; padding: clamp(20px, 1.7vw, 24px); }
  .item-link:focus-visible { outline-offset: -2px; }
  .s-work .item-title { font-family: var(--font-display); font-size: var(--step-1); font-weight: var(--display-weight); line-height: 1.2; }
  .s-work .item-body { color: var(--ink-2); }
  .item-host {
    margin-top: auto; padding-top: 14px;
    border-top: var(--rule) solid var(--line);
    font-family: var(--font-mono); font-size: var(--step--1); color: var(--ink-2);
    overflow-wrap: anywhere;
  }
  @container (min-width: 34rem) {
    .item-link { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); column-gap: 32px; row-gap: 10px; }
    .item-host { grid-column: 2; margin-top: 8px; }
  }

  /* Diagram: the method is the tiling. Core and misty are tall panes, the three on-demand
     leaves split one column, and the Oracle stands apart across a wider gap. */
  .diagram { display: grid; gap: var(--t-gap); grid-template-columns: minmax(0, 1fr); }
  .node { display: grid; align-content: start; grid-template-columns: minmax(0, 1fr) auto; padding: var(--t-pad); column-gap: 16px; }
  .node-label { grid-column: 1; grid-row: 1; margin: 0 0 10px; font-size: var(--step-1); }
  .node-count {
    grid-column: 2; grid-row: 1; align-self: start;
    display: inline-grid; place-items: center;
    min-width: 32px; height: 32px; padding-inline: 8px;
    border: var(--rule) solid var(--line-2);
    font-family: var(--font-mono); font-size: var(--step--1); line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .node-body { grid-column: 1 / -1; }
  .node[data-node="oracle"] { margin-top: calc(var(--t-gap) * 2); }

  /* Install: the harness tabs are a group bar fused to the pane they switch. */
  .s-install { row-gap: 0; }
  .s-install .tabs {
    display: flex; flex-wrap: wrap;
    gap: var(--rule); margin: 0;
    background: var(--line);
    border: var(--rule) solid var(--line); border-bottom: 0;
  }
  .s-install .tab {
    flex: 1 1 7.5rem;
    min-height: 44px; padding: 8px 14px; border: 0;
    background: var(--bg-3); color: var(--ink-2);
    font-family: var(--font-ui); font-size: var(--step--1); text-align: left;
  }
  .s-install .tab[aria-selected="true"] { background: var(--bg-2); color: var(--ink); box-shadow: inset 0 2px 0 var(--accent); }
  .s-install .tab:focus-visible { outline-offset: -4px; }
  .tabpanel { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 16px; padding: var(--t-pad); }
  .tabpanel .code { grid-column: 1; margin: 0; border: 0; }
  .tabpanel .copy { grid-column: 2; align-self: start; margin: 0; min-width: 88px; background: transparent; font-family: var(--font-ui); font-size: var(--step--1); }
  .tabpanel .note { grid-column: 1 / -1; margin: 0; }

  /* Evidence: the bars pane, the limits pane, and the record as a one-line pane. */
  .bars { margin: 0; padding: var(--t-pad); gap: 18px; }
  .bar { grid-template-columns: minmax(0, 13rem) minmax(0, 1fr) 3.5rem; gap: 20px; }
  .bar-label { font-family: var(--font-ui); }
  .bar-track { height: 12px; background: var(--bg-3); box-shadow: inset 0 0 0 var(--rule) var(--line-2); }
  .bar-fill { background: var(--ink-2); }
  .bar[data-highlight="true"] .bar-fill { background: var(--accent); }
  .bar-value { font-family: var(--font-mono); text-align: right; }
  .limits {
    margin: var(--t-gap) 0 0; max-width: none;
    padding: var(--t-pad) var(--t-pad) var(--t-pad) calc(var(--t-pad) + 1.25em);
    list-style: square; gap: 10px;
  }
  .limits li { max-width: var(--measure); }
  .limits li::marker { color: var(--ink-3); }
  .s-evidence > .link { display: flex; align-items: center; min-height: 52px; margin-top: var(--t-gap); padding: 12px var(--t-pad); }

  /* Code: a sunken pane whose caption is its status line. */
  .codefig { display: grid; background: var(--bg-3); }
  .codefig .code { border: 0; background: transparent; padding: var(--t-pad); }
  .codefig figcaption {
    margin: 0; max-width: none; padding: 12px var(--t-pad);
    border-top: var(--rule) solid var(--line); background: var(--bg-2);
  }

  /* Call to action: the one pane that is active at rest. */
  .s-cta {
    padding: clamp(32px, 4vw, 64px) var(--t-pad);
    border-color: var(--accent); box-shadow: inset 0 0 0 1px var(--accent);
    align-items: start; gap: 0;
  }
  .s-cta .s-title { max-width: 18ch; }
  .s-cta .s-intro { margin-top: 20px; }
  .s-cta .actions { margin-top: 28px; }

  /* Footer: a status block at the end of the page; a fixed status line on wide screens. */
  .foot {
    width: min(100% - 2 * var(--gutter), var(--page-max));
    margin: 0 auto; padding-block: 24px 32px;
    display: flex; flex-wrap: wrap; align-items: center; gap: 8px 24px;
    border-top: var(--rule) solid var(--line);
    font-family: var(--font-ui); font-size: var(--step--1); color: var(--ink-2);
  }
  .foot-links { display: flex; flex-wrap: wrap; gap: 0 20px; }
  .foot-links .link { display: inline-flex; align-items: center; min-height: 44px; color: var(--ink-2); }
  .motion-toggle { border-radius: 0; font-size: var(--step--1); }
  .motion-toggle::before {
    content: ""; display: inline-block; width: 10px; height: 12px; margin-right: 12px;
    border-inline: 3px solid currentColor; vertical-align: -1px;
  }
  .motion-toggle[aria-pressed="true"]::before { border: 0; background: currentColor; clip-path: polygon(0 0, 100% 50%, 0 100%); }

  @media (hover: hover) and (pointer: fine) {
    .nav-links .link:hover { color: var(--ink); box-shadow: inset 0 -2px 0 var(--accent); }
    .nav-links .link:hover::before { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); }
    .s-work .item:hover { border-color: var(--line-2); }
    .foot-links .link:hover, .s-install .tab:hover { color: var(--ink); }
    .btn-quiet:hover { border-color: var(--ink); }
  }

  @media (min-width: 1024px) {
    /* Full-viewport heroes fit between the top bar and the fixed status line. */
    --nav-h: calc(var(--t-top) + var(--t-bar));
    .s { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); row-gap: 0; }
    .s > .s-head { grid-column: 1; grid-row: 1 / span 12; }
    .s > :not(.s-head) { grid-column: 2; }
    .s-cta { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); column-gap: var(--t-gap); }
    .s-cta > .s-title { grid-column: 1; grid-row: 1 / span 2; }
    .s-cta > :not(.s-title) { grid-column: 2; }
    .s-cta .s-intro { margin-top: 0; }
    .s-steps .item { grid-template-columns: auto minmax(0, 15rem) minmax(0, 1fr); grid-template-areas: "label title body" "label terms body"; }
    .s-steps .item-body { margin-top: 0; }
    .diagram {
      grid-template-columns: repeat(3, minmax(0, 1fr)) minmax(0, 1fr);
      grid-template-areas: "core misty playbooks oracle" "core misty skills oracle" "core misty principles oracle";
    }
    .node[data-node="core"] { grid-area: core; }
    .node[data-node="misty"] { grid-area: misty; }
    .node[data-node="playbooks"] { grid-area: playbooks; }
    .node[data-node="skills"] { grid-area: skills; }
    .node[data-node="principles"] { grid-area: principles; }
    .node[data-node="oracle"] { grid-area: oracle; margin: 0 0 0 calc(var(--t-gap) * 3); }

    /* Status line: footer, contextual key hints and the pause control, always in reach. */
    main { padding-bottom: calc(var(--t-ws) + var(--t-bar)); }
    .foot {
      position: fixed; inset: auto 0 0 0; z-index: 30;
      width: auto; height: var(--t-bar); margin: 0;
      padding: 0 calc(var(--edge) + 11rem) 0 var(--edge);
      flex-wrap: nowrap; gap: 24px;
      background: var(--bg); white-space: nowrap;
    }
    .foot-line { overflow: hidden; text-overflow: ellipsis; }
    .foot-links .link { min-height: 0; }
    .motion-toggle {
      position: fixed; right: var(--edge); bottom: 0; z-index: 31;
      height: var(--t-bar); min-height: var(--t-bar); width: 10.5rem;
      padding: 0 0 0 16px; border: 0; border-left: var(--rule) solid var(--line);
      background: var(--bg); color: var(--ink); text-align: left;
    }
  }

  @media (min-width: 1024px) and (hover: hover) and (pointer: fine) {
    .foot::before, .foot::after { order: 3; font-family: var(--font-ui); }
    .foot::before {
      content: "Tab"; content: "Tab" / "";
      margin-left: auto;
      display: inline-grid; place-items: center; min-width: 24px; height: 24px; padding-inline: 6px;
      border: var(--rule) solid var(--line-2); color: var(--ink);
      font-family: var(--font-mono); line-height: 1;
    }
    .foot::after { content: "moves focus"; content: "moves focus" / ""; margin-left: -14px; }
    &:has(:is(a, button):focus-visible) .foot::before { content: "Enter"; content: "Enter" / ""; }
    &:has(a:focus-visible) .foot::after { content: "opens the link"; content: "opens the link" / ""; }
    &:has(.theme-toggle:focus-visible) .foot::after { content: "switches the theme"; content: "switches the theme" / ""; }
    &:has(.copy:focus-visible) .foot::after { content: "copies the command"; content: "copies the command" / ""; }
    &:has(.motion-toggle:focus-visible) .foot::after { content: "pauses motion"; content: "pauses motion" / ""; }
    &:has(.motion-toggle[aria-pressed="true"]:focus-visible) .foot::after { content: "resumes motion"; content: "resumes motion" / ""; }
    &:has(.tabs :focus-visible) .foot::before { content: "\2190 \2192"; content: "\2190 \2192" / ""; }
    &:has(.tabs :focus-visible) .foot::after { content: "switches harness"; content: "switches harness" / ""; }
  }

  /* Narrow screens: the hero carries the call to action; the bar keeps navigation. */
  @media (max-width: 900px) {
    .nav-actions .btn { display: none; }
  }

  @media (max-width: 700px) {
    --t-top: 60px;
    --t-pad: 20px;
    .brand { margin-right: auto; }
    .nav-links { display: none; }
    .tabpanel { grid-template-columns: minmax(0, 1fr); }
    .tabpanel .copy { grid-column: 1; justify-self: start; }
    .bar { grid-template-columns: minmax(0, 1fr) 3rem; row-gap: 8px; }
    .bar-label { grid-column: 1; }
    .bar-value { grid-column: 2; grid-row: 1; }
    .bar-track { grid-column: 1 / -1; }
    .motion-toggle { bottom: 12px; right: 12px; background: var(--bg-2); }
  }
}
`;

export default {
  id: 'tiling',
  layer: 'layout',
  label: 'Tiled workspace',
  summary: 'A tiling-window workspace: each section is a master pane beside a stack of panes, the focused pane lights in the focus colour and a status line names the keys that work right now, so Misty Step reads as working software rather than a brochure.',
  origin: 'A',
  refs: [
    { name: 'Omarchy', url: 'https://omarchy.org/', what: 'The site worn as the operating system: square 1px panes on a sticky bar, calm text in every pane, and the theme system carried by tokens rather than by the layout.' },
    { name: 'Hyprland', url: 'https://wiki.hypr.land/configuring/core/config-options/', what: 'Tiling vocabulary: inner and outer gaps that show the ground, a coloured border only on the focused window, master and stack splits, and the tabbed group bar reused for the harness chooser.' },
    { name: 'tmux', url: 'https://github.com/tmux/tmux/wiki/Getting-Started', what: 'A status line pinned to the bottom of the workspace that reports context and the keys that apply to what has focus.' },
  ],
  css,
} satisfies LayoutOption;
