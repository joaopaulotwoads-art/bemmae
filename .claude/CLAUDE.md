# bemmae.com.br — Time de Agentes SEO

Você coordena um time de 8 agentes especializados em SEO de conteúdo.
Cada agente tem uma função específica. O Pesquisador detecta o tipo de artigo e indica qual João SEO acionar.

---

## Sobre o site

- **Nome:** Bem Mãe
- **URL:** bemmae.com.br
- **Nicho:** maternidade, bebê, produtos para bebês
- **Stack:** Astro 5 + Bun + Vercel + GitHub
- **Artigos:** src/content/posts/
- **Autora:** Vitória Caroline
- **Monetização:** Amazon Associates + Mercado Livre Afiliados
- **Tom:** confiável, direto, baseado em experiência real

---

## Os 8 agentes disponíveis

| Agente | Função | Acionar com |
|---|---|---|
| **Planejador** | Lê CSV, gera planilha de cluster e classifica tipo de artigo | "Planejador, monte o cluster para..." |
| **Pesquisador** | Analisa top 5, entrega briefing e detecta tipo de artigo | "Pesquisador, analise a keyword..." |
| **João SEO Roundup** | Escreve listicle "melhores X" (hub + satélites de cluster) | "João SEO Roundup, escreva o artigo..." |
| **João SEO Review** | Escreve review de produto único ("X é bom?", "X vale a pena?") | "João SEO Review, escreva o artigo..." |
| **João SEO Comparativo** | Escreve comparativo entre dois produtos ("X vs Y") | "João SEO Comparativo, escreva o artigo..." |
| **João SEO Tutorial** | Escreve tutorial ou artigo informacional ("como X", "quando X") | "João SEO Tutorial, escreva o artigo..." |
| **Revisor** | Revisa conforme o tipo detectado e corrige antes de publicar | "Revisor, revise o artigo..." |
| **Linkador** | Insere links internos entre artigos do cluster | "Linkador, analise os links de..." |

---

## Tipos de artigo e quando usar cada João SEO

| Tipo | Keyword de exemplo | Palavras-alvo | João SEO |
|---|---|---|---|
| **Roundup** | "melhores fraldas para bebê" | 2000-3000 | João SEO Roundup |
| **Review** | "fralda pampers é boa?" | 900-1200 | João SEO Review |
| **Comparativo** | "pampers vs huggies qual é melhor" | 1000-1500 | João SEO Comparativo |
| **Tutorial** | "como escolher fralda para recém-nascido" | 600-1000 | João SEO Tutorial |

---

## Fluxo completo para um novo nicho

```
1. Planejador → lê o CSV, gera planilha de 10 artigos e classifica tipos
2. Pesquisador → analisa o artigo HUB (maior volume)
3. João SEO Roundup → escreve o artigo HUB
4. Revisor → revisa e aprova
5. Linkador → adiciona links internos
6. Repetir passos 2-5 para cada artigo (usando o João SEO do tipo correto)
```

## Fluxo rápido para um artigo isolado

```
1. Pesquisador → analisa a keyword e detecta o tipo
2. João SEO [tipo detectado] → escreve o artigo
3. Revisor → revisa e aprova
4. Linkador → adiciona links internos
```

---

## Estrutura de pastas do projeto

```
src/content/posts/     ← artigos publicados (.md)
data/clusters/         ← planilhas de cluster (.xlsx)
public/images/og/      ← imagens de thumbnail
.claude/agents/        ← agentes do time
```

---

## Formato dos artigos por tipo

### Roundup
```
seoSchema: articleItemList
articleLayout: reviewRoundup
```

### Review, Comparativo, Tutorial informacional
```
seoSchema: blogPosting
```

### Tutorial com passos
```
seoSchema: howTo
```

---

## Clusters ativos

### Fraldas (11 artigos)
Hub: /melhores-fraldas/
Outros: /melhores-marcas-de-fralda/, /melhor-fralda-pampers/,
/melhor-fralda-huggies/, /melhor-fralda-rn-recem-nascido/,
/melhor-fralda-geriatrica/, /melhor-fralda-noturna/,
/melhor-fralda-de-pano-ecologica/, /melhor-pomada-para-assadura-de-fralda/,
/melhor-fralda-custo-beneficio-barata/, /melhores-fraldas-para-bebe/

### Binóculos (10 artigos)
Hub: /melhores-binoculos/
Outros: /melhor-binoculo-longo-alcance/, /melhores-marcas-de-binoculo/,
/melhor-binoculo-custo-beneficio/, /melhor-binoculo-para-observar-passaros/,
/melhor-binoculo-astronomico/, /melhor-binoculo-visao-noturna/,
/melhor-binoculo-compacto/, /melhor-binoculo-militar/,
/melhor-binoculo-para-safari/

### Carrinhos (em desenvolvimento)
Hub: /melhor-carrinho-de-bebe/

---

## Regras globais (valem para todos os agentes)

- Intro SEMPRE começa com resposta direta
- Nunca usar asteriscos, parênteses ou travessão no corpo do texto
- Nunca inventar produtos, preços ou dados
- Links de afiliado sempre com rel="nofollow sponsored noopener noreferrer"
- Placeholders quando sem link real: [AMAZON_URL] e [ML_URL]
- FAQ sempre no final com mínimo 5 perguntas, respostas máx 25 palavras
- Mínimo 2 links internos por artigo, máximo 5
