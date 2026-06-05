import fs from 'fs';

const s = fs.readFileSync('src/content/posts/melhor-carrinho-de-bebe.md', 'utf8');
const parts = s.split('<h2 class="cnx-aff-rank-heading">');
console.log('sections', parts.length - 1);
for (let i = 1; i <= parts.length - 1; i++) {
  const title = parts[i].match(/^[^<]+/)?.[0] ?? '?';
  const block = parts[i];
  const cardEnd = block.indexOf('</div></div></div><p>');
  const snippet = cardEnd >= 0 ? block.slice(cardEnd + 21, cardEnd + 21 + 1200) : '';
  console.log('\n===', i, title, '===');
  console.log(snippet.split('</p>')[0].slice(0, 400));
  console.log('---');
  console.log(snippet.split('</p>')[1]?.slice(0, 400) ?? '');
}
