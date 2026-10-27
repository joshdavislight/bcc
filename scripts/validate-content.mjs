import { readFileSync } from 'node:fs';
import { z } from 'zod';

const OfferingSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  audience: z.enum(['youth', 'adult']),
  ages: z.string().min(1),
  description: z.string().min(1),
  schedule: z.string().min(1),
  price: z.string().min(1),
  instructor: z.string().optional(),
  portalUrl: z.string().url(),
  active: z.boolean().default(true),
});

const RoomSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  dimensions: z.string().min(1),
  ceiling: z.string().min(1),
  floor: z.string().min(1),
  features: z.array(z.string()),
  rate: z.string().min(1),
  photos: z.array(z.string().url()).optional(),
  image: z.string().optional(),
});

function fail(message) {
  console.error(`❌ ${message}`);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`✅ ${message}`);
}

const offerings = JSON.parse(readFileSync('./src/data/offerings.json', 'utf8'));
const offeringIds = new Set();
for (const [index, o] of offerings.entries()) {
  const result = OfferingSchema.safeParse(o);
  if (!result.success) {
    fail(`offerings.json[${index}]: ${result.error.message}`);
  } else {
    if (offeringIds.has(o.id)) fail(`offerings.json: duplicate id "${o.id}"`);
    offeringIds.add(o.id);
  }
}
ok(`offerings.json: ${offerings.length} valid offerings`);

const rooms = JSON.parse(readFileSync('./src/data/rooms.json', 'utf8'));
const roomIds = new Set();
for (const [index, r] of rooms.entries()) {
  const result = RoomSchema.safeParse(r);
  if (!result.success) {
    fail(`rooms.json[${index}]: ${result.error.message}`);
  } else {
    if (roomIds.has(r.id)) fail(`rooms.json: duplicate id "${r.id}"`);
    roomIds.add(r.id);
  }
}
ok(`rooms.json: ${rooms.length} valid rooms`);

const redirects = JSON.parse(readFileSync('./redirects.json', 'utf8'));
if (!Array.isArray(redirects)) {
  fail('redirects.json must be an array');
} else {
  const froms = new Set();
  for (const [index, r] of redirects.entries()) {
    if (typeof r.from !== 'string' || !r.from.startsWith('/')) {
      fail(`redirects.json[${index}]: invalid "from" path`);
    }
    if (typeof r.to !== 'string' || !r.to.startsWith('/')) {
      fail(`redirects.json[${index}]: invalid "to" path`);
    }
    if (froms.has(r.from)) fail(`redirects.json: duplicate "from" path "${r.from}"`);
    froms.add(r.from);
  }
  ok(`redirects.json: ${redirects.length} valid redirects`);
}

if (process.exitCode) {
  console.error('\nValidation failed.');
} else {
  console.log('\nAll content validated.');
}
