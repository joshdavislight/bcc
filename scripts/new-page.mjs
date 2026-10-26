import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: npm run new:page <slug>');
  process.exit(1);
}

if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error('Slug must be lowercase letters, numbers, and hyphens only.');
  process.exit(1);
}

const today = new Date().toISOString().split('T')[0];
const dest = join(__dirname, '../src/content/pages', `${slug}.md`);

if (existsSync(dest)) {
  console.error(`Page already exists: ${dest}`);
  process.exit(1);
}

const template = readFileSync(join(__dirname, '../docs/templates/page.md'), 'utf8')
  .replace('page-slug', slug)
  .replace('YYYY-MM-DD', today);

writeFileSync(dest, template);
console.log(`Created ${dest}`);
console.log('Next: edit the file, set nav: true if it belongs in the nav, and run npm run check.');
