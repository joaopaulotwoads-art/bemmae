import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const svg = readFileSync(join(root, 'public', 'favicon.svg'));

const sizes = [
  { size: 32,  out: 'favicon-32.png' },
  { size: 180, out: 'apple-touch-icon.png' },
  { size: 512, out: 'favicon-512.png' },
];

for (const { size, out } of sizes) {
  await sharp(svg).resize(size, size).png().toFile(join(root, 'public', out));
  console.log(`✓ ${out} (${size}x${size})`);
}
