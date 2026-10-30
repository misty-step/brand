#!/usr/bin/env node
// Behaviour proof for the package on the demo pages: the field runs, pauses, follows the theme without a remount,
// stops offscreen and in hidden tabs, draws one still frame under reduced motion and Save-Data, keeps the pause
// control in the hero on phones, keeps the hero order without inline styles, and destroy() releases everything.
// Headless Chromium on a Linux worker only (no browser runs on a Mac). From the repository root, with the
// configurator's dependencies installed and the root served (python3 -m http.server 4190 --bind 127.0.0.1):
//   node demo/proof.mjs http://127.0.0.1:4190 proof.json
import { writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { platform } from 'node:os';

if (platform() === 'darwin') {
  console.error('demo/proof.mjs drives a browser and refuses to run on macOS: run it on a Linux Boat worker.');
  process.exit(2);
}
const { chromium } = createRequire(new URL('../configurator/package.json', import.meta.url))('playwright');
const base = (process.argv[2] ?? 'http://127.0.0.1:4190').replace(/\/$/, '');
const out = process.argv[3] ?? 'proof.json';
const GL = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
const results = [];
function check(name, pass, detail) {
  results.push({ name, pass: Boolean(pass), detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} ${name}${detail === undefined ? '' : ` ${JSON.stringify(detail)}`}`);
}

// Counts requested animation frames: a stopped field requests none.
function countFrames() {
  const request = window.requestAnimationFrame.bind(window);
  window.__frames = 0;
  window.requestAnimationFrame = callback => {
    window.__frames++;
    return request(callback);
  };
}
async function open(browser, path, { width = 1440, height = 900, reduce = false, theme = 'light', init } = {}) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, colorScheme: theme, reducedMotion: reduce ? 'reduce' : 'no-preference' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error' || message.type() === 'warning') errors.push(message.text()); });
  await page.addInitScript(countFrames);
  if (init) await page.addInitScript(init);
  await page.goto(base + path, { waitUntil: 'load' });
  return { page, context, errors };
}
const drawn = page => page.waitForFunction(() => document.querySelector('.hero-motion-host canvas')?.style.opacity === '1', null, { timeout: 20000 });
async function framesIn(page, ms) {
  const before = await page.evaluate(() => window.__frames);
  await page.waitForTimeout(ms);
  return (await page.evaluate(() => window.__frames)) - before;
}
async function fieldClip(page) {
  const box = await page.locator('.hero-motion-host').boundingBox();
  return { x: box.x, y: box.y + box.height * 0.55, width: box.width, height: box.height * 0.45 };
}
async function changes(page, ms) {
  const clip = await fieldClip(page);
  const a = await page.screenshot({ clip });
  await page.waitForTimeout(ms);
  return Buffer.compare(a, await page.screenshot({ clip })) !== 0;
}
/** Lightest and darkest channel value in the field band. */
async function levels(page) {
  const png = await page.screenshot({ clip: await fieldClip(page) });
  return page.evaluate(async b64 => {
    const bitmap = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0);
    const data = ctx.getImageData(0, 0, bitmap.width, bitmap.height).data;
    let min = 255, max = 0;
    for (let i = 0; i < data.length; i += 4) { min = Math.min(min, data[i]); max = Math.max(max, data[i]); }
    return { min, max };
  }, png.toString('base64'));
}
const toggleState = page => page.evaluate(() => {
  const button = document.querySelector('.motion-toggle');
  return { paused: document.documentElement.dataset.paused, pressed: button.getAttribute('aria-pressed'), text: button.textContent, hidden: button.hidden, stored: localStorage.getItem('brand-motion-paused'), parent: button.parentElement.className || button.parentElement.tagName };
});

const browser = await chromium.launch({ headless: true, args: GL });
try {
  {
    const { page, context, errors } = await open(browser, '/demo/dist/studio.html');
    await drawn(page);
    check('field mounts in the server-rendered .hero-motion-host', await page.evaluate(() => document.querySelectorAll('.hero-motion-host').length === 1 && document.querySelectorAll('canvas').length === 1));
    check('field animates', (await framesIn(page, 1000)) > 10 && (await changes(page, 700)));
    await page.click('.motion-toggle');
    const paused = await toggleState(page);
    check('Pause sets data-paused, aria-pressed, label and storage', paused.paused === '1' && paused.pressed === 'true' && paused.text === 'Resume motion' && paused.stored === 'true', paused);
    await page.waitForTimeout(300);
    check('Pause stops the field (no frames, no pixel change)', (await framesIn(page, 1000)) <= 1 && !(await changes(page, 800)));
    const light = await levels(page);
    await page.evaluate(() => { window.__canvas = document.querySelector('.hero-motion-host canvas'); });
    await page.click('.theme-toggle');
    await page.waitForTimeout(400);
    const dark = await levels(page);
    const same = await page.evaluate(() => window.__canvas === document.querySelector('.hero-motion-host canvas') && window.__canvas.isConnected && document.querySelectorAll('canvas').length === 1);
    check('theme flip re-colours the field without a remount', same && light.min < 230 && dark.max < 128 && dark.max > dark.min, { light, dark, sameCanvas: same });
    await page.click('.motion-toggle');
    const resumed = await toggleState(page);
    check('Resume restarts the field', resumed.paused === '0' && resumed.stored === 'false' && (await framesIn(page, 1000)) > 10, resumed);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(500);
    check('field stops offscreen', (await framesIn(page, 1000)) <= 1);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    check('field restarts on screen', (await framesIn(page, 1000)) > 10);
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForTimeout(300);
    check('field stops in a hidden tab', (await framesIn(page, 1000)) <= 1);
    await page.evaluate(() => {
      delete document.hidden;
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForTimeout(300);
    const released = await page.evaluate(() => {
      const canvas = document.querySelector('.hero-motion-host canvas');
      const gl = canvas.getContext('webgl');
      window.brand.destroy();
      return { connected: canvas.isConnected, lost: gl.isContextLost(), canvases: document.querySelectorAll('canvas').length, hostChildren: document.querySelector('.hero-motion-host').childElementCount, toggle: document.querySelector('.motion-toggle').parentElement.tagName };
    });
    check('destroy() releases the canvas and its GL context', !released.connected && released.lost && released.canvases === 0 && released.hostChildren === 0 && released.toggle === 'BODY', released);
    check('nothing runs after destroy()', (await framesIn(page, 1000)) === 0);
    await page.evaluate(() => { window.brand = window.startBrand(); });
    await drawn(page);
    check('startBrand() runs again after destroy (client-side navigation)', await page.evaluate(() => document.querySelectorAll('canvas').length === 1));
    check('no console errors (studio, motion)', errors.length === 0, errors);
    await context.close();
  }
  {
    const { page, context, errors } = await open(browser, '/demo/dist/studio.html', { reduce: true });
    await drawn(page);
    await page.waitForTimeout(600);
    const state = await page.evaluate(() => ({ reduced: document.documentElement.dataset.reducedMotion, hidden: document.querySelector('.motion-toggle').hidden, settled: [...document.querySelectorAll('[data-enter]')].every(el => el.classList.contains('is-in')) }));
    check('reduced motion: one still frame, entrances settled, no pause control', state.reduced === '1' && state.hidden && state.settled && (await framesIn(page, 1000)) <= 1 && !(await changes(page, 1000)), state);
    check('no console errors (reduced motion)', errors.length === 0, errors);
    await context.close();
  }
  {
    const init = () => Object.defineProperty(navigator, 'connection', { configurable: true, get: () => ({ saveData: true }) });
    const { page, context, errors } = await open(browser, '/demo/dist/studio.html', { init });
    await drawn(page);
    await page.waitForTimeout(600);
    const hidden = await page.evaluate(() => document.querySelector('.motion-toggle').hidden);
    check('Save-Data: one still frame, no pause control', hidden && (await framesIn(page, 1000)) <= 1 && !(await changes(page, 1000)), { hidden });
    check('no console errors (Save-Data)', errors.length === 0, errors);
    await context.close();
  }
  {
    const { page, context, errors } = await open(browser, '/demo/dist/studio.html', { width: 390, height: 844 });
    await drawn(page);
    const phone = await page.evaluate(() => {
      const button = document.querySelector('.motion-toggle');
      return { holder: button.parentElement.className, inHero: button.parentElement.parentElement.matches('[data-hero-root]'), visible: !button.hidden && !button.parentElement.hidden };
    });
    check('phone: the pause control sits in the hero row', phone.holder === 'hero-motion-controls' && phone.inHero && phone.visible, phone);
    const after = await page.evaluate(() => {
      window.brand.destroy();
      return { parent: document.querySelector('.motion-toggle').parentElement.tagName, holders: document.querySelectorAll('.hero-motion-controls').length };
    });
    check('phone: destroy() puts the control back where the page rendered it', after.parent === 'BODY' && after.holders === 0, after);
    check('no console errors (phone)', errors.length === 0, errors);
    await context.close();
  }
  {
    const { page, context, errors } = await open(browser, '/demo/dist/stack.html');
    const order = await page.evaluate(() => ['.hero-title', '.hero-sub', '.actions', '.hero-proof'].map(sel => getComputedStyle(document.querySelector(`.hero ${sel}`)).getPropertyValue('--ma-i').trim()));
    check('strict-CSP hero (no inline --enter-i) keeps the entrance order', order.join() === '0,1,2,3', order);
    await drawn(page);
    check('no console errors (stack)', errors.length === 0, errors);
    await context.close();
  }
} finally {
  await browser.close();
}
{
  const browser = await chromium.launch({ headless: true, args: ['--disable-webgl', '--disable-3d-apis'] });
  try {
    const { page, context, errors } = await open(browser, '/demo/dist/studio.html');
    await page.waitForTimeout(2500);
    const state = await page.evaluate(() => ({ title: document.querySelector('h1.hero-title')?.getBoundingClientRect().height > 0, drawnCanvas: document.querySelector('.hero-motion-host canvas')?.style.opacity === '1' }));
    check('without WebGL: the page renders, the field draws nothing and nothing loops', state.title && !state.drawnCanvas && (await framesIn(page, 1000)) <= 1, state);
    check('no console errors (no WebGL)', errors.length === 0, errors);
    await context.close();
  } finally {
    await browser.close();
  }
}
await writeFile(out, JSON.stringify(results, null, 1));
const failed = results.filter(result => !result.pass);
console.log(`${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
