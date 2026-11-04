import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

// Guardrail for site copy. Rules live in docs: the no-ai-slop skill plus the
// "Copy" section of AGENTS.md. Keeps the patterns from creeping back in.
const BANNED = [
  [/\bdelve\b/i, 'cut it'],
  [/\bleverage\b/i, 'use "use"'],
  [/\bseamlessly\b/i, 'say how it works'],
  [/\belevate\b/i, 'say what it does'],
  [/\bunlock\b/i, 'say what it does'],
  [/\bempower\b/i, 'say what it does'],
  [/\bfostering\b/i, 'use "keeping" or name the action'],
  [/\btapestry\b/i, 'cut it'],
  [/\brobust\b/i, 'say what it handles'],
  [/\bworld-class\b/i, 'name the credential'],
  [/\btestament to\b/i, 'state the fact'],
  [/\bpivotal\b/i, 'state the fact'],
  [/\bgame.?changer\b/i, 'say the change'],
  [/\bcutting-edge\b/i, 'say what is new'],
  [/\bever-evolving\b/i, 'cut it'],
];

// The youth page is being rewritten separately; drop this once it is.
const SKIP = new Set(['src/pages/youth.astro']);

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.(astro|md|json)$/.test(extname(path)) ? [path] : [];
  });
}

const problems = [];
let scanned = 0;

for (const path of walk('src')) {
  const rel = relative(process.cwd(), path).replaceAll('\\', '/');
  if (SKIP.has(rel)) continue;
  scanned += 1;

  const lines = readFileSync(path, 'utf8').split('\n');
  lines.forEach((line, index) => {
    const where = `${rel}:${index + 1}`;
    if (line.includes('\u2014')) {
      problems.push(`${where}  em dash (—)  rewrite with a period, comma, colon, or parentheses`);
    }
    for (const [pattern, hint] of BANNED) {
      const match = line.match(pattern);
      if (match) problems.push(`${where}  "${match[0]}"  ${hint}`);
    }
  });
}

if (problems.length > 0) {
  console.error(`❌ copy: ${problems.length} issue${problems.length === 1 ? '' : 's'}`);
  for (const problem of problems) console.error(`   ${problem}`);
  console.error('   Rules: no-ai-slop skill + "Copy" section of AGENTS.md');
  process.exitCode = 1;
} else {
  console.log(`✅ copy: no AI-slop patterns in ${scanned} files`);
}
