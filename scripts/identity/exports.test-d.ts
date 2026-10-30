// Type-level check of the published declarations, resolved through the package's own exports map.
// Compiled (never run) by `tsc -p scripts/identity`.
import { HTML_ATTRS, THEME_ATTR, twoLineLength, type Theme } from '@misty-step/brand/attrs';
import { FAVICON_SVG, lockup, MARK_16, MARK_32, MARK_FULL } from '@misty-step/brand/mark';
import { startBrand, type GroundFogParams } from '@misty-step/brand/runtime';

const params: Partial<GroundFogParams> = { density: 0.5, wind: 1 };
const handle = startBrand({ root: document, motion: true, params });
handle.destroy();
const theme: Theme = document.documentElement.getAttribute(THEME_ATTR) === 'dark' ? 'dark' : 'light';
const layout: 'editorial' = HTML_ATTRS['data-layout'];
const markup: string = lockup('MISTY STEP', { href: '/' }) + lockup('MISTYSTACK') + MARK_16 + MARK_32 + MARK_FULL + FAVICON_SVG;
const h2: number = twoLineLength('Before work, name the check.');
// @ts-expect-error the lockup draws only the two brand names
lockup('MISTY');
// @ts-expect-error params are the field's own keys
startBrand({ params: { speed: 2 } });
export { theme, layout, markup, h2 };
