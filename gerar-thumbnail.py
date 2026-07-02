"""
gerar-thumbnail.py
Gera a capa 1200x630 de um artigo, detectando o tipo automaticamente:
  - articleItemList (roundup): 3 produtos em colunas iguais
  - blogPosting    (review):   1 produto centralizado e grande

Uso:
    python gerar-thumbnail.py melhor-canguru-para-bebe          # gera .webp (padrao)
    python gerar-thumbnail.py carrinho-capri-galzerano-e-bom    # detecta review
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

# ── Leitura do artigo ────────────────────────────────────────────────────────

def read_article(slug):
    path = os.path.join(POSTS_DIR, slug + ".md")
    if not os.path.exists(path):
        print(f"Arquivo não encontrado: {path}")
        sys.exit(1)
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def get_seo_schema(content):
    """Lê seoSchema do frontmatter. Retorna 'blogPosting' como padrão."""
    match = re.search(r'^seoSchema:\s*(\S+)', content, re.MULTILINE)
    return match.group(1).strip() if match else "blogPosting"


def extract_image_ids(content, max_count=3):
    """Retorna os primeiros IMAGE_IDs do Amazon CDN encontrados no artigo."""
    # Tenta pegar primeiro da seção do roundup (antes do primeiro H2 de produto)
    roundup_section = content.split("<h2>")[0] if "<h2>" in content else content

    pattern = re.compile(
        r'https://m\.media-amazon\.com/images/I/([A-Za-z0-9+_%\-]+)\._AC_SL300_\.jpg'
    )
    ids = pattern.findall(roundup_section)

    if len(ids) < max_count:
        ids = pattern.findall(content)

    ids = list(dict.fromkeys(ids))  # deduplica mantendo ordem

    if len(ids) < max_count:
        print(f"Atenção: encontrei apenas {len(ids)} imagem(ns) no artigo.")

    return ids[:max_count]

# ── Download ─────────────────────────────────────────────────────────────────

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

# ── Layouts ──────────────────────────────────────────────────────────────────

def build_roundup_thumbnail(images):
    """3 produtos em colunas iguais (roundup/articleItemList)."""
    canvas = Image.new("RGB", (W, H), BG_COLOR)
    draw   = ImageDraw.Draw(canvas)

    COL_W   = W // 3
    PADDING = 40
    IMG_MAX = COL_W - PADDING * 2

    for idx, prod in enumerate(images):
        if prod is None:
            continue
        prod.thumbnail((IMG_MAX, H - PADDING * 2), Image.LANCZOS)
        cx = idx * COL_W + (COL_W - prod.width) // 2
        cy = (H - prod.height) // 2
        bg = Image.new("RGB", prod.size, BG_COLOR)
        bg.paste(prod, mask=prod.split()[3])
        canvas.paste(bg, (cx, cy))

    for i in [1, 2]:
        x = i * COL_W
        draw.line([(x, 40), (x, H - 40)], fill=DIVIDER, width=1)

    return canvas


def build_review_thumbnail(image):
    """1 produto centralizado e grande (review/blogPosting)."""
    canvas = Image.new("RGB", (W, H), BG_COLOR)

    if image is None:
        return canvas

    # Imagem pode ocupar até 80% da altura e 55% da largura
    max_w = int(W * 0.55)
    max_h = int(H * 0.82)
    image.thumbnail((max_w, max_h), Image.LANCZOS)

    cx = (W - image.width) // 2
    cy = (H - image.height) // 2

    bg = Image.new("RGB", image.size, BG_COLOR)
    bg.paste(image, mask=image.split()[3])
    canvas.paste(bg, (cx, cy))

    return canvas

# ── Salvar ───────────────────────────────────────────────────────────────────

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
    if len(sys.argv) < 2:
        print("Uso: python gerar-thumbnail.py <slug> [--jpg]")
        sys.exit(1)

    slug     = sys.argv[1].strip()
    use_webp = "--jpg" not in sys.argv

    print(f"Gerando thumbnail para: {slug}  (formato: {'webp' if use_webp else 'jpg'})")

    content = read_article(slug)
    schema  = get_seo_schema(content)
    print(f"  Tipo detectado: {schema}")

    if schema == "blogPosting":
        print("  Layout: review (produto único centralizado)")
        ids = extract_image_ids(content, max_count=1)
        print(f"  IMAGE_ID: {ids}")
        image = fetch_image(ids[0]) if ids else None
        canvas = build_review_thumbnail(image)
    else:
        print("  Layout: roundup (3 colunas)")
        ids = extract_image_ids(content, max_count=3)
        print(f"  IMAGE_IDs: {ids}")
        images = [fetch_image(img_id) for img_id in ids]
        while len(images) < 3:
            images.append(None)
        canvas = build_roundup_thumbnail(images)

    save(canvas, slug, use_webp=use_webp)


if __name__ == "__main__":
    main()
