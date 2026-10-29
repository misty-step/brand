// Micro-interactions shared by MotionA's options (Emil Kowalski's rules, brief.md section C).
// Motion owns transition lists and press transforms; layouts own the colours they move between.
// Individual transform properties (scale, translate, rotate) compose with any transform a
// layout or hero sets, so nothing here clobbers another layer.
//   - A press answers at once on every pointer (touch included).
//   - Colour eases only for a fine pointer that can hover; touch and keyboard get instant state,
//     and tabs never animate (they are keyboard-driven and frequent).
//   - The theme toggle's half-moon turns to show the new state, once per toggle.

const PRESSABLE = ':is(.btn,.tab,.copy,.theme-toggle,.motion-toggle)';
const HOVERABLE = ':is(.btn,.copy,.theme-toggle,.motion-toggle)';

/**
 * smooth: colour eases in 150-160ms, a press gives way to 0.97 in 90ms (ease-out).
 * pixel: colour flips through one in-between step (steps(3)), a press drops one 2px unit, no easing.
 */
export function interactionCss(id: string, flavour: 'smooth' | 'pixel'): string {
  const s = `html[data-motion="${id}"]`;
  const out = 'cubic-bezier(.23,1,.32,1)', turn = 'rotate 300ms cubic-bezier(.77,0,.175,1)';
  const colour = (d: number, ease: string) => ['color', 'background-color', 'border-color', 'box-shadow', 'text-decoration-color'].map((p) => `${p} ${d}ms ${ease}`).join(',');
  const shared = `
${s} ${PRESSABLE},${s} .item-link{-webkit-tap-highlight-color:transparent}
${s}[data-reduced-motion="1"] ${PRESSABLE}:active{scale:none;translate:none}
${s}[data-theme="dark"] .theme-toggle{rotate:180deg}`;
  if (flavour === 'smooth') {
    return `${shared}
${s} ${PRESSABLE}{transition:scale 160ms ${out},${turn}}
${s} ${PRESSABLE}:active{scale:.97;transition:scale 90ms ${out},${turn}}
@media (hover:hover) and (pointer:fine){
${s} ${HOVERABLE}{transition:scale 160ms ${out},${turn},${colour(160, 'ease')}}
${s} ${HOVERABLE}:active{transition:scale 90ms ${out},${turn},${colour(160, 'ease')}}
${s} a.link,${s} .item-link{transition:${colour(150, 'ease')}}
}`;
  }
  return `${shared}
${s} ${PRESSABLE}:active{translate:0 2px}
@media (hover:hover) and (pointer:fine){
${s} ${HOVERABLE},${s} a.link,${s} .item-link{transition:${colour(150, 'steps(3,jump-none)')}}
}`;
}
