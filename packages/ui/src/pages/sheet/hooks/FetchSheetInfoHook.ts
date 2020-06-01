import { useCallback, useEffect } from 'react'
import { SheetInfo } from '@sheeted/core/build/web/Shared.type'

import { useApi } from '../../../hooks/ApiHook'
import { useAsync } from '../../../hooks/utils/AsyncHook'

export type SheetInfoValues = {
  busy: boolean
  ready: boolean
  result: SheetInfo | null
  error: Error | null
}

export const useFetchSheetInfo = (sheetName: string): SheetInfoValues => {
  const api = useApi()
  const fetchInfo = useCallback(() => api.fetchSheetInfo(sheetName), [
    api,
    sheetName,
  ])
  const { busy, ready, result, error, trigger } = useAsync(fetchInfo)
  useEffect(() => {
    if (sheetName) {
      trigger()
    }
  }, [trigger, sheetName])
  return {
    busy,
    ready,
    result,
    error,
  }
}
