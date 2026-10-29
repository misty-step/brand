"""Generator for MarkB's round-2 name mark: r2-b-stencil.

It draws MISTY STEP and MISTYSTACK from Sofia Sans Extra Condensed outlines (OFL, the baseline display face in
../../type/industrial-condensed/fonts/), not from a font at runtime, and writes the paths into
../r2-b-stencil/drawing.ts. This directory has no index.ts, so the option registry never loads it.

Run (any Python 3.11+ venv):  pip install fonttools brotli skia-pathops uharfbuzz resvg-py pillow
                              python options/mark/r2-b-src/build.py
Units: font units (UPM 1000), y up, baseline 0, cap height H = 655. SVG output flips y (top of cap = 0).
"""
from __future__ import annotations

import math
from pathlib import Path

import pathops
import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

HERE = Path(__file__).resolve().parent
FONT = HERE.parent.parent / 'type/industrial-condensed/fonts/sofia-sans-extra-condensed-latin.woff2'
H = 655  # cap height


# ----------------------------------------------------------------------------- outlines and booleans
class Face:
    """One static instance of the variable font (wght 600..800), with HarfBuzz for the font's own kerning."""

    def __init__(self, wght: float):
        tt = instancer.instantiateVariableFont(TTFont(str(FONT)), {'wght': wght})
        tt.flavor = None
        import io
        buf = io.BytesIO(); tt.save(buf)
        self.gs = tt.getGlyphSet(); self.cmap = tt.getBestCmap(); self.hmtx = tt['hmtx']
        self.hb = hb.Font(hb.Face(hb.Blob(buf.getvalue())))

    def adv(self, ch: str) -> float:
        return self.hmtx[self.cmap[ord(ch)]][0]

    def glyph(self, ch: str, dx: float = 0.0, dy: float = 0.0) -> pathops.Path:
        p = pathops.Path()
        self.gs[self.cmap[ord(ch)]].draw(TransformPen(p.getPen(glyphSet=self.gs), (1, 0, 0, 1, dx, dy)))
        p.simplify(fix_winding=True)
        return p

    def positions(self, text: str) -> list[float]:
        """Pen x for each character plus the end, with the font's kerning."""
        buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
        hb.shape(self.hb, buf, {'kern': True})
        xs, x = [], 0.0
        for pos in buf.glyph_positions:
            xs.append(x + pos.x_offset); x += pos.x_advance
        return xs + [x]


_faces: dict[float, Face] = {}


def face(wght: float) -> Face:
    if wght not in _faces:
        _faces[wght] = Face(wght)
    return _faces[wght]


def op(a, b, kind):
    return pathops.op(a, b, kind, fix_winding=True)


def union(*ps):
    out = pathops.Path()
    for p in ps:
        out = op(out, p, pathops.PathOp.UNION)
    return out


def minus(a, *bs):
    for b in bs:
        a = op(a, b, pathops.PathOp.DIFFERENCE)
    return a


def clip(a, b):
    return op(a, b, pathops.PathOp.INTERSECTION)


def rect(x0, y0, x1, y1):
    p = pathops.Path(); p.moveTo(x0, y0); p.lineTo(x1, y0); p.lineTo(x1, y1); p.lineTo(x0, y1); p.close()
    return p


def move(p, dx=0.0, dy=0.0):
    q = pathops.Path(); p.draw(TransformPen(q.getPen(), (1, 0, 0, 1, dx, dy))); return q


def drop_fragments(p, min_h):
    """Remove islands shorter than min_h: a cut must never leave a sliver thinner than itself."""
    keep = [c for c in p.contours if c.bounds[3] - c.bounds[1] >= min_h]
    return union(*keep) if keep else pathops.Path()


def remap(p, xs=None, ys=None):
    """Piecewise-linear coordinate remap (hinting by hand): xs/ys are [(from, to), ...] sorted by from."""
    def f(v, pts):
        if not pts: return v
        if v <= pts[0][0]: return v + pts[0][1] - pts[0][0]
        for (a, A), (b, B) in zip(pts, pts[1:]):
            if v <= b: return A + (B - A) * (v - a) / (b - a)
        return v + pts[-1][1] - pts[-1][0]
    q = pathops.Path(); pen = q.getPen()
    class P:
        def moveTo(s, pt): pen.moveTo((f(pt[0], xs), f(pt[1], ys)))
        def lineTo(s, pt): pen.lineTo((f(pt[0], xs), f(pt[1], ys)))
        def qCurveTo(s, *pts): pen.qCurveTo(*[(f(x, xs), f(y, ys)) for x, y in pts])
        def curveTo(s, *pts): pen.curveTo(*[(f(x, xs), f(y, ys)) for x, y in pts])
        def closePath(s): pen.closePath()
        def endPath(s): pen.endPath()
    p.draw(P()); q.simplify(fix_winding=True); return q


def svgd(p, top: float, x0: float = 0.0, k: float = 1.0, nd: int = 1) -> str:
    """Path data with y flipped so `top` maps to 0; x shifted by -x0; scaled by k."""
    def num(v):
        s = f'{v:.{nd}f}'
        return (s.rstrip('0').rstrip('.') if '.' in s else s).replace('-0', '0') if s not in ('-0', '-0.0') else '0'
    pen = SVGPathPen(None, ntos=num)
    p.draw(TransformPen(pen, (k, 0, 0, -k, -x0 * k, top * k)))
    return pen.getCommands()


def cells_path(cells, c, x0=0.0, y0=0.0):
    """Grid cells (col, row-from-baseline) of size c as one path."""
    return union(*[rect(x0 + i * c, y0 + j * c, x0 + (i + 1) * c, y0 + (j + 1) * c) for i, j in cells]) if cells else pathops.Path()


def rows_cells(rows: list[str]):
    """ASCII rows (top first) -> cells with row 0 at the baseline."""
    n = len(rows)
    return [(i, n - 1 - j) for j, r in enumerate(rows) for i, ch in enumerate(r) if ch == '#']


def ts_drawing(p, top, bottom, x0, x1, nd=1):
    return {'vb': [round(x1 - x0, nd), round(top - bottom, nd)], 'd': svgd(p, top, x0, nd=nd)}


# ----------------------------------------------------------------------------- r2-b-stencil
# One stencil cut runs through the whole name where the mist passes. It is set by the letters themselves:
# the band between the top of the S spine and the underside of the P bowl (E, T and the S top sit just above it)
# is split into two equal cuts; MISTY takes the lower one, the word it leads to takes the upper one, so the cut
# steps up exactly one cut thickness at the word break (the centre of the word space; the Y|S join in MISTYSTACK).
# Every closed counter in either name (P, A) lies across the upper cut, so the logotype is a working stencil.
# Letters never move; only the cut steps.
#
# Why this band and no other (measured at wght 760): lower bands hit A's bar (138..236), K's junction (200..372),
# P's bowl foot (230..338) or M's vertex (80) and leave slivers. Lowercase mistystack was tried and dropped: its
# only clean band, s spine top 322 to t bar underside 392, allows a cut of 35 units (H / 19): a hairline.
#
# Where the cut appears (crit 2): only where it reads as made. The symbol carries the stepped cut at every size;
# the name is cut from a 28 px cap up (logotype(): hero, footer statement, social cards, print). At the nav's
# 14 px cap the band is 2.95 px: two 2 px cuts detached the T bar (STEP read as SIEP at 1x) and even one 2 px cut
# read as a strikethrough, so the nav and phone names are solid caps with this file's kerning and tracking.

def stencil_word(name: str, wght: float, L: float, t: float, step: float, track: float, pairs: dict[str, float],
                 space: float, min_frag: float):
    f = face(wght)
    up = name.upper()
    first, second = ('MISTY', up[6:]) if ' ' in up else ('MISTY', up[5:])
    text = first + second
    xs = f.positions(text)
    extra = 0.0; x_end_first = x_start_second = 0.0
    parts_a, parts_b = [], []
    for i, ch in enumerate(text):
        if i > 0:
            extra += track + pairs.get(text[i - 1:i + 1], 0.0)
        if i == len(first):
            extra += space
        g = f.glyph(ch, xs[i] + extra)
        (parts_a if i < len(first) else parts_b).append(g)
        if i == len(first) - 1: x_end_first = g.bounds[2]
        if i == len(first): x_start_second = g.bounds[0]
    a, b = union(*parts_a), union(*parts_b)
    a = drop_fragments(minus(a, rect(-500, L, x_end_first + 1, L + t)), min_frag)
    b = drop_fragments(minus(b, rect(x_start_second - 1, L + step, 99999, L + step + t)), min_frag)
    return union(a, b), xs[-1] + extra


PX14 = H / 14  # one CSS px at the 14 px nav cap
STENCIL = dict(
    # Display drawing (28 px cap and up): wght 760; L = S spine top (410), L + 2t = P bowl underside (548).
    display=dict(wght=760, L=410, t=69, step=69, track=-6, space=118, min_frag=69,
                 pairs={'MI': -4, 'TY': -8, 'YS': 22, 'TE': -4, 'EP': 0, 'TA': -12, 'AC': 0, 'CK': -6}),
    # Nav drawing at a 14 px cap: wght 800, tracked +0.5 px, solid (no cut).
    nav=dict(wght=800, L=0, t=0, step=0, track=0.5 * PX14, space=2 * PX14, min_frag=0,
             pairs={'TY': -10, 'YS': 20, 'TA': -16, 'CK': -6}),
)

# Symbol cut, in 28ths of the M's height (the 32 px drawing is a 28 px M): the left half is cut 12..14 above the
# baseline and the right half 16..18, so the halves' cuts sit a full cut thickness apart and the step reads first.
# animateIn starts from STRAIGHT (both halves cut on the left rows) and steps the right half up once.
SYM_LEFT, SYM_RIGHT, SYM_T = 12, 16, 2


def stencil_m(wght: float, left: float, right: float, t: float):
    """The M with the stepped cut: the left half cut at `left`, the right half at `right`; the step at the vertex."""
    f = face(wght); m = f.glyph('M'); b = m.bounds; cx = (b[0] + b[2]) / 2
    return minus(m, rect(b[0] - 1, left, cx, left + t), rect(cx, right, b[2] + 1, right + t)), b


def stencil_m32(right_rows: int = SYM_RIGHT) -> list[str]:
    """32 px symbol drawn on the pixel grid: the wght 800 M, 28 px tall (baseline under row 29), stems hinted to
    5 px (6..10 and 21..25), vertex on the centre line, rasterised at 50% coverage so no pixel is soft; cut 2 px."""
    m = face(800).glyph('M'); b = m.bounds; k = 28 / H
    xs = [(b[0], 6 / k), (b[0] + 124, 11 / k), ((b[0] + b[2]) / 2, 16 / k), (b[2] - 124, 21 / k), (b[2], 26 / k)]
    q = minus(remap(m, xs=xs), rect(0, SYM_LEFT / k, 16 / k, (SYM_LEFT + SYM_T) / k),
              rect(16 / k, right_rows / k, 32 / k, (right_rows + SYM_T) / k))
    return raster_rows(q, k, 32, base=30)


def raster_rows(p, k: float, size: int, base: int) -> list[str]:
    """Rows of '#'/'.' for a path at k px per unit, baseline at y = base px, cell on at >= 50% coverage."""
    import io
    from PIL import Image
    import resvg_py
    ss = 8
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{size * ss}" height="{size * ss}" viewBox="0 0 {size} {size}">'
           f'<path d="{svgd(p, base / k, 0, k=k, nd=3)}" fill="#000"/></svg>')
    im = Image.open(io.BytesIO(bytes(resvg_py.svg_to_bytes(svg_string=svg)))).convert('RGBA').split()[3]
    im = im.resize((size, size), Image.BOX)
    return [''.join('#' if im.getpixel((x, y)) >= 128 else '.' for x in range(size)) for y in range(size)]


STENCIL_M16 = [  # 16 px favicon on the pixel grid: stems 3 px, deep V 2 px; cut 1 px through the middle, left half
    '................',  # on row 8, right half one step higher on row 7, as in the 32 px drawing (13..17 of 28)
    '.#####....#####.',
    '.#####....#####.',
    '.#####....#####.',
    '.###.##..##.###.',
    '.###.##..##.###.',
    '.###.##..##.###.',
    '.###.##.........',
    '........##..###.',
    '.###..####..###.',
    '.###...##...###.',
    '.###...##...###.',
    '.###........###.',
    '.###........###.',
    '.###........###.',
    '................',
]
# animateIn's first frame at 16 px: both halves cut on row 8 (the right half has not stepped up yet).
STENCIL_M16_STRAIGHT = STENCIL_M16[:7] + ['.###.##..##.###.', '................'] + STENCIL_M16[9:]


# ----------------------------------------------------------------------------- output
def emit(option: str, consts: dict):
    lines = ['// Generated by ../r2-b-src/build.py from Sofia Sans Extra Condensed outlines (OFL); edit there and rerun.',
             '/* eslint-disable */']
    for k, v in consts.items():
        lines.append(f'export const {k} = {_ts(v)} as const;')
    (HERE.parent / option / 'drawing.ts').write_text('\n'.join(lines) + '\n')


def _ts(v):
    import json
    return json.dumps(v, separators=(',', ':'))


def build():
    names = ('MISTY STEP', 'MISTYSTACK')
    disp, nav = {}, {}
    for n in names:
        for store, key, top, bottom in ((disp, 'display', H + 8, -8), (nav, 'nav', H, 0)):
            c = STENCIL[key]
            p, end = stencil_word(n, c['wght'], c['L'], c['t'], c['step'], c['track'], c['pairs'],
                                  c['space'] if ' ' in n else 0, c['min_frag'])
            bb = p.bounds
            store[n] = ts_drawing(p, top, bottom, min(0, bb[0]), max(end, bb[2]))
    # Symbol from 48 px up: the same M and cut as the 32 px drawing, in vector, in a box of 32/28 H.
    u = H / 28; side = 32 * u

    def full(right):
        m, b = stencil_m(800, SYM_LEFT * u, right * u, SYM_T * u)
        return {'vb': [round(side, 1), round(side, 1)], 'd': svgd(move(m, (side - (b[2] - b[0])) / 2 - b[0], 2 * u), side)}
    emit('r2-b-stencil', {
        'NAV': nav, 'DISPLAY': disp,
        'M_FULL': full(SYM_RIGHT), 'M_32': stencil_m32(), 'M_16': STENCIL_M16,
        'STRAIGHT': {'full': full(SYM_LEFT)['d'], 'm32': stencil_m32(SYM_LEFT), 'm16': STENCIL_M16_STRAIGHT},
    })


if __name__ == '__main__':
    build()
