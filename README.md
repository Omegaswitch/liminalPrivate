# GMK Liminal (private)

The GMK Liminal kits page on its own: a copy of the site in `gmk-liminal` from the landing (logo, tagline, hero render) to
the footer, without the film, the camcorder boot-up, the "Transmission ended / Signal lost" screen or the live 3D walk.
The page opens straight on the kits page: reveal, colorway, kits (with prices), renders, vendors, footer.

## Develop

```
npm install
npm run dev      # vite dev server
npm run build    # production build to dist/
```

## Layout

- `index.html`: the top bar and the showcase mount. The build writes the kits page into it (`vite.config.js`), so it is
  there before any script runs
- `src/main.js`: renders the showcase, Lenis smooth scroll, in-page links, Back to top
- `src/showcase.js`: renders the showcase from `content/*.json`
- `src/lightbox.js` (`src/styles/lightbox.css`): click a render or kit picture to see it larger
- `src/parallax.js`: the renders drift inside their frames as the page scrolls (off under `prefers-reduced-motion` and on touch screens)
- `src/scramble.js`, `src/mirror.js`: the scrambled-letter and mirrored-hover text effects
- `privacy.html` (with `src/privacy.js`, `src/styles/privacy.css`): the privacy policy, linked from the footer
- `content/`: `set.json`, `kits.json` (kits and deskmats), `renders.json`, `vendors.json`. Renders are paths under `public/`
- `src/styles/`: `tokens.css`, `base.css`, `layout.css` (top bar), `showcase.css`
