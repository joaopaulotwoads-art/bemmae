import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const filePath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/content/posts/melhores-fraldas.md');
let content = fs.readFileSync(filePath, 'utf8');

const rel = 'nofollow sponsored noopener noreferrer';

content = content.replace(
  /<div class="cnx-aff-product-cta-row">\s*<div class="cnx-aff-product-cta">/g,
  '<div class="cnx-aff-product-cta-row">\n        <motion.div class="cnx-aff-product-cta cnx-aff-product-cta--amazon">'.replace(
    /motion\./g,
    '',
  ),
);

content = content.replace(
  /(<div class="cnx-aff-product-cta-row">[\s\S]*?<div class="cnx-aff-product-cta cnx-aff-product-cta--amazon">[\s\S]*?<\/div>)\s*<\/div>\s*<p class="review-secondary-price"><a href="([^"]+)"[^>]*>Ver no Mercado Livre<\/a><\/p>/g,
  `$1\n        <div class="cnx-aff-product-cta cnx-aff-product-cta--ml">\n          <a href="$2" target="_blank" rel="${rel}">Ver no Mercado Livre</a>\n        </div>\n      </div>`,
);

fs.writeFileSync(filePath, content);
console.log('review-secondary-price left:', (content.match(/review-secondary-price/g) || []).length);
