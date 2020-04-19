import React, {
  useContext,
  createContext,
  ReactChild,
  useState,
  useCallback,
  useEffect,
} from 'react'
import { SheetInfo } from '@sheeted/core/build/web/Shared.type'
import { HttpError } from '@sheeted/core/build/web/Errors'

import { useApi } from '../../../hooks/ApiHook'
import { useAsync } from '../../../hooks/utils/AsyncHook'

export type SheetInfoContextValues = {
  busy: boolean
  ready: boolean
  result: SheetInfo | null
  error: HttpError | null
  trigger: (sheetName: string) => void
}

const SheetInfoContext = createContext<SheetInfoContextValues>(null as any)

export const useSheetInfoContext = () => useContext(SheetInfoContext)

export const SheetInfoContextProvider = (props: { children: ReactChild }) => {
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
