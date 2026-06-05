import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const tipTap = path.join(root, '../src/components/admin/AffiliateBlocksTipTap.tsx');
let neu = fs.readFileSync(path.join(root, '_roundup-render-snippet.txt'), 'utf8');
neu = neu.replace(/motion\.div/g, 'motion.div'); // keep marker
neu = neu.split('motion.div').join('div');

let s = fs.readFileSync(tipTap, 'utf8');
const start = s.indexOf('        const children = list.map((it) => {');
const end = s.indexOf('        ] as any;', start);
if (start < 0 || end < 0) throw new Error('block not found');
const endFull = end + '        ] as any;'.length;
s = s.slice(0, start) + neu + s.slice(endFull);
fs.writeFileSync(tipTap, s);
console.log('injected');
