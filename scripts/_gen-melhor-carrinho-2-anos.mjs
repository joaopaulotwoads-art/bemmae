import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "_melhor-carrinho-2-anos-data.json"), "utf8"));

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function productCard(title, image, features, url) {
  const li = features.map((f) => `        <li>${esc(f)}</li>`).join("\n");
  return `<div class="cnx-aff-product cnx-aff-block-wrap">
  <div class="cnx-aff-product-body">
    <div class="cnx-aff-product-media">
      <img src="${esc(image)}" alt="${esc(title)}" class="cnx-aff-product-img" />
    </div>
    <div class="cnx-aff-product-main">
      <h3 class="cnx-aff-product-title" data-product-name="${esc(title)}">${esc(title)}</h3>
      <ul class="cnx-aff-product-features" style="color:#1e293b;">
${li}
      </ul>
      <div class="cnx-aff-product-cta">
        <a href="${esc(url)}" target="_blank" rel="nofollow sponsored noopener noreferrer">
          Ver na Amazon
        </a>
      </div>
    </div>
  </div>
</div>`;
}

function prosCons(pros, cons, url) {
  const pl = pros.map((t) => `          <li>${esc(t)}</li>`).join("\n");
  const cl = cons.map((t) => `          <li>${esc(t)}</li>`).join("\n");
  return `<div class="cnx-aff-pros-cons cnx-aff-block-wrap">
  <div class="cnx-aff-pros-cons-sections">
    <section class="cnx-aff-pros-section">
      <h3 class="cnx-aff-pros-title">Prós</h3>
      <ul class="cnx-aff-pros-list" style="color:#1e293b;">
${pl}
      </ul>
    </section>
    <section class="cnx-aff-cons-section">
      <h3 class="cnx-aff-cons-title">Contras</h3>
      <ul class="cnx-aff-cons-list" style="color:#1e293b;">
${cl}
      </ul>
    </section>
  </div>
  <div class="cnx-aff-pros-cons-cta">
      <a href="${esc(url)}" target="_blank" rel="nofollow sponsored noopener noreferrer">
        Ver na Amazon
      </a>
    </div>
</div>`;
}

const roundupJson = JSON.stringify(
  data.map((p, i) => ({
    rank: String(i + 1),
    itemBadge: p.badge || "",
    title: p.title,
    image: p.image,
    score: "",
    features: p.features,
    cta1: "Ver na Amazon",
    cta1Url: p.url,
    cta2: "",
    cta2Url: "",
  })),
);

function roundupItem(p, i) {
  const r = String(i + 1);
  const badge = p.badge ? `<div class="cnx-aff-roundup-item-badge">${esc(p.badge)}</div>` : "";
  const feats = p.features.map((f) => `<li>${esc(f)}</li>`).join("");
  return `  <div class="cnx-aff-roundup-item">
    <div class="cnx-aff-roundup-rank">${r}</div>
    <div class="cnx-aff-roundup-img-cell">
          <img src="${esc(p.image)}" alt="${esc(p.title)}" class="cnx-aff-roundup-img" />
        </div>
    <div class="cnx-aff-roundup-product-col">
      ${badge}
      <h3 class="cnx-aff-roundup-item-title">${esc(p.title)}</h3>
    </div>
    <div class="cnx-aff-roundup-features-col">
      <ul class="cnx-aff-roundup-feature-list" style="color:#1e293b;">${feats}</ul>
    </div>
    <div class="cnx-aff-roundup-cta-col">
      <div class="cnx-aff-roundup-ctas">
        <a class="cnx-aff-roundup-cta-primary" href="${esc(p.url)}" target="_blank" rel="nofollow sponsored noopener noreferrer">Ver na Amazon</a>
      </div>
    </div>
  </div>`;
}

const roundupHtml = `<div class="cnx-aff-roundup cnx-aff-block-wrap" data-cnx-roundup='${roundupJson}'>
  <div class="cnx-aff-roundup-head" aria-hidden="true">
    <span class="cnx-aff-roundup-head-spacer"></span>
    <span>Imagem</span>
    <span>Produto</span>
    <span>Destaques</span>
    <span>Preço</span>
  </div>
${data.map(roundupItem).join("\n")}
</div>`;

const ogPath = "/images/og/melhor-carrinho-para-bebe-de-2-anos-leveza-e-facilidade.jpg";

const frontmatter = `---
title: "Melhor Carrinho para Bebê de 2 Anos – leveza e facilidade"
slug: melhor-carrinho-para-bebe-de-2-anos
author: vitoria-caroline
category: carrinhos-de-bebe
publishedDate: "2026-05-14T12:00:00-03:00"
thumbnail: ${ogPath}
metaTitle: "Melhor carrinho para bebê de 2 anos – leveza e facilidade em 2026 | Bem Mãe"
metaDescription: Escolher o melhor carrinho para bebê de 2 anos é essencial. Conheça opções que oferecem leveza, segurança e versatilidade para o dia a dia com seu pequeno.
metaImage: ${ogPath}
keywords: carrinho bebê 2 anos, carrinho gêmeos leve, Graco gêmeos, Joie Aire Twin, Galzerano Doppio, Kiddo duplo, carrinho leve 8kg
contentFormat: html
seoSchema: articleItemList
articleLayout: reviewRoundup
---

`;

const intro = `<p>Escolher o carrinho ideal para um bebê de 2 anos pode ser uma tarefa complicada, especialmente quando se busca leveza e facilidade de uso. Para ajudar nessa decisão, foi montada uma lista com carrinhos que priorizam peso abaixo de 8kg e fechamento com uma mão. Esses critérios garantem praticidade para o dia a dia corrido dos pais.</p>
<p>A lista inclui opções variadas, desde carrinhos para gêmeos até modelos com bebê conforto, atendendo diferentes necessidades e preferências. Cada produto foi selecionado com base em especificações que realmente fazem a diferença no uso cotidiano.</p>

<h2>Lista dos melhores carrinhos para bebê de 2 anos</h2>
`;

const crit = `<h2>Critérios essenciais para escolher o ideal</h2>
<p>Ao escolher um carrinho para bebê de 2 anos, a leveza é fundamental. Carrinhos mais leves facilitam o transporte e o manuseio, especialmente em passeios longos. Verifique o peso total do carrinho e se ele é fácil de dobrar e guardar.</p>
<p>A facilidade de uso também é crucial. Considere carrinhos com sistema de travamento simples e rodas que giram suavemente. Isso garante que você possa manobrar o carrinho sem esforço, mesmo em espaços apertados.</p>
<p>Outro ponto importante é o conforto e a segurança. Procure modelos com assentos acolchoados e cintos de segurança ajustáveis. Isso garante que seu filho esteja seguro e confortável durante os passeios, sem comprometer a tranquilidade do passeio.</p>
`;

const productBlocks = data
  .map((p, i) => {
    const h = `<h2>${i + 1}. ${esc(p.title)}</h2>`;
    const paras = p.paras.map((x) => `<p>${esc(x)}</p>`).join("\n");
    return `${h}
${productCard(p.title, p.image, p.features, p.url)}
${paras}
${prosCons(p.pros, p.cons, p.url)}
<hr />`;
  })
  .join("\n");

const tail = `<h2>Tandem vs. lado a lado — qual formato é melhor?</h2>
<p>Carrinhos tandem, como o Graco Carrinho de Bebê Gêmeos Passeio, são populares pela facilidade de manobrabilidade em espaços estreitos. Eles permitem que você navegue por corredores apertados e portas com mais facilidade. No entanto, podem ser menos confortáveis para as crianças, já que o espaço para cada uma tende a ser mais restrito.</p>
<p>Por outro lado, carrinhos lado a lado, como o Joie Carrinho Duplo para Gêmeos Aire Twin, oferecem mais conforto individual e visão igual para as crianças. Este formato pode ser mais difícil de manobrar em locais apertados, mas proporciona um passeio mais agradável e espaçoso. O Galzerano Carrinho Duolee Duo exemplifica bem essa configuração, sendo ideal para passeios ao ar livre.</p>
<p>Ao escolher entre esses formatos, considere a frequência e o local de uso. Se o uso for predominantemente em áreas urbanas, um modelo tandem pode ser mais prático. Para quem busca conforto em passeios mais longos, um carrinho lado a lado pode ser mais adequado. Avalie também o peso e a facilidade de armazenamento, especialmente se o carrinho for transportado com frequência.</p>

<h2>Comparativo e diferencial</h2>
<p>O Graco Carrinho de Bebê Gêmeos Passeio se destaca pela leveza e facilidade de manobra, ideal para quem busca praticidade no dia a dia. Com um design compacto e fácil de dobrar, ele é perfeito para pais que precisam de mobilidade sem abrir mão do conforto dos pequenos.</p>

<h2>Perguntas frequentes</h2>
<h3>Qual carrinho de gêmeos é mais fácil de manobrar em espaços apertados?</h3>
<p>O Graco Carrinho de Bebê Gêmeos Passeio é ideal para espaços apertados devido ao seu design compacto.</p>
<h3>Qual carrinho oferece mais conforto para bebês de 2 anos?</h3>
<p>O Joie Carrinho Duplo para Gêmeos Aire Twin possui assentos acolchoados que garantem maior conforto.</p>
<h3>Qual carrinho é mais leve para transporte diário?</h3>
<p>O Galzerano Carrinho Duolee Duo é conhecido por sua leveza, facilitando o transporte diário.</p>
<h3>Qual carrinho possui melhor sistema de segurança?</h3>
<p>O Kiddo Carrinho para Gêmeos com Bebê Conforto oferece um sistema de segurança robusto com cinto de 5 pontos.</p>
<h3>Qual carrinho é mais fácil de montar e desmontar?</h3>
<p>O Galzerano Carrinho para Gêmeos Doppio II é fácil de montar e desmontar, ideal para pais em movimento.</p>
<h3>Qual carrinho tem melhor custo-benefício?</h3>
<p>O Kiddo Carrinho Duplo para Gêmeos oferece um bom equilíbrio entre preço e funcionalidade, sendo uma opção econômica.</p>
`;

const out =
  frontmatter +
  intro +
  "\n" +
  roundupHtml +
  "\n\n" +
  crit +
  "\n" +
  productBlocks +
  "\n" +
  tail;

const dest = path.join(__dirname, "../src/content/posts/melhor-carrinho-para-bebe-de-2-anos.mdoc");
fs.writeFileSync(dest, out, "utf8");
console.log("Wrote", dest);
