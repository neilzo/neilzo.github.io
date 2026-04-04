import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import remarkFootnoteTooltip from './src/plugins/remark-footnote-tooltip.mjs';

export default defineConfig({
  site: 'https://neildaftary.com',
  output: 'static',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [remarkFootnoteTooltip],
  },
});
