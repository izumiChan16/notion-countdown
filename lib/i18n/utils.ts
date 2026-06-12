import type { Locale } from './locales';
import { defaultLocale } from './locales';

export function detectBrowserLanguage(): Locale {
  if (typeof window === 'undefined') return defaultLocale;

  const browserLang = navigator.language.toLowerCase();

  if (browserLang.startsWith('zh')) return 'zh';
  if (browserLang.startsWith('en')) return 'en';

  return defaultLocale;
}

export function getStoredLanguage(): Locale | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem('language');
  if (stored === 'zh' || stored === 'en') return stored;

  return null;
}

export function setStoredLanguage(locale: Locale): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('language', locale);
}
