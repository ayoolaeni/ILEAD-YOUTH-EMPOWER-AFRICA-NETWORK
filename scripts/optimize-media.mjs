// Builds web-ready media from the original photos/videos.
//   node scripts/optimize-media.mjs              (everything; or: cd frontend && npm run media)
//   node scripts/optimize-media.mjs team-esther  (only images whose name starts with this)
// Output: frontend/public/media/** and frontend/src/data/media.generated.json
//
// To add a photo: drop it in a source folder, add a line to IMAGES below, re-run.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(path.resolve('frontend/package.json'));
const sharp = require('sharp');
const ffmpeg = require('ffmpeg-static');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const UPDATE = path.join(ROOT, 'update');
const LEGACY = path.join(ROOT, 'legacy-site', 'images');
const OUT = path.join(ROOT, 'frontend', 'public', 'media');
const WA = 'WhatsApp Image 2026-09-23 at ';

// name -> [source file, widths to generate, optional crop {left, top, width, height} in source pixels]
const IMAGES = {
  // Leadership portraits
  'team-okolo': [path.join(UPDATE, 'WhatsApp Image 2026-08-31 at 17.04.06.jpeg'), [480, 900]],
  'team-esther': [path.join(LEGACY, 'akinwande-esther.jpg'), [480, 900], { left: 300, top: 170, width: 540, height: 700 }],
  'team-glory': [path.join(UPDATE, 'Glory Kayode.jpeg'), [480, 900]],
  'team-david': [path.join(LEGACY, 'david-anyebe.jpg'), [480, 900]],
  'team-michael': [path.join(UPDATE, 'Michael Victor Idoko.jpeg'), [480, 900]],
  'team-aro': [path.join(UPDATE, 'Aro Joshua.jpeg'), [480, 900]],

  // #MakeItEasy school outreach (2026)
  'mie-01': [path.join(UPDATE, WA + '10.08.10 (1).jpeg'), [480, 810]],
  'mie-02': [path.join(UPDATE, WA + '10.08.10.jpeg'), [480, 810]],
  'mie-03': [path.join(UPDATE, WA + '10.08.11 (1).jpeg'), [480, 810, 1080]],
  'mie-04': [path.join(UPDATE, WA + '10.08.11 (2).jpeg'), [480, 810]],
  'mie-05': [path.join(UPDATE, WA + '10.08.11 (4).jpeg'), [480, 810]],
  'mie-06': [path.join(UPDATE, WA + '10.08.11 (5).jpeg'), [480, 810]],
  'mie-07': [path.join(UPDATE, WA + '10.08.11.jpeg'), [480, 810, 1080]],
  'mie-08': [path.join(UPDATE, WA + '10.08.12 (1).jpeg'), [480, 810]],
  'mie-09': [path.join(UPDATE, WA + '10.08.12 (2).jpeg'), [480, 810]],
  'mie-10': [path.join(UPDATE, WA + '10.08.12 (3).jpeg'), [480, 810]],
  'mie-11': [path.join(UPDATE, WA + '10.08.12 (4).jpeg'), [480, 810]],
  'mie-12': [path.join(UPDATE, WA + '10.08.13 (1).jpeg'), [480, 810, 1080]],
  'mie-13': [path.join(UPDATE, WA + '10.08.13.jpeg'), [480, 810]],

  // Earlier outreaches
  'earlier-01': [path.join(LEGACY, 'projectpic1.jpg'), [480, 960, 1280]],
  'earlier-02': [path.join(LEGACY, 'projectpic10.jpg'), [480, 960, 1280]],
  'earlier-03': [path.join(LEGACY, 'projectpic2.jpg'), [480, 960]],
  'earlier-04': [path.join(LEGACY, 'projectpic3.jpg'), [480, 720]],
  'earlier-05': [path.join(LEGACY, 'projectpic4.jpg'), [480, 720]],
  'earlier-06': [path.join(LEGACY, 'projectpic5.jpg'), [480, 720]],
  'earlier-07': [path.join(LEGACY, 'projectpic6.jpg'), [480, 720]],
  'earlier-08': [path.join(LEGACY, 'projectpic7.jpg'), [480, 720]],
  'earlier-09': [path.join(LEGACY, 'projectpic8.jpg'), [480, 720]],
  'earlier-10': [path.join(LEGACY, 'projectpic9.jpg'), [480, 720]],

  // Section imagery
  'about-classroom': [path.join(LEGACY, 'student-in-school.jpeg'), [640, 1280, 1920]],
  'health': [path.join(LEGACY, 'health1.jpeg'), [640, 1080]],
  'specific': [path.join(LEGACY, 'specificpic.jpg'), [720]],
};

// name -> [source file, second of the video to use as the poster image]
const VIDEOS = {
  'video-01': [path.join(ROOT, 'legacy-site', 'videos', 'project3-video.mp4'), 16],
  'video-02': [path.join(ROOT, 'legacy-site', 'videos', 'project4-video.mp4'), 4],
  'video-03': [path.join(UPDATE, 'WhatsApp Video 2026-09-23 at 10.08.27.mp4'), 1],
  'video-04': [path.join(UPDATE, 'WhatsApp Video 2026-09-23 at 10.08.53.mp4'), 1],
};

const ONLY = process.argv[2];
const MANIFEST = path.join(ROOT, 'frontend', 'src', 'data', 'media.generated.json');
const mkdir = (p) => fs.mkdirSync(p, { recursive: true });
const kb = (f) => Math.round(fs.statSync(f).size / 1024);

async function images() {
  const dir = path.join(OUT, 'img');
  mkdir(dir);
  const manifest = {};
  const existing = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : { images: {}, videos: {} };
  for (const [name, [src, widths, crop]] of Object.entries(IMAGES)) {
    if (ONLY && !name.startsWith(ONLY)) { if (existing.images[name]) manifest[name] = existing.images[name]; continue; }
    if (!fs.existsSync(src)) { console.warn('MISSING', src); continue; }
    const base = () => {
      const img = sharp(src).rotate();
      return crop ? img.extract(crop) : img;
    };
    const meta = crop ? { autoOrient: crop } : await sharp(src).rotate().metadata();
    const srcW = meta.autoOrient?.width ?? meta.width;
    const srcH = meta.autoOrient?.height ?? meta.height;
    const done = [];
    for (const w of widths) {
      const width = Math.min(w, srcW);
      if (done.includes(width)) continue;
      await base().resize({ width, withoutEnlargement: true })
        .webp({ quality: 76 }).toFile(path.join(dir, `${name}-${width}.webp`));
      done.push(width);
    }
    manifest[name] = { w: srcW, h: srcH, widths: done };
    console.log('img', name, done.join('/'));
  }
  return manifest;
}

async function brand() {
  const logo = path.join(LEGACY, 'logo.jpg');
  mkdir(OUT);
  // Wide gap => white bg trims cleanly for the round logo
  await sharp(logo).resize(320).webp({ quality: 90 }).toFile(path.join(OUT, 'logo.webp'));
  await sharp(logo).resize(640).png().toFile(path.join(OUT, 'logo-640.png'));
  const pub = path.join(ROOT, 'frontend', 'public');
  for (const [file, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
    await sharp(logo).resize(size, size, { fit: 'contain', background: '#ffffff' }).png().toFile(path.join(pub, file));
  }
  await sharp(path.join(UPDATE, WA + '10.08.11.jpeg')).resize(1200, 630, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 82 }).toFile(path.join(pub, 'og-image.jpg'));
  console.log('brand assets done');
}

function videos() {
  const dir = path.join(OUT, 'video');
  mkdir(dir);
  const manifest = {};
  for (const [name, [src, posterAt]] of Object.entries(VIDEOS)) {
    if (!fs.existsSync(src)) { console.warn('MISSING', src); continue; }
    const mp4 = path.join(dir, `${name}.mp4`);
    const poster = path.join(dir, `${name}-poster.jpg`);
    execFileSync(ffmpeg, ['-y', '-loglevel', 'error', '-i', src,
      '-vf', "scale='if(gt(iw,ih),-2,min(720,iw))':'if(gt(iw,ih),min(720,ih),-2)'",
      '-c:v', 'libx264', '-crf', '29', '-preset', 'veryfast', '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', mp4]);
    execFileSync(ffmpeg, ['-y', '-loglevel', 'error', '-ss', String(posterAt), '-i', src, '-frames:v', '1', '-q:v', '4', poster]);
    manifest[name] = true;
    console.log('video', name, `${kb(src)}KB -> ${kb(mp4)}KB`);
  }
  return manifest;
}

const imgManifest = await images();
let vidManifest = {};
if (ONLY) {
  vidManifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')).videos : {};
} else {
  await brand();
  vidManifest = videos();
}
const outJson = MANIFEST;
mkdir(path.dirname(outJson));
fs.writeFileSync(outJson, JSON.stringify({ images: imgManifest, videos: vidManifest }, null, 1));
console.log('wrote', path.relative(ROOT, outJson));
