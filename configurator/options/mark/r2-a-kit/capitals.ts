// The lockup wordmark shared by the r2-a marks. This folder has no index.ts, so the option registry never loads it.
// Capitals of Sofia Sans Extra Condensed ExtraBold (wght 800; OFL-1.1, licence beside the font in
// options/type/industrial-condensed/fonts/OFL-SofiaSans.txt), outlined with fontTools and kerned with the font's own
// GPOS pairs through HarfBuzz, so the logotype is artwork and never waits for a web font.
// Units are font units (1000 per em). y runs down from the baseline; the cap line is at -655. Each glyph is
// [outline, advance, ink left, ink right]. Only the letters of MISTY STEP and MISTYSTACK are drawn.
import { esc } from '../../../src/html';

type Glyph = readonly [d: string, advance: number, left: number, right: number];
export const CAP = 655;
const G: Record<string, Glyph> = {
  A: ['M9 0Q-1 0 1 -13L136 -646Q138 -655 147 -655H281Q291 -655 293 -646L427 -14Q430 0 420 0H305Q297 0 295 -9L235 -398Q228 -432 224 -466Q219 -501 215 -535H213Q209 -501 204 -466Q200 -432 194 -398L132 -10Q131 0 121 0ZM134 -136 151 -237H274L293 -136Z', 428, 1, 428],
  C: ['M225 6Q130 6 80 -48Q31 -103 31 -219V-436Q31 -548 80 -604Q130 -661 225 -661Q292 -661 336 -632Q381 -604 401 -552Q421 -500 413 -429Q411 -417 404 -417H299Q288 -417 290 -431Q294 -488 278 -518Q263 -549 224 -549Q187 -549 170 -522Q154 -496 154 -432V-226Q154 -160 172 -133Q189 -106 225 -106Q268 -106 281 -138Q294 -171 291 -226Q290 -238 300 -238H403Q412 -238 414 -226Q423 -119 376 -56Q328 6 225 6Z', 445, 31, 415],
  E: ['M49 0Q39 0 39 -12V-643Q39 -655 49 -655H335Q345 -655 345 -643V-556Q345 -544 335 -544H163V-385H319Q329 -385 329 -372V-290Q329 -279 319 -279H163V-111H335Q345 -111 345 -99V-12Q345 0 335 0Z', 377, 39, 345],
  I: ['M49 0Q39 0 39 -12V-643Q39 -655 49 -655H153Q163 -655 163 -643V-12Q163 0 153 0Z', 202, 39, 163],
  K: ['M49 0Q39 0 39 -12V-643Q39 -655 49 -655H153Q163 -655 163 -643V-502Q163 -483 162 -456Q161 -428 160 -402Q159 -375 158 -354H159Q169 -385 180 -422Q192 -460 211 -501L281 -649Q282 -655 291 -655H407Q420 -655 413 -640L292 -382L431 -15Q438 0 424 0H302Q292 0 290 -8L203 -272L163 -196V-12Q163 0 153 0Z', 434, 39, 433],
  M: ['M42 0Q32 0 32 -11L41 -643Q41 -655 51 -655H176Q186 -655 187 -646L276 -315L366 -646Q368 -655 378 -655H503Q512 -655 512 -643L521 -11Q521 0 511 0H409Q399 0 399 -12L397 -289Q396 -340 398 -382Q400 -423 403 -458H402Q394 -427 384 -394Q375 -362 365 -331L289 -88Q286 -80 278 -80H274Q267 -80 265 -88L188 -332Q178 -362 168 -394Q159 -427 151 -458H149Q153 -423 155 -382Q157 -340 157 -289L154 -12Q154 0 144 0Z', 553, 32, 521],
  P: ['M49 0Q39 0 39 -12V-643Q39 -655 49 -655H185Q283 -655 330 -603Q376 -550 376 -439Q376 -336 328 -281Q280 -226 188 -226H163V-12Q163 0 153 0ZM163 -337H185Q220 -337 236 -362Q252 -387 252 -439Q252 -495 236 -520Q221 -544 186 -544H163Z', 398, 39, 376],
  S: ['M190 6Q126 6 88 -18Q49 -42 34 -86Q18 -129 23 -190Q24 -203 33 -203H135Q145 -203 144 -191Q139 -149 152 -126Q165 -102 192 -102Q218 -102 230 -117Q242 -132 242 -166Q242 -194 232 -216Q222 -238 201 -254L116 -320Q68 -356 46 -396Q23 -437 24 -499Q25 -577 66 -619Q107 -661 187 -661Q280 -661 322 -611Q364 -561 356 -471Q356 -456 347 -456H243Q233 -456 235 -471Q238 -506 228 -530Q217 -553 192 -553Q171 -553 160 -540Q148 -526 147 -498Q147 -468 159 -448Q171 -429 191 -413L275 -350Q309 -324 328 -298Q348 -273 357 -242Q366 -210 366 -166Q365 -83 324 -38Q282 6 190 6Z', 388, 22, 366],
  T: ['M139 0Q128 0 128 -12V-544H25Q14 -544 14 -556V-643Q14 -655 25 -655H357Q366 -655 366 -643V-556Q366 -544 357 -544H252V-12Q252 0 242 0Z', 381, 14, 366],
  Y: ['M156 0Q146 0 146 -12V-226L5 -640Q0 -655 12 -655H128Q138 -655 139 -647L183 -463Q189 -433 196 -404Q202 -374 207 -345H210Q216 -374 222 -404Q228 -433 234 -462L279 -647Q280 -655 288 -655H402Q415 -655 410 -640L269 -227V-12Q269 0 261 0Z', 415, 4, 411],
};
const KERN: Record<string, number> = { AA: 16, AC: -8, AT: -39, AY: -50, CA: -7, CC: -3, CT: 1, CY: -13, EA: 1, EC: -10, KC: -24, KE: -2, KI: -2, KK: -2, KP: -2, KS: -8, PA: -38, PS: 4, PY: -8, SC: -1, SS: -14, ST: -6, SY: -7, TA: -38, TC: -10, TS: -4, TT: 5, TY: 5, YA: -50, YC: -23, YS: -8, YT: 8, YY: 8 };

export interface Capitals {
  /** Extra space between letters, in font units, on top of the font's kerning. */
  track: number;
  /** The word space, in font units. */
  space: number;
  cls: string;
}

/**
 * The name in outlined capitals inside a cap-height box: the viewBox top is the cap line and its bottom the baseline,
 * so CSS sets the cap height by setting the height. Round letters overshoot the box by 6 units (overflow is visible).
 * Falls back to the escaped name when it has a letter this set does not draw.
 */
export function capitals(name: string, o: Capitals): string {
  let x = 0, start = 0, end = 0, prev = '';
  const parts: string[] = [];
  for (const ch of name.toUpperCase()) {
    if (ch === ' ') { x += o.space; prev = ''; continue; }
    const g = G[ch];
    if (!g) return esc(name);
    if (!parts.length) start = g[2];
    else if (prev) x += (KERN[prev + ch] ?? 0) + o.track;
    parts.push(`<path transform="translate(${x - start} 0)" d="${g[0]}"/>`);
    end = x - start + g[3];
    x += g[1];
    prev = ch;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -${CAP} ${end} ${CAP}" class="${o.cls}" overflow="visible" aria-hidden="true" focusable="false"><g fill="currentColor">${parts.join('')}</g></svg>`;
}
