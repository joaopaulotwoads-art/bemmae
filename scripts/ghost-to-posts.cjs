const fs = require('fs');
const path = require('path');

const exportPath = path.join(__dirname, 'bem-mae-ghost.json');
const outPath = path.join(__dirname, '../src/data/posts-from-ghost.json');

if (!fs.existsSync(exportPath)) {
  console.error('Arquivo de export do Ghost não encontrado em:', exportPath);
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(exportPath, 'utf8'));

// Estrutura padrão do export do Ghost: { db: [ { data: { posts: [...] } } ] }
const posts = raw.db?.[0]?.data?.posts || [];

function cleanGhostUrl(html) {
  if (!html || typeof html !== 'string') return html || '';
  return html.replace(/__GHOST_URL__/g, '');
}

const mapped = posts
  .filter((p) => p.status === 'published')
  .map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    html: cleanGhostUrl(p.html),
    created_at: p.created_at,
    updated_at: p.updated_at,
    published_at: p.published_at,
    excerpt: p.custom_excerpt || p.excerpt || '',
    feature_image: p.feature_image || null,
  }));

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(mapped, null, 2), 'utf8');
console.log('Gerado', outPath, 'com', mapped.length, 'posts publicados.');

