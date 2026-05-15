/**
 * Bloco HTML cnx-aff-rating (review único "full" vs BBR "compact").
 * Integrar: copiar buildRatingBlock para o teu cnx-aff-blocks.js e exportar.
 */

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildRatingBlock({ productName, ratings, paraQuemE, paraQuemNaoE, verdict, mode = "compact" }) {
  const estrelas = (nota) => {
    const cheia = Math.floor(nota);
    const vazia = 5 - cheia;
    return "★".repeat(cheia) + "☆".repeat(vazia);
  };

  const barra = (nota) => {
    const pct = Math.round((nota / 5) * 100);
    return `<div class="cnx-aff-rating-bar-track">
      <div class="cnx-aff-rating-bar-fill" style="width:${pct}%;"></div>
    </div>`;
  };

  const notaGeral = ratings
    ? Math.round(
        ((ratings.praticidade +
          ratings.seguranca +
          ratings.conforto +
          ratings.durabilidade +
          ratings.valeOPreco) /
          5) *
          10,
      ) / 10
    : null;

  const criterios = ratings
    ? `
    <div class="cnx-aff-rating-criteria">
      ${[
        ["Praticidade", ratings.praticidade],
        ["Segurança", ratings.seguranca],
        ["Conforto do bebê", ratings.conforto],
        ["Durabilidade", ratings.durabilidade],
        ["Vale o preço?", ratings.valeOPreco],
      ]
        .map(
          ([label, nota]) => `
        <div class="cnx-aff-rating-row">
          <p class="cnx-aff-rating-label">${esc(label)}</p>
          ${barra(Number(nota))}
          <p class="cnx-aff-rating-value">${Number(nota).toFixed(1)}</p>
        </div>
      `,
        )
        .join("")}
    </div>
  `
    : "";

  const cabecalho =
    mode === "full" && ratings
      ? `
    <div class="cnx-aff-rating-header">
      <div>
        <p class="cnx-aff-rating-kicker">Avaliação geral</p>
        <p class="cnx-aff-rating-title">${esc(productName || "")}</p>
      </div>
      <div class="cnx-aff-rating-score-wrap">
        <p class="cnx-aff-rating-score-num">${notaGeral != null ? esc(String(notaGeral)) : ""}</p>
        <div class="cnx-aff-rating-stars">${estrelas(Math.round(notaGeral))}</div>
      </div>
    </div>
    ${criterios}
  `
      : "";

  const prosItem = (item) => `
    <div class="cnx-aff-rating-list-item">
      <span class="cnx-aff-rating-check" aria-hidden="true">✓</span>
      <p class="cnx-aff-rating-list-text">${esc(item)}</p>
    </div>
  `;

  const consItem = (item) => `
    <div class="cnx-aff-rating-list-item">
      <span class="cnx-aff-rating-cross" aria-hidden="true">✗</span>
      <p class="cnx-aff-rating-list-text">${esc(item)}</p>
    </div>
  `;

  const paraQuemGrid = `
    <div class="cnx-aff-rating-grid">
      <div class="cnx-aff-rating-card cnx-aff-rating-card--pro">
        <p class="cnx-aff-rating-card-title">Para quem é</p>
        <div class="cnx-aff-rating-card-body">
          ${(paraQuemE || []).map(prosItem).join("")}
        </div>
      </div>
      <div class="cnx-aff-rating-card cnx-aff-rating-card--con">
        <p class="cnx-aff-rating-card-title">Para quem não é</p>
        <div class="cnx-aff-rating-card-body">
          ${(paraQuemNaoE || []).map(consItem).join("")}
        </div>
      </div>
    </div>
  `;

  const veredictoBlock = verdict
    ? `
    <div class="cnx-aff-rating-verdict">
      <p class="cnx-aff-rating-verdict-title">Veredicto</p>
      <p class="cnx-aff-rating-verdict-body">${esc(verdict)}</p>
    </div>
  `
    : "";

  if (mode === "full") {
    return `
    <div class="cnx-aff-rating cnx-aff-block-wrap cnx-aff-rating--full">
      <div class="cnx-aff-rating-panel">
        ${cabecalho}
      </div>
      ${paraQuemGrid}
      ${veredictoBlock}
    </div>
  `;
  }

  return `
    <div class="cnx-aff-rating cnx-aff-block-wrap cnx-aff-rating--compact">
      ${paraQuemGrid}
      ${veredictoBlock}
    </div>
  `;
}

module.exports = { buildRatingBlock, esc };
