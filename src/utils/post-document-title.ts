function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Título `<title>` para posts no tema Bem Mãe: remove sufixos manuais legados
 * (`| Bem Mãe`, `- Bem Mãe`, etc.) e acrescenta uma única vez ` | {marca}`.
 */
export function buildBemmaePostDocumentTitle(input: {
  metaTitle?: string | null;
  postTitle: string;
  siteName: string;
  brandName?: string | null;
}): string {
  const brand = (input.brandName || input.siteName || 'Site').trim();
  const baseSource = (input.metaTitle?.trim() || input.postTitle || '').trim();
  let base = baseSource;

  for (const token of [brand, 'Bem Mãe', 'Site']) {
    const t = token.trim();
    if (!t) continue;
    const esc = escapeRegExp(t);
    base = base.replace(new RegExp(`\\s*\\|\\s*${esc}\\s*$`, 'i'), '').trim();
    base = base.replace(new RegExp(`\\s*-\\s*${esc}\\s*$`, 'i'), '').trim();
    base = base.replace(new RegExp(`\\s*—\\s*${esc}\\s*$`, 'i'), '').trim();
  }

  const suffix = ` | ${brand}`;
  if (base.endsWith(suffix)) return base;
  return `${base}${suffix}`;
}
