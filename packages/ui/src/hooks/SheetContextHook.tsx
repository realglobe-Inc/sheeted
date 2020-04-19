import React, { createContext, useContext, ReactChild } from 'react'
import { Sheets } from '@sheeted/core/build/web/Shared.type'

import { useApi } from './ApiHook'
import { useAsync } from './utils/AsyncHook'
import { useMountEffect } from './utils/MountEffectHook'

type SheetContextValues = {
  busy: boolean
  ready: boolean
  error: Error | null
  sheets: Sheets
  trigger: () => void
}

const SheetContext = createContext<SheetContextValues>(null as any)

/**
 * Get sheets info from context
 */
export const useSheetContext = () => useContext(SheetContext)

/**
 * Sync sheet context on mounting component
 */
export const useSheetContextSyncOnMount = () => {
  const { trigger } = useSheetContext()
  useMountEffect(() => {
    trigger()
  })
}

const defaultResult: Sheets = {
  groups: [],
  sheets: [],
}

export const SheetContextProvider = (props: { children: ReactChild }) => {
  const api = useApi()
  const { busy, ready, result: sheets, trigger, error } = useAsync(
    api.fetchSheets,
    {
      defaultResult,
    },
  )
  return (
    <SheetContext.Provider
      value={{
        busy,
        ready,
        error,
        sheets,
        trigger,
      }}
    >
      {props.children}
    </SheetContext.Provider>
  )
}
