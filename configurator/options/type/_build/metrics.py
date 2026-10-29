"""Font metrics helpers shared by the generator and the browser-free checks."""
import io
import re

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

# Headlines used to measure the display setting: the configurator's baseline copy plus
# longer facts-based lines near the canon's 50-character ceiling.
SAMPLE = [
    "Reimagine the process. Show the dollars.",
    "Give your agent a method.",
    "One process, rebuilt with AI. The savings in dollars.",
    "Your coding agent, with a method and an outside check.",
    "Reimagine one process with AI. See the savings in dollars.",
]


def px(term, vw):
    total = 0.0
    for sign, num, unit in re.findall(r"([+-]?)\s*([\d.]+)(rem|px|vw)", term):
        n = float(num) * (-1 if sign == "-" else 1)
        total += n * 16 if unit == "rem" else n if unit == "px" else n * vw / 100
    return total


def size_at(expr, vw):
    """Evaluate the clamp()/round() size expressions the generator emits, in px."""
    e = expr
    step = None
    m = re.match(r"round\(nearest, (clamp\(.*\)), ([\d.]+)px\)$", e)
    if m:
        e, step = m.group(1), float(m.group(2))
    m = re.match(r"clamp\((.*?), (.*), (.*?)\)$", e)
    if m:
        lo, mid, hi = (px(x, vw) for x in m.groups())
        v = min(max(mid, lo), hi)
    else:
        v = px(e, vw)
    if step:
        v = round(v / step) * step
    return v


def load(path, wght):
    """Open a font, pinning every variable axis (wght at the given weight, others at default)."""
    f = TTFont(path)
    if "fvar" in f:
        axes = {a.axisTag: a for a in f["fvar"].axes}
        loc = {t: (min(max(wght, a.minValue), a.maxValue) if t == "wght" else a.defaultValue) for t, a in axes.items()}
        f = instancer.instantiateVariableFont(f, loc)
        buf = io.BytesIO()
        f.save(buf)
        buf.seek(0)
        f = TTFont(buf)
    return f


def width(font, text, size, tracking_em):
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    upm = font["head"].unitsPerEm
    adv = sum(hmtx[cmap.get(ord(c), ".notdef")][0] for c in text)
    return adv * size / upm + tracking_em * size * len(text)


def lines(font, text, size, tracking, col):
    n, cur = 1, ""
    for w in text.split(" "):
        trial = (cur + " " + w).strip()
        if width(font, trial, size, tracking) <= col or not cur:
            cur = trial
        else:
            n += 1
            cur = w
    return n


def advance(font, tracking_em, uppercase):
    """Average advance per character (em) of the display setting over SAMPLE."""
    vals = [width(font, h.upper() if uppercase else h, 1.0, tracking_em) / len(h) for h in SAMPLE]
    return sum(vals) / len(vals)
