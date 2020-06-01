import React, { createContext, ReactChild, useContext, FC } from 'react'

import { locale } from '../locale'

const LocaleContext = createContext(locale)

/**
 * Get locale from context
 */
export const useLocale = (): typeof locale => useContext(LocaleContext)

export const LocaleContextProvider: FC<{ children: ReactChild }> = ({
  children,
}) => {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  )
}
