'use client';

import { useContext, useEffect, useRef } from 'react';
import { TranslationContext } from '@/context/translation-context';
import { getTranslation } from '@/app/actions';

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }

  const { language, translations, addTranslation } = context;
  const requestedTranslations = useRef<Set<string>>(new Set());

  const t = (text: string): string => {
    if (language === 'en') {
      return text;
    }
    const key = `${language}:${text}`;
    if (translations[key]) {
      return translations[key];
    }
    
    // Mark this text for translation, but return original text for now
    if (!requestedTranslations.current.has(key)) {
      requestedTranslations.current.add(key);
    }
    
    return text;
  };

  useEffect(() => {
    const requests = Array.from(requestedTranslations.current);
    if (requests.length > 0) {
      requests.forEach(key => {
        const [lang, text] = key.split(':', 2);
        if (lang === language) {
          getTranslation(text, lang).then(translatedText => {
            if (translatedText) {
              addTranslation(key, translatedText);
              requestedTranslations.current.delete(key);
            }
          });
        }
      });
    }
  }, [language, addTranslation, translations]); // Rerun when language changes or new translations are requested

  return { t, setLanguage: context.setLanguage, currentLanguage: language };
}
