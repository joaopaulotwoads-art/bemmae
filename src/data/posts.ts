import postsJson from './posts-from-ghost.json';

export type Post = typeof postsJson[number];

function cleanGhostUrl(html: string): string {
  return (html || '').replace(/__GHOST_URL__/g, '');
}

export const posts: Post[] = (postsJson as Post[]).map((p) => ({
  ...p,
  html: cleanGhostUrl(p.html),
}));

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug);
}

