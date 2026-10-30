#!/usr/bin/env node
// npm run demo: write demo/dist/studio.html and demo/dist/stack.html, the Locked home pages built on the package
// alone (markup.mjs). Only the words come from the configurator's r2-cut copy, as each site keeps its own.
// Serve the repository root (for example `python3 -m http.server`) and open /demo/dist/<page>.html.
// The stack page writes its hero without inline --enter-i, as a strict-CSP site must.
import { mkdir, writeFile } from 'node:fs/promises';
import { collect } from '../scripts/identity/lib.mjs';
import { page } from './markup.mjs';

const { options } = await collect();
const dist = new URL('./dist/', import.meta.url);
await mkdir(dist, { recursive: true });
for (const name of ['studio', 'stack']) {
  await writeFile(new URL(`${name}.html`, dist), page(options.copy.pages[name], { inlineOrder: name === 'studio' }));
  console.log(`wrote demo/dist/${name}.html`);
}
