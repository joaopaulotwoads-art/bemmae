/**
 * Bem Mãe – maternidade, saúde e lifestyle.
 */
export const siteConfig = {
  name: 'Bem Mãe',
  description: 'Blog sobre maternidade, lifestyle, saúde e bem-estar.',
  url: 'https://bem-m-e.vercel.app',
  nav: [
    { href: '/', label: 'Início' },
    { href: '/sobre', label: 'Sobre' },
    { href: '/blog', label: 'Blog' },
    { href: '/contato', label: 'Contato' },
  ],
  footerNav: [
    { href: '/', label: 'Início' },
    { href: '/sobre', label: 'Sobre' },
    { href: '/blog', label: 'Blog' },
    { href: '/contato', label: 'Contato' },
  ],
  social: { instagram: '#', facebook: '#', pinterest: '#' },
} as const;
