# Misty Step brand

The Misty Step brand configurator lives here. It renders the real studio and mistystack home pages, with independently selectable marks, typefaces, colour, layout, heroes, motion and copy.

Phaedrus locked the identity on 29 October 2026: the configurator's `Locked` preset (Mist sign, industrial condensed type, mono, editorial layout, horizon hero, Ground fog). Both sites consume the identity package generated from that preset, in [identity/](identity/README.md).

## Run the configurator

```sh
cd configurator
npm install
npm run dev
```

See [the configurator guide](configurator/README.md) for option authoring, the rendering contract, verification and the isolated preview deployment.

This repository is separate from the archived `misty-step/aesthetic` design system. The configurator explores its successor; it does not deploy either production site.

## The identity package

The repository root is the package `@misty-step/brand`. Both sites install it from a tag:

```json
"@misty-step/brand": "github:misty-step/brand#v0.1.0"
```

`identity/` holds the stylesheet, the html attributes, the runtime, the mark, the icons and the social cards. A script generates every file there from the configurator's option modules. Nothing in it is copied by hand. [identity/README.md](identity/README.md) covers install, markup, the runtime, Next.js and Astro usage, licences and regeneration.

```sh
npm ci
npm run identity        # regenerate identity/ from the Locked preset
npm run identity:check  # fail when identity/ is stale; CI runs it on every pull request
npm run identity:og     # render the social cards (Linux worker only: no browser runs on a Mac)
```

`demo/` is the package's proof fixture, outside the published files. `npm run demo` writes both home pages against the package alone. On a Linux worker, `demo/proof.mjs` checks the runtime's behaviour, and `demo/compare.mjs` compares the pages' renders with the configurator's.

## Licences

Code is MIT ([LICENSE](LICENSE)). Every font is SIL Open Font License 1.1; its licence file sits beside it.
