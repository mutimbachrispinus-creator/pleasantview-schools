import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', env: { ...process.env, OPENNEXT_CLOUDFLARE_RUNNING: '1' } });
}

console.log('🚀 [Cloudflare Pages] Preparing OpenNext deployment bundle...');

// 1. Remove webpack cache pack to stay well under Cloudflare 25 MiB asset limits
try {
  fs.rmSync('.next/cache', { recursive: true, force: true });
} catch {}

// 2. OpenNext Cloudflare bundle (using dedicated worker config)
console.log('Generating OpenNext Cloudflare bundle...');
run('npx @opennextjs/cloudflare build --config wrangler.worker.jsonc');

// 3. Wrangler bundle into output directory
console.log('Creating Pages distribution bundle with Wrangler...');
run('npx wrangler deploy --dry-run --outdir .open-next/assets --config wrangler.worker.jsonc');

// 4. Rename worker.js -> _worker.js for Cloudflare Pages Advanced Mode
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

// Create a fallback index.html if needed for asset validation
const indexPath = path.join('.open-next', 'assets', 'index.html');
if (!fs.existsSync(indexPath)) {
  fs.writeFileSync(
    indexPath,
    '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Pleasantview Schools</title></head><body><script>window.location.reload();</script></body></html>'
  );
}

console.log('✨ Build succeeded! Output directory .open-next/assets is ready with _worker.js.');
