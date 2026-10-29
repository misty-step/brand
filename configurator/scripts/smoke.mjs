import { chromium } from 'playwright';
import { preview } from 'vite';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const layers = ['mark', 'type', 'color', 'layout', 'hero', 'motion', 'copy'];
const usage = `Usage: node scripts/smoke.mjs [--url <origin>] [--webgl] [--out <dir>]
  --url     Test a deployed build instead of serving local dist/.
  --webgl   Enable SwiftShader and require WebGL proof for WebGL motion options.
            Forbidden on macOS. Run this mode on a Linux Boat worker.
  --out     Write smoke.json and 390/1440 screenshots for each motion and preset.
Default: Playwright bundled headless shell only. Never desktop Chrome or a relay.`;
const config = { url: process.env.LAB_URL, webgl: false, out: null };
for (let i = 2; i < process.argv.length; i++) {
  const flag = process.argv[i];
  if (flag === '--help' || flag === '-h') { console.log(usage); process.exit(0); }
  if (flag === '--webgl') { config.webgl = true; continue; }
  if (flag === '--url' || flag === '--out') {
    const value = process.argv[++i];
    if (!value || value.startsWith('--')) throw new Error(`${flag} needs a value.\n${usage}`);
    config[flag.slice(2)] = value;
    continue;
  }
  throw new Error(`Unknown flag: ${flag}\n${usage}`);
}
if (config.webgl && process.platform === 'darwin') {
  throw new Error('--webgl is forbidden on this Mac. Use a Linux Boat worker; no browser was launched.');
}
if (config.url) {
  const url = new URL(config.url);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('--url must be HTTP or HTTPS.');
  config.url = url.href.replace(/\/$/, '');
}
const out = config.out ? path.resolve(config.out) : path.join(root, 'evidence');
await mkdir(out, { recursive: true });
const inventory = [];
for (const layer of layers) {
  for (const entry of await readdir(path.join(root, 'options', layer), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const files = await readdir(path.join(root, 'options', layer, entry.name));
    if (files.includes('index.ts')) inventory.push({ layer, id: entry.name });
  }
}
const server = config.url ? null : await preview({ root, preview: { host: '127.0.0.1', port: 4177, strictPort: true } });
const base = config.url ?? 'http://127.0.0.1:4177';
// The default deliberately has no channel, executablePath, app path, or GUI mode.
const launch = config.webgl
  ? { headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }
  : { headless: true };
let browser;
const results = [];

function instrument() {
  const stats = window.__labSmoke = { draws: 0, webglContexts: 0, webglAttempts: 0 };
  const original = HTMLCanvasElement.prototype.getContext;
  const seen = new WeakSet();
  HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
    const isGL = /webgl/i.test(String(kind));
    if (isGL) stats.webglAttempts++;
    const context = original.call(this, kind, ...args);
    if (!context || seen.has(context)) return context;
    seen.add(context);
    if (isGL) stats.webglContexts++;
    for (const name of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced', 'drawRangeElements', 'clear', 'clearRect', 'fillRect', 'drawImage', 'fill', 'stroke', 'putImageData']) {
      if (typeof context[name] !== 'function') continue;
      const fn = context[name];
      context[name] = function (...values) {
        this.canvas.__labDraws = (this.canvas.__labDraws ?? 0) + 1;
        // Count even detached GL work; detached 2D colour parsers are not a background.
        if (isGL || this.canvas.isConnected) stats.draws++;
        return fn.apply(this, values);
      };
    }
    return context;
  };
}
const baseline = () => ({ v: 1, page: 'studio', theme: 'light', reducedMotion: false, paused: false, fullPreview: false, picks: Object.fromEntries(layers.map(layer => [layer, 'baseline-' + layer])), locks: [] });
const href = state => base + '/preview.html#' + encodeURIComponent(JSON.stringify(state));
const safeName = value => value.replace(/[^a-zA-Z0-9._-]/g, '-');

async function checkState({ label, state, width, option, shot }) {
  const context = await browser.newContext({
    viewport: { width, height: width === 390 ? 844 : 900 },
    deviceScaleFactor: width === 390 ? 2 : 1,
    isMobile: width === 390, hasTouch: width === 390,
    colorScheme: state.theme, reducedMotion: state.reducedMotion ? 'reduce' : 'no-preference',
  });
  await context.addInitScript(instrument);
  const page = await context.newPage();
  const errors = [];
  let evidence;
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  try {
    await page.goto(href(state), { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__LAB__?.ready, null, { timeout: 15000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout((config.webgl && option?.layer === 'motion') || shot ? 2500 : 180);
    const shape = await page.evaluate(() => {
      const runtime = window.__LAB__;
      const host = runtime.motion?.host === 'page'
        ? document.querySelector('[data-motion-root]')
        : runtime.motion?.host === 'full'
          ? document.querySelector('.hero-motion-host')
          : document.querySelector('[data-motion-slot]');
      const canvases = [...document.querySelectorAll('canvas')];
      return {
        h1: document.querySelectorAll('h1.hero-title').length,
        width: document.documentElement.scrollWidth, viewport: innerWidth,
        runtime, canvases: canvases.length,
        canvasDraws: canvases.reduce((sum, canvas) => sum + (canvas.__labDraws ?? 0), 0),
        stillArt: !!host?.querySelector('svg,img') || (!!host && getComputedStyle(host).backgroundImage !== 'none'),
        ...window.__labSmoke,
      };
    });
    if (shape.h1 !== 1) errors.push(`Expected one h1.hero-title, got ${shape.h1}`);
    if (shape.width > shape.viewport + 1) errors.push(`Horizontal overflow: ${shape.width} > ${shape.viewport}`);
    if (option && shape.runtime.state.picks[option.layer] !== option.id) errors.push(`Deployed build did not resolve ${option.layer}/${option.id}`);
    if (config.webgl && option?.layer === 'motion' && !shape.runtime.motion) errors.push('Preview lacks renderer metadata. Deploy the current build before WebGL proof.');
    const renderer = shape.runtime.motion?.renderer ?? 'none';
    if (config.webgl && option?.layer === 'motion' && renderer === 'webgl') {
      if (!state.reducedMotion) {
        if (!shape.canvases) errors.push('WebGL motion created no canvas');
        if (!shape.webglContexts) errors.push(`WebGL motion created no WebGL context (${shape.webglAttempts} attempts)`);
        if (!shape.canvasDraws) errors.push('WebGL motion never painted a frame');
      } else if (!shape.canvasDraws && !shape.stillArt) {
        errors.push('Reduced WebGL motion did not render a still canvas, image, SVG, or poster');
      }
    }
    let reducedDrawDelta = null;
    if (state.reducedMotion) {
      const before = await page.evaluate(() => window.__labSmoke.draws);
      await page.waitForTimeout(300);
      reducedDrawDelta = await page.evaluate(() => window.__labSmoke.draws) - before;
      if (reducedDrawDelta) errors.push(`Reduced motion still draws: ${reducedDrawDelta} calls`);
    }
    if (shot) await page.screenshot({ path: path.join(out, shot), timeout: 20000 });
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(180);
    const offscreen = await page.evaluate(() => {
      const rect = document.querySelector('[data-hero-root]').getBoundingClientRect();
      return rect.bottom <= 0 || rect.top >= innerHeight;
    });
    const before = await page.evaluate(() => window.__labSmoke.draws);
    await page.waitForTimeout(300);
    const offscreenDrawDelta = await page.evaluate(() => window.__labSmoke.draws) - before;
    if (offscreen && offscreenDrawDelta) errors.push(`Offscreen motion still draws: ${offscreenDrawDelta} calls`);
    if (config.webgl && option?.layer === 'motion' && renderer === 'webgl' && !offscreen) errors.push('Could not scroll the hero offscreen to prove drawing stopped');
    evidence = { renderer, canvases: shape.canvases, webglContexts: shape.webglContexts, webglAttempts: shape.webglAttempts, canvasDraws: shape.canvasDraws, offscreen, offscreenDrawDelta, reducedDrawDelta, ...(shot ? { screenshot: shot } : {}) };
  } catch (error) { errors.push(error.message); }
  finally { await context.close(); }
  const result = { label, pass: errors.length === 0, ...(errors.length ? { errors } : {}), ...(evidence ? { evidence } : {}) };
  results.push(result);
  console.log((result.pass ? 'PASS ' : 'FAIL ') + label + (errors.length ? ' ' + errors.join('; ') : ''));
}

try {
  browser = await chromium.launch(launch);
  for (const option of inventory) {
    for (const page of ['studio', 'stack']) for (const width of [390, 1440]) for (const theme of ['light', 'dark']) for (const reducedMotion of option.layer === 'motion' ? [false, true] : [false]) {
      const state = { ...baseline(), page, theme, reducedMotion };
      state.picks[option.layer] = option.id;
      const label = `${option.layer}/${option.id} ${page} ${width} ${theme}${reducedMotion ? ' reduced' : ''}`;
      const shot = config.out && option.layer === 'motion' && page === 'studio' && theme === 'light' && !reducedMotion ? `motion-${safeName(option.id)}-${width}.png` : null;
      await checkState({ label, state, width, option, shot });
    }
  }
  const shell = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  shell.on('pageerror', error => errors.push(error.message));
  await shell.goto(base, { waitUntil: 'networkidle' });
  await shell.waitForFunction(() => window.__LAB__?.ready);
  const shellInfo = await shell.evaluate(() => window.__LAB__);
  await shell.locator('[data-action="save"]').click();
  await shell.locator('[data-action="save"]').click();
  await shell.locator('[data-action="shortlist"]').click();
  const boxes = shell.locator('[data-compare]');
  await boxes.nth(0).check(); await boxes.nth(1).check();
  await shell.locator('[data-action="compare"]').click();
  if (await shell.locator('.compare-item').count() !== 2) errors.push('Compare did not render two saved combinations');
  await shell.keyboard.press('Escape');
  await shell.locator('[data-action="spec"]').click();
  if (!await shell.locator('#panel').isVisible()) errors.push('Spec panel not opened');
  await shell.keyboard.press('Escape');
  const composition = await shell.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth + 1, desktop: document.querySelector('.desktop .frame-window').getBoundingClientRect().width, viewport: innerWidth }));
  if (composition.overflow) errors.push('Shell horizontal overflow at 1440');
  if (composition.desktop < composition.viewport * .65) errors.push(`Desktop preview too small: ${composition.desktop}/${composition.viewport}`);
  await shell.locator('.head-actions [data-action="full"]').click();
  if (await shell.locator('.rail').isVisible()) errors.push('Full preview did not hide controls');
  await shell.keyboard.press('Escape');
  const desktop = await (await shell.locator('#desktop').elementHandle()).contentFrame();
  await desktop.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await shell.locator('[data-page="stack"]').click();
  await desktop.waitForFunction(() => document.documentElement.dataset.page === 'stack' && window.__LAB__?.ready);
  if (await desktop.evaluate(() => scrollY) !== 0) errors.push('Changed page did not start at the top');
  await shell.locator('[data-page="studio"]').click();
  await desktop.waitForFunction(() => document.documentElement.dataset.page === 'studio' && window.__LAB__?.ready);
  await shell.screenshot({ path: path.join(out, 'shell-1440.png'), timeout: 20000 });
  results.push({ label: 'shell shortlist + compare + spec + full preview + scroll reset', pass: !errors.length, ...(errors.length ? { errors } : {}) });
  await shell.close();
  // Presets are declared by the shell; this automatically covers the curator's later additions.
  if (config.out) for (const preset of shellInfo.presets ?? []) for (const width of [390, 1440]) {
    await checkState({ label: `preset/${preset.id} studio ${width} light`, state: { ...baseline(), picks: preset.picks }, width, shot: `preset-${safeName(preset.id)}-${width}.png` });
  }
} catch (error) {
  results.push({ label: 'runner', pass: false, errors: [error.message] });
  console.error(error.message);
} finally {
  await browser?.close();
  await server?.close();
}
const failed = results.filter(result => !result.pass);
const summary = { at: new Date().toISOString(), base, platform: process.platform, backend: config.webgl ? 'Bundled Playwright headless shell with SwiftShader, off-Mac WebGL proof' : 'Bundled Playwright headless shell, no desktop browser or relay', webgl: config.webgl, inventory, states: results.length, passed: results.length - failed.length, failed: failed.length, results };
await writeFile(path.join(out, 'smoke.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify({ states: summary.states, passed: summary.passed, failed: summary.failed, inventory: inventory.length, out }));
if (failed.length) process.exitCode = 1;
