#!/usr/bin/env python3
"""Render artifacts/body-figure.json so the geometry is reviewed by eye.

Left: what the browser paints. Right: what the hit test resolves, tinted per
region, with each label's leader point marked. If a leader is not inside its own
colour, the figure is wrong in a way no assertion phrased in the module's own
terms would catch.
"""
import json, sys
from PIL import Image, ImageDraw

d = json.load(open('artifacts/body-figure.json'))
W, H = d['view']['width'], d['view']['height']
TINT = {'head': (158, 75, 39), 'throat': (138, 100, 22), 'chest': (42, 89, 87),
        'tummy': (85, 99, 47), 'hands': (60, 86, 111), 'legs': (122, 63, 85)}

im = Image.new('RGB', (W * 2 + 30, H), (244, 240, 230))
dr = ImageDraw.Draw(im)
for rid in d['paintOrder']:
    for poly in d['polys'][rid]:
        dr.polygon([tuple(p) for p in poly], fill=(224, 216, 198), outline=(34, 33, 27))
off = W + 30
for y, row in enumerate(d['map']):
    for x, rid in enumerate(row):
        if rid:
            im.putpixel((off + x, y), TINT[rid])
for rid, (lx, ly) in d['leaders'].items():
    for cx in (0, off):
        dr.ellipse([cx + lx - 5, ly - 5, cx + lx + 5, ly + 5], outline=(200, 40, 40), width=2)
    dr.text((off + lx + 8, ly - 5), rid, fill=(20, 20, 20))
im = im.resize((im.width * 2, im.height * 2), Image.NEAREST)
im.save('artifacts/body-figure.png')
print('artifacts/body-figure.png')
