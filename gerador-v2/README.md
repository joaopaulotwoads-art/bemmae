# gerador-v2 — bloco `cnx-aff-rating`

Este repositório (`cms`) não continha o projeto **gerador-v2** nem `cnx-aff-blocks.js`. Foi criada esta pasta com o código pronto para copiares para o projeto real.

## 1. `lib/buildRatingBlock.js`

- Função `buildRatingBlock` + escape HTML (`esc`) para textos dinâmicos.
- Barras de critério usam classes CSS (`cnx-aff-rating-bar-*`) definidas em `src/styles/affiliate-blocks.css` no CMS.

**Integração:** copia o corpo de `buildRatingBlock` (e `esc` se não tiveres equivalente) para o teu `cnx-aff-blocks.js` e adiciona `buildRatingBlock` ao `module.exports`.

## 2. `server.js` (no teu gerador)

- `const { buildRatingBlock } = require('./cnx-aff-blocks');` (ou caminho correcto).
- Após obter `features` / pros / cons, chama o modelo para JSON de ratings (como no teu prompt).
- `const ratingMode = req.body.articleType === 'review' ? 'full' : 'compact';`
- Monta `ratingHtml` e faz `content = content.replace('%%RATING_BLOCK%%', ratingHtml)`.
- Garante que o template do produto inclui `%%RATING_BLOCK%%` (ver `prompts/bbr.js`).

## 3. `prompts/bbr.js`

Depois de `%%PROS_CONS_BLOCK%%`:

```
%%PROS_CONS_BLOCK%%

%%RATING_BLOCK%%

---
```

## 4. `script.js` (front)

No `body` de `fetch` para `/generate-product-review`:

```js
articleType: currentArticleType, // 'review' | 'bbr'
```

## Testar

1. Gerar um produto em modo BBR → só grelha “para quem é / não é” + veredicto (`compact`).
2. Gerar review único com `articleType: 'review'` → cabeçalho com nota geral, estrelas, barras por critério (`full`).
