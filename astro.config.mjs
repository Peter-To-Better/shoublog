import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://shouren-blog.lanya.dev',
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/draft/'),
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
