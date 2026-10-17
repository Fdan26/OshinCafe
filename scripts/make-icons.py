"""Generates per-app Android launcher icons from the source artwork.

Usage: python scripts/make-icons.py
Source art lives in assets/icons/<flavor>.png (square, yellow rounded tile on black).
Output goes to android/app/src/<flavor>/res, which overrides the default icons.
"""
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
FLAVORS = {'customer': 'customer.png', 'cafe': 'staff.png'}
DENSITIES = {'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}
ART_SCALE = 0.56  # art width as a share of the 108dp adaptive canvas, so text clears round masks


def clean_tile(path: Path):
    """Return (square RGB art with the black corners filled, background colour)."""
    im = Image.open(path).convert('RGB')
    w, h = im.size
    bg = im.getpixel((w // 2, int(h * 0.04)))
    if sum(bg) < 120:  # thin black frame at the top edge; sample a bit further in
        bg = im.getpixel((w // 2, int(h * 0.06)))
    for corner in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        ImageDraw.floodfill(im, corner, bg, thresh=60)
    inset = round(w * 0.035)  # trim the leftover tile outline
    return im.crop((inset, inset, w - inset, h - inset)), bg


def save_all(flavor: str, art: Image.Image, bg: tuple):
    res = ROOT / 'android' / 'app' / 'src' / flavor / 'res'
    hex_bg = '#{:02X}{:02X}{:02X}'.format(*bg)

    for name, scale in DENSITIES.items():
        out = res / f'mipmap-{name}'
        out.mkdir(parents=True, exist_ok=True)

        # Adaptive foreground: 108dp canvas, art centred inside the safe zone
        canvas = round(108 * scale)
        fg = Image.new('RGBA', (canvas, canvas), bg + (255,))
        side = round(canvas * ART_SCALE)
        fg.paste(art.resize((side, side), Image.LANCZOS), ((canvas - side) // 2,) * 2)
        fg.save(out / 'ic_launcher_foreground.png')

        # Legacy icons (Android 7 and older): 48dp rounded square and circle
        size = round(48 * scale)
        tile = Image.new('RGBA', (size, size), bg + (255,))
        inner = round(size * 0.86)
        tile.paste(art.resize((inner, inner), Image.LANCZOS), ((size - inner) // 2,) * 2)

        square_mask = Image.new('L', (size, size), 0)
        ImageDraw.Draw(square_mask).rounded_rectangle([0, 0, size - 1, size - 1], radius=round(size * 0.2), fill=255)
        square = tile.copy()
        square.putalpha(square_mask)
        square.save(out / 'ic_launcher.png')

        round_tile = Image.new('RGBA', (size, size), bg + (255,))
        inner = round(size * 0.74)
        round_tile.paste(art.resize((inner, inner), Image.LANCZOS), ((size - inner) // 2,) * 2)
        circle_mask = Image.new('L', (size, size), 0)
        ImageDraw.Draw(circle_mask).ellipse([0, 0, size - 1, size - 1], fill=255)
        round_tile.putalpha(circle_mask)
        round_tile.save(out / 'ic_launcher_round.png')

    values = res / 'values'
    values.mkdir(parents=True, exist_ok=True)
    (values / 'ic_launcher_background.xml').write_text(
        '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n'
        f'    <color name="ic_launcher_background">{hex_bg}</color>\n</resources>\n',
        encoding='utf-8',
    )
    print(f'{flavor}: background {hex_bg}')


for flavor, source in FLAVORS.items():
    art, bg = clean_tile(ROOT / 'assets' / 'icons' / source)
    save_all(flavor, art, bg)
