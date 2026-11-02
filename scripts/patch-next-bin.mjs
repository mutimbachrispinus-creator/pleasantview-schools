import fs from 'fs';
import path from 'path';

// Patch node_modules/.bin/next so that if Cloudflare Pages executes `npx next build`,
// it automatically triggers OpenNext bundling to produce `.open-next/assets/_worker.js`.

const binNextPath = path.resolve('node_modules/.bin/next');
const realNextPath = path.resolve('node_modules/next/dist/bin/next');

if (fs.existsSync(binNextPath) && fs.existsSync(realNextPath)) {
  const wrapperContent = `#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const isBuild = args.includes('build');
const realNext = path.resolve(__dirname, '../next/dist/bin/next');

// If this is not a build, or if we are already inside the OpenNext bundling step,
// pass through directly to the real Next.js binary.
if (!isBuild || process.env.OPENNEXT_CLOUDFLARE_RUNNING === '1') {
  const res = spawnSync(process.execPath, [realNext, ...args], {
    stdio: 'inherit',
    env: process.env
  });
  process.exit(res.status ?? 0);
}

console.log('\\n🚀 [Cloudflare Auto-Hook] Step 1: Compiling Next.js application...');
process.env.OPENNEXT_CLOUDFLARE_RUNNING = '1';

const buildRes = spawnSync(process.execPath, [realNext, ...args], {
  stdio: 'inherit',
  env: process.env
});

if (buildRes.status !== 0) {
  process.exit(buildRes.status ?? 1);
}

console.log('\\n📦 [Cloudflare Auto-Hook] Step 2: Next.js compiled successfully. Bundling for Cloudflare Pages Advanced Mode...');
const scriptPath = path.resolve(process.cwd(), 'scripts/build-cloudflare.mjs');

const cfRes = spawnSync(process.execPath, [scriptPath, '--post-next'], {
  stdio: 'inherit',
  env: process.env
});

process.exit(cfRes.status ?? 0);
`;

  try {
    fs.unlinkSync(binNextPath);
  } catch {}
  fs.writeFileSync(binNextPath, wrapperContent, { mode: 0o755 });
  console.log('✅ Successfully installed Next.js build hook in node_modules/.bin/next');
} else {
  console.log('ℹ️ node_modules/.bin/next not found, skipping patch.');
}
