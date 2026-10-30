#!/usr/bin/env node
// Pixel comparison of the demo renders with the configurator's reference renders. Pairs ref-<name>.jpg with
// demo-<name>.jpg, decodes both in headless Chromium (Linux worker only) and writes pair-<name>.jpg strips
// (reference | demo | differences in red) plus compare.json. Usage: node demo/compare.mjs <refDir> <demoDir> <outDir>
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { platform } from 'node:os';
import { join } from 'node:path';

if (platform() === 'darwin') {
  console.error('demo/compare.mjs decodes images in a browser and refuses to run on macOS: run it on a Linux Boat worker.');
  process.exit(2);
}
const { chromium } = createRequire(new URL('../configurator/package.json', import.meta.url))('playwright');
const [refDir, demoDir, outDir] = process.argv.slice(2);
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext()).newPage();
const rows = [];
try {
  for (const file of (await readdir(refDir)).filter(name => name.startsWith('ref-') && name.endsWith('.jpg')).sort()) {
    const name = file.slice('ref-'.length);
    const demo = join(demoDir, `demo-${name}`);
    if (!existsSync(demo)) {
      rows.push({ name, missing: true });
      continue;
    }
    const [a, b] = await Promise.all([readFile(join(refDir, file)), readFile(demo)]);
    const stats = await page.evaluate(async ([ra, rb]) => {
      const load = async b64 => createImageBitmap(await (await fetch(`data:image/jpeg;base64,${b64}`)).blob());
      const [ia, ib] = await Promise.all([load(ra), load(rb)]);
      const w = Math.max(ia.width, ib.width), h = Math.max(ia.height, ib.height);
      const pixels = image => {
        const ctx = new OffscreenCanvas(w, h).getContext('2d');
        ctx.drawImage(image, 0, 0);
        return ctx.getImageData(0, 0, w, h).data;
      };
      const da = pixels(ia), db = pixels(ib);
      const strip = new OffscreenCanvas(w * 3, h);
      const ctx = strip.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, w * 3, h);
      ctx.drawImage(ia, 0, 0);
      ctx.drawImage(ib, w, 0);
      const diff = ctx.createImageData(w, h);
      let mismatched = 0, max = 0;
      for (let i = 0; i < da.length; i += 4) {
        const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2]));
        max = Math.max(max, d);
        const bad = d > 32; // JPEG noise stays well under this; any real change in content does not
        if (bad) mismatched++;
        const grey = 200 + (da[i] >> 3);
        diff.data.set(bad ? [230, 0, 0, 255] : [grey, grey, grey, 255], i);
      }
      ctx.putImageData(diff, w * 2, 0);
      const blob = await strip.convertToBlob({ type: 'image/jpeg', quality: 0.72 });
      const url = await new Promise(resolve => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(blob); });
      return { size: [ia.width, ia.height, ib.width, ib.height], mismatched: mismatched / (w * h), max, strip: url.slice(url.indexOf(',') + 1) };
    }, [a.toString('base64'), b.toString('base64')]);
    await writeFile(join(outDir, `pair-${name}`), Buffer.from(stats.strip, 'base64'));
    const row = { name, identicalBytes: Buffer.compare(a, b) === 0, sameSize: stats.size[0] === stats.size[2] && stats.size[1] === stats.size[3], size: stats.size, mismatchedPct: Number((stats.mismatched * 100).toFixed(3)), maxChannelDiff: stats.max };
    rows.push(row);
    console.log(`${name}: ${row.identicalBytes ? 'identical bytes' : `${row.mismatchedPct}% pixels differ (max ${row.maxChannelDiff})`}${row.sameSize ? '' : ` size ${stats.size.join('x')}`}`);
  }
} finally {
  await browser.close();
}
await writeFile(join(outDir, 'compare.json'), JSON.stringify(rows, null, 1));
