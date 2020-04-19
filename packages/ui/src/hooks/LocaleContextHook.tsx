import React, { createContext, ReactChild, useContext } from 'react'

import { locale } from '../locale'

const LocaleContext = createContext(locale)

/**
 * Get locale from context
 */
export const useLocale = () => useContext(LocaleContext)

export const LocaleContextProvider = (props: { children: ReactChild }) => {
  return (
    <LocaleContext.Provider value={locale}>
      {props.children}
    </LocaleContext.Provider>
  )
}
