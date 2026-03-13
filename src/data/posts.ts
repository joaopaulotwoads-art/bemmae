import postsJson from './posts-from-ghost.json';

export type Post = typeof postsJson[number];

export const posts: Post[] = postsJson as Post[];

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug);
}

