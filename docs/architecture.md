# BCC website architecture

## Stack

- **Astro 7** with static output
- **TypeScript** for config and components
- **Zod** (via `astro/zod`) for content and data validation
- **GitHub Pages** for hosting
- **GitHub Actions** for CI/CD

**Node requirement:** >=22.22.0 (`.nvmrc` pins 22.23.4).

## Content flow

```
src/content/pages/*.md   →  [...slug].astro  →  HTML pages
src/data/offerings.json  →  youth.astro / adult.astro  →  class listing pages
src/data/rooms.json      →  facilities.astro  →  room cards
```

## Build pipeline

1. `astro check` validates TypeScript and content collection types.
2. `node scripts/validate-content.mjs` validates JSON data files.
3. `astro build` generates the static site in `dist/`.
4. `node scripts/postbuild.mjs` generates redirect stubs from `redirects.json` and writes `sitemap.xml`.
5. (Deploy) GitHub Pages serves `dist/` via the configured Pages source.

## Redirects

GitHub Pages cannot serve 301 redirects. During the build, redirect stubs are generated as `dist/<old-path>/index.html` with a meta-refresh and canonical link. The source of truth is `redirects.json`.

## SEO / LLM surface

- Each page has a unique title, description, canonical URL, and Open Graph tags.
- `LocalBusiness` JSON-LD on relevant pages.
- `ItemList` + `Course` structured data on class listing pages.
- `llms.txt` and `llms-full.txt` will be generated in a later phase.

## Design tokens

Provisional tokens live in `src/styles/tokens.css`. A dedicated design pass will refine colors, typography, and photography before content pages are considered final.
