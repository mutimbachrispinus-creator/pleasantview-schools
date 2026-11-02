import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', env: { ...process.env, BUILD_RUNNING: '1' } });
}

if (process.env.BUILD_RUNNING === '1') {
  run('npx next build');
  try {
    fs.rmSync('.next/cache', { recursive: true, force: true });
  } catch {}
  process.exit(0);
}

process.env.BUILD_RUNNING = '1';

console.log('🚀 Starting Cloudflare Pages Next.js 15 build...');

// 1. Next.js build
run('npx next build');

// 2. Remove webpack cache pack
try {
  fs.rmSync('.next/cache', { recursive: true, force: true });
} catch {}

// 3. OpenNext bundle
run('npx @opennextjs/cloudflare build');

// 4. Wrangler bundle into assets directory
run('npx wrangler deploy --dry-run --outdir .open-next/assets');

// 5. Rename worker.js -> _worker.js for Cloudflare Pages Advanced Mode
const workerPath = path.join('.open-next', 'assets', 'worker.js');
const targetPath = path.join('.open-next', 'assets', '_worker.js');

if (fs.existsSync(workerPath)) {
  fs.renameSync(workerPath, targetPath);
  console.log('✅ Created .open-next/assets/_worker.js (Cloudflare Pages Advanced Mode)');
}

// Clean up maps and extra files
try {
  fs.rmSync(path.join('.open-next', 'assets', 'README.md'), { force: true });
  fs.rmSync(path.join('.open-next', 'assets', 'worker.js.map'), { force: true });
} catch {}

console.log('✨ Build succeeded! Output directory: .open-next/assets');
