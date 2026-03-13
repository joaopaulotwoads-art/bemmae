import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
export default defineConfig({
  output: 'static',
  site: 'https://bem-m-e.vercel.app',
  integrations: [tailwind({ applyBaseStyles: false })],
  vite: {
    server: { fs: { allow: [root] } },
  },
});
