import { defineConfig } from 'vite';
import { showcaseHTML } from './src/showcase.js';

const EMPTY = '<div class="showcase" id="showcase"></div>';

export default defineConfig({
  plugins: [{
    // the kits page is written into index.html at build time, so it is in the page before any script runs
    name: 'prerender-showcase',
    transformIndexHtml(html, ctx) {
      if (!ctx.filename.endsWith('index.html')) return html;
      if (!html.includes(EMPTY)) throw new Error('prerender-showcase: the empty #showcase mount is missing from index.html');
      return html.replace(EMPTY, `<div class="showcase" id="showcase">${showcaseHTML('/')}</div>`);
    },
  }],
  build: {
    target: 'es2022', chunkSizeWarningLimit: 700,
    rollupOptions: { input: { main: 'index.html', privacy: 'privacy.html' } },
  },
});
