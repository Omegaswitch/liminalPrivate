# Graph Report - liminalprivate  (2026-11-02)

## Corpus Check
- 17 files · ~7,519 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .css 5, (none) 1, .ico 1)

## Summary
- 86 nodes · 119 edges · 9 communities (8 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8989c410`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- main.js
- showcase.js
- Product
- createLightbox
- scramble.js
- scripts
- GMK Liminal (private)
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `Product` - 11 edges
2. `createLightbox()` - 9 edges
3. `showcaseHTML()` - 6 edges
4. `mirrorize()` - 5 edges
5. `scripts` - 4 edges
6. `@fontsource/archivo-narrow` - 4 edges
7. `@fontsource/instrument-sans` - 4 edges
8. `show()` - 4 edges
9. `kit()` - 4 edges
10. `@fontsource/ibm-plex-mono` - 3 edges

## Surprising Connections (you probably didn't know these)
- `transformIndexHtml()` --calls--> `showcaseHTML()`  [EXTRACTED]
  vite.config.js → src/showcase.js
- `createLightbox()` --calls--> `mirrorize()`  [EXTRACTED]
  src/lightbox.js → src/mirror.js

## Import Cycles
- None detected.

## Communities (9 total, 1 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.13
Nodes (19): dependencies, @fontsource/archivo-narrow@^5.3.0, @fontsource/ibm-plex-mono@^5.3.0, @fontsource/instrument-sans@^5.3.0, gsap@^3.15.0, lenis@^1.3.26, description, devDependencies (+11 more)

### Community 1 - "main.js"
Cohesion: 0.16
Nodes (6): onScroll(), parallax, showcase, mirrorize(), createParallax(), LAYERS

### Community 2 - "showcase.js"
Cohesion: 0.23
Nodes (7): esc(), kit(), price(), renderShowcase(), showcaseHTML(), SWATCHES, transformIndexHtml()

### Community 3 - "Product"
Cohesion: 0.17
Nodes (11): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+3 more)

### Community 4 - "createLightbox"
Cohesion: 0.43
Nodes (5): createLightbox(), loadFull(), open(), show(), step()

### Community 5 - "scramble.js"
Cohesion: 0.50
Nodes (4): pick(), POOLS, scramble(), TURNS

### Community 6 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, preview

### Community 7 - "GMK Liminal (private)"
Cohesion: 0.50
Nodes (3): Develop, GMK Liminal (private), Layout

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createLightbox()` connect `createLightbox` to `main.js`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.13157894736842105 - nodes in this community are weakly interconnected._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `@fontsource/archivo-narrow` connect `package.json` to `main.js`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._