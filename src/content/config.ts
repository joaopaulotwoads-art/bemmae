import { defineCollection, z } from 'astro:content';
import { normalizeCanonicalUrl } from '../utils/read-site-settings';
// Force reload v2
import { glob } from 'astro/loaders';

const posts = defineCollection({
    loader: glob({
        pattern: '**/*.{md,mdoc}',
        base: './src/content/posts',
        generateId: ({ entry }) => entry.replace(/\.(md|mdoc)$/i, ''),
    }),
    schema: z.object({
        title: z.string(),
        slug: z.string(),
        author: z.string().optional(),
        publishedDate: z.string().optional(),
        category: z.string().optional(),
        thumbnail: z.string().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        metaImage: z.string().optional(),
        /** Palavras-chave SEO (texto ou lista), ex.: "carrinho, bebê, travel system". */
        keywords: z.union([z.string(), z.array(z.string())]).optional(),
        /** `html` = corpo guardado como HTML (ex.: import Ghost); render com set:html. */
        contentFormat: z.enum(['markdown', 'html']).optional(),
        /**
         * JSON-LD do post: auto = detecta cards Bem Mãe (ItemList) ou BlogPosting;
         * blogPosting = artigo informativo; articleItemList = ranking/review; none = desliga.
         */
        seoSchema: z.enum(['auto', 'blogPosting', 'articleItemList', 'none']).optional(),
        /** Layout editorial: reviewRoundup = artigo tipo ranking (fundo rosado, CTAs amarelos, blocos de review). */
        articleLayout: z.enum(['default', 'reviewRoundup']).optional(),
        /** Oculta a imagem hero dentro do artigo (mantém thumbnail para OG/cards externos). */
        hideThumbnail: z.boolean().optional(),
    }),
});

const authors = defineCollection({
    loader: glob({ pattern: '**/*.yaml', base: './src/content/authors' }),
    schema: z.object({
        name: z.string(),
        slug: z.string(),
        role: z.string(),
        avatar: z.string().optional(),
        /** Cargo para JSON-LD Person (E-E-A-T); se vazio, usa `role`. */
        jobTitle: z.string().optional(),
        /** URLs de redes ou perfis (JSON-LD sameAs). */
        sameAs: z.array(z.string()).optional(),
        /** Descrição longa só para schema; se vazio, usa `bio`. */
        seoDescription: z.string().optional(),
        bio: z.string(),
        // Campos de acesso ao painel admin
        email: z.string().optional(),
        adminRole: z.enum(['admin', 'editor', 'none']).optional(),
        adminPasswordHash: z.string().optional(),
    }),
});

const categories = defineCollection({
    loader: glob({ pattern: '**/*.yaml', base: './src/content/categories' }),
    schema: z.object({
        name: z.string(),
        slug: z.string(),
    }),
});


const siteThemes = defineCollection({
    loader: glob({ pattern: '**/*.yaml', base: './src/content/themes' }),
    schema: z.object({
        name: z.string(),
        slug: z.string(),
        primaryColor: z.string(),
        secondaryColor: z.string(),
        borderRadius: z.string(),
        layout: z.enum(['classic', 'bento', 'stellar', 'blog-adsense']).default('classic'),
        screenshot: z.string().optional(),
    }),
});

const siteSettings = defineCollection({
    loader: glob({
        pattern: 'settings.yaml',
        base: './src/content/singletons',
        generateId: ({ entry }) => entry.replace(/\.yaml$/, ''), // id = 'settings'
    }),
    schema: z.object({
        siteName: z.string(),
        /** Tema visual do site público (pastas em src/themes/ e singletons). */
        activeTheme: z.string().default('bemmae'),
        colorScheme: z.enum(['dark', 'light']).default('dark'),
        siteMode: z.enum(['blog', 'local']).default('blog'),
        aiProvider: z.enum(['openai', 'gemini']).default('gemini').optional(),
        aiApiKey: z.string().optional(),
        // Pexels API — imagens em posts gerados por IA (1 a cada ~400 palavras, máx 5)
        pexelsApiKey: z.string().optional(),
        // SEO Técnico — sempre apex https:// sem www (igual Vercel)
        canonicalUrl: z
            .string()
            .optional()
            .transform((val) => {
                if (val == null || String(val).trim() === '') return undefined;
                return normalizeCanonicalUrl(String(val)) || undefined;
            }),
        generateSitemap: z.boolean().default(true),
        generateRobots: z.boolean().default(true),
        robotsDisallow: z.array(z.string()).optional(),
        // Estrutura de permalink dos posts
        blogPermalinkStructure: z.enum(['postname', 'year_month', 'year_month_day']).default('postname'),
        blogUrlPrefix: z.enum(['blog', 'root']).default('blog'), // 'root' = sem /blog na URL
        // Contato centralizado — usado em Header, Footer, páginas locais, schema JSON-LD
        companyPhone: z.string().optional(),
        companyWhatsapp: z.string().optional(),
        // Atualizações automáticas do template (workflow .github)
        autoUpdateEnabled: z.boolean().optional(),
    }),
});

export const collections = { posts, authors, categories, siteThemes, siteSettings };
