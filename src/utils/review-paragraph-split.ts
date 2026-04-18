/**
 * Divide parágrafos longos do corpo em reviews (layout reviewRoundup) em blocos
 * mais curtos (~4 linhas na coluna editorial ~72ch), agrupando frases até um
 * teto de palavras. Preserva <a href>...</a> no meio do texto.
 */

const LINK_PLACEHOLDER = (i: number) => `⟦${i}⟧`;

/** Largura alvo ~4 linhas em 72ch, ~10–11 palavras por linha em PT. */
const MAX_WORDS_PER_PARAGRAPH = 40;

const MIN_WORDS_TO_SPLIT = 45;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function protectAnchors(html: string): { text: string; links: string[] } {
  const links: string[] = [];
  const text = html.replace(/<a\s[^>]*>[\s\S]*?<\/a>/gi, (m) => {
    links.push(m);
    return LINK_PLACEHOLDER(links.length - 1);
  });
  return { text, links };
}

function restoreAnchors(text: string, links: string[]): string {
  return text.replace(/⟦(\d+)⟧/g, (_, d) => links[Number(d)] ?? _);
}

/** Só processa <p> que são texto + links; ignora strong, img, etc. */
function isSimpleParagraphHtml(inner: string): boolean {
  const withoutAnchors = inner.replace(/<a\s[^>]*>[\s\S]*?<\/a>/gi, '');
  return !/<[a-z]/i.test(withoutAnchors);
}

function splitIntoSentences(text: string): string[] {
  const raw = text.trim();
  if (!raw) return [];
  const pieces = raw.split('. ');
  return pieces.map((piece, i) => {
    const p = piece.trim();
    if (i < pieces.length - 1) {
      return p.endsWith('.') ? p : `${p}.`;
    }
    return p;
  });
}

function packSentencesToWordBudget(sentences: string[], maxWords: number): string[] {
  const out: string[] = [];
  let cur = '';
  let curWords = 0;

  for (const sent of sentences) {
    const w = wordCount(sent);
    if (!cur) {
      cur = sent;
      curWords = w;
      continue;
    }
    if (curWords + w <= maxWords) {
      cur = `${cur} ${sent}`;
      curWords += w;
    } else {
      out.push(cur);
      cur = sent;
      curWords = w;
    }
  }
  if (cur) out.push(cur);
  return out;
}

export function splitReviewRoundupBodyParagraphs(html: string): string {
  return html.replace(/<p>([\s\S]*?)<\/p>/gi, (full, inner: string) => {
    const trimmed = inner.trim();
    if (!trimmed || !isSimpleParagraphHtml(trimmed)) return full;

    const { text, links } = protectAnchors(trimmed);
    if (wordCount(text) < MIN_WORDS_TO_SPLIT) return full;

    const sentences = splitIntoSentences(text);
    if (sentences.length < 2) return full;

    const chunks = packSentencesToWordBudget(sentences, MAX_WORDS_PER_PARAGRAPH);
    if (chunks.length <= 1) return full;

    return chunks.map((c) => `<p>${restoreAnchors(c.trim(), links)}</p>`).join('');
  });
}
