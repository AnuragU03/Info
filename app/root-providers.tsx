'use client';

import { ReactNode } from 'react';
import { Providers } from './providers';
import { AuthProvider } from '@/context/auth-context';
import { TranslationProvider } from '@/context/translation-context';

interface RootProvidersProps {
  children: ReactNode;
}

export function RootProviders({ children }: RootProvidersProps) {
  return (
    <Providers>
      <AuthProvider>
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </AuthProvider>
    </Providers>
  );
}
