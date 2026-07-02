"""
gerar-thumbnail.py
Gera a capa 1200x630 de um artigo roundup pegando as 3 primeiras imagens do roundup.

Uso:
    python gerar-thumbnail.py melhor-canguru-para-bebe          # gera .webp (padrao)
    python gerar-thumbnail.py melhor-canguru-para-bebe --jpg    # gera .jpg
"""

import sys
import re
import os
import io
import time
import urllib.request

from PIL import Image, ImageDraw

# ── Configuração ────────────────────────────────────────────────────────────

POSTS_DIR  = os.path.join(os.path.dirname(__file__), "src", "content", "posts")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "public", "images", "og")
W, H       = 1200, 630
BG_COLOR   = "#ffffff"
DIVIDER    = "#f0ede9"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
}

# ── Funções ─────────────────────────────────────────────────────────────────

def get_slug():
    if len(sys.argv) < 2:
        print("Uso: python gerar-thumbnail.py <slug>")
        print("Ex:  python gerar-thumbnail.py melhor-canguru-para-bebe")
        sys.exit(1)
    return sys.argv[1].strip()


def extract_image_ids(slug):
    """Lê o .md do artigo e retorna os 3 primeiros IMAGE_IDs do roundup."""
    path = os.path.join(POSTS_DIR, slug + ".md")
    if not os.path.exists(path):
        print(f"Arquivo não encontrado: {path}")
        sys.exit(1)

    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Pega só a seção do roundup (antes do primeiro H2 de produto)
    roundup_section = content.split("<h2>")[0] if "<h2>" in content else content

    pattern = re.compile(
        r'https://m\.media-amazon\.com/images/I/([A-Za-z0-9+_%-]+)\._AC_SL300_\.jpg'
    )
    ids = pattern.findall(roundup_section)

    if len(ids) < 3:
        # Fallback: pega de qualquer parte do artigo
        ids = pattern.findall(content)

    ids = list(dict.fromkeys(ids))  # deduplica mantendo ordem
    if len(ids) < 3:
        print(f"Atenção: encontrei apenas {len(ids)} imagem(ns) no artigo.")

    return ids[:3]


def fetch_image(image_id, retries=3):
    """Baixa imagem do Amazon CDN em resolução alta."""
    for size in ["_AC_SL500_", "_AC_SX500_", "_AC_SL300_"]:
        url = f"https://m.media-amazon.com/images/I/{image_id}.{size}.jpg"
        for attempt in range(retries):
            try:
                req = urllib.request.Request(url, headers=HEADERS)
                with urllib.request.urlopen(req, timeout=15) as r:
                    data = r.read()
                img = Image.open(io.BytesIO(data)).convert("RGBA")
                print(f"  OK {image_id} ({size})")
                return img
            except Exception as e:
                if attempt < retries - 1:
                    time.sleep(3)
                else:
                    print(f"  ERRO {image_id} ({size}): {e}")
    return None


def build_thumbnail(images):
    """Monta o canvas 1200x630 com 3 imagens em colunas iguais."""
    canvas = Image.new("RGB", (W, H), BG_COLOR)
    draw   = ImageDraw.Draw(canvas)

    COL_W   = W // 3        # 400px por coluna
    PADDING = 40             # margem interna
    IMG_MAX = COL_W - PADDING * 2   # 320px max por imagem

    for idx, prod in enumerate(images):
        if prod is None:
            continue

        # Redimensiona mantendo proporção
        prod.thumbnail((IMG_MAX, H - PADDING * 2), Image.LANCZOS)

        # Centraliza na coluna
        cx = idx * COL_W + (COL_W - prod.width) // 2
        cy = (H - prod.height) // 2

        # Composição sobre fundo branco (remove transparência)
        bg = Image.new("RGB", prod.size, BG_COLOR)
        bg.paste(prod, mask=prod.split()[3])
        canvas.paste(bg, (cx, cy))

    # Divisores verticais sutis
    for i in [1, 2]:
        x = i * COL_W
        draw.line([(x, 40), (x, H - 40)], fill=DIVIDER, width=1)

    return canvas


def save(canvas, slug, use_webp=True):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    if use_webp:
        out = os.path.join(OUTPUT_DIR, slug + ".webp")
        canvas.save(out, "WEBP", quality=88, method=6)
    else:
        out = os.path.join(OUTPUT_DIR, slug + ".jpg")
        canvas.save(out, "JPEG", quality=95, optimize=True)
    size_kb = os.path.getsize(out) // 1024
    print(f"\nSalvo: {out}  ({size_kb} KB)")
    return out


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    slug     = get_slug()
    use_webp = "--jpg" not in sys.argv

    print(f"Gerando thumbnail para: {slug}  (formato: {'webp' if use_webp else 'jpg'})")

    print("Extraindo IMAGE_IDs do artigo...")
    ids = extract_image_ids(slug)
    print(f"  Encontrados: {ids}")

    print("Baixando imagens...")
    images = [fetch_image(img_id) for img_id in ids]

    while len(images) < 3:
        images.append(None)

    print("Montando canvas...")
    canvas = build_thumbnail(images)

    save(canvas, slug, use_webp=use_webp)


if __name__ == "__main__":
    main()
