export const locales = ['pt', 'en', 'fr', 'ht'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'pt';

export const localeNames = {
  pt: 'Português',
  en: 'English', 
  fr: 'Français',
  ht: 'Kreyòl Ayisyen'
};

export const currencies = {
  pt: { code: 'BRL', symbol: 'R$' },
  en: { code: 'USD', symbol: '$' },
  fr: { code: 'EUR', symbol: '€' },
  ht: { code: 'HTG', symbol: 'G' }
};

export function getLocaleFromUrl(pathname: string): Locale {
  const segments = pathname.split('/');
  const locale = segments[1] as Locale;
  return locales.includes(locale) ? locale : defaultLocale;
}