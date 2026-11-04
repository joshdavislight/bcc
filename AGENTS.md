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
4. **Run `npm run check` before committing.** This catches broken data, invalid frontmatter, TypeScript errors, and AI-slop patterns in copy.
5. **Images go in `public/images/`** and should be WebP or AVIF.
6. **Navigation is generated automatically.** To add a page to the nav, set `nav: true` and an `order` number in frontmatter.
7. **Prefer small, readable changes.** One page per commit is fine.
8. **External links open in a new tab.** Anything that leaves the site (social media, FitDegree, iClassPro, Skedda, maps, PDFs on another host) gets `target="_blank" rel="noopener"`. Internal links never do. `mailto:` and `tel:` stay as they are. In Markdown, write the link as an HTML anchor so it can carry the attributes.

## Copy

The site speaks in the BCC's voice, not a marketing deck's. Two things enforce that.

**Use the `no-ai-slop` skill** (`~/.config/opencode/skills/no-ai-slop/`, MIT, from petergyang/no-ai-slop) when writing or editing prose. It has detect mode ("is this slop?") and edit mode, plus a self-check list. Load it before rewriting a page.

**House rules on top of the skill:**

- **No em dashes (—).** Zero. Rewrite the sentence with a period, comma, colon, or parentheses. The skill allows one or two in long prose; this site never needs them.
- **No puffery.** Cut *world-class*, *exciting*, *magic*, *seamless*, *elevate*, *unlock*, *fostering*, and the rest of the skill's banned list. Say the concrete thing instead: a rate, a dimension, a day, a name.
- **Voice:** warm, direct, second person, plain nouns. Someone is deciding whether to book a class, so tell them what happens and what it costs.
- **Headings and buttons are literal**, sentence case: "Book a room", "Rental policies". No metaphor headlines.
- **Keep old-site facts.** Dimensions, rig points, rates, policies, and allergy/insurance wording came from the WordPress site; clarify the grammar around them but do not change the facts.
- **Meta descriptions and JSON-LD count as copy.** They show up in search results.

`npm run check` runs `scripts/check-copy.mjs`, which fails on em dashes and the banned-word list across `src/**/*.{astro,md,json}`. Run `npm run check:copy` alone for a quick pass. `src/pages/youth.astro` holds verbatim WordPress copy at the client's request, so the checker skips it; do not rewrite that page's text, only formatting.


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
