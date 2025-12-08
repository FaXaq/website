import { paraglideVitePlugin } from '@inlang/paraglide-js';
import mdx from '@mdx-js/rollup';
import rehypeApplyCodeMeta from '@repo/rehype-apply-code-meta';
import remarkExtractCodeMeta from '@repo/remark-extract-code-meta';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import path from "path";
import remarkFrontmatter from 'remark-frontmatter';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [// Enables Vite to resolve imports using path aliases.
    tsconfigPaths(),
    tanstackStart({
      srcDirectory: 'src',
      router: {
        routesDirectory: 'routes',
      },
    }),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/paraglide',
      outputStructure: "message-modules",
      cookieName: "PARAGLIDE_LOCALE",
      strategy: ["url", "cookie", "preferredLanguage", "baseLocale"],
      urlPatterns: [
        {
          pattern: "/:path(.*)?",
          localized: [
            ['en' as unknown as Locale, '/en/:path(.*)?'],
            ['fr' as unknown as Locale, '/fr/:path(.*)?'],
          ],
        },
      ],
    }),
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkExtractCodeMeta],
      rehypePlugins: [rehypeApplyCodeMeta]
    }),
    viteReact(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
    },
  },
});