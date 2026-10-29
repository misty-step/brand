import type { LayoutOption } from '../../../src/contract';
export default {
  id: 'baseline-layout', layer: 'layout', label: 'Plain document',
  summary: 'A quiet single-column document, intentionally plain so other layers remain visible.',
  origin: 'baseline',
  refs: [{ name: 'Web platform', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section', what: 'Semantic sections and a straightforward reading order rather than a brand composition.' }],
  css: `
    html[data-layout="baseline-layout"] {
      --page-max: 1280px;
      --gutter: clamp(20px, 4vw, 64px);
      --edge: max(var(--gutter), calc((100% - var(--page-max)) / 2));
      --radius: 0px;
      --rule: 1px;
      --nav-h: 88px;
    }
    html[data-layout="baseline-layout"] main { width:100%; max-width:none; padding:0; }
    html[data-layout="baseline-layout"] .nav,
    html[data-layout="baseline-layout"] .foot { padding-inline:var(--edge); }
    html[data-layout="baseline-layout"] .nav { min-height:var(--nav-h);display:flex;align-items:center;gap:32px;border-bottom:var(--rule) solid var(--line); }
    html[data-layout="baseline-layout"] .nav-links { margin-left:auto;display:flex;gap:24px; }
    html[data-layout="baseline-layout"] .s { padding:80px var(--edge);border-top:var(--rule) solid var(--line); }
    html[data-layout="baseline-layout"] .s-head { margin-bottom:32px; }
    html[data-layout="baseline-layout"] .s-items,
    html[data-layout="baseline-layout"] .diagram { display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px; }
    html[data-layout="baseline-layout"] .group { margin-top:40px; }
    html[data-layout="baseline-layout"] .group-label { margin-bottom:20px; }
    html[data-layout="baseline-layout"] .item-label { display:block;margin-bottom:16px;color:var(--ink-2); }
    html[data-layout="baseline-layout"] .item-title { display:block;margin-bottom:12px; }
    html[data-layout="baseline-layout"] .item-terms { font-weight:600;margin-bottom:12px; }
    html[data-layout="baseline-layout"] .item-link { display:grid;gap:12px;min-height:160px; }
    html[data-layout="baseline-layout"] .item-host { font-family:var(--font-mono);font-size:var(--step--1);overflow-wrap:anywhere; }
    html[data-layout="baseline-layout"] .node { padding:24px;background:var(--bg-2);border:var(--rule) solid var(--line); }
    html[data-layout="baseline-layout"] .node-count { color:var(--ink-2); }
    html[data-layout="baseline-layout"] .foot { padding-block:40px;display:flex;justify-content:space-between;gap:24px;border-top:var(--rule) solid var(--line); }
    html[data-layout="baseline-layout"] .foot-links { display:flex;flex-wrap:wrap;gap:24px; }
    html[data-layout="baseline-layout"] .btn { border-radius:var(--radius); }
    @media(max-width:700px) {
      html[data-layout="baseline-layout"] { --nav-h:76px; }
      html[data-layout="baseline-layout"] .nav { gap:12px; }
      html[data-layout="baseline-layout"] .nav-links { display:none; }
      html[data-layout="baseline-layout"] .nav-actions { margin-left:auto; }
      html[data-layout="baseline-layout"] .nav-actions .btn { display:none; }
      html[data-layout="baseline-layout"] .s { padding-block:72px; }
      html[data-layout="baseline-layout"] .s-items,
      html[data-layout="baseline-layout"] .diagram { grid-template-columns:1fr;gap:32px; }
      html[data-layout="baseline-layout"] .foot { flex-direction:column; }
    }
  `,
} satisfies LayoutOption;
