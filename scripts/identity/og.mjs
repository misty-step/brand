#!/usr/bin/env node
// npm run identity:og: render identity/og/<page>.png (1200 x 630) in headless Chromium and record their
// source hashes in identity/manifest.json. No browser may run on a Mac here: run it on a Linux Boat worker,
// after npm run identity, with the configurator's dependencies installed (it uses their Playwright).
import { once } from 'node:events';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { platform } from 'node:os';
import { extname, join, normalize } from 'node:path';
import { collect, CONF, OG, OUT, outputs } from './lib.mjs';

if (platform() === 'darwin') {
  console.error('identity:og renders in a browser, and no browser may run on a Mac: run it on a Linux Boat worker.');
  process.exit(2);
}
const { chromium } = createRequire(join(CONF, 'package.json'))('playwright');

const data = await collect();
const { files, og } = await outputs(data);
for (const [file, contents] of files) {
  if (!existsSync(join(OUT, file)) || Buffer.compare(await readFile(join(OUT, file)), Buffer.from(contents)) !== 0) {
    console.error(`identity/${file} is stale: run npm run identity first, so the cards draw with the committed runtime.`);
    process.exit(1);
  }
}

// The cards load the committed runtime, field and fonts from identity/, as a site would.
const TYPES = { '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const pages = new Map([...og.values()].map(card => [`/og/${card.page}.html`, card.html]));
const server = createServer(async (request, response) => {
  const path = new URL(request.url, 'http://127.0.0.1').pathname;
  if (pages.has(path)) {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end(pages.get(path));
    return;
  }
  const file = normalize(join(OUT, path));
  if (!file.startsWith(OUT) || !existsSync(file)) {
    response.writeHead(404);
    response.end();
    return;
  }
  response.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  response.end(await readFile(file));
});
server.listen(0, '127.0.0.1');
await once(server, 'listening');
const base = `http://127.0.0.1:${server.address().port}`;

const manifest = JSON.parse(await readFile(join(OUT, 'manifest.json'), 'utf8'));
const browser = await chromium.launch({ headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
try {
  for (const [file, card] of og) {
    // Reduced motion: the field draws its one finished still frame.
    const context = await browser.newContext({ viewport: { width: OG.width, height: OG.height }, deviceScaleFactor: 1, colorScheme: OG.theme, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const problems = [];
    page.on('pageerror', error => problems.push(String(error)));
    page.on('console', message => { if (message.type() === 'error' || message.type() === 'warning') problems.push(message.text()); });
    await page.goto(`${base}/og/${card.page}.html`, { waitUntil: 'load' });
    await page.evaluate(async () => {
      const css = getComputedStyle(document.querySelector('.hero-title'));
      await document.fonts.load(`${css.fontWeight} ${css.fontSize} ${css.fontFamily}`);
      await document.fonts.ready;
    });
    await page.waitForFunction(() => document.querySelector('.hero-motion-host canvas')?.style.opacity === '1', null, { timeout: 20000 });
    await page.waitForTimeout(800); // the canvas fades in over 400 ms
    if (problems.length) throw new Error(`${file}: ${problems.join('; ')}`);
    await mkdir(join(OUT, 'og'), { recursive: true });
    await writeFile(join(OUT, file), await page.screenshot({ type: 'png' }));
    manifest.rasters[file] = card.hash;
    await context.close();
    console.log(`rendered identity/${file}`);
  }
} finally {
  await browser.close();
  server.close();
}
await writeFile(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
