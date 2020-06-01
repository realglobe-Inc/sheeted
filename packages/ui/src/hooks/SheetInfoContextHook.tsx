import React, {
  useContext,
  createContext,
  ReactChild,
  useState,
  useCallback,
  useEffect,
  FC,
} from 'react'
import { SheetInfo } from '@sheeted/core/build/web/Shared.type'
import { HttpError } from '@sheeted/core/build/web/Errors'

import { useApi } from './ApiHook'
import { useAsync } from './utils/AsyncHook'

export type SheetInfoContextValues = {
  busy: boolean
  ready: boolean
  result: SheetInfo | null
  error: HttpError | null
  trigger: (sheetName: string) => void
}

const SheetInfoContext = createContext<SheetInfoContextValues>(null as any)

export const useSheetInfoContext = (): SheetInfoContextValues =>
  useContext(SheetInfoContext)

export const SheetInfoContextProvider: FC<{ children: ReactChild }> = (
  props,
) => {
  const api = useApi()
  const [sheetName, setSheetName] = useState('')
  const fetchInfo = useCallback(() => api.fetchSheetInfo(sheetName), [
    api,
    sheetName,
  ])
  const { busy, ready, result, error, trigger } = useAsync(fetchInfo)
  // sheetName を変更することがトリガーになる
  useEffect(() => {
    if (sheetName) {
      trigger()
    }
  }, [trigger, sheetName])
  return (
    <SheetInfoContext.Provider
      value={{
        busy,
        ready,
        result,
        error: error as HttpError,
        trigger: setSheetName,
      }}
    >
      {props.children}
    </SheetInfoContext.Provider>
  )
}
