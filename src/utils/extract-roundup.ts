/**
 * Extrai o primeiro bloco `.cnx-aff-roundup` do HTML do artigo.
 * Usado para renderizar o roundup no lugar da hero image quando hideThumbnail = true.
 */
export function extractFirstRoundup(html: string): { roundupHtml: string; remainingHtml: string } {
  const startRe = /<div[^>]+class="[^"]*cnx-aff-roundup[^"]*"[^>]*>/;
  const startMatch = startRe.exec(html);
  if (!startMatch) return { roundupHtml: '', remainingHtml: html };

  const blockStart = startMatch.index;
  let pos = blockStart + startMatch[0].length;
  let depth = 1;

  while (pos < html.length && depth > 0) {
    const nextOpen = html.indexOf('<div', pos);
    const nextClose = html.indexOf('</div>', pos);

    if (nextClose === -1) break;

    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      pos = nextOpen + 4;
    } else {
      depth--;
      pos = nextClose + 6;
    }
  }

  const roundupHtml = html.slice(blockStart, pos);
  const remainingHtml = html.slice(0, blockStart) + html.slice(pos);

  return { roundupHtml, remainingHtml };
}
