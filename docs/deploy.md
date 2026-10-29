# Deploying the BCC website

The site is built as a static Astro site and deployed to GitHub Pages. This document covers the current preview host (`dev.bouldercircuscenter.net`) and the apex cutover.

## Current state

- **Repo:** `https://github.com/joshdavislight/bcc.git`
- **Branch:** `main`
- **Preview domain:** `dev.bouldercircuscenter.net` → `joshdavislight.github.io` (CNAME)
- **Production domain:** `bouldercircuscenter.net` (not yet cut over)

## How it works

1. Push to `main` triggers `.github/workflows/deploy.yml`.
2. The workflow installs Node `22.23.4`, runs `npm run check`, then `npm run build`.
3. `npm run build` runs `astro build` followed by `node scripts/postbuild.mjs`, which:
   - generates `dist/sitemap.xml` from the real pages,
   - generates meta-refresh redirect stubs for every entry in `redirects.json`.
4. The workflow uploads `dist/` to GitHub Pages and deploys it.

## First-time setup

1. In the repo's GitHub settings, enable **Pages → Source: GitHub Actions** (or run the API equivalent).
2. Add a DNS CNAME record at HostGator:
   ```
   dev CNAME joshdavislight.github.io.
   ```
3. Push `main`. GitHub Pages will provision a TLS cert for `dev.bouldercircuscenter.net` once the CNAME resolves.
4. Check "Enforce HTTPS" once the cert is active.

## Staging-only controls

The deploy workflow sets `PUBLIC_PREVIEW=true`, which makes every page emit `<meta name="robots" content="noindex">`. This keeps `dev` out of search indexes while the production domain still points at WordPress.

## At cutover

1. DNS:
   - Keep the `dev` CNAME (useful for previews).
   - Add four A records on the apex:
     ```
     @ A 185.199.108.153
     @ A 185.199.109.153
     @ A 185.199.110.153
     @ A 185.199.111.153
     ```
   - Ensure the `mail` A record still points to the HostGator mail server IP before changing the apex.
2. Repo:
   - Change `public/CNAME` from `dev.bouldercircuscenter.net` to `bouldercircuscenter.net`.
   - Remove the `PUBLIC_PREVIEW: 'true'` environment variable from `.github/workflows/deploy.yml` so pages become indexable.
3. Push `main`. GitHub Pages will claim the apex domain and issue a new cert.
4. Verify `https://bouldercircuscenter.net/` serves the new site, email still flows, and old URLs redirect.

## Troubleshooting

- **DNS check unsuccessful in GitHub settings:** the CNAME may not have propagated to GitHub's edge yet. Verify with `dig dev.bouldercircuscenter.net CNAME @ns8471.hostgator.com`.
- **HTTPS error before cert is ready:** GitHub Pages issues the cert after the domain resolves. Wait a few minutes, then check again.
- **Old URL returns 404:** check that `redirects.json` has the path and that `npm run build` wrote the stub to `dist/<old-path>/index.html`.
