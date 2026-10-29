# Agent instructions — Boulder Circus Center website

You are editing a static website built with Astro. Before making changes, read this file and `docs/editing.md`.

## Repository map

| Path | Purpose |
|---|---|
| `src/content/pages/*.md` | Content pages rendered by `[...slug].astro`. These are the safest files for you to edit. |
| `src/data/offerings.json` | Youth and adult class listings. Validate with `npm run check`. |
| `src/data/rooms.json` | Rental room specs and rates. Validate with `npm run check`. |
| `src/pages/*.astro` | Page components for Home, Youth, Adult, and Facilities. Edit structure carefully. |
| `src/layouts/Base.astro` | Shared page shell: head, nav, footer, JSON-LD. |
| `src/components/*.astro` | Reusable components. |
| `src/styles/*.css` | Design tokens and styles. Prefer editing tokens over one-off rules. |
| `redirects.json` | Old URL → new URL map for migration. |
| `scripts/postbuild.mjs` | Generates redirect stubs and `sitemap.xml` after `astro build`. |
| `.github/workflows/` | CI/CD — do not edit unless asked. |
| `docs/` | Human and agent documentation. |

## Rules

1. **Content pages go in `src/content/pages/*.md`.** Use frontmatter: `title`, `description`, `nav`, `order`, `updated`.
2. **Do not hand-edit `dist/`.** It is generated and will be overwritten.
3. **Do not hand-edit snapshots** — there are none yet, but this rule stands for future data pipelines.
4. **Run `npm run check` before committing.** This catches broken data, invalid frontmatter, and TypeScript errors.
5. **Images go in `public/images/`** and should be WebP or AVIF.
6. **Navigation is generated automatically.** To add a page to the nav, set `nav: true` and an `order` number in frontmatter.
7. **Prefer small, readable changes.** One page per commit is fine.

## Common tasks

### Add a page

```bash
npm run new:page about
```

Edit the created file. Set `nav: true` and an `order` if it belongs in the main navigation.

### Edit class or room data

Edit `src/data/offerings.json` or `src/data/rooms.json`, then run `npm run check`.

### Preview changes

```bash
npm run dev
```

Use background mode if the harness supports it.

### Build the site

```bash
npm run build
```

## Tech notes

- Astro 7, static output, trailing-slash URLs.
- Content collections use Zod schemas via `astro/zod`.
- Data files use Zod schemas in `src/data/schema.ts`.
- Requires Node.js **>=22.22.0**. Use `nvm use` to read `.nvmrc`.
- GitHub Pages cannot serve 301s; redirects are generated as meta-refresh stubs from `redirects.json`.

## If something breaks

1. Read the error from `npm run check` or `npm run build`.
2. Check that JSON files parse and match their Zod schemas.
3. Check that Markdown frontmatter has all required fields.
4. If a component change causes a failure, revert it and ask before redesigning components.
