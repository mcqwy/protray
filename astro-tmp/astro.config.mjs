// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// hreflang 值与 astro.config / Seo.astro / sitemap 的 i18n.locales 三处必须完全一致
const LOCALES = {
  en: 'en',
  zh: 'zh-CN',
  es: 'es',
  th: 'th',
  vi: 'vi',
};
const DEFAULT_LOCALE = 'en';

// https://astro.build/config
export default defineConfig({
  site: 'https://mcqwy.github.io',
  base: '/protray',
  trailingSlash: 'always',
  build: { format: 'directory' },
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: LOCALES,
      },
      filter: (page) => !page.includes('/404'),
    }),
  ],
});