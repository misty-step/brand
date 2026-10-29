#!/usr/bin/env node
// Checks every colour option that carries a `contrast:begin` block against the
// token guarantees in ./README.md, then (with --write) records the measured
// ratios in that block. Ratios are WCAG 2 contrast on the 8-bit sRGB colour the
// browser paints. Run from configurator/: node options/color/check.mjs [--write]
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const write = process.argv.includes('--write');
const BEGIN = '// contrast:begin';
const END = '// contrast:end';

function oklchToLinear(L, C, h) {
  const a = C * Math.cos((h * Math.PI) / 180), b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
const encode = (x) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);
const decode = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

// Returns { rgb: [r, g, b] in 0-255, inGamut } for `oklch(L C H)` or `#rrggbb`.
function parse(value) {
  const v = value.trim();
  const ok = v.match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)\s*\)$/);
  if (ok) {
    const L = +ok[1] / (ok[2] ? 100 : 1);
    const lin = oklchToLinear(L, +ok[3], +ok[4]);
    const inGamut = lin.every((c) => c >= -1e-4 && c <= 1 + 1e-4);
    return { rgb: lin.map((c) => Math.round(encode(Math.min(1, Math.max(0, c))) * 255)), inGamut, L };
  }
  const hex = v.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const rgb = [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16));
    const lin = rgb.map((c) => decode(c / 255));
    const l = Math.cbrt(0.4122214708 * lin[0] + 0.5363325363 * lin[1] + 0.0514459929 * lin[2]);
    const m = Math.cbrt(0.2119034982 * lin[0] + 0.6806995451 * lin[1] + 0.1073969566 * lin[2]);
    const s = Math.cbrt(0.0883024619 * lin[0] + 0.2817188376 * lin[1] + 0.6299787005 * lin[2]);
    return { rgb, inGamut: true, L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s };
  }
  throw new Error(`Unsupported colour "${value}": use oklch(L C H) or #rrggbb`);
}
const luminance = ([r, g, b]) => 0.2126 * decode(r / 255) + 0.7152 * decode(g / 255) + 0.0722 * decode(b / 255);
const ratio = (a, b) => {
  const [x, y] = [luminance(a.rgb), luminance(b.rgb)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
// The probe's own HSL reading (DesignCanon/checklist/probe.js), for its palette flags.
function probeHsl([r8, g8, b8]) {
  const [r, g, b] = [r8 / 255, g8 / 255, b8 / 255], mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (!d) return [0, 0, 0];
  const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(h * 60 + 360) % 360, d / (1 - Math.abs(mx + mn - 1) || 1), d];
}

const SURFACES = ['--bg', '--bg-2', '--bg-3'];
const f = (n) => n.toFixed(2);

function checkTheme(theme, tokens) {
  const c = Object.fromEntries(Object.entries(tokens).map(([k, v]) => [k, parse(v)]));
  const fails = [], flags = [];
  const on = (fg, bgs = SURFACES) => bgs.map((bg) => ratio(c[fg], c[bg]));
  for (const [k, v] of Object.entries(c)) if (!v.inGamut) fails.push(`${k} is outside sRGB`);
  if (!(c['--bg-3'].L < c['--bg'].L && c['--bg'].L < c['--bg-2'].L)) fails.push('surfaces must order --bg-3 < --bg < --bg-2 in lightness');
  const text = {};
  for (const role of ['--ink', '--ink-2', '--ink-3', '--accent-2']) {
    text[role] = on(role);
    if (Math.min(...text[role]) < 4.5) fails.push(`${role} under 4.5:1 on a surface (${text[role].map(f).join(', ')})`);
  }
  const line = on('--line'), line2 = on('--line-2', ['--bg', '--bg-2']), focus = on('--focus');
  if (Math.min(...line2) < 3) fails.push(`--line-2 under 3:1 (${line2.map(f).join(', ')})`);
  if (Math.min(...focus) < 3) fails.push(`--focus under 3:1 (${focus.map(f).join(', ')})`);
  const onAccent = ratio(c['--accent-ink'], c['--accent']);
  if (onAccent < 4.5) fails.push(`--accent-ink on --accent ${f(onAccent)} < 4.5`);
  const accentOnBg = on('--accent');
  const selection = ratio(c['--ink'], c['--selection']);
  if (selection < 4.5) fails.push(`--ink on --selection ${f(selection)} < 4.5`);
  const fields = ['--field-1', '--field-2', '--field-3'];
  const fieldVsBg = fields.map((k) => ratio(c[k], c['--bg']));
  if (!(fieldVsBg[0] < fieldVsBg[1] && fieldVsBg[1] < fieldVsBg[2])) fails.push('fields must step away from --bg: field-1 < field-2 < field-3');
  const towardInk = theme === 'light' ? (a, b) => a > b : (a, b) => a < b;
  if (!fields.every((k, i) => towardInk(i ? c[fields[i - 1]].L : c['--bg'].L, c[k].L))) fails.push(`fields must move toward --ink (${theme === 'light' ? 'darker' : 'lighter'} than --bg)`);
  const inkOnFields = fields.map((k) => ratio(c['--ink'], c[k]));
  if (Math.min(...inkOnFields) < 4.5) fails.push(`--ink under 4.5:1 on a field (${inkOnFields.map(f).join(', ')})`);
  const ink2OnFields = fields.slice(0, 2).map((k) => ratio(c['--ink-2'], c[k]));
  if (Math.min(...ink2OnFields) < 4.5) fails.push(`--ink-2 under 4.5:1 on field-1/2 (${ink2OnFields.map(f).join(', ')})`);

  const [gh, gs, gd] = probeHsl(c['--bg'].rgb);
  const cream = luminance(c['--bg'].rgb) > 0.75 && gh >= 30 && gh <= 60 && gs > 0.2 && gd >= 0.02;
  if (cream) flags.push('probe reads --bg as a warm cream ground');
  for (const k of ['--accent', '--accent-2']) {
    const [h, , d] = probeHsl(c[k].rgb);
    if (d > 0.2 && h >= 245 && h <= 300) flags.push(`probe reads ${k} as violet/indigo (HSL hue ${Math.round(h)})`);
    if (cream && d > 0.2 && h >= 5 && h <= 30) flags.push(`probe reads cream + terracotta (${k})`);
  }

  const lines = [
    `${theme.padEnd(6)}on bg, bg-2, bg-3: ink ${text['--ink'].map(f).join(' ')}; ink-2 ${text['--ink-2'].map(f).join(' ')}; ink-3 ${text['--ink-3'].map(f).join(' ')}; accent-2 ${text['--accent-2'].map(f).join(' ')}`,
    `${''.padEnd(6)}accent-ink on accent ${f(onAccent)}; accent on bg, bg-2, bg-3 ${accentOnBg.map(f).join(' ')}; focus ${focus.map(f).join(' ')}; line-2 on bg, bg-2 ${line2.map(f).join(' ')}; line ${line.map(f).join(' ')}; ink on selection ${f(selection)}`,
    `${''.padEnd(6)}fields vs bg ${fieldVsBg.map(f).join(' ')}; ink on fields ${inkOnFields.map(f).join(' ')}; ink-2 on field-1, field-2 ${ink2OnFields.map(f).join(' ')}`,
  ];
  return { fails, flags, lines };
}

const dirs = (await readdir(here, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name).sort();
const palettes = [];
let failed = 0, checked = 0;
for (const id of dirs) {
  const file = join(here, id, 'index.ts');
  if (!existsSync(file)) continue;
  const source = await readFile(file, 'utf8');
  if (!source.includes(BEGIN)) {
    console.log(`${id}: no ${BEGIN} block, not checked`);
    continue;
  }
  const { default: option } = await import(pathToFileURL(file).href);
  if (option.id !== id || option.layer !== 'color') throw new Error(`${file}: id/layer mismatch`);
  checked++;
  palettes.push({ id, light: option.light, dark: option.dark });
  const results = ['light', 'dark'].map((t) => checkTheme(t, option[t]));
  const fails = results.flatMap((r, i) => r.fails.map((x) => `${i ? 'dark' : 'light'}: ${x}`));
  const flags = results.flatMap((r, i) => r.flags.map((x) => `${i ? 'dark' : 'light'}: ${x}`));
  failed += fails.length ? 1 : 0;
  console.log(`${fails.length ? 'FAIL' : 'ok  '} ${id}`);
  for (const x of fails) console.log(`     ${x}`);
  for (const x of flags) console.log(`     flag ${x}`);
  for (const r of results) for (const l of r.lines) console.log(`     ${l}`);
  if (write) {
    const block = [
      `${BEGIN} (written by options/color/check.mjs --write; WCAG 2 ratios, 8-bit sRGB)`,
      ...results.flatMap((r) => r.lines.map((l) => `// ${l}`)),
      ...flags.map((x) => `// flag: ${x}`),
      END,
    ].join('\n');
    const next = source.replace(new RegExp(`${BEGIN}[\\s\\S]*?${END}`), block);
    if (next !== source) await writeFile(file, next);
  }
}
console.log(`${checked} palettes checked, ${failed} failing`);

// --pairs: lint the other layers' CSS (and the renderer's base.css) for text/background token
// pairs the guarantees above do not cover, and report the worst ratio across every palette.
// Same-rule pairs only: the cascade across rules needs a browser, so this is a lint, not proof.
if (process.argv.includes('--pairs')) {
  const COVERED = new Set([
    ...['ink', 'ink-2', 'ink-3', 'accent-2'].flatMap((t) => ['bg', 'bg-2', 'bg-3'].map((b) => `${t}|${b}`)),
    'accent-ink|accent', 'ink|selection', 'ink|field-1', 'ink|field-2', 'ink|field-3', 'ink-2|field-1', 'ink-2|field-2',
  ]);
  const covered = (a, b) => COVERED.has(`${a}|${b}`) || COVERED.has(`${b}|${a}`);
  const ROLES = Object.keys(palettes[0]?.light ?? {}).map((k) => k.slice(2));
  const firstVar = (value = '') => value.match(/var\(--([\w-]+)/)?.[1];
  const worst = (fg, bg) => palettes.flatMap((p) => ['light', 'dark'].map((t) => ({ r: ratio(parse(p[t][`--${fg}`]), parse(p[t][`--${bg}`])), at: `${p.id} ${t}` }))).sort((x, y) => x.r - y.r)[0];
  const root = dirname(here);
  const sources = [join(root, '..', 'src', 'preview', 'base.css')];
  for (const layer of (await readdir(root, { withFileTypes: true })).filter((d) => d.isDirectory() && d.name !== 'color')) {
    for (const opt of await readdir(join(root, layer.name), { withFileTypes: true })) {
      if (opt.isDirectory() && existsSync(join(root, layer.name, opt.name, 'index.ts'))) sources.push(join(root, layer.name, opt.name, 'index.ts'));
    }
  }
  const findings = [];
  for (const file of sources) {
    const text = await readFile(file, 'utf8');
    const css = (file.endsWith('.css') ? [text] : [...text.matchAll(/`([^`]*)`/g)].map((m) => m[1])).join('\n').replace(/\$\{[^}]*\}/g, 'X').replace(/\/\*[\s\S]*?\*\//g, '');
    for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const decl = Object.fromEntries([...body.matchAll(/([\w-]+)\s*:\s*([^;]+)/g)].map((m) => [m[1].toLowerCase(), m[2]]));
      const fg = firstVar(decl.color), bg = firstVar(decl['background-color'] ?? decl.background);
      const where = `${file.slice(root.length - 'options'.length)}  ${selector.trim().slice(-80)}`;
      if (fg === 'accent') findings.push(`text set in --accent (a fill, may be light): ${where}`);
      if (fg && bg && ROLES.includes(fg) && ROLES.includes(bg) && fg !== bg && !covered(fg, bg)) {
        const w = worst(fg, bg);
        findings.push(`--${fg} on --${bg} is not a guaranteed pair; worst ${f(w.r)} in ${w.at}: ${where}`);
      }
    }
  }
  console.log(findings.length ? findings.join('\n') : 'pairs: every same-rule text/background token pair is guaranteed');
}
process.exit(failed ? 1 : 0);
