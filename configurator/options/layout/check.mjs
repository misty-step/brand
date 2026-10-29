// Static check for layout options. Needs no browser: it imports each options/layout/<id>/index.ts
// (Node strips the types), parses the CSS with postcss and reports contract problems.
//
//   node options/layout/check.mjs            # every layout option
//   node options/layout/check.mjs tiling     # named ids
//
// Problems (exit 1): a rule outside html[data-layout="<id>"], literal colours, literal font families,
// transitions, animations or keyframes (motion owns them), :active transforms, text under 12px, a
// missing or non-https reference, an id that differs from its directory, dashes in the picker copy.
// Notes (exit 0): uppercase, literal letter-spacing, custom properties that are neither contract
// tokens nor defined by the option itself.
import { createRequire } from 'node:module';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const postcss = createRequire(path.join(root, 'package.json'))('postcss');

const contract = new Set([
  '--bg', '--bg-2', '--bg-3', '--ink', '--ink-2', '--ink-3', '--line', '--line-2', '--accent', '--accent-ink', '--accent-2',
  '--focus', '--selection', '--field-1', '--field-2', '--field-3',
  '--font-display', '--font-body', '--font-ui', '--font-mono', '--display-weight', '--display-tracking', '--display-leading',
  '--display-transform', '--display-advance', '--body-weight', '--body-leading', '--measure',
  '--step--1', '--step-0', '--step-1', '--step-2', '--step-3', '--step-4', '--step-5',
  '--page-max', '--gutter', '--edge', '--radius', '--rule', '--nav-h', '--v',
]);
const colourProp = /^(color|background(-color)?|border(-(top|right|bottom|left|block|inline)(-(start|end))?)?(-color)?|outline(-color)?|box-shadow|text-decoration(-color)?|fill|stroke|caret-color|accent-color|column-rule(-color)?|scrollbar-color)$/;
const literalColour = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?|oklch|oklab|lab|lch|color|light-dark)\(|\b(white|black|red|green|blue|gr[ae]y|orange|yellow|purple|pink|silver|navy|teal)\b/i;

const all = (await readdir(here, { withFileTypes: true })).filter(d => d.isDirectory() && !d.name.startsWith('_')).map(d => d.name);
const ids = process.argv.slice(2).length ? process.argv.slice(2) : all;
let failing = 0;

for (const id of ids) {
  const { default: option } = await import(pathToFileURL(path.join(here, id, 'index.ts')).href);
  const scope = `html[data-layout="${id}"]`;
  const problems = [], notes = [];
  if (option.id !== id || option.layer !== 'layout') problems.push(`id/layer is ${option.id}/${option.layer}`);
  if (!option.refs?.length) problems.push('no references');
  for (const r of option.refs ?? []) if (!/^https:\/\//.test(r.url) || !r.what) problems.push(`reference ${r.name} needs an https url and what it teaches`);
  if (/[\u2013\u2014]/.test([option.label, option.summary, ...(option.refs ?? []).map(r => r.what)].join(' '))) problems.push('en or em dash in label, summary or references');

  let ast;
  try { ast = postcss.parse(option.css); } catch (error) { problems.push('CSS does not parse: ' + error.message); }
  if (ast) {
    const scoped = rule => {
      for (let node = rule.parent; node && node.type !== 'root'; node = node.parent) if (node.type === 'rule' && node.selector.trim().startsWith(scope)) return true;
      return rule.selectors.every(s => s.trim().startsWith(scope));
    };
    ast.walkRules(rule => { if (!scoped(rule)) problems.push('unscoped rule: ' + rule.selector.replace(/\s+/g, ' ').slice(0, 90)); });
    ast.walkAtRules(at => { if (/keyframes$/.test(at.name)) problems.push('@keyframes ' + at.params + ' (motion owns animation)'); });
    const defined = new Set(), used = new Set();
    ast.walkDecls(decl => {
      const where = (decl.parent?.selector ?? '@' + decl.parent?.name + ' ' + decl.parent?.params).replace(/\s+/g, ' ').slice(0, 70);
      const value = decl.value.trim();
      if (decl.prop.startsWith('--')) defined.add(decl.prop);
      for (const m of value.matchAll(/var\((--[\w-]+)/g)) used.add(m[1]);
      if (/^(transition|animation)/.test(decl.prop)) problems.push(`${decl.prop} in ${where} (motion owns it)`);
      if (decl.prop === 'transform' && /:active/.test(where)) problems.push('press transform in ' + where);
      if (decl.prop === 'font-family' && !/^var\(--font-(display|body|ui|mono)\)$/.test(value) && value !== 'inherit') problems.push(`font-family ${value} in ${where}`);
      if (decl.prop === 'font') problems.push('font shorthand in ' + where);
      if (colourProp.test(decl.prop) || decl.prop.startsWith('--')) {
        const bare = value.replace(/var\([^)]*\)/g, '').replace(/(repeating-)?(linear|radial|conic)-gradient/g, '');
        if (literalColour.test(bare)) problems.push(`literal colour in ${decl.prop}: ${value.slice(0, 60)} (${where})`);
      }
      const px = decl.prop === 'font-size' && value.match(/^(\d+(?:\.\d+)?)px$/);
      if (px && Number(px[1]) < 12) problems.push(`font-size ${value} in ${where}`);
      if (decl.prop === 'font-size' && /^0(px)?$/.test(value)) problems.push('font-size 0 in ' + where);
      if (decl.prop === 'text-transform' && /upper/.test(value)) notes.push('uppercase in ' + where);
      if (decl.prop === 'letter-spacing' && !/var\(|^normal$|^0$/.test(value)) notes.push(`letter-spacing ${value} in ${where}`);
    });
    for (const name of used) if (!contract.has(name) && !defined.has(name)) notes.push('custom property neither contract nor defined: ' + name);
  }
  if (problems.length) failing++;
  console.log(`${problems.length ? 'FAIL' : 'ok  '} ${id}${problems.length || notes.length ? '' : ` (${option.css.length} chars, ${option.refs.length} refs)`}`);
  for (const p of problems) console.log('     ' + p);
  for (const n of notes) console.log('     note: ' + n);
}
process.exitCode = failing ? 1 : 0;
