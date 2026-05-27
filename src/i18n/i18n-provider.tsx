import React, { type ReactNode } from 'react';
import { I18nContext, useI18nState } from './translations';

export function I18nProvider({ children }: { children: ReactNode }) {
  const state = useI18nState();
  return (
    <I18nContext.Provider value={state}>
      {children}
    </I18nContext.Provider>
  );
}
