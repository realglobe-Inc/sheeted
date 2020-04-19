import { useCallback, useEffect } from 'react'

import { useApi } from '../../../hooks/ApiHook'
import { useAsync } from '../../../hooks/utils/AsyncHook'

export const useFetchSheetInfo = (sheetName: string) => {
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
