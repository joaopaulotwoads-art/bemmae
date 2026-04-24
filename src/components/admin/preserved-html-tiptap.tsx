/**
 * Blocos de HTML arbitrários (hero review, caixa de destaque) que o TipTap não modela.
 * Envolve em nó atómico para o conteúdo aparecer no painel e voltar idêntico ao salvar.
 */

import { Node, mergeAttributes } from '@tiptap/core';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';

function makePreservedDiv(outerHtml: string): string {
    const enc = encodeURIComponent(outerHtml);
    return `<div class="cms-preserved-html-root" data-cms-preserved-html="${enc}"></div>`;
}

/** TipTap não inclui schema de <table>; sem isto o editor achata tudo a texto corrido. */
function shouldPreserveTableBlock(el: HTMLElement): boolean {
    if (el.classList.contains('product-review')) return false;
    const tableEl = el.tagName === 'TABLE' ? el : el.querySelector('table');
    if (!tableEl) return false;
    const wrapperCls = typeof el.className === 'string' ? el.className : '';
    const tableCls =
        typeof (tableEl as HTMLElement).className === 'string'
            ? (tableEl as HTMLElement).className
            : '';
    if (wrapperCls.includes('cnx-aff-') || tableCls.includes('cnx-aff-')) return false;
    if ((tableEl as HTMLElement).classList.contains('product-review-table')) return false;
    return true;
}

/** Antes de setContent: section/div de layout → nó preservado (o resto continua HTML normal). */
export function preprocessHtmlForTipTap(html: string): string {
    if (!html || !html.trim()) return html;
    if (typeof document === 'undefined') return html;
    /** DOM Element — não usar `Node.ELEMENT_NODE` (o import de `@tiptap/core` sombreia `Node`). */
    const ELEMENT_NODE = 1;
    try {
        const wrap = document.createElement('div');
        wrap.innerHTML = html.trim();
        const out: string[] = [];
        for (const child of Array.from(wrap.childNodes)) {
            if (child.nodeType !== ELEMENT_NODE) {
                continue;
            }
            const el = child as HTMLElement;
            if (
                el.matches?.('section.review-hero-picks') ||
                (el.tagName === 'SECTION' && el.classList.contains('review-hero-picks'))
            ) {
                out.push(makePreservedDiv(el.outerHTML));
                continue;
            }
            if (el.matches?.('div.review-highlight-box')) {
                out.push(makePreservedDiv(el.outerHTML));
                continue;
            }
            if (shouldPreserveTableBlock(el)) {
                out.push(makePreservedDiv(el.outerHTML));
                continue;
            }
            out.push(el.outerHTML);
        }
        const joined = out.join('');
        // Nunca devolver vazio se o original tinha conteúdo (evita apagar o post no editor).
        if (!joined.trim() && html.trim().length > 0) {
            return html.trim();
        }
        return joined;
    } catch {
        return html;
    }
}

/** Depois de getHTML: repõe o HTML original dos blocos preservados para o .mdoc. */
export function expandPreservedHtmlBlocks(html: string): string {
    if (!html || !html.includes('data-cms-preserved-html')) return html;
    return html.replace(/<div[^>]*data-cms-preserved-html="([^"]+)"[^>]*>\s*<\/div>/gi, (_full, encoded) => {
        try {
            return decodeURIComponent(encoded);
        } catch {
            return _full;
        }
    });
}

function PreservedHtmlNodeView({ node }: { node: { attrs: { encoded?: string } } }) {
    let inner = '';
    try {
        inner = decodeURIComponent(node.attrs.encoded || '');
    } catch {
        inner = '';
    }
    return (
        <NodeViewWrapper className="cms-preserved-html-wrapper not-prose" contentEditable={false}>
            <div
                className="cms-preserved-html-inner border border-dashed border-[rgba(255,255,255,0.18)] rounded-lg overflow-hidden bg-[#0d0d0d]"
                dangerouslySetInnerHTML={{ __html: inner }}
            />
            <p className="text-[10px] text-[#737373] mt-1.5 px-0.5">
                Bloco HTML preservado (destaques, tabelas, etc.) — mantém-se ao salvar
            </p>
        </NodeViewWrapper>
    );
}

export const PreservedHtmlExtension = Node.create({
    name: 'preservedHtml',
    group: 'block',
    atom: true,
    draggable: true,
    addAttributes() {
        return {
            encoded: {
                default: '',
                parseHTML: (el) => (el as HTMLElement).getAttribute('data-cms-preserved-html') || '',
                renderHTML: (attrs) => (attrs.encoded ? { 'data-cms-preserved-html': attrs.encoded } : {}),
            },
        };
    },
    parseHTML() {
        return [
            {
                tag: 'div[data-cms-preserved-html]',
                getAttrs: (el) => ({
                    encoded: (el as HTMLElement).getAttribute('data-cms-preserved-html') || '',
                }),
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes({ class: 'cms-preserved-html-root' }, HTMLAttributes),
        ];
    },
    addNodeView() {
        return ReactNodeViewRenderer(PreservedHtmlNodeView);
    },
});
