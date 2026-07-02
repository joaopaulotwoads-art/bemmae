#!/usr/bin/env python3
"""
Gerador de Links de Afiliado — bemmae.com.br
=============================================
Uso:
    python tools/gerar-links-afiliados.py

Gera links Amazon (com tag de afiliado) e busca produtos no Mercado Livre
via API pública para montar a lista de links de um artigo novo.
"""

import json
import sys
import urllib.request
import urllib.parse

# ─── CONFIGURAÇÃO ────────────────────────────────────────────────────────────

AMAZON_TAG = "eumaecarrinho-20"

# Preencha abaixo quando tiver o ID do ML Afiliados
# (Painel ML Afiliados > Ferramentas > Link Builder > seu matt_tool)
ML_MATT_TOOL = "49050716"

# ─── FUNÇÕES ─────────────────────────────────────────────────────────────────

def amazon_link(asin: str) -> str:
    """Gera link Amazon com tag de afiliado a partir do ASIN."""
    return f"https://www.amazon.com.br/dp/{asin}?tag={AMAZON_TAG}"


def ml_search(query: str, limit: int = 3) -> list[dict]:
    """
    Busca produto no Mercado Livre via API pública.
    Retorna lista de dicts com title, url e price.
    """
    encoded = urllib.parse.quote(query)
    url = f"https://api.mercadolibre.com/sites/MLB/search?q={encoded}&limit={limit}"

    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            data = json.loads(resp.read())
    except Exception as e:
        print(f"  [ERRO ao buscar ML] {e}", file=sys.stderr)
        return []

    results = []
    for item in data.get("results", [])[:limit]:
        results.append({
            "title": item.get("title", ""),
            "url": item.get("permalink", ""),
            "price": item.get("price", 0),
        })
    return results


def ml_affiliate_link(product_url: str, keyword: str = "") -> str:
    """
    Gera link de afiliado do ML adicionando parâmetros matt_.
    Requer ML_MATT_TOOL preenchido.
    """
    if ML_MATT_TOOL == "SEU_MATT_TOOL_ID":
        return product_url + "  ← adicione ?matt_tool=SEU_ID manualmente"

    params = {
        "matt_tool": ML_MATT_TOOL,
        "matt_word": urllib.parse.quote(keyword),
    }
    qs = "&".join(f"{k}={v}" for k, v in params.items())
    sep = "&" if "?" in product_url else "?"
    return product_url + sep + qs


def processar_produto(nome: str, asin: str, keyword_ml: str = "") -> dict:
    """
    Dado nome e ASIN, retorna dict com links Amazon e ML prontos.
    """
    amazon = amazon_link(asin)

    kw = keyword_ml or nome
    ml_resultados = ml_search(kw)
    if ml_resultados:
        melhor_ml = ml_resultados[0]
        ml_url = ml_affiliate_link(melhor_ml["url"], kw)
        ml_titulo = melhor_ml["title"]
        ml_preco = melhor_ml["price"]
    else:
        ml_url = "[ML_URL]"
        ml_titulo = "Não encontrado"
        ml_preco = 0

    return {
        "produto": nome,
        "asin": asin,
        "amazon_link": amazon,
        "ml_titulo": ml_titulo,
        "ml_preco": ml_preco,
        "ml_link": ml_url,
    }


def imprimir_resultado(r: dict) -> None:
    print(f"\n{'─'*60}")
    print(f"  Produto : {r['produto']}")
    print(f"  ASIN    : {r['asin']}")
    print(f"  Amazon  : {r['amazon_link']}")
    print(f"  ML item : {r['ml_titulo']}")
    if r["ml_preco"]:
        print(f"  ML preço: R$ {r['ml_preco']:,.2f}")
    print(f"  ML link : {r['ml_link']}")


# ─── EXEMPLO DE USO ──────────────────────────────────────────────────────────
# Edite esta lista com os produtos do seu próximo artigo

PRODUTOS = [
    # {"nome": "Cosco Toffy",          "asin": "B09XXXXX",  "keyword_ml": "carrinho bebê cosco toffy"},
    # {"nome": "Galzerano Cross Trail", "asin": "B0B4FBBRXS","keyword_ml": "carrinho bebê galzerano cross trail"},
]


def main():
    if not PRODUTOS:
        print("⚠  Nenhum produto na lista. Edite a seção PRODUTOS no script.")
        print()
        print("Exemplo rápido de uso direto:")
        print()

        # Demo com um produto fictício para mostrar o formato
        demo = {
            "produto": "Produto Demo",
            "asin": "B0XXXXXXXX",
            "amazon_link": amazon_link("B0XXXXXXXX"),
            "ml_titulo": "—",
            "ml_preco": 0,
            "ml_link": "[ML_URL]",
        }
        imprimir_resultado(demo)

        print()
        print("Para usar: preencha a lista PRODUTOS no script e rode novamente.")
        return

    print(f"\n{'='*60}")
    print(f"  Gerando links — tag Amazon: {AMAZON_TAG}")
    print(f"{'='*60}")

    for p in PRODUTOS:
        resultado = processar_produto(
            nome=p["nome"],
            asin=p["asin"],
            keyword_ml=p.get("keyword_ml", ""),
        )
        imprimir_resultado(resultado)

    print(f"\n{'─'*60}")
    print("  Pronto! Cole os links acima no artigo.")
    print()

    if ML_MATT_TOOL == "SEU_MATT_TOOL_ID":
        print("  ℹ  Links ML sem tag de afiliado.")
        print("  Para ativar: abra o script e preencha ML_MATT_TOOL com")
        print("  o ID do seu canal em: ML Afiliados > Ferramentas > Link Builder")


if __name__ == "__main__":
    main()
