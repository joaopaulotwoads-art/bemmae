import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/components/admin/AffiliateBlocksTipTap.tsx');
let s = fs.readFileSync(file, 'utf8');

const old = `        const children = list.map((it) => {
            const feats = it.features.filter((f) => f.trim()).map((f) => ['li', {}, f]);
            const ctas: any[] = [];
            if (it.cta1 && it.cta1Url) {
                ctas.push(['a', { class: 'cnx-aff-roundup-cta-primary', href: it.cta1Url, target: '_blank', rel: 'nofollow sponsored noopener noreferrer' }, it.cta1]);
            }
            if (it.cta2 && it.cta2Url) {
                ctas.push(['a', { class: 'cnx-aff-roundup-cta-secondary', href: it.cta2Url, target: '_blank', rel: 'nofollow sponsored noopener noreferrer' }, it.cta2]);
            }
            const imgCell = it.image
                ? ['motion.div', { class: 'cnx-aff-roundup-img-cell' }, ['img', { src: it.image, alt: '', class: 'cnx-aff-roundup-img' }]]
                : ['div', { class: 'cnx-aff-roundup-img-cell cnx-aff-roundup-img-cell--empty', 'aria-hidden': 'true' }];
            return [
                'div',
                { class: 'cnx-aff-roundup-item' },
                ['div', { class: 'cnx-aff-roundup-rank' }, it.rank],
                imgCell,
                [
                    'div',
                    { class: 'cnx-aff-roundup-product-col' },
                    ...(it.itemBadge ? [['div', { class: 'cnx-aff-roundup-item-badge' }, it.itemBadge]] : []),
                    ['h3', { class: 'cnx-aff-roundup-item-title' }, it.title],
                    ...(it.score ? [['div', { class: 'cnx-aff-roundup-item-score' }, \`Nota \${it.score}\`]] : []),
                ],
                ['div', { class: 'cnx-aff-roundup-features-col' }, ...(feats.length ? [['ul', {}, ...feats]] : [])],
                ['div', { class: 'cnx-aff-roundup-cta-col' }, ['div', { class: 'cnx-aff-roundup-ctas' }, ...ctas]],
            ];
        });
        return [
            'div',
            mergeAttributes(
                {},
                {
                    class: 'cnx-aff-roundup cnx-aff-block-wrap',
                    'data-cnx-roundup': JSON.stringify(list),
                },
            ),
            headRow,
            ...children,
        ] as any;`;

const neu = `        const rel = 'nofollow sponsored noopener noreferrer';
        const buildCtas = (it: RoundupItem) => {
            const ctas: any[] = [];
            if (it.cta1 && it.cta1Url) {
                ctas.push(['a', { class: 'cnx-aff-roundup-cta-primary', href: it.cta1Url, target: '_blank', rel }, it.cta1]);
            }
            if (it.cta2 && it.cta2Url) {
                ctas.push(['a', { class: 'cnx-aff-roundup-cta-secondary', href: it.cta2Url, target: '_blank', rel }, it.cta2]);
            }
            return ['div', { class: 'cnx-aff-roundup-ctas' }, ...ctas];
        };
        const imgCellFor = (it: RoundupItem) =>
            it.image
                ? ['div', { class: 'cnx-aff-roundup-img-cell' }, ['img', { src: it.image, alt: it.title, class: 'cnx-aff-roundup-img', loading: 'lazy', decoding: 'async' }]]
                : ['div', { class: 'cnx-aff-roundup-img-cell cnx-aff-roundup-img-cell--empty', 'aria-hidden': 'true' }];

        const children = list.map((it) => {
            if (layoutCards) {
                const productInner: any[] = [
                    ...(it.itemBadge ? [['div', { class: 'cnx-aff-roundup-item-badge' }, it.itemBadge]] : []),
                    ['h3', { class: 'cnx-aff-roundup-item-title' }, it.title],
                ];
                if (it.highlight?.trim()) {
                    productInner.push([
                        'p',
                        { class: 'cnx-aff-roundup-highlight' },
                        ['span', { class: 'cnx-aff-roundup-highlight-label' }, 'Destaque:'],
                        \` \${it.highlight.trim()}\`,
                    ]);
                }
                return [
                    'div',
                    { class: 'cnx-aff-roundup-item' },
                    ['div', { class: 'cnx-aff-roundup-rank' }, it.rank],
                    ...(it.score
                        ? [
                              [
                                  'motion.div',
                                  { class: 'cnx-aff-roundup-score-badge', 'aria-label': \`Nota \${it.score} de 10\` },
                                  ['span', { class: 'cnx-aff-roundup-score-star', 'aria-hidden': 'true' }, '★'],
                                  ['span', { class: 'cnx-aff-roundup-score-value' }, it.score],
                                  ['span', { class: 'cnx-aff-roundup-score-suffix' }, '/10'],
                              ],
                          ]
                        : []),
                    [
                        'div',
                        { class: 'cnx-aff-roundup-card-body' },
                        imgCellFor(it),
                        ['div', { class: 'cnx-aff-roundup-product-col' }, ...productInner],
                        ['div', { class: 'cnx-aff-roundup-card-divider', 'aria-hidden': 'true' }],
                        ['div', { class: 'cnx-aff-roundup-cta-col' }, buildCtas(it)],
                    ],
                ];
            }
            const feats = it.features.filter((f) => f.trim()).map((f) => ['li', {}, f]);
            return [
                'div',
                { class: 'cnx-aff-roundup-item' },
                ['div', { class: 'cnx-aff-roundup-rank' }, it.rank],
                imgCellFor(it),
                [
                    'div',
                    { class: 'cnx-aff-roundup-product-col' },
                    ...(it.itemBadge ? [['div', { class: 'cnx-aff-roundup-item-badge' }, it.itemBadge]] : []),
                    ['h3', { class: 'cnx-aff-roundup-item-title' }, it.title],
                    ...(it.score ? [['div', { class: 'cnx-aff-roundup-item-score' }, \`Nota \${it.score}\`]] : []),
                ],
                ['div', { class: 'cnx-aff-roundup-features-col' }, ...(feats.length ? [['ul', {}, ...feats]] : [])],
                ['div', { class: 'cnx-aff-roundup-cta-col' }, buildCtas(it)],
            ];
        });
        return [
            'div',
            mergeAttributes(
                {},
                {
                    class: roundupWrapClass(layoutCards),
                    'data-cnx-roundup': JSON.stringify(list),
                },
            ),
            ...(headRow ? [headRow] : []),
            ...children,
        ] as any;`;

if (!s.includes(old.split('\n')[0])) {
  // try without motion.div typo in old
  const idx = s.indexOf('const children = list.map((it) => {');
  const end = s.indexOf('] as any;\n    },\n    addNodeView()', idx);
  if (idx === -1 || end === -1) throw new Error('block not found');
  s = s.slice(0, idx) + neu + s.slice(end);
} else {
  s = s.replace(old, neu);
}

fs.writeFileSync(file, s.replace(/motion\.motion\.div/g, 'div').replace(/\['motion\.motion\.motion\.div'/g, "['motion.div'"));
console.log('patched renderHTML');
