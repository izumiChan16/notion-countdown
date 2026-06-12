'use client';

import { LanguageIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/lib/i18n/hooks';
import type { Locale } from '@/lib/i18n/locales';

export default function LanguageSwitcher() {
  const [language, changeLanguage] = useLanguage();

  const handleChange = (newLang: Locale) => {
    changeLanguage(newLang);
    // Force re-render by updating URL
    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLang);
    window.history.replaceState({}, '', url.toString());
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-1 rounded-md border border-[#dedbd5] bg-white p-1 text-sm shadow-[0_1px_2px_rgba(15,15,15,0.04)]">
      <LanguageIcon className="ml-1 h-4 w-4 text-[#787774]" />
      <button
        onClick={() => handleChange('zh')}
        className={`rounded px-2.5 py-1 font-medium transition-colors ${
          language === 'zh' ? 'bg-[#37352f] text-white' : 'text-[#787774] hover:bg-[#f7f6f3] hover:text-[#37352f]'
        }`}
      >
        中文
      </button>
      <button
        onClick={() => handleChange('en')}
        className={`rounded px-2.5 py-1 font-medium transition-colors ${
          language === 'en' ? 'bg-[#37352f] text-white' : 'text-[#787774] hover:bg-[#f7f6f3] hover:text-[#37352f]'
        }`}
      >
        EN
      </button>
    </div>
  );
}
