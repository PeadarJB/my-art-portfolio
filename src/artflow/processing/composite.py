from __future__ import annotations

from PIL import Image


def composite_exact_artwork(
    background: Image.Image, artwork_rgba: Image.Image, top_left: tuple[int, int]
) -> Image.Image:
    """Composite exact artwork pixels; fully opaque artwork pixels stay bit-identical."""

    canvas = background.convert("RGBA").copy()
    artwork = artwork_rgba.convert("RGBA")
    canvas.alpha_composite(artwork, dest=top_left)
    return canvas
