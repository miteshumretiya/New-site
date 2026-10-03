"""Builds the self-hosted font files in src/fonts/.

Archivo and JetBrains Mono (both SIL OFL 1.1, no Reserved Font Names) are
downloaded from github.com/google/fonts, their variable axes are limited to the
ranges the site uses, and they are subset to the characters it renders:

  Archivo        wdth 62–100, wght 400–900   88 KB → 52 KB
  JetBrains Mono wght 400–600                 40 KB → 27 KB

Usage:  pip install fonttools brotli && python3 scripts/subset-fonts.py
"""

import os
import urllib.request

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "src", "fonts")
BASE = "https://raw.githubusercontent.com/google/fonts/main/ofl"
UNICODES = "U+0020-007E,U+00A0-00FF,U+2013-2014,U+2018-201D,U+2022,U+2026,U+2212"
FEATURES = ["kern", "liga", "calt", "tnum", "lnum", "case", "ccmp", "locl", "mark", "mkmk"]

FONTS = [
    ("archivo/Archivo%5Bwdth,wght%5D.ttf", {"wdth": (62, 100), "wght": (400, 900)}, "Archivo-latin-var.woff2"),
    ("jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf", {"wght": (400, 600)}, "JetBrainsMono-latin-var.woff2"),
]


def codepoints(spec):
    out = []
    for part in spec.replace("U+", "").split(","):
        lo, _, hi = part.partition("-")
        out += range(int(lo, 16), int(hi or lo, 16) + 1)
    return out


def build(remote, limits, name):
    tmp = os.path.join(OUT, name + ".src.ttf")
    urllib.request.urlretrieve(f"{BASE}/{remote}", tmp)
    font = instancer.instantiateVariableFont(TTFont(tmp), limits)
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = FEATURES
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    opts.hinting = False
    opts.desubroutinize = True
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=codepoints(UNICODES))
    sub.subset(font)
    font.flavor = "woff2"
    font.save(os.path.join(OUT, name))
    os.remove(tmp)
    print(name, os.path.getsize(os.path.join(OUT, name)), "bytes")


if __name__ == "__main__":
    for remote, limits, name in FONTS:
        build(remote, limits, name)
