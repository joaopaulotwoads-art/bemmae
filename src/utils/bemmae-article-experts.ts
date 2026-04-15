import type { CollectionEntry } from 'astro:content';

export type BemmaeExpertCardData = {
  name: string;
  badge?: string;
  role?: string;
  bio?: string;
  photo?: string;
  emoji?: string;
  href?: string;
};

function normHref(h: string) {
  return String(h || '')
    .trim()
    .replace(/\/+$/, '');
}

function memberToCard(m: Record<string, unknown>): BemmaeExpertCardData {
  return {
    name: String(m.name || '').trim(),
    badge: String(m.badge || '').trim(),
    role: String(m.role || '').trim(),
    bio: String(m.bio || '').trim(),
    photo: String(m.photo || '').trim(),
    emoji: String(m.emoji || '').trim(),
    href: String(m.href || '').trim(),
  };
}

function authorFallbackCard(author: CollectionEntry<'authors'>): BemmaeExpertCardData {
  const name = String(author.data.name || '').trim() || 'Autor';
  const avatar = String(author.data.avatar || '').trim();
  return {
    name,
    badge: '',
    role: String(author.data.role || '').trim(),
    bio: String(author.data.bio || '').trim(),
    photo: avatar,
    emoji: avatar ? '' : name.charAt(0).toUpperCase() || '👤',
    href: `/authors/${author.id}`,
  };
}

/**
 * Cartões de especialistas no fim do artigo: alinha com `teamMembers` do about.yaml
 * (badge, role, bio longos) e inclui figuras sem página de autor (ex.: revisão editorial).
 */
export function buildBemmaeArticleExperts(
  author: CollectionEntry<'authors'> | null,
  about: Record<string, unknown> | null | undefined,
): BemmaeExpertCardData[] {
  const teamRaw = Array.isArray(about?.teamMembers) ? about!.teamMembers : [];
  const team = teamRaw
    .map((m) => memberToCard(m as Record<string, unknown>))
    .filter((c) => c.name);

  if (team.length === 0) {
    return author ? [authorFallbackCard(author)] : [];
  }

  if (!author) {
    return team;
  }

  const authorHref = normHref(`/authors/${author.id}`);
  const match = team.find((m) => normHref(m.href || '') === authorHref);
  const others = team.filter((m) => normHref(m.href || '') !== authorHref);

  const primary: BemmaeExpertCardData = match
    ? { ...match, href: match.href || `/authors/${author.id}` }
    : authorFallbackCard(author);

  return [primary, ...others];
}
