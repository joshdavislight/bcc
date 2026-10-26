# Editing the BCC website

The site is built with [Astro](https://astro.build/) as a static site. Content lives in plain files; there is no CMS.

## Quick recipes

### Add a new page

```bash
npm run new:page about
```

Then edit `src/content/pages/about.md`. Set `nav: true` and `order` if it belongs in the navigation.

### Change class or room information

Edit `src/data/offerings.json` or `src/data/rooms.json`. Run `npm run check` to catch mistakes.

### Change a page's title, description, or navigation

Edit the frontmatter at the top of the Markdown file in `src/content/pages/`.

### Take a page down temporarily

Add `noindex: true` to the frontmatter and remove `nav: true`.

### Preview locally

```bash
npm run dev
```

Open the URL printed in the terminal.

### Build the site

```bash
npm run build
```

This creates a `dist/` folder with the static site.

### Before committing

```bash
npm run check
```

This runs Astro's type checker and validates the data files.

## Where things live

| Path | Purpose |
|---|---|
| `src/content/pages/*.md` | Content pages (Contact, Waiver, FAQ, etc.) |
| `src/data/offerings.json` | Youth and adult class listings |
| `src/data/rooms.json` | Rental room specs and rates |
| `src/pages/*.astro` | Page layouts for Home, Youth, Adult, Facilities |
| `src/layouts/Base.astro` | Shared page shell (nav, footer, SEO) |
| `src/components/*.astro` | Reusable pieces (Nav, Footer, etc.) |
| `src/styles/*.css` | Design tokens and styles |
| `redirects.json` | Old URL → new URL map |
| `.github/workflows/` | Build and deploy automation |

## Rules

1. **Never hand-edit files in `dist/`** — it is generated and will be overwritten.
2. **Run `npm run check` before opening a PR.**
3. **Images go in `public/images/`** and should be WebP or AVIF when possible.
4. **Keep the nav simple.** The navigation is generated from `nav: true` frontmatter plus the Youth/Adult/Facilities pages.
