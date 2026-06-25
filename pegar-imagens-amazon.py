"""
Pega IMAGE_ID dos produtos Amazon a partir do ASIN.
Roda localmente: python pegar-imagens-amazon.py
Instalar dependências: pip install requests
"""

import re
import time
import random
import requests

SESSION = requests.Session()
SESSION.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "DNT": "1",
})
# Estabelece sessão/cookies visitando a home primeiro
print("Iniciando sessão na Amazon...")
SESSION.get("https://www.amazon.com.br", timeout=15)
time.sleep(3)
HEADERS = SESSION.headers

# Coloque aqui os ASINs que precisa
PRODUTOS = [
    ("Burigotto Ecco",              "B087RYYMKC"),
    ("Burigotto Up!",               "B07D2FJS93"),
    ("Cosco Toffy",                 "B09ZNX93JK"),
    ("Cosco Travel System Nexus",   "B0784DBYBX"),
    ("Galzerano Olympus",           "B09VHCYVVJ"),
    ("Galzerano Milano Rev II",     "B09TM5VXNK"),
    ("Voyage Park",                 "B08X7H8498"),
    ("Litet Candy",                 "B08952CD7S"),
]

TAG = "eumaecarrinho-20"


PATTERNS = [
    r'data-old-hires="https://m\.media-amazon\.com/images/I/([A-Za-z0-9+]+)\._',
    r'"hiRes"\s*:\s*"https://m\.media-amazon\.com/images/I/([A-Za-z0-9+]+)\._',
    r'"large"\s*:\s*"https://m\.media-amazon\.com/images/I/([A-Za-z0-9+]+)\._',
    r'"thumb"\s*:\s*"https://m\.media-amazon\.com/images/I/([A-Za-z0-9+]+)\._',
    r'landingImage[^>]+src="https://m\.media-amazon\.com/images/I/([A-Za-z0-9+]+)\._',
    r'https://m\.media-amazon\.com/images/I/([A-Za-z0-9+]{10,})\._AC_',
]

def pegar_image_id(asin):
    url = f"https://www.amazon.com.br/dp/{asin}"
    try:
        r = SESSION.get(url, timeout=15)
        print(f"  HTTP {r.status_code}")
        if r.status_code != 200:
            print(f"  Bloqueado — status {r.status_code}")
            return None
        html = r.text

        for pattern in PATTERNS:
            match = re.search(pattern, html)
            if match:
                return match.group(1)

        # Debug: mostra trecho do HTML para análise
        idx = html.find("media-amazon.com/images/I/")
        if idx > 0:
            print(f"  [DEBUG] Trecho encontrado: ...{html[idx:idx+80]}...")
        else:
            print(f"  [DEBUG] Nenhuma URL de imagem encontrada no HTML ({len(html)} chars)")
        return None
    except Exception as e:
        print(f"  Erro: {e}")
        return None


print("=" * 60)
for nome, asin in PRODUTOS:
    if asin == "ASIN_AQUI":
        print(f"[PULAR] {nome} — ASIN não preenchido")
        continue

    print(f"\n{nome} (ASIN: {asin})")
    image_id = pegar_image_id(asin)

    if image_id:
        img_url = f"https://m.media-amazon.com/images/I/{image_id}._AC_SL300_.jpg"
        amz_url = f"https://www.amazon.com.br/dp/{asin}?tag={TAG}"
        print(f"  Imagem : {img_url}")
        print(f"  Afiliado: {amz_url}")
    else:
        print(f"  Não encontrou — tente abrir manualmente: https://www.amazon.com.br/dp/{asin}")

    time.sleep(random.uniform(3, 6))  # Pausa aleatória para não ser bloqueado

print("\n" + "=" * 60)
print("Pronto! Cole as URLs acima no artigo.")
