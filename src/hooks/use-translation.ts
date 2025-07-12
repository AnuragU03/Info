'use client';

import { useContext, useEffect, useCallback } from 'react';
import { TranslationContext } from '@/context/translation-context';
import { getTranslation } from '@/app/actions';

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }

  const { language, translations, addTranslation, setLanguage } = context;

  const t = useCallback((text: string): string => {
    if (language === 'en' || !text) {
      return text;
    }
    const key = `${language}:${text}`;
    return translations[key] || text;
  }, [language, translations]);

  useEffect(() => {
    // This effect is now just for listening to changes on `t` and fetching.
    // We don't need to manage requestedTranslations manually anymore.
  }, [t]);

  const translateAndStore = useCallback(async (text: string, lang: string) => {
    const key = `${lang}:${text}`;
    if (translations[key] || lang === 'en') {
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
  }, [addTranslation, translations]);

  // This function will be called from components to register text for translation
  const registerTextForTranslation = useCallback((text: string) => {
    if (language !== 'en' && text) {
       translateAndStore(text, language);
    }
  }, [language, translateAndStore]);

  const wrappedT = useCallback((text: string): string => {
      // Register the text for translation when it's first seen
      if (typeof window !== 'undefined') { // Ensure this runs only on the client
          registerTextForTranslation(text);
      }
      return t(text);
  }, [t, registerTextForTranslation]);

  return { t: wrappedT, setLanguage, currentLanguage: language };
}
