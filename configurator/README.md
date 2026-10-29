# Misty Step brand configurator

The working brand lab for Misty Step, in `misty-step/brand`. It renders the real studio and stack home-page content through seven independently selectable layers. The archived aesthetic package stays untouched; its one-size/no-scroll law does not apply to this commissioned successor exploration.

## Run

```sh
cd configurator
npm install
npm run dev
# http://127.0.0.1:5173
npm run build
npm run smoke
```

`npm run smoke` serves the production build and uses only Playwright's bundled `chrome-headless-shell`, via `chromium.launch({ headless: true })`. Desktop Chrome, browser channels, executable overrides, the operator's relay, Tern and GUI apps are forbidden. Only LabCore runs browser verification, one run at a time. Builders use builds/type checks/source review and report visual checks as pending conductor. Set `LAB_URL` to smoke a deployed preview. The script checks every option against the plain baseline on both pages, 390/1440, light/dark, plus reduced motion for motion options. Console errors, overflow, missing h1, offscreen canvas drawing, or reduced-motion drawing fail the run. Machine evidence goes to ignored `evidence/smoke.json`. This backend exercises intentional no-WebGL still fallbacks; real WebGL rendering is verified off this Mac later.

## Add an option

Create `options/<layer>/<id>/index.ts`, default-exporting the corresponding option type from `src/contract.ts`. The id must equal its directory. The Vite registry discovers it lazily with `import.meta.glob('/options/*/*/index.ts')`. Keep assets and font licence files beside the option. Helpers may live inside your layer directory without an `index.ts` at that depth. Do not modify another layer or the renderer. Branch from `origin/feat/lab-007`, use your own worktree, push your branch, and report `ready: <branch> <sha> <ids>` to LabCore.

All options consume tokens, not another option's choices. CSS scopes under `html[data-<layer>="<id>"]`. Layout and hero never set font families or literal colours. Layout defines static geometry and colours; motion owns transition lists and press transforms. Every option names references and explains what it learns. Baselines are intentionally plain controls, not directions.

Copy imports `src/content/facts.ts`. It is the single home for the offer, five project descriptions and hosts, current native install commands, current core, and reported historical trial. Facts were read from the private studio source and public stack master on 2026-10-29. The trial is the draft PR #607 record, not a current-adapter evaluation: current 4/6, kernel 5/6, no injected guidance 2/6, with limits retained. Commands are displayed verbatim, not run into a live profile. Grok Bot has a setup brief, not an invented install command.

## Runtime and markup

`preview.html` takes the same encoded JSON hash as the shell. Page, theme, reduced motion, pause, full-preview mode, every selected option and layer locks travel in the URL. Section hash links scroll without replacing that configuration. The shell's shortlist and notes stay in localStorage. Alt+R shuffles unlocked layers, Alt+S saves, Alt+L copies the share link. Native select controls support keyboard navigation; dialogs and full-preview mode close with Escape. The compact rail keeps every layer on one line; select its name to expand the summary and references. At a 1440px shell the desktop preview occupies more than 65% of the viewport, beside a 240px-wide phone frame. Full preview hides the controls. Frame sizing responds only to user/layout events, with no ResizeObserver or animation loop. Page and option changes start at scroll position zero.

The renderer emits the contract below. Additions: stable tab/panel ids and ARIA relationships; `id="top"` on body; `tabindex="-1"` on main so the skip link can move focus; an explicit brand-link accessible name; `data-paused` on html; external links open a new tab with `rel="noopener noreferrer"`; full-hero backgrounds use an aria-hidden `.hero-motion-host`; panel heroes without a motion slot receive `.hero-visual[data-motion-slot]`. The optional mark extension `css?: string` is restricted to `.brand`, `.brand-mark`, `.brand-name`, scoped under its data-mark id; canonical contract types remain unchanged and authors may use `MarkOption & { css: string }`.

Type faces use local `@font-face` with swap and the declared weight/style/range. Color and type tokens are injected into the root. Theme-only updates call the existing motion handle's `update()`; option/page swaps destroy it. Backgrounds lazy-load after semantic first paint, mount at the hero's requested host, stop offscreen/hidden/paused, and receive `dprCap: 1.5`. Reduced motion shows the final still state. One entrance observer adds `.is-in` to `[data-enter]`. The motion toggle pauses all CSS animation and the background.

## Markup the renderer emits (layouts and heroes style exactly this)
```html
<html data-page data-theme data-reduced-motion data-mark data-type data-color data-layout data-hero data-motion data-copy>
<body>
  <div class="bg" data-motion-root aria-hidden="true"></div>
  <a class="skip" href="#main">Skip to content</a>
  <header class="nav">
    <a class="brand" href="#top"><span class="brand-mark">[mark svg]</span><span class="brand-name">[brand or custom wordmark]</span></a>
    <nav class="nav-links" aria-label="Primary"><a class="link">..</a>...</nav>
    <div class="nav-actions"><button class="theme-toggle" aria-label="..">..</button><a class="btn btn-primary btn-sm">[navCta]</a></div>
  </header>
  <main id="main">
    <section class="hero" data-hero-root>[hero option html]</section>
    <section class="s s-steps" id="..">
      <div class="s-head" data-enter><h2 class="s-title">..</h2><p class="s-intro">..</p></div>
      <ol class="s-items"><li class="item" data-enter><span class="item-label">..</span><h3 class="item-title">..</h3><p class="item-terms">..</p><p class="item-body">..</p></li>...</ol>
    </section>
    <section class="s s-work"> s-head; <div class="group"><h3 class="group-label">..</h3><ul class="s-items"><li class="item" data-enter><a class="item-link" href><span class="item-title">..</span><span class="item-body">..</span><span class="item-host">..</span></a></li></ul></div></section>
    <section class="s s-points"> s-head; <ul class="s-items"><li class="item" data-enter><h3 class="item-title"/><p class="item-body"/></li></ul></section>
    <section class="s s-diagram"> s-head; <ol class="diagram"><li class="node" data-node="core|misty|playbooks|skills|principles|oracle" data-enter><span class="node-count"/><h3 class="node-label"/><p class="node-body"/></li></ol></section>
    <section class="s s-install"> s-head; <div class="tabs" role="tablist"><button role="tab" class="tab" aria-selected/>..</div><div class="tabpanel" role="tabpanel"><pre class="code"><code>..</code></pre><button class="copy">Copy</button><p class="note"/></div></section>
    <section class="s s-evidence"> s-head; <div class="bars"><div class="bar" data-highlight><span class="bar-label"/><span class="bar-track"><span class="bar-fill" style="--v:5/6"/></span><span class="bar-value">5/6</span></div>..</div><ul class="limits"><li/></ul><a class="link" href>..</a></section>
    <section class="s s-code"> s-head; <figure class="codefig"><pre class="code"><code>..</code></pre><figcaption/></figure></section>
    <section class="s s-cta"> <h2 class="s-title"/><p class="s-intro"/><div class="actions"><a class="btn btn-primary"/><a class="btn btn-quiet"/></div></section>
  </main>
  <footer class="foot"><p class="foot-line"/><nav class="foot-links"><a class="link"/></nav></footer>
  <button class="motion-toggle" aria-pressed="false">Pause motion</button>
</body></html>
```
Buttons: `.btn`, `.btn-primary`, `.btn-quiet`, `.btn-sm`. Text links: `a.link`. Code: `pre.code > code`. The renderer adds `.is-in` to `[data-enter]` via IntersectionObserver (immediately when reduced motion). LabCore may add elements but never rename these; additions go in the README.


## Preview deployment

This lab is never part of the repository's Pages deploy. Its separate `wrangler.jsonc` targets only `misty-brand-lab` on workers.dev and serves static assets. HTML and assets carry `X-Robots-Tag: noindex, nofollow`; a robots file also excludes crawling.

```sh
npm run build
npm run smoke
pass-env run -f ~/.cache/tmp/misty-design/preview/.env.pass -- npx wrangler deploy
```

Only deploy after the production smoke is green. Never deploy another Worker from this lab.
