#!/usr/bin/env node
// npm run identity: regenerate identity/ from the configurator's Locked preset.
// npm run identity:check: change nothing; fail when any committed file is stale, missing or extra.
// The social cards need a browser, so og.mjs renders them on a Linux worker; both modes fail while they are stale.
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { collect, OUT, outputs, rasterise } from './lib.mjs';

const check = process.argv.includes('--check');
const KEEP = new Set(['README.md']); // written by hand, never generated

const data = await collect();
const { files, icons, og } = await outputs(data);
const manifestPath = join(OUT, 'manifest.json');
const previous = existsSync(manifestPath) ? JSON.parse(await readFile(manifestPath, 'utf8')) : {};
const recorded = previous.rasters ?? {};
const manifest = {
  note: 'Source hashes of the rendered images. generate.mjs renders the icons; og.mjs renders the social cards on a Linux worker.',
  locked: data.picks,
  rasters: {
    ...Object.fromEntries([...icons].map(([file, icon]) => [file, icon.hash])),
    ...Object.fromEntries([...og.keys()].map(file => [file, recorded[file] ?? null])),
  },
};
files.set('manifest.json', JSON.stringify(manifest, null, 2) + '\n');

const problems = [];
const same = async (file, contents) => existsSync(join(OUT, file)) && Buffer.compare(await readFile(join(OUT, file)), Buffer.from(contents)) === 0;
for (const [file, contents] of files) {
  if (await same(file, contents)) continue;
  if (check) problems.push(`${file} is stale`);
  else {
    await mkdir(dirname(join(OUT, file)), { recursive: true });
    await writeFile(join(OUT, file), contents);
    console.log(`wrote identity/${file}`);
  }
}
for (const [file, icon] of icons) {
  if (recorded[file] === icon.hash && existsSync(join(OUT, file))) continue;
  if (check) problems.push(`${file} is stale (its source changed)`);
  else {
    await mkdir(dirname(join(OUT, file)), { recursive: true });
    await writeFile(join(OUT, file), rasterise(icon.source));
    console.log(`rendered identity/${file}`);
  }
}
const stale = [...og].filter(([file, card]) => recorded[file] !== card.hash || !existsSync(join(OUT, file))).map(([file]) => file);
for (const file of stale) problems.push(`${file} is stale: run npm run identity:og on a Linux worker (no browser runs on a Mac)`);

const owned = new Set([...files.keys(), ...icons.keys(), ...og.keys(), ...KEEP]);
async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield relative(OUT, path);
  }
}
if (existsSync(OUT)) {
  for await (const file of walk(OUT)) {
    if (owned.has(file)) continue;
    if (check) problems.push(`${file} is not generated`);
    else {
      await rm(join(OUT, file));
      console.log(`removed identity/${file}`);
    }
  }
}

if (problems.length) {
  console.error(`identity${check ? ':check' : ''}: ${problems.length} problem${problems.length > 1 ? 's' : ''}\n- ${problems.join('\n- ')}`);
  if (check) console.error('Run npm run identity (and npm run identity:og on a Linux worker for the social cards), then commit identity/.');
  process.exit(1);
}
console.log(check ? 'identity:check: identity/ matches the configurator\'s Locked preset' : 'identity: up to date');
