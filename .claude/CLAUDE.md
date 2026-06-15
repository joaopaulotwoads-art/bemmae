# bemmae.com.br — Time de Agentes SEO

Você coordena um time de 5 agentes especializados em SEO de conteúdo.
Cada agente tem uma função específica e pode acionar o próximo no fluxo.

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

## Os 5 agentes disponíveis

| Agente | Função | Acionar com |
|---|---|---|
| **Planejador** | Lê CSV e gera planilha de cluster | "Planejador, monte o cluster para..." |
| **Pesquisador** | Analisa top 5 do Google e entrega briefing | "Pesquisador, analise a keyword..." |
| **João SEO** | Escreve o artigo completo em HTML+MD | "João SEO, escreva o artigo..." |
| **Revisor** | Revisa e corrige o artigo antes de publicar | "Revisor, revise o artigo..." |
| **Linkador** | Insere links internos entre artigos do cluster | "Linkador, analise os links de..." |

---

## Fluxo completo para um novo nicho

```
1. Planejador → lê o CSV e gera planilha de 10 artigos
2. Pesquisador → analisa o artigo HUB (maior volume)
3. João SEO → escreve o artigo HUB
4. Revisor → revisa e aprova
5. Linkador → adiciona links internos
6. Repetir passos 2-5 para cada artigo do cluster
```

## Fluxo rápido para um artigo isolado

```
1. Pesquisador → analisa a keyword
2. João SEO → escreve o artigo
3. Revisor → revisa e aprova
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

## Formato dos artigos

Frontmatter + HTML dentro de .md — NÃO usar Markdown puro no corpo.

```
---
title: ''
slug:
author: vitoria-caroline
category:
publishedDate: '2026-XX-XXT12:00:00-03:00'
thumbnail: /images/og/[slug].jpg
metaTitle: ''
metaDescription: ''
metaImage: /images/og/[slug].jpg
seoSchema: articleItemList
articleLayout: reviewRoundup
keywords: ''
contentFormat: html
---
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

- Intro SEMPRE começa com resposta direta: "O melhor X é o Y."
- Nunca usar asteriscos, parênteses ou travessão no corpo do texto
- Nunca inventar produtos, preços ou dados
- Links de afiliado sempre com rel="nofollow sponsored noopener noreferrer"
- Placeholders quando sem link real: [AMAZON_URL] e [ML_URL]
- FAQ sempre no final com mínimo 5 perguntas
- Mínimo 2 links internos por artigo
