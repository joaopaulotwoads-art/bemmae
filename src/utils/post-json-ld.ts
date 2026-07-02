/**
 * JSON-LD para posts: @graph com #website, #organization, #author, ImageObject, SearchAction, BreadcrumbList.
 */

import { canonicalPathname, schemaPageUrl } from './read-site-settings';

export type PostSeoSchema = 'auto' | 'blogPosting' | 'articleItemList' | 'none';

const BEMMAE_CARD_H3 =
    /<div[^>]*class="[^"]*\bbemmae-card\b[^"]*"[^>]*>[\s\S]*?<div[^>]*class="[^"]*\bbemmae-text\b[^"]*"[^>]*>[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>/gi;

const DEFAULT_IMAGE_WIDTH = 1200;
const DEFAULT_IMAGE_HEIGHT = 630;

export function extractBemmaeRankedProductNames(html: string | null | undefined): string[] {
    if (!html) return [];
    const names: string[] = [];
    for (const m of html.matchAll(BEMMAE_CARD_H3)) {
        const name = m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        if (name && !/^ficha t[eé]cnica/i.test(name)) names.push(name);
    }
    return names;
}

export function extractRankedProducts(html: string | null | undefined): { name: string; url?: string }[] {
    if (!html) return [];

    const dataAttrMatch = html.match(/data-cnx-roundup="([^"]+)"/) || html.match(/data-cnx-roundup='([^']+)'/);
    if (dataAttrMatch) {
        try {
            const decoded = dataAttrMatch[1].replace(/&quot;/g, '"');
            const parsed: unknown = JSON.parse(decoded);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return (parsed as Record<string, string>[])
                    .filter((item) => item.title?.trim())
                    .sort((a, b) => Number(a.rank) - Number(b.rank))
                    .map((item) => ({
                        name: item.title.trim(),
                        url: item.cta1Url?.trim() || undefined,
                    }));
            }
        } catch {
            // fall through
        }
    }

    return extractBemmaeRankedProductNames(html).map((name) => ({ name }));
}

export function toAbsoluteUrl(siteOrigin: string, img?: string | null): string | undefined {
    if (!img?.trim()) return undefined;
    const t = img.trim();
    if (t.startsWith('http://') || t.startsWith('https://')) return t;
    const base = siteOrigin.replace(/\/+$/, '');
    if (t.startsWith('/')) return `${base}${t}`;
    return `${base}/${t}`;
}

export function toIsoDateTime(dateStr?: string | null): string | undefined {
    if (!dateStr?.trim()) return undefined;
    const d = dateStr.trim();
    if (d.includes('T')) return d;
    return `${d}T12:00:00.000Z`;
}

export function buildAuthorAbsoluteUrl(siteOrigin: string, authorId: string): string {
    const base = siteOrigin.replace(/\/+$/, '');
    const seg = authorId.split('/').map(encodeURIComponent).join('/');
    return `${base}/authors/${seg}`;
}

function siteRootOnly(siteUrl: string): string {
    return siteUrl.replace(/\/+$/, '');
}

function normalizeKeywords(kw: string | string[] | undefined): string | undefined {
    if (kw === undefined || kw === null) return undefined;
    const s = Array.isArray(kw) ? kw.map((x) => String(x).trim()).filter(Boolean).join(', ') : String(kw).trim();
    return s || undefined;
}

function stripToPlainText(html: string): string {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Extrai perguntas e respostas para FAQPage (JSON-LD).
 * HTML: só dentro da seção após &lt;h2&gt;Perguntas frequentes / FAQ (evita capturar títulos de produto).
 * Markdown: **Pergunta?** seguida de parágrafo de resposta.
 */
export function extractFAQ(content: string | null | undefined): Array<{ question: string; answer: string }> {
    if (!content?.trim()) return [];
    const raw = content.trim();

    const faqHeading = /<h2[^>]*>\s*(?:Perguntas\s+frequentes|FAQ)\b[^<]*<\/h2>/i;
    const hm = raw.match(faqHeading);
    let segment = '';
    if (hm && hm.index !== undefined) {
        const start = hm.index + hm[0].length;
        const rest = raw.slice(start);
        const nextH2 = rest.search(/<h2\b/i);
        segment = nextH2 === -1 ? rest : rest.slice(0, nextH2);
    }

    const items: Array<{ question: string; answer: string }> = [];
    if (segment) {
        const re = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
        let m;
        while ((m = re.exec(segment)) !== null) {
            const q = stripToPlainText(m[1]);
            let a = stripToPlainText(m[2]);
            if (!q || !a) continue;
            if (a.length > 2000) a = `${a.slice(0, 2000)}…`;
            items.push({ question: q, answer: a });
        }
    }
    if (items.length > 0) return items.slice(0, 8);

    const mdItems: Array<{ question: string; answer: string }> = [];
    const mdRe = /\*\*([^*]+\?)\*\*\s*\n([\s\S]+?)(?=\n\*\*[^*]+\?\*\*|$)/g;
    let mdMatch;
    while ((mdMatch = mdRe.exec(raw)) !== null) {
        const question = mdMatch[1].trim();
        let answer = mdMatch[2].trim().replace(/\n+/g, ' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
        if (answer.length > 2000) answer = `${answer.slice(0, 2000)}…`;
        if (question && answer) mdItems.push({ question, answer });
    }
    return mdItems.slice(0, 8);
}

/** IDs absolutos com fragmento (ex.: https://domínio/#website). */
function idFragment(siteRoot: string, fragment: string): string {
    return `${siteRoot}/#${fragment}`;
}

function idPage(pageUrl: string, fragment: string): string {
    const base = pageUrl.replace(/\/+$/, '');
    return `${base}#${fragment}`;
}

/** Template de busca interna: listagem do blog com ?q= */
export function buildBlogSearchUrlTemplate(siteUrl: string): string {
    const root = siteRootOnly(siteUrl);
    const blogPath = canonicalPathname('/blog');
    return `${root}${blogPath}?q={search_term_string}`;
}

/**
 * Graph mínimo (home, listagens): WebSite + Organization + SearchAction + inLanguage.
 */
export function buildBemmaeDefaultSiteJsonLd(opts: {
    siteUrl: string;
    siteName: string;
    description?: string;
}): Record<string, unknown> {
    const root = siteRootOnly(opts.siteUrl);
    const webSiteId = idFragment(root, 'website');
    const orgId = idFragment(root, 'organization');

    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': orgId,
                name: opts.siteName,
                url: schemaPageUrl(`${root}/`),
            },
            {
                '@type': 'WebSite',
                '@id': webSiteId,
                name: opts.siteName,
                url: schemaPageUrl(`${root}/`),
                description: opts.description || undefined,
                inLanguage: 'pt-BR',
                publisher: { '@id': orgId },
                potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                        '@type': 'EntryPoint',
                        urlTemplate: schemaPageUrl(buildBlogSearchUrlTemplate(opts.siteUrl)),
                    },
                    'query-input': 'required name=search_term_string',
                },
            },
        ],
    };
}

function buildAuthorPersonNode(opts: {
    name: string;
    authorPageUrl: string;
    imageUrl?: string;
    jobTitle?: string;
    description?: string;
    sameAs?: string[];
}): Record<string, unknown> {
    const base = opts.authorPageUrl.replace(/\/+$/, '');
    const node: Record<string, unknown> = {
        '@type': 'Person',
        '@id': `${base}#author`,
        name: opts.name,
        url: schemaPageUrl(`${base}/`),
    };
    if (opts.imageUrl) {
        node.image = {
            '@type': 'ImageObject',
            url: schemaPageUrl(opts.imageUrl),
        };
    }
    if (opts.jobTitle?.trim()) node.jobTitle = opts.jobTitle.trim();
    if (opts.description?.trim()) node.description = opts.description.trim();
    if (opts.sameAs?.length) node.sameAs = opts.sameAs.map((u) => u.trim()).filter(Boolean);
    return node;
}

export function buildPostJsonLd(opts: {
    seoSchema?: PostSeoSchema;
    /** Título do artigo (headline / caption) */
    headline: string;
    description: string;
    pageUrl: string;
    siteUrl: string;
    siteName: string;
    publishedDate?: string;
    imageUrl?: string;
    /** Largura/altura da imagem principal (OG); padrão 1200×630 */
    imageWidth?: number;
    imageHeight?: number;
    authorName?: string;
    authorUrl?: string;
    authorImageUrl?: string;
    authorJobTitle?: string;
    authorDescription?: string;
    authorSameAs?: string[];
    htmlContent?: string | null;
    /** Categoria do post: nome e path canônico (ex. /carrinhos-de-bebe/) */
    categoryName?: string;
    categoryPath?: string;
    /** Palavras-chave (texto separado por vírgulas ou vindo do frontmatter) */
    keywords?: string | string[];
    /** URLs absolutas de posts relacionados (WebPage relatedLink) */
    relatedPostUrls?: string[];
}): Record<string, unknown> | null {
    let mode: PostSeoSchema = opts.seoSchema || 'auto';
    const items = extractRankedProducts(opts.htmlContent);

    if (mode === 'auto') {
        mode = items.length >= 2 ? 'articleItemList' : 'blogPosting';
    }
    if (mode === 'none') return null;

    const root = siteRootOnly(opts.siteUrl);
    const webSiteId = idFragment(root, 'website');
    const orgId = idFragment(root, 'organization');
    const pageUrl = schemaPageUrl(opts.pageUrl.trim());
    const iso = toIsoDateTime(opts.publishedDate);
    const imgUrl = opts.imageUrl;
    const w = opts.imageWidth ?? DEFAULT_IMAGE_WIDTH;
    const h = opts.imageHeight ?? DEFAULT_IMAGE_HEIGHT;
    const caption = opts.headline;

    const authorPageUrl = opts.authorUrl ? opts.authorUrl.replace(/\/+$/, '') + '/' : undefined;
    const keywordsNorm = normalizeKeywords(opts.keywords);
    const authorNode =
        opts.authorName && authorPageUrl
            ? buildAuthorPersonNode({
                  name: opts.authorName,
                  authorPageUrl,
                  imageUrl: opts.authorImageUrl,
                  jobTitle: opts.authorJobTitle,
                  description: opts.authorDescription,
                  sameAs: opts.authorSameAs,
              })
            : null;

    const imageId = idPage(pageUrl, 'primaryimage');
    const webPageId = idPage(pageUrl, 'webpage');
    const articleId = idPage(pageUrl, mode === 'articleItemList' ? 'article' : 'blogposting');
    const breadcrumbId = idPage(pageUrl, 'breadcrumb');

    const imageObject: Record<string, unknown> = {
        '@type': 'ImageObject',
        '@id': imageId,
        url: imgUrl ? schemaPageUrl(imgUrl) : imgUrl,
        width: w,
        height: h,
        caption,
    };

    const blogPath = canonicalPathname('/blog');
    const blogIndexUrl = schemaPageUrl(`${root}${blogPath}`);

    const breadcrumbItems: Record<string, unknown>[] = [
        {
            '@type': 'ListItem',
            position: 1,
            name: 'Início',
            item: schemaPageUrl(`${root}/`),
        },
        {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: blogIndexUrl,
        },
    ];
    let pos = 3;
    if (opts.categoryName && opts.categoryPath) {
        const catUrl = schemaPageUrl(`${root}${canonicalPathname(opts.categoryPath)}`);
        breadcrumbItems.push({
            '@type': 'ListItem',
            position: pos++,
            name: opts.categoryName,
            item: catUrl,
        });
    }
    breadcrumbItems.push({
        '@type': 'ListItem',
        position: pos,
        name: opts.headline,
        item: pageUrl,
    });

    const faqItems = extractFAQ(opts.htmlContent);
    const faqPageNode: Record<string, unknown> | null =
        faqItems.length > 0
            ? {
                  '@type': 'FAQPage',
                  '@id': idPage(pageUrl, 'faqpage'),
                  mainEntity: faqItems.map((item) => ({
                      '@type': 'Question',
                      name: item.question,
                      acceptedAnswer: {
                          '@type': 'Answer',
                          text: item.answer,
                      },
                  })),
              }
            : null;

    const publisherRef = { '@id': orgId };
    const webSiteRef = { '@id': webSiteId };

    const webPage: Record<string, unknown> = {
        '@type': 'WebPage',
        '@id': webPageId,
        url: pageUrl,
        name: opts.headline,
        isPartOf: webSiteRef,
        inLanguage: 'pt-BR',
        ...(imgUrl ? { primaryImageOfPage: { '@id': imageId } } : {}),
        ...(opts.relatedPostUrls?.length
            ? { relatedLink: opts.relatedPostUrls.map((u) => schemaPageUrl(u)) }
            : {}),
    };

    const articleCommon: Record<string, unknown> = {
        headline: opts.headline,
        description: opts.description || undefined,
        url: pageUrl,
        inLanguage: 'pt-BR',
        datePublished: iso,
        dateModified: iso,
        author: authorNode ? { '@id': authorNode['@id'] as string } : undefined,
        publisher: publisherRef,
        isPartOf: webSiteRef,
        mainEntityOfPage: { '@id': webPageId },
        ...(keywordsNorm ? { keywords: keywordsNorm } : {}),
        ...(imgUrl ? { image: { '@id': imageId }, thumbnailUrl: schemaPageUrl(imgUrl) } : {}),
    };

    let mainEntity: Record<string, unknown>;

    if (mode === 'articleItemList' && items.length >= 2) {
        mainEntity = {
            '@type': 'Article',
            '@id': articleId,
            ...articleCommon,
        };
    } else {
        mainEntity = {
            '@type': 'BlogPosting',
            '@id': articleId,
            ...articleCommon,
        };
    }

    const itemListNode: Record<string, unknown> | null =
        mode === 'articleItemList' && items.length >= 2
            ? {
                  '@type': 'ItemList',
                  '@id': idPage(pageUrl, 'itemlist'),
                  name: opts.headline,
                  url: pageUrl,
                  numberOfItems: items.length,
                  itemListElement: items.map((item, i) => ({
                      '@type': 'ListItem',
                      position: i + 1,
                      name: item.name,
                      ...(item.url ? { url: schemaPageUrl(item.url) } : {}),
                  })),
              }
            : null;

    const graph: Record<string, unknown>[] = [
        mainEntity,
        ...(itemListNode ? [itemListNode] : []),
        webPage,
        {
            '@type': 'BreadcrumbList',
            '@id': breadcrumbId,
            itemListElement: breadcrumbItems,
        },
        ...(faqPageNode ? [faqPageNode] : []),
        ...(authorNode ? [authorNode] : []),
        ...(imgUrl ? [imageObject] : []),
        {
            '@type': 'Organization',
            '@id': orgId,
            name: opts.siteName,
            url: schemaPageUrl(`${root}/`),
        },
        {
            '@type': 'WebSite',
            '@id': webSiteId,
            name: opts.siteName,
            url: schemaPageUrl(`${root}/`),
            inLanguage: 'pt-BR',
            publisher: { '@id': orgId },
            potentialAction: {
                '@type': 'SearchAction',
                target: {
                    '@type': 'EntryPoint',
                    urlTemplate: schemaPageUrl(buildBlogSearchUrlTemplate(opts.siteUrl)),
                },
                'query-input': 'required name=search_term_string',
            },
        },
    ];

    return {
        '@context': 'https://schema.org',
        '@graph': graph,
    };
}
