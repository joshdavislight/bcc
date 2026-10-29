import { readFileSync, writeFileSync } from 'node:fs';
import { readdir, mkdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const dist = './dist';
const siteUrl = 'https://bouldercircuscenter.net';

function fail(message) {
  console.error(`❌ ${message}`);
  process.exitCode = 1;
}

function warn(message) {
  console.warn(`⚠️  ${message}`);
}

function ok(message) {
  console.log(`✅ ${message}`);
}

const redirects = JSON.parse(readFileSync('./redirects.json', 'utf8'));
if (!Array.isArray(redirects)) {
  fail('redirects.json must be an array');
  process.exit(1);
}

const validRedirects = redirects.filter((r) => {
  if (typeof r.from !== 'string' || !r.from.startsWith('/')) {
    fail(`redirects.json: invalid "from" path "${r.from}"`);
    return false;
  }
  if (typeof r.to !== 'string' || !r.to.startsWith('/')) {
    fail(`redirects.json: invalid "to" path "${r.to}"`);
    return false;
  }
  return true;
});

// Walk dist before adding stubs to collect real pages and avoid collisions.
const pageUrls = new Set();
const realPagePaths = new Set();
const ignoredDirs = new Set(['_astro', 'images']);

const entries = await readdir(dist, { recursive: true, withFileTypes: true });
for (const entry of entries) {
  if (!entry.isFile() || entry.name !== 'index.html') continue;
  const parts = entry.parentPath.split(/[\\/]/);
  if (parts.some((p) => ignoredDirs.has(p))) continue;
  const relDir = relative(dist, entry.parentPath).replace(/\\/g, '/');
  const urlPath = relDir === '' ? '/' : `/${relDir}/`;
  pageUrls.add(urlPath);
  realPagePaths.add(join(entry.parentPath, entry.name));
}

// Generate sitemap from real pages only.
const sitemapUrls = Array.from(pageUrls).sort();
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map(
    (u) => `  <url>\n    <loc>${siteUrl}${u}</loc>\n  </url>`,
  )
  .join('\n')}
</urlset>
`;
writeFileSync(join(dist, 'sitemap.xml'), sitemap, 'utf8');
ok(`sitemap.xml: ${sitemapUrls.length} URLs`);

// Validate redirect targets resolve to real pages (fragments allowed).
const targetBasePaths = new Set(
  Array.from(pageUrls).map((u) => u.replace(/\/$/, '')),
);
for (const r of validRedirects) {
  const base = r.to.split('#')[0].replace(/\/$/, '');
  if (base !== '' && !targetBasePaths.has(base)) {
    warn(`redirect target may not exist: ${r.from} → ${r.to}`);
  }
}

// Generate redirect stubs.
let skipped = 0;
let written = 0;
for (const r of validRedirects) {
  if (r.from === r.to) {
    skipped++;
    continue;
  }
  if (r.from === '/') {
    skipped++;
    continue;
  }
  const outDir = join(dist, r.from.replace(/^\//, ''));
  const outFile = join(outDir, 'index.html');
  if (realPagePaths.has(outFile)) {
    warn(`redirect collision with real page, skipped: ${r.from}`);
    skipped++;
    continue;
  }
  const targetUrl = new URL(r.to, siteUrl).toString();
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Moved — Boulder Circus Center</title>
  <meta name="robots" content="noindex" />
  <link rel="canonical" href="${targetUrl}" />
  <meta http-equiv="refresh" content="0; url=${targetUrl}" />
</head>
<body>
  <p>This page has moved to <a href="${targetUrl}">${targetUrl}</a>.</p>
</body>
</html>
`;
  await mkdir(outDir, { recursive: true });
  writeFileSync(outFile, html, 'utf8');
  written++;
}
ok(`redirect stubs: ${written} written, ${skipped} skipped`);

if (process.exitCode) {
  console.error('\nPost-build failed.');
  process.exit(process.exitCode);
}
