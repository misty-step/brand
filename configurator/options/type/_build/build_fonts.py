"""Instance and subset the pinned sources into Latin woff2 files (step 2 of 3).

    python3 build_fonts.py        # reads plan.json and .src/, writes .out/<plan key>/fonts/

Variable fonts are instanced to the axis ranges the option uses (fewer bytes), subset to Google
Fonts' Latin range plus arrows, minus and multiply, unhinted, with every OpenType layout feature
kept (tabular figures, ligatures, alternates). A face whose OFL reserves its name is renamed
inside the font (plan "rename"), as the OFL requires of modified versions.

Unhinted is not the same as no hinting tables. FreeType autohints any TrueType font that has no
fpgm, no prep and no glyph instructions, and under full hinting (headless Chrome on Linux) the
autohinter rounds 't' and 'g' about a pixel wide and 'n' and 'h' a pixel narrow at 16px, which
reads as gaps inside words. So every glyf font gets the 7-byte prep and gasp that gftools
fix-unhinted writes (smart dropout control, smooth at all sizes). That is exactly what the
Google Fonts variable sources already carry; FreeType then takes its native path, and the font
renders as designed.
"""
import io
import json
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont, newTable
from fontTools.ttLib.tables import ttProgram
from fontTools.varLib import instancer

HERE = Path(__file__).parent
SRC = HERE / ".src"
OUT = HERE / ".out"
LATIN = (
    "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,"
    "U+2000-206F,U+20AC,U+2122,U+2190-2193,U+2212,U+2215,U+FEFF,U+FFFD"
)


def parse_ranges(spec):
    out = set()
    for part in spec.split(","):
        part = part.strip().upper().replace("U+", "")
        if "-" in part:
            a, b = part.split("-")
            out.update(range(int(a, 16), int(b, 16) + 1))
        else:
            out.add(int(part, 16))
    return out


def set_family(font, family):
    name = font["name"]
    for rec in list(name.names):
        if rec.nameID in (1, 4, 16):
            name.setName(family, rec.nameID, rec.platformID, rec.platEncID, rec.langID)
        if rec.nameID == 6:
            name.setName(family.replace(" ", ""), rec.nameID, rec.platformID, rec.platEncID, rec.langID)


def mark_unhinted(font):
    """gftools fix-unhinted: a prep with smart dropout control and a gasp that smooths all sizes."""
    if "glyf" not in font:
        return  # CFF outlines go through FreeType's own CFF hinter, never the autohinter
    program = ttProgram.Program()
    program.fromAssembly(["PUSHW[]", "511", "SCANCTRL[]", "PUSHB[]", "4", "SCANTYPE[]"])
    prep = newTable("prep")
    prep.program = program
    font["prep"] = prep
    gasp = newTable("gasp")
    gasp.gaspRange = {0xFFFF: 0x000F}
    font["gasp"] = gasp


def build(src, out, axes=None, unicodes=LATIN, rename=None):
    # recalcTimestamp=False keeps head.modified from the source, so rebuilds are byte-identical.
    font = TTFont(SRC / src, recalcTimestamp=False)
    if axes and "fvar" in font:
        font = instancer.instantiateVariableFont(font, axes, updateFontNames=False)
        buf = io.BytesIO()  # reload: subsetting a freshly instanced gvar can miss glyphs
        font.save(buf)
        buf.seek(0)
        font = TTFont(buf, recalcTimestamp=False)
    if rename:
        set_family(font, rename)
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["*"]
    opts.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14, 16, 17]
    opts.name_languages = [0x0409]
    opts.hinting = False
    opts.desubroutinize = True
    opts.notdef_outline = True
    opts.drop_tables += ["DSIG"]
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=parse_ranges(unicodes))
    sub.subset(font)
    mark_unhinted(font)
    out.parent.mkdir(parents=True, exist_ok=True)
    font.flavor = "woff2"
    font.save(out)
    return out.stat().st_size


if __name__ == "__main__":
    plan = json.loads((HERE / "plan.json").read_text())
    for opt, faces in plan.items():
        total = 0
        for f in faces:
            axes = {k: (tuple(v) if isinstance(v, list) else v) for k, v in (f.get("axes") or {}).items()}
            size = build(f["src"], OUT / opt / "fonts" / f["out"], axes or None, f.get("unicodes", LATIN), f.get("rename"))
            total += size
            print(f"{opt:12s} {f['out']:44s} {size / 1024:6.1f} KB")
        print(f"{opt:12s} {'TOTAL':44s} {total / 1024:6.1f} KB")
