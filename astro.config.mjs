// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import markdoc from '@astrojs/markdoc';

// https://astro.build/config
export default defineConfig({
    output: 'server',
    /**
     * `ignore` = `/rota` e `/rota/` resolvem no dev e no SSR sem 404 (evita depender só do redirect do middleware).
     * Em produção na Vercel, `vercel.json` com `trailingSlash: true` continua a enviar tudo para a URL com `/` no fim.
     * Sitemap e helpers em código seguem usando path com barra final como canônico.
     */
    trailingSlash: 'ignore',
    adapter: vercel(),
    /** CSS inline no HTML → menos pedidos bloqueantes no caminho crítico (Lighthouse / LCP). */
    build: {
        inlineStylesheets: 'always',
    },
    integrations: [
        react({
            // classic evita erro "jsxDEV is not a function" com client:only em dev
            jsxRuntime: 'classic',
        }),
        tailwind(), 
        markdoc({ allowHTML: true })
    ],
    // Reset Trigger: 2026-02-07 11:40
});
