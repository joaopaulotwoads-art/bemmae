import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '../src/content/posts/melhor-fralda-pampers.md');

const ML_LABEL = 'Ver no Mercado Livre';
const rel = 'nofollow sponsored noopener noreferrer';

/** Cole 10 links meli.la (rank 1→10). Vazio = busca no Mercado Livre pelo título. */
const ML_URLS = [
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
];

function mlListaFallback(title) {
  const slug = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `https://lista.mercadolivre.com.br/${slug}`;
}

function mlLinkForIndex(i, title) {
  return (ML_URLS[i] || '').trim() || mlListaFallback(title);
}

const data = [
  {
    title: 'Pampers Premium Care Fralda Tamanho P',
    image: 'https://m.media-amazon.com/images/I/618UVKgOQ1L._AC_SY300_SX300_QL70_ML2_.jpg',
    url: 'https://www.amazon.com.br/dp/B07GQ136TS',
    badge: 'Melhor escolha',
    highlight: 'Proteção noturna',
    features: ['Barreiras anti-derrames para noites tranquilas', 'Suave como algodão para conforto do bebê', 'Canais de ar para pele sequinha'],
    rating: { aria: 'Nota 5.0 de 5', stars: '★★★★★', score: '5.0', count: '6.564 avaliações' },
    paras: [
      'A Pampers Premium Care Fralda Tamanho P é projetada para proporcionar conforto e proteção aos bebês nos primeiros meses de vida. Com barreiras anti-derrames e canais de ar, mantém a pele arejada e seca. O ajuste flexível e a loção hipoalergênica ajudam a prevenir irritações, garantindo até 12 horas de absorção.',
      'Este produto é ideal para cuidadores de recém-nascidos que buscam evitar assaduras e garantir noites tranquilas. A combinação de suavidade e proteção prolongada oferece segurança no uso prolongado. No entanto, para bebês com necessidades específicas de absorção, pode ser necessário avaliar outras opções complementares.',
    ],
    pros: ['Protege contra vazamentos durante a noite', 'Conforto que não irrita a pele', 'Mantém a pele arejada e seca', 'Ajusta-se facilmente ao corpo do bebê'],
    cons: ['Não contém fibras de algodão'],
  },
  {
    title: 'Pampers Pants Ajuste Total Tamanho M',
    image: 'https://m.media-amazon.com/images/I/61kHj8Jf52L._AC_SY300_SX300_QL70_ML2_.jpg',
    url: 'https://www.amazon.com.br/dp/B0C5SQNSL4',
    highlight: 'Facilidade de troca',
    features: ['Cintura elástica para ajuste perfeito', 'Barreira Anti-cocô evita vazamentos', 'Fácil de vestir e tirar rapidamente'],
    rating: { aria: 'Nota 4.5 de 5', stars: '★★★★⯨', score: '4.5', count: '500 avaliações' },
    paras: [
      'A Pampers Pants Ajuste Total Tamanho M é uma fralda projetada para oferecer conforto e proteção para bebês. Com cintura elástica 360°, adapta-se perfeitamente ao corpo do bebê, enquanto a nova barreira anti-cocô previne vazamentos nas costas. Oferece até 12 horas de proteção, tornando as noites mais tranquilas e secas.',
      'Este produto é ideal para pais que buscam uma solução prática e segura para noites de sono contínuo. A facilidade de vestir e retirar, aliada à proteção contra vazamentos, justifica o investimento. Pode não ser a melhor escolha para bebês com necessidades específicas fora do padrão de uso recomendado, onde a proteção pode variar.',
    ],
    pros: ['Ajusta-se ao corpo do bebê', 'Mantém o bebê sequinho à noite', 'Troca rápida e sem complicação', 'Protege contra vazamentos nas costas'],
    cons: ['Não é ideal para bebês muito ativos'],
  },
  {
    title: 'Pampers Fralda Confort Sec Tamanho M',
    image: 'https://m.media-amazon.com/images/I/71sFW94e1IL._AC_SY300_SX300_QL70_ML2_.jpg',
    url: 'https://www.amazon.com.br/dp/B09FFRMKNQ',
    highlight: 'Absorção',
    features: ['Até 2X mais seco para noites tranquilas', 'Canais de ar para pele arejada', 'Gel mágico para absorção eficaz'],
    rating: { aria: 'Nota 5.0 de 5', stars: '★★★★★', score: '5.0', count: '11.231 avaliações' },
    paras: [
      'A Pampers Fralda Confort Sec Tamanho M é projetada para bebês que precisam de proteção durante toda a noite. Com tecnologia que promete até 2x mais secura em comparação com fraldas comuns, conta com canais de ar que mantêm a pele arejada e um gel mágico que retém a umidade, proporcionando noites mais tranquilas.',
      'Este produto é ideal para bebês que necessitam de uma fralda que ofereça alta absorção e conforto durante o sono. Os pais que buscam evitar vazamentos noturnos encontrarão nas barreiras anti vazamento e no ajuste flexível uma solução eficaz. Pode não ser a escolha mais econômica, mas o investimento compensa pela tranquilidade e proteção oferecidas.',
    ],
    pros: ['Bumbum seco para noites de sono', 'Menos troca de fraldas à noite', 'Conforto que evita irritações', 'Proteção extra contra vazamentos'],
    cons: ['Requer troca frequente para melhor desempenho'],
  },
  {
    title: 'Pampers Fralda Recém-Nascido Tamanho RN+',
    image: 'https://m.media-amazon.com/images/I/61JMOOlw39L._AC_SY300_SX300_QL70_ML2_.jpg',
    url: 'https://www.amazon.com.br/dp/B07GPV56NS',
    highlight: 'Recém-nascido',
    features: ['Proteção suave para a pele do bebê', 'Afasta umidade e cocô da pele', 'Indica quando é hora da troca'],
    rating: { aria: 'Nota 5.0 de 5', stars: '★★★★★', score: '5.0', count: '4.033 avaliações' },
    paras: [
      'As fraldas Pampers Recém-Nascido Tamanho RN+ foram desenvolvidas para atender às necessidades dos primeiros dias de vida dos bebês. Com um corte especial para o umbigo, elas oferecem ajuste suave e flexível. O indicador de umidade avisa quando é hora de trocar, enquanto a malha algodão-sec afasta a umidade e o cocô da pele sensível do bebê.',
      'Este produto é ideal para recém-nascidos que precisam de proteção delicada e eficaz. As fraldas são uma boa escolha para quem busca segurança e conforto, graças à loção hipoalergênica que previne irritações. O investimento vale a pena pelo cuidado com a pele sensível do bebê, mas pode não ser necessário para quem já superou essa fase inicial.',
    ],
    pros: ['Conforto para a pele sensível do bebê', 'Trocas rápidas com indicador de umidade', 'Protege o umbigo sem incomodar', 'Mantém a pele seca por mais tempo'],
    cons: ['Não contém fibras de algodão'],
  },
  {
    title: 'Pampers Premium Care Pants Fácil de Vestir',
    image: 'https://m.media-amazon.com/images/I/61LKL15Bt2L._AC_SY300_SX300_QL70_ML2_.jpg',
    url: 'https://www.amazon.com.br/dp/B088P95YRD',
    highlight: 'Troca prática',
    features: ['Troca rápida e prática para pais', 'Cintura elástica que se adapta facilmente', 'Indicador de umidade para troca precisa'],
    rating: { aria: 'Nota 5.0 de 5', stars: '★★★★★', score: '5.0', count: '687 avaliações' },
    paras: [
      'Pampers Premium Care Pants Fácil de Vestir são fraldas projetadas para facilitar a troca em bebês. Com cintura elástica 360° e sistema de Ajuste Inteligente, adaptam-se perfeitamente ao corpo do bebê. O produto possui indicador de umidade e promete até 12 horas de proteção, garantindo noites tranquilas e secas.',
      'Este produto é ideal para cuidadores que buscam praticidade e conforto durante a troca de fraldas, especialmente à noite. A cintura elástica e o indicador de umidade tornam essas fraldas uma escolha conveniente para quem deseja minimizar interrupções no sono do bebê. Pode não ser a opção mais econômica para uso durante o dia.',
    ],
    pros: ['Facilidade na troca durante a noite', 'Conforto que acompanha o crescimento do bebê', 'Menos preocupações com vazamentos noturnos', 'Rasgue e retire sem complicações'],
    cons: ['Pode ser difícil de ajustar em bebês muito ativos'],
  },
  {
    title: 'Pampers Fralda Supersequinha Tamanho M',
    image: 'https://m.media-amazon.com/images/I/617TESrq0lL._AC_SY300_SX300_QL70_ML2_.jpg',
    url: 'https://www.amazon.com.br/dp/B07X4GWDZY',
    highlight: 'Noite seca',
    features: ['Mantém o bebê seco a noite toda', 'Camada extra para conforto do bebê', 'Magic Gel retém umidade eficientemente'],
    rating: { aria: 'Nota 4.5 de 5', stars: '★★★★⯨', score: '4.5', count: '1.456 avaliações' },
    paras: [
      'A Pampers Fralda Supersequinha Tamanho M é projetada para manter os bebês secos durante a noite inteira. Com uma camada extra de absorção e Magic Gel, a fralda impede que o xixi entre em contato com a pele. As fitas reajustáveis permitem ajustes precisos, promovendo maior conforto e segurança sem danificar a fralda.',
      'Este produto é ideal para bebês que dormem a noite toda e precisam de uma proteção prolongada contra vazamentos. Pais que buscam uma fralda com alta capacidade de absorção, especialmente para uso noturno, encontrarão nesta opção uma escolha valiosa. Talvez não seja a melhor opção para quem busca economia a curto prazo, mas compensa pelo conforto e eficácia no uso prolongado.',
    ],
    pros: ['Evita assaduras durante a noite', 'Conforto semelhante ao tecido de roupa', 'Ajuste fácil sem danificar a fralda', 'Absorção superior em comparação a concorrentes'],
    cons: ['Não é reutilizável, apenas descartável'],
  },
  {
    title: 'Pampers Fralda Descartável Premium Care XG',
    image: 'https://m.media-amazon.com/images/I/71ubStm-xGL._AC_SY300_SX300_QL70_ML2_.jpg',
    url: 'https://www.amazon.com.br/dp/B0DDV1C223',
    highlight: 'Conforto premium',
    features: ['Suave como algodão para conforto total', 'Canais de ar para pele sequinha', 'Loção hipoalergênica previne irritações'],
    rating: { aria: 'Nota 4.5 de 5', stars: '★★★★⯨', score: '4.5', count: '765 avaliações' },
    paras: [
      'Pampers Fralda Descartável Premium Care XG é projetada para bebês em fase de crescimento que necessitam de proteção prolongada. Oferecendo suavidade similar ao algodão, possui canais de ar que mantêm a pele do bebê arejada e sequinha. Conta com loção hipoalergênica exclusiva para prevenir irritações e um sistema de absorção que garante até 12 horas de sono seco.',
      'Este produto é ideal para pais que buscam conforto e proteção prolongada para seus bebês ativos. O ajuste flexível da fralda acompanha os movimentos do bebê, tornando-a uma opção segura para longos períodos, como noites de sono. O investimento é justificado para quem valoriza cuidados com a pele e conforto contínuo.',
    ],
    pros: ['Conforto que acalma o bebê', 'Menos trocas durante a noite', 'Pele do bebê sempre fresca', 'Ajuste que permite liberdade de movimento'],
    cons: ['Não possui indicador de umidade'],
  },
  {
    title: 'Pampers Fralda Supersequinha Tamanho G',
    image: 'https://m.media-amazon.com/images/I/61A0SW8AHKL._AC_SY300_SX300_QL70_ML2_.jpg',
    url: 'https://www.amazon.com.br/dp/B07X4GVF9H',
    highlight: 'Absorção noturna',
    features: ['Mantém o bebê seco a noite toda', 'Camada extra para conforto e proteção', 'Magic Gel retém umidade eficientemente'],
    rating: { aria: 'Nota 4.5 de 5', stars: '★★★★⯨', score: '4.5', count: '4.646 avaliações' },
    paras: [
      'A Pampers Fralda Supersequinha Tamanho G é desenvolvida para manter bebês secos durante uma noite inteira. Com uma camada extra de absorção, evita que a umidade entre em contato com a pele delicada do bebê. O Magic Gel retém a umidade internamente, enquanto a cobertura tipo tecido proporciona mais conforto. As fitas reajustáveis permitem ajustes sem danificar a fralda.',
      'Este produto é ideal para bebês que necessitam de proteção prolongada durante o sono, garantindo conforto e pele seca. As fraldas são particularmente úteis para noites, quando trocas frequentes não são práticas. O investimento compensa para quem prioriza uma noite tranquila, mas pode não ser necessário para quem realiza trocas frequentes ou durante o dia.',
    ],
    pros: ['Evita assaduras durante a noite', 'Conforto semelhante ao tecido de roupa', 'Ajuste fácil sem danificar a fralda', 'Proteção prolongada para noites tranquilas'],
    cons: ['Não é reutilizável, apenas descartável'],
  },
  {
    title: 'Pampers Pants Ajuste Total Tamanho XXG',
    image: 'https://m.media-amazon.com/images/I/71Xr1Ayhm1L._AC_SY300_SX300_QL70_ML2_.jpg',
    url: 'https://www.amazon.com.br/dp/B0CGY6WDHC',
    highlight: 'Ajuste total',
    features: ['Ajuste perfeito para o corpo do bebê', 'Conforto que permite liberdade de movimento', 'Material respirável para pele saudável'],
    rating: { aria: 'Nota 5.0 de 5', stars: '★★★★★', score: '5.0', count: '2.549 avaliações' },
    paras: [
      'As fraldas Pampers Pants Ajuste Total Tamanho XXG são projetadas para atender crianças em fase avançada de crescimento, oferecendo um ajuste completo e confortável. Com dimensões da embalagem de 58,2 x 49,4 x 22,5 cm e pesando 3,28 kg, este produto é fabricado no Brasil pela Procter & Gamble, garantindo qualidade e segurança para o uso diário.',
      'Este produto é ideal para crianças grandes que necessitam de um ajuste seguro e eficaz durante o uso diário. Com uma avaliação de 4,8 de 5 estrelas de 2.549 clientes, as fraldas Pampers Pants são uma escolha confiável para garantir conforto e proteção. O investimento é justificado para quem busca fraldas que acompanhem o crescimento e ofereçam praticidade no dia a dia.',
    ],
    pros: ['Facilita a troca rápida e prática', 'Mantém o bebê seco por mais tempo', 'Reduz vazamentos durante a noite', 'Design que se adapta ao crescimento'],
    cons: ['Pode ser mais caro que marcas básicas', 'Tamanho XXG pode não ser comum'],
  },
  {
    title: 'Pampers Premium Care Fralda Tamanho G',
    image: 'https://m.media-amazon.com/images/I/61KXSX2M+ML._AC_SY300_SX300_QL70_ML2_.jpg',
    url: 'https://www.amazon.com.br/dp/B0DDTZD5BS',
    highlight: 'Conforto diário',
    features: ['Suave como algodão para conforto diário', 'Canais de Ar mantêm pele arejada', 'Loção hipoalergênica previne irritações'],
    rating: { aria: 'Nota 5.0 de 5', stars: '★★★★★', score: '5.0', count: '1.305 avaliações' },
    paras: [
      'As fraldas Pampers Premium Care Tamanho G são projetadas para bebês em fase de crescimento, oferecendo a proteção mais suave da marca. Com canais de ar que mantêm a pele do bebê arejada e seca, elas também contam com um sistema de absorção que garante até 12 horas de sono sem vazamentos. O ajuste flexível e cômodo se adapta aos movimentos, proporcionando conforto durante o uso.',
      'Este produto é ideal para bebês que precisam de conforto e proteção prolongada durante o sono e atividades do dia a dia. Os pais que buscam prevenir irritações e manter a pele do bebê sempre seca encontrarão na loção hipoalergênica um grande aliado. Vale o investimento para quem deseja fraldas que oferecem segurança durante longos períodos, mas pode não ser a escolha mais econômica para quem troca fraldas com frequência.',
    ],
    pros: ['Conforto prolongado durante a noite', 'Menos trocas noturnas para pais', 'Pele do bebê sempre sequinha', 'Facilita a movimentação do bebê'],
    cons: ['Pode ser mais caro que fraldas comuns', 'Não é ideal para bebês com alergias específicas'],
  },
];

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function ratingMini(r) {
  return `<motion.div class="cnx-aff-rating cnx-aff-rating--mini">
  <span class="cnx-aff-rating-stars" aria-label="${esc(r.aria)}">${r.stars}</span>
  <span class="cnx-aff-rating-score">${esc(r.score)}</span>
  <span class="cnx-aff-rating-count">${esc(r.count)}</span>
</motion.div>`.replace(/motion\./g, '');
}

function productCard(title, image, features, amazonUrl, mlUrl) {
  const li = features.map((f) => `        <li>${esc(f)}</li>`).join('\n');
  return `<motion.div class="cnx-aff-product cnx-aff-block-wrap">
  <motion.div class="cnx-aff-product-body">
    <motion.div class="cnx-aff-product-media">
      <img src="${esc(image)}" alt="${esc(title)}" class="cnx-aff-product-img" loading="lazy" decoding="async" />
    </motion.div>
    <motion.div class="cnx-aff-product-main">
      <h3 class="cnx-aff-product-title" data-product-name="${esc(title)}">${esc(title)}</h3>
      <ul class="cnx-aff-product-features" style="color:#1e293b;">
${li}
      </ul>
      <motion.div class="cnx-aff-product-cta-row">
        <motion.div class="cnx-aff-product-cta cnx-aff-product-cta--amazon">
          <a href="${esc(amazonUrl)}" target="_blank" rel="${rel}">Ver na Amazon</a>
        </motion.div>
        <motion.div class="cnx-aff-product-cta cnx-aff-product-cta--ml">
          <a href="${esc(mlUrl)}" target="_blank" rel="${rel}">${ML_LABEL}</a>
        </motion.div>
      </motion.div>
    </motion.div>
  </motion.div>
</motion.div>`.replace(/motion\./g, '');
}

function prosCons(pros, cons, amazonUrl, mlUrl) {
  const pl = pros.map((t) => `          <li>${esc(t)}</li>`).join('\n');
  const cl = cons.map((t) => `          <li>${esc(t)}</li>`).join('\n');
  return `<motion.div class="cnx-aff-pros-cons cnx-aff-block-wrap">
  <motion.div class="cnx-aff-pros-cons-sections">
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
  </motion.div>
  <motion.div class="cnx-aff-pros-cons-cta cnx-aff-pros-cons-ctas">
      <a class="cnx-aff-pros-cons-cta-primary" href="${esc(amazonUrl)}" target="_blank" rel="${rel}">Ver na Amazon</a>
      <a class="cnx-aff-pros-cons-cta-secondary" href="${esc(mlUrl)}" target="_blank" rel="${rel}">${ML_LABEL}</a>
    </motion.div>
</motion.div>`.replace(/motion\./g, '');
}

function scoreTo10(score) {
  const n = parseFloat(score);
  return Number.isNaN(n) ? '' : (n * 2).toFixed(1);
}

const roundupJson = JSON.stringify(
  data.map((p, i) => ({
    rank: String(i + 1),
    itemBadge: p.badge || '',
    title: p.title,
    image: p.image,
    score: scoreTo10(p.rating.score),
    highlight: p.highlight || '',
    features: p.features,
    cta1: 'Ver preço',
    cta1Url: p.url,
    cta2: ML_LABEL,
    cta2Url: mlLinkForIndex(i, p.title),
  })),
);

function roundupItem(p, i) {
  const mlUrl = mlLinkForIndex(i, p.title);
  const r = String(i + 1);
  const badge = p.badge ? `<div class="cnx-aff-roundup-item-badge">${esc(p.badge)}</div>` : '';
  const score10 = scoreTo10(p.rating.score);
  const highlight = p.highlight
    ? `<p class="cnx-aff-roundup-highlight"><span class="cnx-aff-roundup-highlight-label">Destaque:</span> ${esc(p.highlight)}</p>`
    : '';
  const scoreBadge = `<div class="cnx-aff-roundup-score-badge" aria-label="Nota ${esc(score10)} de 10">
      <span class="cnx-aff-roundup-score-star" aria-hidden="true">★</span>
      <span class="cnx-aff-roundup-score-value">${esc(score10)}</span>
      <span class="cnx-aff-roundup-score-suffix">/10</span>
    </div>`;
  return `  <motion.div class="cnx-aff-roundup-item">
    <motion.div class="cnx-aff-roundup-rank">${r}</motion.div>
    <motion.div class="cnx-aff-roundup-card-body">
      <motion.div class="cnx-aff-roundup-img-cell">
        <img src="${esc(p.image)}" alt="${esc(p.title)}" class="cnx-aff-roundup-img" loading="lazy" decoding="async" />
      </motion.div>
      <motion.div class="cnx-aff-roundup-product-col">
        ${badge}
        <h3 class="cnx-aff-roundup-item-title">${esc(p.title)}</h3>
        ${highlight}
      </motion.div>
      <motion.div class="cnx-aff-roundup-card-divider" aria-hidden="true"></motion.div>
      <motion.div class="cnx-aff-roundup-cta-col">
        ${scoreBadge}
        <motion.div class="cnx-aff-roundup-ctas">
          <a class="cnx-aff-roundup-cta-primary" href="${esc(p.url)}" target="_blank" rel="${rel}">Ver preço</a>
          <a class="cnx-aff-roundup-cta-secondary" href="${esc(mlUrl)}" target="_blank" rel="${rel}">${ML_LABEL}</a>
        </motion.div>
      </motion.div>
    </motion.div>
  </motion.div>`.replace(/motion\./g, '');
}

const roundupHtml = `<motion.div class="cnx-aff-roundup cnx-aff-block-wrap cnx-aff-roundup--no-features cnx-aff-roundup--cards" data-cnx-roundup='${roundupJson}'>
${data.map(roundupItem).join('\n')}
</motion.div>`.replace(/motion\./g, '');

const frontmatter = `---
title: Melhor fralda Pampers Premium Care ou Confort Sec qual escolher
slug: melhor-fralda-pampers
author: vitoria-caroline
category: fraldas
publishedDate: "2026-05-18T12:00:00-03:00"
thumbnail: /images/og/melhor-fralda-pampers-analise-das-opcoes-disponiveis.png
metaTitle: Melhor fralda Pampers Premium Care ou Confort Sec qual escolher | Bem Mãe
metaDescription: Encontre a melhor fralda Pampers para seu bebê. Veja como a Premium Care se destaca em conforto e proteção, além de dicas para escolher o tamanho ideal.
metaImage: /images/og/melhor-fralda-pampers-analise-das-opcoes-disponiveis.png
keywords: 'fraldas Pampers, Premium Care, Confort Sec, Supersec, fralda pants, conforto bebê'
contentFormat: html
seoSchema: articleItemList
articleLayout: reviewRoundup
---

`;

const intro = `<p>Escolher a fralda certa pode ser um verdadeiro desafio para mães que buscam conforto e proteção para seus bebês. Imagine estar no meio de um passeio e perceber que a fralda não aguentou o tranco, ou ainda, durante a noite, quando tudo que você quer é que seu pequeno durma tranquilamente sem vazamentos. Há também aqueles momentos em que a pele sensível do bebê precisa de um toque extra de suavidade para evitar irritações. E, claro, a praticidade no dia a dia é essencial, afinal, ninguém quer perder tempo com trocas complicadas. E para te ajudar nessa escolha, selecionamos os 10 melhores modelos de fralda Pampers disponíveis em 2026.</p>

<h2>Lista dos melhores modelos de fralda Pampers em 2026</h2>
`;

const crit = `<h2>Critérios Essenciais para Escolher o Ideal</h2>
<p>Ao escolher a melhor fralda Pampers, considere o tamanho adequado para o bebê, garantindo conforto e evitando vazamentos. Tamanhos variam de RN+ a XXG, atendendo recém-nascidos até crianças maiores.</p>
<p>A absorção é crucial para manter a pele do bebê seca e saudável. Opções como a Pampers Premium Care oferecem camadas extras de proteção, enquanto a Supersequinha foca na absorção prolongada.</p>
<p>Facilidade de uso também é importante, especialmente para pais atarefados. Fraldas como a Pampers Pants Ajuste Total oferecem praticidade ao vestir, ideal para bebês que já se movimentam bastante.</p>
`;

const productBlocks = data
  .map((p, i) => {
    const h = `<h2>${i + 1}. ${esc(p.title)}</h2>`;
    const paras = p.paras.map((x) => `<p>${esc(x)}</p>`).join('\n');
    const mlUrl = mlLinkForIndex(i, p.title);
    return `${h}
${productCard(p.title, p.image, p.features, p.url, mlUrl)}
${ratingMini(p.rating)}
${paras}
${prosCons(p.pros, p.cons, p.url, mlUrl)}
<hr />`;
  })
  .join('\n');

const tail = `<h2>Premium Care vs Confort Sec vs Supersec: Entenda</h2>
<h3>Comparação de Linhas Pampers</h3>
<p>A linha Pampers Premium Care oferece fraldas como a Premium Care Fralda Tamanho P, que se destaca por suas barreiras anti-derrames e suavidade semelhante ao algodão, garantindo conforto e pele seca. Já a Pampers Fralda Descartável Premium Care XG inclui loção hipoalergênica, ideal para evitar irritações. O Premium Care é recomendado para quem busca máximo conforto e proteção da pele.</p>
<p>A Pampers Confort Sec, com a Fralda Tamanho M, foca na absorção com seu gel mágico e canais de ar, prometendo até 2X mais secura. É uma opção prática para noites tranquilas, especialmente para bebês que precisam de uma solução mais econômica sem abrir mão da eficácia na absorção. A linha é ideal para quem prioriza manter o bebê seco por mais tempo.</p>
<p>Por outro lado, a Pampers Supersec, como a Fralda Supersequinha Tamanho M, é projetada para manter o bebê seco a noite toda, com uma camada extra de conforto e o eficaz Magic Gel. É uma escolha indicada para quem busca uma solução confiável para evitar vazamentos durante o sono. As fraldas Supersec são adequadas para quem precisa de uma opção mais acessível que ainda oferece proteção noturna de qualidade.</p>

<h2>Fralda de Tira vs. Fralda Pants: Qual escolher?</h2>
<h3>Vantagens da Fralda de Tira</h3>
<p>As fraldas de tira, como a Pampers Premium Care Fralda Tamanho P, são ideais para recém-nascidos. Elas oferecem barreiras anti-derrames, garantindo noites tranquilas. Além disso, a suavidade do material proporciona conforto semelhante ao algodão, essencial para a pele delicada dos bebês. As fraldas de tira também possuem canais de ar que mantêm a pele seca e arejada, prevenindo assaduras. Para os pais que buscam praticidade, o indicador de umidade da Pampers Fralda Recém-Nascido Tamanho RN+ é um recurso valioso, avisando quando é hora de trocar.</p>
<h3>Vantagens da Fralda Pants</h3>
<p>As fraldas pants, como a Pampers Pants Ajuste Total Tamanho M, são perfeitas para bebês ativos. A cintura elástica proporciona um ajuste perfeito, permitindo liberdade de movimento. A facilidade de vestir e tirar rapidamente é uma vantagem para pais que precisam de agilidade no dia a dia. A Pampers Premium Care Pants Fácil de Vestir oferece troca prática, ideal para momentos fora de casa. Com barreiras anti-cocô e material respirável, as fraldas pants evitam vazamentos e mantêm a pele saudável. O ajuste total e o conforto são diferenciais importantes para crianças em fase de crescimento.</p>
<p>Para escolher entre fralda de tira ou pants, considere a idade e o nível de atividade do bebê. Recém-nascidos se beneficiam das fraldas de tira pela proteção e conforto, enquanto bebês mais ativos podem aproveitar a liberdade e praticidade das fraldas pants.</p>

<h2>Comparativo e Diferencial</h2>
<p>A Pampers Premium Care Fralda Tamanho P se destaca como a melhor escolha para mães que buscam conforto e proteção superior para seus bebês. Sua camada ultra macia e a tecnologia de absorção garantem até 12 horas de proteção, sendo ideal para recém-nascidos com pele sensível.</p>

<h2>Perguntas Frequentes</h2>
<h3>Qual a fralda Pampers mais indicada para bebês com pele sensível?</h3>
<p>A Pampers Premium Care Fralda Tamanho P é ideal devido à sua camada ultra macia e proteção contra vazamentos.</p>
<h3>Qual fralda Pampers oferece melhor ajuste para bebês ativos?</h3>
<p>A Pampers Pants Ajuste Total Tamanho M proporciona ajuste anatômico, permitindo maior liberdade de movimento.</p>
<h3>Qual opção é mais econômica para uso diário?</h3>
<p>A Pampers Fralda Supersequinha Tamanho M é uma escolha acessível com boa capacidade de absorção.</p>
<h3>Fralda Pampers para recém-nascidos: qual a melhor escolha?</h3>
<p>A Pampers Fralda Recém-Nascido Tamanho RN+ oferece ajuste suave e proteção extra para os primeiros dias de vida.</p>
<h3>Qual fralda Pampers tem maior capacidade de absorção para a noite?</h3>
<p>A Pampers Fralda Confort Sec Tamanho M é eficaz para noites tranquilas, com absorção prolongada.</p>
<h3>Qual a diferença entre Pampers Premium Care e Pampers Supersequinha?</h3>
<p>A Premium Care oferece maior suavidade e proteção para peles sensíveis, enquanto a Supersequinha é mais econômica e prática para o dia a dia.</p>
`;

const body = intro + roundupHtml + crit + productBlocks + tail;
fs.writeFileSync(outPath, frontmatter + body);
console.log('Wrote', outPath);
