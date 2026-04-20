import type { CollectionEntry } from 'astro:content';

type PostEntry = Pick<CollectionEntry<'posts'>, 'id' | 'data'>;

function foldDiacritics(s: string): string {
  return s.normalize('NFD').replace(/\p{M}/gu, '');
}

export function normalizeBlogSearchQuery(q: string | null | undefined): string {
  return (q ?? '').trim().replace(/\s+/g, ' ');
}

function postSearchBlob(post: PostEntry): string {
  return foldDiacritics(
    [
      post.data.title,
      post.data.metaDescription,
      post.data.metaTitle,
      post.data.slug,
      post.id,
    ]
      .filter(Boolean)
      .join(' \n ')
      .toLowerCase(),
  );
}

/**
 * Cada palavra da busca deve aparecer em título, meta, slug ou id (ordem livre).
 * Ignora maiúsculas e acentos.
 */
export function postMatchesBlogSearch(post: PostEntry, normalizedQuery: string): boolean {
  const q = normalizeBlogSearchQuery(normalizedQuery);
  if (!q) return true;
  const hay = postSearchBlob(post);
  const words = foldDiacritics(q.toLowerCase())
    .split(' ')
    .filter(Boolean);
  if (words.length === 0) return true;
  return words.every((w) => hay.includes(w));
}

export function filterPostsByBlogSearch<T extends PostEntry>(
  posts: T[],
  rawQuery: string | null | undefined,
): T[] {
  const q = normalizeBlogSearchQuery(rawQuery);
  if (!q) return posts;
  return posts.filter((p) => postMatchesBlogSearch(p, q));
}
