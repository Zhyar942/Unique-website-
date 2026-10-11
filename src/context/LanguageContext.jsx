import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';

export const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // Default to Kurdish Sorani as primary first-class language; support ?lang= query param
  const [lang, setLang] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang');
      if (urlLang && ['ku', 'ar', 'en'].includes(urlLang)) {
        return urlLang;
      }
    } catch {
      // fallback
    }
    return localStorage.getItem('unique_lang') || 'ku';
  });

  const isRtl = lang === 'ku' || lang === 'ar';

  useEffect(() => {
    localStorage.setItem('unique_lang', lang);
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.body.classList.remove('lang-en', 'lang-ar', 'lang-ku', 'is-rtl', 'is-ltr');
    document.body.classList.add(`lang-${lang}`, isRtl ? 'is-rtl' : 'is-ltr');
  }, [lang, isRtl]);

  const t = translations[lang] || translations.ku;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};
