# @misty-step/brand

The Misty Step identity that mistystep.io and stack.mistystep.io both use. It provides one stylesheet, the `<html>` attributes that stylesheet expects, a small runtime, the Mist sign, icons and social cards.

Everything here is generated from the brand configurator's `Locked` preset, which Phaedrus locked on 29 October 2026:

- mark `r2-a-mist` (Mist sign)
- type `industrial-condensed`
- colour `mono`
- layout `editorial`
- hero `horizon`
- motion `r2-mist-ground` (Ground fog) at its default params

The preset's copy, `r2-cut`, does not ship here. Each site keeps its own words.

## Install

```json
"@misty-step/brand": "github:misty-step/brand#v0.1.0"
```

npm and pnpm both resolve a GitHub tag. Every file is committed, so installing runs no build step.

## Exports

| Specifier | What it is |
|---|---|
| `@misty-step/brand/brand.css` | The whole look in one stylesheet: the OFL faces (`@font-face`, relative `url(./fonts/...)`), type and colour tokens for both themes, the configurator's base styles, and the editorial layout, horizon hero, Ground fog entrance and interaction, and Mist sign lockup CSS. The selectors match the configurator's, such as `html[data-layout="editorial"]` and `html[data-theme="dark"]`. |
| `@misty-step/brand/attrs` | `HTML_ATTRS`, the six `<html>` data attributes the stylesheet expects; `THEME_ATTR` (`'data-theme'`); and `twoLineLength(headline)`, the hero title's `--h2` value. |
| `@misty-step/brand/runtime` | `startBrand(options?) => { destroy() }`. See [Runtime](#runtime). |
| `@misty-step/brand/mark` | `MARK_16`, `MARK_32` and `MARK_FULL`: SVG strings in `currentColor`, one drawing per size. `lockup(name, opts?)`: the nav lockup. `FAVICON_SVG`: the 16 px drawing in light and dark, chosen by `prefers-color-scheme`. |
| `@misty-step/brand/identity/icons/*` | `favicon.svg` (light and dark), `favicon-32.png`, `apple-touch-icon.png` (180 px), `icon-192.png`, `icon-512.png`. The PNGs are the light drawing; PNG cannot follow the system theme. |
| `@misty-step/brand/identity/og/*` | `studio.png` and `stack.png`: 1200 x 630 social cards with the lockup, the page's headline and a Ground fog still. |

## The html element

Spread `HTML_ATTRS` onto `<html>`:

```html
<html lang="en" data-type="industrial-condensed" data-color="mono" data-layout="editorial" data-hero="horizon" data-mark="r2-a-mist" data-motion="r2-mist-ground">
```

The runtime adds two attributes and keeps them current:

- `data-reduced-motion` (`1` or `0`), from `prefers-reduced-motion`.
- `data-paused` (`1` or `0`), from the pause control.

Until the runtime has run, brand.css follows `prefers-reduced-motion` directly: entrances are finished and nothing animates.

## Theme

The site owns `data-theme` (`light` or `dark`):

- Set it from the visitor's stored choice, or from the system setting.
- Without the attribute, brand.css follows `prefers-color-scheme`. A page can therefore leave it unset until the visitor chooses, and needs no inline script to avoid a flash of the wrong theme.
- The runtime watches `data-theme` and the system setting. It re-colours the Ground fog field in place, without a remount.
- `meta[name="theme-color"]` and the toggle's label belong to the site.

## Markup

For the home pages, the contract is the configurator renderer's markup: the "Markup the renderer emits" section of [configurator/README.md](https://github.com/misty-step/brand/blob/master/configurator/README.md), plus the additions listed there. This is the skeleton with the horizon hero:

```html
<body id="top">
  <div class="bg" data-motion-root aria-hidden="true"></div>
  <a class="skip" href="#main">Skip to content</a>
  <header class="nav">
    <a class="brand" href="/" aria-label="Misty Step"><!-- lockup('MISTY STEP') --></a>
    <nav class="nav-links" aria-label="Primary"><a class="link" href="#process">…</a></nav>
    <div class="nav-actions"><button class="theme-toggle" aria-label="Switch to dark theme"><svg …></svg></button><a class="btn btn-primary btn-sm" href="…">…</a></div>
  </header>
  <main id="main" tabindex="-1">
    <section class="hero" data-hero-root>
      <div class="hero-motion-host" aria-hidden="true"></div>
      <div class="hz-copy">
        <h1 class="hero-title" data-enter style="--h2:22">…</h1>
        <div class="hz-row">
          <p class="hero-sub" data-enter>…</p>
          <div class="actions" data-enter><a class="btn btn-primary" href="…">…</a><a class="btn btn-quiet" href="…">…</a></div>
        </div>
      </div>
      <p class="hero-proof" data-enter>…</p>
    </section>
    <nav class="toc" aria-label="Contents">…</nav>
    <section class="s s-steps" id="process">…</section>
  </main>
  <footer class="foot"><p class="foot-line">…</p><nav class="foot-links" aria-label="Footer">…</nav></footer>
  <button class="motion-toggle" aria-pressed="false">Pause motion</button>
</body>
```

- **`--h2`.** Set `--h2` to `twoLineLength(headline)`. It sizes the headline so that it always breaks into at most two lines.
- **Entrance order.** brand.css sets `--enter-i` on `.hero-title` (0), `.hero-sub` (1), `.actions` (2) and `.hero-proof` (3). An inline value wins.
- **Strict CSP.** Under `style-src` without `'unsafe-inline'`, the browser refuses style attributes. Put `--h2` and the evidence bars' `--v` in your own stylesheet, for example `.hero-title{--h2:22}` and `.bar:nth-child(2) .bar-fill{--v:5/6}`.
- **Motion host.** Render `.hero-motion-host` yourself, so the server HTML is final. If it is missing, the runtime prepends one and removes it again on `destroy()`.
- **Toc.** `.toc` is hidden in the editorial layout. Emit it or leave it out.
- **Other pages.** Use the tokens and the editorial section primitives where they fit: `.s`, `.s-head`, `.s-title`, `.s-intro`, `.s-items`, `.item`, `.btn`, `.btn-primary`, `.btn-quiet`, `a.link`, `pre.code` and `.foot`.
- **Reference.** [demo/markup.mjs](https://github.com/misty-step/brand/blob/master/demo/markup.mjs) writes both home pages against this package alone. Its renders match the configurator's.

## Runtime

```js
import { startBrand } from '@misty-step/brand/runtime';
const brand = startBrand(); // after hydration
brand.destroy();            // before the page goes away
```

`startBrand` takes these options:

- `root` (`Document`): the document to manage. Default: the global document.
- `motion` (`boolean`): `false` mounts no field. Default: `true`.
- `params` (`Partial<GroundFogParams>`): overrides for the field's Locked values (screen, cell, inks, density, height, depth, wind, turbulence, travel, step). The field clamps each one to its range.

It owns this behaviour:

- **Entrances.** Each `[data-enter]` element gets `.is-in` as it scrolls into view. Under reduced motion, or while paused, all of them get it at once.
- **Ground fog field.** After first paint, it loads `field.js` and mounts the field into the hero's `.hero-motion-host`, but only while the hero is visible. The field stops offscreen and in hidden tabs.
- **Still frame.** Under reduced motion or Save-Data, the field draws one finished still frame and stops. Without WebGL, the field draws nothing. In all three cases nothing loops.
- **Pause control.** The `.motion-toggle` sets `aria-pressed`, its label and `data-paused`, and remembers the choice in localStorage (`brand-motion-paused`). It is hidden while there is nothing to pause. At 700 px and narrower it moves into a `.hero-motion-controls` row inside the hero, so it never covers copy. Above 700 px, and on `destroy()`, it returns to where the page rendered it.
- **Theme.** A change to `data-theme` re-colours the field in place.
- **Mark.** The Mist sign plays its entrance on `.brand-mark` once per page load. It never plays under reduced motion.
- **`destroy()`.** It stops the field, releases its GL context and canvas, and disconnects every observer and listener. Calling `startBrand()` again also destroys the previous handle, which makes the runtime safe after client-side navigation.

The runtime uses no eval, needs no inline script and makes no external requests. It writes inline styles only on the field's own elements (its wrapper and canvas), through CSSOM, which CSP allows.

### Next.js App Router

```tsx
// app/layout.tsx
import '@misty-step/brand/brand.css';
import { HTML_ATTRS } from '@misty-step/brand/attrs';
import { Brand } from './brand';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...HTML_ATTRS} suppressHydrationWarning>
      <body id="top">
        {children}
        <button className="motion-toggle" aria-pressed="false">Pause motion</button>
        <Brand />
      </body>
    </html>
  );
}
```

```tsx
// app/brand.tsx
'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { startBrand } from '@misty-step/brand/runtime';

export function Brand() {
  const pathname = usePathname();
  useEffect(() => {
    const brand = startBrand();
    return () => brand.destroy();
  }, [pathname]);
  return null;
}
```

- Keep the pause button in the root layout, so it outlives navigation.
- `suppressHydrationWarning` covers the attributes that a theme script and the runtime add to `<html>`.

### Astro

```astro
---
import '@misty-step/brand/brand.css';
import { HTML_ATTRS } from '@misty-step/brand/attrs';
import { lockup } from '@misty-step/brand/mark';
---
<html lang="en" {...HTML_ATTRS}>
  <body id="top">
    <header class="nav"><a class="brand" href="/" aria-label="mistystack" set:html={lockup('MISTYSTACK')} /></header>
    <slot />
    <button class="motion-toggle" aria-pressed="false">Pause motion</button>
    <script>
      import { startBrand } from '@misty-step/brand/runtime';
      startBrand();
    </script>
  </body>
</html>
```

With view transitions, start and destroy the runtime on Astro's events:

```js
let brand;
document.addEventListener('astro:page-load', () => { brand = startBrand(); });
document.addEventListener('astro:before-swap', () => brand?.destroy());
```

## Icons and social cards

Import the files through the package exports, or copy them into your public directory at build:

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:image" content="https://mistystep.io/og/studio.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```

`icon-192.png` and `icon-512.png` are for a web app manifest.

## Weight

- **CSS.** brand.css stays well under the 40 KB gzip budget.
- **Runtime.** runtime.js is the only script on the first load.
- **Field.** field.js holds the field: about 11 KB gzip, loaded after first paint.
- **Fonts.** The fonts are unhinted Latin subsets. Each loads only when a page uses it; Kode Mono, for example, loads only for code.

## Licences

Code is MIT: `LICENSE` sits at the repository root, and npm includes it in the package. The fonts are SIL Open Font License 1.1, with their licence texts beside them:

- `fonts/OFL-SofiaSans.txt`: Sofia Sans and Sofia Sans Extra Condensed (Lettersoup: Botio Nikoltchev, Ani Petrova)
- `fonts/OFL-KodeMono.txt`: Kode Mono (Isa Ozler)

Keep each licence file beside its font if you copy the fonts.

## Regenerate

The configurator's option modules are the only source. Nothing in this directory is edited by hand, except this README. From the repository root:

```sh
npm ci
npm run identity        # regenerate identity/ from the Locked preset in configurator/src/presets.ts
npm run identity:check  # change nothing; fail when a committed file is stale, missing or extra (CI runs this)
npm run identity:og     # Linux worker only: render og/*.png in headless Chromium (needs configurator/ dependencies)
```

| File | Generated from |
|---|---|
| `brand.css` | The type option (faces, tokens), the colour option (both themes), `configurator/src/preview/base.css`, and the layout, hero, motion (entrance and interaction) and mark CSS |
| `runtime.js` | `scripts/identity/runtime.ts`, the configurator's `MotionLifecycle` (`configurator/src/preview/motion.ts`) and the mark's `animateIn` |
| `field.js` | The motion option and its `_r2-mist` engine |
| `attrs.js` | The preset's picks, and `twoLineLength` from `configurator/options/hero/shared.ts` |
| `mark.js` | The mark's drawings at 16, 32 and 160 px, its drawn capitals for both names, and the themed favicon |
| `icons/*.png` | The mark, rasterised by @resvg/resvg-js |
| `og/*.png` | The card template in `scripts/identity/lib.mjs`, rendered in Chromium on a Linux worker |
| `manifest.json` | Source hashes of the rendered images, so the check catches a stale PNG without re-rendering it |

To change the identity:

1. Change the preset or the option module.
2. Run `npm run identity` and, for the cards, `npm run identity:og` on a worker.
3. Commit the result and tag a new version.
