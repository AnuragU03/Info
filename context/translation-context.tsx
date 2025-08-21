'use client';

import { createContext, useState, useCallback, useMemo, type ReactNode } from 'react';

interface TranslationContextType {
  language: string;
  setLanguage: (language: string) => void;
  translations: Record<string, string>;
  addTranslation: (key: string, value: string) => void;
}

export const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});

  const addTranslation = useCallback((key: string, value: string) => {
    setTranslations(prev => ({ ...prev, [key]: value }));
  }, []);

  const value = useMemo(() => ({
    language,
    setLanguage,
    translations,
    addTranslation
  }), [language, translations, addTranslation]);

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}
