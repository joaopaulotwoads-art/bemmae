# Configuração de Links de Afiliado — bemmae.com.br

## Amazon Associates

- **Associate Tag:** `eumaecarrinho-20`
- **Formato do link:** `https://www.amazon.com.br/dp/[ASIN]?tag=eumaecarrinho-20`

### Como montar um link Amazon sem API

1. Pesquise o produto no Google: `[nome do produto] site:amazon.com.br`
2. Abra a página e copie o ASIN da URL (ex: `/dp/B09XXXXX`)
3. Monte o link: `https://www.amazon.com.br/dp/B09XXXXX?tag=eumaecarrinho-20`

### Como usar o script automático

```bash
# Edite tools/gerar-links-afiliados.py — seção PRODUTOS
python tools/gerar-links-afiliados.py
```

---

## Mercado Livre Afiliados

- **matt_tool:** `49050716`
- **matt_word padrão:** `bemmae`
- **Formato do link:** `[URL do produto]?matt_tool=49050716&matt_word=bemmae`

---

## Regras para todos os links de afiliado

```html
rel="nofollow sponsored noopener noreferrer"
target="_blank"
```

Nunca omitir o `rel` — é obrigatório pela Amazon e pelo Google.
