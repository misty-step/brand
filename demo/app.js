// The demo site's own script: a theme toggle (the site owns data-theme) and the package runtime.
import { startBrand } from '/identity/runtime.js';

const html = document.documentElement;
if (!html.hasAttribute('data-theme')) html.setAttribute('data-theme', matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.addEventListener('click', event => {
  if (!event.target.closest('.theme-toggle')) return;
  html.setAttribute('data-theme', html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});
// Exposed for demo/proof.mjs, which destroys and restarts the runtime as client-side navigation would.
window.startBrand = startBrand;
window.brand = startBrand();
