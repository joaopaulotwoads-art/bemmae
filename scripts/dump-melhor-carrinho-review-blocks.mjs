import fs from 'fs';

const s = fs.readFileSync('src/content/posts/melhor-carrinho-de-bebe.md', 'utf8');
const re =
  /<h2 class="cnx-aff-rank-heading">([^<]+)<\/h2><div class="cnx-aff-product[\s\S]*?Ver na Amazon<\/a><\/div><\/div><\/div><\/div>(<p>[\s\S]*?)<div class="cnx-aff-pros-cons/g;
let m;
let n = 0;
while ((m = re.exec(s)) !== null) {
  n++;
  console.log('---', n, m[1].trim(), '---');
  console.log(JSON.stringify(m[2]));
  console.log('');
}
