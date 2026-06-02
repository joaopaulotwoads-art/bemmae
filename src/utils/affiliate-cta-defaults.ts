/** Rótulos padrão dos CTAs de afiliado (Amazon + Mercado Livre). */
export const AMAZON_CTA_LABEL = 'Ver na Amazon';
export const ML_CTA_LABEL = 'Ver no Mercado Livre';
export const PRICE_CTA_LABEL = 'Ver preço';

/** URL de busca no Mercado Livre a partir do nome do produto. */
export function mercadoLivreSearchUrl(title: string): string {
  const slug = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `https://lista.mercadolivre.com.br/${slug || 'fralda'}`;
}

/** Preenche cta2 padrão quando o texto ML está definido mas a URL está vazia. */
export function withDefaultMercadoLivreCta<T extends { title: string; cta2: string; cta2Url: string }>(
  item: T,
): T {
  if (item.cta2 && !item.cta2Url.trim()) {
    return { ...item, cta2Url: mercadoLivreSearchUrl(item.title) };
  }
  if (!item.cta2 && !item.cta2Url) {
    return {
      ...item,
      cta2: ML_CTA_LABEL,
      cta2Url: mercadoLivreSearchUrl(item.title),
    };
  }
  return item;
}
