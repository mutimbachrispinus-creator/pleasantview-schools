import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function getEnv() {
  const env = { ...process.env, OPENNEXT_CLOUDFLARE_RUNNING: '1' };
  const [major] = process.versions.node.split('.').map(Number);
  if (major < 22) {
    const nvmDir = path.join(process.env.HOME || '', '.nvm/versions/node');
    if (fs.existsSync(nvmDir)) {
      const versions = fs.readdirSync(nvmDir)
        .filter(v => parseInt(v.replace(/^v/, ''), 10) >= 22)
        .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
      if (versions.length > 0) {
        const binDir = path.join(nvmDir, versions[0], 'bin');
        if (fs.existsSync(binDir)) {
          env.PATH = `${binDir}:${env.PATH || ''}`;
        }
      }
    }
  }
  return env;
}

function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', env: getEnv() });
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

// 5. Create _routes.json so Cloudflare Pages serves CSS and static assets natively
const routesJson = {
  version: 1,
  include: ["/*"],
  exclude: [
    "/_next/static/*",
    "/images/*",
    "/favicon.ico",
    "/icon.png",
    "/apple-touch-icon.png",
    "/manifest.json",
    "/sw.js",
    "/sitemap.xml",
    "/sitemap.xsl",
    "/robots.txt"
  ]
};
fs.writeFileSync(
  path.join('.open-next', 'assets', '_routes.json'),
  JSON.stringify(routesJson, null, 2)
);
console.log('✅ Created .open-next/assets/_routes.json (Bypasses worker for static assets)');

// 6. Ensure no conflicting index.html exists in assets so _worker.js handles the root path /
try {
  fs.rmSync(path.join('.open-next', 'assets', 'index.html'), { force: true });
} catch {}

console.log('✨ Build succeeded! Output directory .open-next/assets is ready with _worker.js and _routes.json.');
