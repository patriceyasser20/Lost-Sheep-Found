'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import en from '../i18n/translations/en.json';
import ar from '../i18n/translations/ar.json';

type Language = 'en' | 'ar';
const dictionaries: Record<Language, Record<string, string>> = { en, ar };

type LanguageContextType = {
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // middleware.ts sets NEXT_LOCALE based on the /ar prefix — mirror it client-side.
    const cookieLocale = document.cookie.match(/NEXT_LOCALE=(en|ar)/)?.[1] as Language | undefined;
    if (cookieLocale) setLanguage(cookieLocale);
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    document.cookie = `NEXT_LOCALE=${lang};path=/;max-age=${60 * 60 * 24 * 365}`;
  };

  const t = (key: string) => dictionaries[language][key] ?? dictionaries.en[key] ?? key;

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
};
