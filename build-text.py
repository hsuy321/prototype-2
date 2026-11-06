#!/usr/bin/env python3
"""Fetch Debord's Society of the Spectacle, Chapter 1 (34 theses) and write text.js.
Run from this folder:  python3 build-text.py
Source: https://www.bopsecrets.org/SI/debord/1.htm (Ken Knabb's translation).
Check the source's terms before publishing the text on your site.
Pass a saved HTML file instead of fetching:  python3 build-text.py chapter1.htm
"""
import html, re, sys, urllib.request

URL = "https://www.bopsecrets.org/SI/debord/1.htm"

def load():
    if len(sys.argv) > 1:
        return open(sys.argv[1], encoding="utf-8", errors="replace").read()
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0 (build-text.py)"})
    raw = urllib.request.urlopen(req, timeout=30).read()
    return raw.decode("utf-8", errors="replace")

def to_lines(src):
    src = re.sub(r"(?is)<(script|style).*?</\1>", "", src)
    src = re.sub(r"(?i)<(i|em)\b[^>]*>", "\x01", src)
    src = re.sub(r"(?i)</(i|em)>", "\x02", src)
    src = re.sub(r"(?i)</?(p|br|div|h\d|blockquote|li|ul|ol|tr|table|hr)\b[^>]*>", "\n", src)
    src = re.sub(r"<[^>]+>", "", src)
    src = html.unescape(src).replace("\xa0", " ")
    src = src.replace("\x01", "<i>").replace("\x02", "</i>")
    return [re.sub(r"\s+", " ", l).strip() for l in src.split("\n")]

def theses(lines):
    out, n, cur = [], 0, None
    stop = lambda l: re.match(r"(?i)^(translator|chapter 1 of guy debord)", re.sub(r"<[^>]+>", "", l))
    for l in lines:
        if not l:
            continue
        if l == str(n + 1) and n < 34:
            if cur is not None: out.append(" ".join(cur))
            n += 1; cur = []
        elif cur is not None:
            if stop(l): break
            cur.append(l)
    if cur is not None: out.append(" ".join(cur))
    return out

t = theses(to_lines(load()))
if len(t) != 34 or not all(t):
    sys.exit(f"Expected 34 theses, found {len(t)}. Save the page as chapter1.htm and run: python3 build-text.py chapter1.htm")
t = [x.replace("`", "'").replace("${", "$ {") for x in t]
with open("text.js", "w", encoding="utf-8") as f:
    f.write("// Thesis text, one paragraph per entry, blank line between, in order (entry 1 first). No numbers.\n")
    f.write("// <i>...</i> is allowed for italics.\nconst SPECTACLE_TEXT = `\n" + "\n\n".join(t) + "\n`;\n")
print("Wrote text.js with", len(t), "theses")
