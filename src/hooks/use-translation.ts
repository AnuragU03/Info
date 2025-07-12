
'use client';

import { useContext, useEffect, useCallback, useRef } from 'react';
import { TranslationContext } from '@/context/translation-context';
import { getTranslation } from '@/app/actions';

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }

  const { language, translations, addTranslation, setLanguage } = context;
  const requestedTranslations = useRef(new Set<string>());

  const t = useCallback((text: string): string => {
    if (language === 'en' || !text) {
      return text;
    }

    const key = `${language}:${text}`;
    if (translations[key]) {
      return translations[key];
    }

    // Mark for translation, but don't fetch here
    if (typeof window !== 'undefined') {
        requestedTranslations.current.add(text);
    }
    
    return text; // Return original text for now
  }, [language, translations]);
  
  useEffect(() => {
    const textsToTranslate = Array.from(requestedTranslations.current);
    if (textsToTranslate.length > 0 && language !== 'en') {
      const translateAndStore = async (text: string, lang: string) => {
        const key = `${lang}:${text}`;
        if (translations[key]) {
          return;
        }
        try {
          const translatedText = await getTranslation(text, lang);
          if (translatedText) {
            addTranslation(key, translatedText);
          }
        } catch (e) {
          console.error("Translation failed for:", text, e);
        }
      };

      textsToTranslate.forEach(text => {
        translateAndStore(text, language);
      });
      requestedTranslations.current.clear();
    }
  }, [t, language, addTranslation, translations]); // Dependency array now correctly tracks changes

  return { t, setLanguage, currentLanguage: language };
}
