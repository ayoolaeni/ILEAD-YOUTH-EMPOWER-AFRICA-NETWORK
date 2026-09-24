// Assembles the folder you upload to Whogohost:  deploy/public_html/
//   = React build (frontend/dist)  +  PHP API (backend/api)
// Run through:  cd frontend && npm run release
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'frontend', 'dist');
const API = path.join(ROOT, 'backend', 'api');
const OUT = path.join(ROOT, 'deploy', 'public_html');

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('frontend/dist not found. Run "npm run build" first (or "npm run release").');
  process.exit(1);
}

// Clear only what we regenerate (the folder itself may be open in File Explorer).
fs.rmSync(OUT, { recursive: true, force: true });
fs.rmSync(path.join(ROOT, 'deploy', 'ilead-site.zip'), { force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.cpSync(DIST, OUT, { recursive: true });

// Copy the API but never ship local data or local overrides.
fs.cpSync(API, path.join(OUT, 'api'), {
  recursive: true,
  filter: (src) => {
    const rel = path.relative(API, src).replace(/\\/g, '/');
    return !(rel === 'storage' || rel.startsWith('storage/') || rel === 'config.local.php');
  },
});

// Ship an empty, locked-down storage folder as the fallback location for messages.
const storage = path.join(OUT, 'api', 'storage');
fs.mkdirSync(storage, { recursive: true });
fs.writeFileSync(path.join(storage, '.htaccess'), 'Require all denied\n<IfModule !mod_authz_core.c>\nDeny from all\n</IfModule>\n');

const count = (dir) => fs.readdirSync(dir, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? count(path.join(dir, e.name)) : 1), 0);
const mb = (dir) => {
  let total = 0;
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
    const p = path.join(d, e.name);
    e.isDirectory() ? walk(p) : (total += fs.statSync(p).size);
  });
  walk(dir);
  return (total / 1024 / 1024).toFixed(1);
};
console.log(`Ready: deploy/public_html  (${count(OUT)} files, ${mb(OUT)} MB)`);

// One-file version for cPanel's File Manager (Upload, then Extract).
const AdmZip = createRequire(path.join(ROOT, 'frontend', 'package.json'))('adm-zip');
const zip = new AdmZip();
zip.addLocalFolder(OUT);
const zipPath = path.join(ROOT, 'deploy', 'ilead-site.zip');
zip.writeZip(zipPath);
const check = new AdmZip(zipPath).getEntries().length;
console.log(`Zip ready: deploy/ilead-site.zip  (${(fs.statSync(zipPath).size / 1024 / 1024).toFixed(1)} MB, ${check} entries)`);
console.log('Upload that zip to public_html on Whogohost, then Extract it.');
