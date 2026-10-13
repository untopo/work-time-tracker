#!/usr/bin/env python3
"""Rebuild the trimmed Font Awesome files that ship in assets/vendor/fontawesome.

Why: the full Font Awesome Free package is ~375 KB (about 270 KB of it is read on
the first page load). The app uses ~95 icons, so we ship only those glyphs.

When to run: after adding or changing an icon (any new `fa-something` class in
index.html or assets/js/*.js). `npm run verify:icons` fails if an icon is used
but missing from the shipped CSS, and tells you to run this script.

How to run:
  1. Download the FULL Font Awesome Free 6.4.0 package (the "web" download from
     https://fontawesome.com/download, or `npm pack @fortawesome/fontawesome-free@6.4.0`
     and unpack it). It contains css/all.min.css and webfonts/*.woff2.
  2. pip install fonttools brotli
  3. python3 scripts/build-fontawesome-subset.py --source /path/to/fontawesome-free-6.4.0-web

The script scans index.html and assets/js/*.js, keeps only the icons found there
(solid, regular and brands are handled separately), writes the smaller
css/all.min.css plus the matching webfonts, and prints a summary. It never
touches app data or any other file.
"""
import argparse
import glob
import os
import re
import sys

try:
    from fontTools import subset
    from fontTools.ttLib import TTFont
except ImportError:
    sys.exit("Missing dependency. Run: pip install fonttools brotli")

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT_DIR = os.path.join(ROOT, "assets", "vendor", "fontawesome")

STYLE_WORDS = {
    "fas": "solid", "fa-solid": "solid", "fa": "solid",
    "far": "regular", "fa-regular": "regular",
    "fab": "brands", "fa-brands": "brands",
}
FAMILIES = {
    # family: (css font-family, font-weight, font file)
    "solid": ("Font Awesome 6 Free", 900, "fa-solid-900.woff2"),
    "regular": ("Font Awesome 6 Free", 400, "fa-regular-400.woff2"),
    "brands": ("Font Awesome 6 Brands", 400, "fa-brands-400.woff2"),
}
# Icons the code references that do not exist in Font Awesome Free (Pro-only).
# They render nothing today; listed here so the check does not fail on them.
KNOWN_MISSING = {"fa-octagon-exclamation"}


def read(path):
    with open(path, encoding="utf-8") as handle:
        return handle.read()


def split_top_level(css):
    """Split minified CSS into (prelude, body) blocks, keeping @media/@keyframes whole."""
    blocks, depth, start, prelude_start = [], 0, 0, 0
    for index, char in enumerate(css):
        if char == "{":
            if depth == 0:
                start = index
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                blocks.append((css[prelude_start:start], css[start + 1:index]))
                prelude_start = index + 1
    return blocks


def scan_usage():
    """Return {token: set(families)} for every fa-* class found in the app code."""
    files = [os.path.join(ROOT, "index.html")] + sorted(glob.glob(os.path.join(ROOT, "assets", "js", "*.js")))
    usage = {}
    for path in files:
        text = read(path)
        for match in re.finditer(r"[\"'`]([^\"'`<>]*\bfa[a-z-]*\b[^\"'`<>]*)[\"'`]", text):
            words = match.group(1).split()
            styles = {STYLE_WORDS[w] for w in words if w in STYLE_WORDS}
            for word in words:
                if re.fullmatch(r"fa-[a-z0-9-]+", word):
                    usage.setdefault(word, set()).update(styles)
    return usage


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--source", required=True, help="folder of the FULL Font Awesome Free 6.4.0 web package")
    args = parser.parse_args()

    src_css_path = os.path.join(args.source, "css", "all.min.css")
    if not os.path.exists(src_css_path):
        sys.exit(f"Could not find {src_css_path}. Point --source at the unpacked full package.")
    src_css = read(src_css_path)
    header_match = re.match(r"\s*/\*!.*?\*/", src_css, flags=re.S)
    header = header_match.group(0).strip() if header_match else ""
    if "Font Awesome Free 6.4.0" not in header:
        print("Warning: source is not Font Awesome Free 6.4.0; check the result carefully.")

    # The license header is re-added once at the top of the output (keep it: the
    # Font Awesome Free license requires the attribution), so parse the rest only.
    blocks = split_top_level(src_css[header_match.end():] if header_match else src_css)

    # name -> codepoint for every icon definition (".fa-name:before{content:"\fxxx"}")
    icon_codepoint, all_tokens = {}, set(re.findall(r"\.(fa-[a-z0-9-]+)", src_css))
    for prelude, body in blocks:
        match = re.search(r'content:"\\([0-9a-f]+)"', body)
        if match and ":before" in prelude:
            for selector in prelude.split(","):
                name = re.match(r"\s*\.(fa-[a-z0-9-]+):before\s*$", selector)
                if name:
                    icon_codepoint[name.group(1)] = match.group(1)

    usage = scan_usage()
    used_icons = {t for t in usage if t in icon_codepoint}
    unknown = sorted(t for t in usage if t not in all_tokens and t not in KNOWN_MISSING)
    if unknown:
        sys.exit("Used in the code but not in Font Awesome Free: " + ", ".join(unknown))

    by_family = {family: set() for family in FAMILIES}
    for token in used_icons:
        styles = usage[token] or {"solid"}  # data-driven icons are rendered with "fas ..."
        for style in styles:
            by_family[style].add(token)

    # 1) fonts: keep only the used glyphs
    os.makedirs(os.path.join(OUT_DIR, "webfonts"), exist_ok=True)
    kept_files = set()
    for family, tokens in by_family.items():
        if not tokens:
            continue
        _, _, filename = FAMILIES[family]
        options = subset.Options()
        options.flavor = "woff2"
        options.layout_features = []
        options.hinting = True  # keep hinting so icons render exactly like the full font
        options.notdef_outline = True
        options.name_IDs = ["*"]
        font = TTFont(os.path.join(args.source, "webfonts", filename))
        subsetter = subset.Subsetter(options)
        subsetter.populate(unicodes=[int(icon_codepoint[t], 16) for t in tokens])
        subsetter.subset(font)
        target = os.path.join(OUT_DIR, "webfonts", filename)
        subset.save_font(font, target, options)
        kept_files.add(filename)
        print(f"{family:8s} {len(tokens):3d} icons -> {filename} ({os.path.getsize(target) / 1024:.1f} KB)")
    for stale in glob.glob(os.path.join(OUT_DIR, "webfonts", "*")):
        if os.path.basename(stale) not in kept_files:
            os.remove(stale)

    # 2) css: keep the base/utility rules, only the used icon rules, and only the needed @font-face
    out = [header] if header else []
    for prelude, body in blocks:
        prelude_stripped = prelude.strip()
        if prelude_stripped.startswith("@font-face"):
            continue
        if ":before" in prelude and re.search(r'content:"\\[0-9a-f]+"', body):
            selectors = [s for s in prelude.split(",") if re.match(r"\s*\.(fa-[a-z0-9-]+):before\s*$", s)
                         and re.match(r"\s*\.(fa-[a-z0-9-]+)", s).group(1) in used_icons]
            if selectors:
                out.append(",".join(s.strip() for s in selectors) + "{" + body + "}")
            continue
        out.append(prelude_stripped + "{" + body + "}")
    for family, tokens in by_family.items():
        if tokens:
            name, weight, filename = FAMILIES[family]
            out.append(
                f'@font-face{{font-family:"{name}";font-style:normal;font-weight:{weight};'
                f'font-display:block;src:url(../webfonts/{filename}) format("woff2")}}'
            )
    css_path = os.path.join(OUT_DIR, "css", "all.min.css")
    os.makedirs(os.path.dirname(css_path), exist_ok=True)
    with open(css_path, "w", encoding="utf-8") as handle:
        handle.write("\n".join(out) + "\n")
    print(f"css      {len(used_icons)} icons -> all.min.css ({os.path.getsize(css_path) / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
