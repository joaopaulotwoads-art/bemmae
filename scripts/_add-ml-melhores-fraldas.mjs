/**
 * Add Mercado Livre secondary CTAs to melhores-fraldas.md
 * Run: node scripts/_add-ml-melhores-fraldas.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, '../src/content/posts/melhores-fraldas.md');

/** Paste 10 ML affiliate URLs (rank 1→10). Empty = lista.mercadolivre fallback. */
const ML_URLS = [
  'https://meli.la/1wBqEnK',
  'https://meli.la/2eugpm2',
  'https://meli.la/2fsuEa4',
  'https://meli.la/1tbccwn',
  'https://meli.la/2b6CEbK',
  'https://meli.la/2WWLBzv',
  'https://meli.la/14mM1KU',
  'https://meli.la/1FaGP1b',
  'https://meli.la/2dYBiTn',
  'https://meli.la/2BMu9tv',
];

const AMAZON_ORDER = [
  'https://amzn.to/4tEKpa4',
  'https://amzn.to/4uRoE7I',
  'https://amzn.to/3PGA1k2',
  'https://amzn.to/49xOohi',
  'https://amzn.to/4uaP04F',
  'https://amzn.to/4wDz24Y',
  'https://amzn.to/4dOi9wI',
  'https://amzn.to/4deTz87',
  'https://amzn.to/4eQJ24m',
  'https://amzn.to/3R8RfXP',
];

const ML_LABEL = 'Ver no Mercado Livre';
const rel = 'nofollow sponsored noopener noreferrer';

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

let content = fs.readFileSync(filePath, 'utf8');

const roundupMatch = content.match(/data-cnx-roundup="([^"]+)"/);
if (!roundupMatch) throw new Error('data-cnx-roundup not found');

const roundupJson = JSON.parse(roundupMatch[1].replace(/&quot;/g, '"'));
roundupJson.forEach((item, i) => {
  item.cta2 = ML_LABEL;
  item.cta2Url = mlLinkForIndex(i, item.title);
});
const newRoundupAttr = JSON.stringify(roundupJson).replace(/"/g, '&quot;');
content = content.replace(/data-cnx-roundup="[^"]+"/, `data-cnx-roundup="${newRoundupAttr}"`);

AMAZON_ORDER.forEach((amazonUrl, i) => {
  const mlUrl = mlLinkForIndex(i, roundupJson[i].title);
  const secondary = `<a class="cnx-aff-roundup-cta-secondary" href="${mlUrl}" target="_blank" rel="${rel}">${ML_LABEL}</a>`;

  const roundupPrimary = `<a class="cnx-aff-roundup-cta-primary" href="${amazonUrl}" target="_blank" rel="${rel}">Ver na Amazon</a>`;
  const roundupPair = `${roundupPrimary}\n        ${secondary}`;
  if (!content.includes(roundupPair)) {
    content = content.replace(roundupPrimary, roundupPair);
  }

  const productCtaOld = `<div class="cnx-aff-product-cta">
        <a href="${amazonUrl}" target="_blank" rel="${rel}">
          Ver na Amazon
        </a>
      </div>`;

  const productCtaNew = [
    '<div class="cnx-aff-product-cta-row">',
    '        <div class="cnx-aff-product-cta cnx-aff-product-cta--amazon">',
    `          <a href="${amazonUrl}" target="_blank" rel="${rel}">Ver na Amazon</a>`,
    '        </motion.div>',
    '        <motion.div class="cnx-aff-product-cta cnx-aff-product-cta--ml">',
    `          <a href="${mlUrl}" target="_blank" rel="${rel}">${ML_LABEL}</a>`,
    '        </motion.div>',
    '      </motion.div>',
  ]
    .join('\n')
    .replace(/motion\./g, '');

  if (content.includes(productCtaOld)) {
    content = content.replace(productCtaOld, productCtaNew);
  }

  const prosCtaOld = `<div class="cnx-aff-pros-cons-cta">
      <a href="${amazonUrl}" target="_blank" rel="${rel}">
        Ver na Amazon
      </a>
    </div>`;

  const prosCtaNew = [
    '<div class="cnx-aff-pros-cons-cta cnx-aff-pros-cons-ctas">',
    `      <a class="cnx-aff-pros-cons-cta-primary" href="${amazonUrl}" target="_blank" rel="${rel}">Ver na Amazon</a>`,
    `      <a class="cnx-aff-pros-cons-cta-secondary" href="${mlUrl}" target="_blank" rel="${rel}">${ML_LABEL}</a>`,
    '    </div>',
  ].join('\n');

  if (content.includes(prosCtaOld) && !content.includes(`cnx-aff-pros-cons-cta-secondary" href="${mlUrl}"`)) {
    content = content.replace(prosCtaOld, prosCtaNew);
  }
});

fs.writeFileSync(filePath, content);
console.log('Updated melhores-fraldas.md');
