/** Endereço público do site (vem do GitHub Pages no build; localhost no computador) */
export const URL_SITE = (process.env.SITE_URL ?? 'http://localhost:8080').replace(/\/$/, '');
