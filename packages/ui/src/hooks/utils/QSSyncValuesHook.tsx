import qs from 'qs'
import { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { useValues } from './ValuesHook'
import { useMountEffect } from './MountEffectHook'

export type ParsedQuery = { [key: string]: string }

/**
 * Use values with syncing query strings
 */
export const useQSSyncValues = <T extends { [key: string]: any }>(
  restore: (query: ParsedQuery) => T,
): [T, (values: Partial<T>) => void, boolean] => {
  const [values, setValues] = useValues(restore({}))
  const history = useHistory()
  const [ready, setReady] = useState(false)
  useMountEffect(() => {
    const query: ParsedQuery = qs.parse(window.location.search.slice(1))
    const values = restore(query)
    setValues(values)
    setReady(true)
  })
  const setValuesAndSaveQuery = useCallback(
    (values: Partial<T>) => {
      setValues(values)
      setTimeout(() => {
        // merge query string
        const query = qs.parse(window.location.search.slice(1))
        const merged = Object.fromEntries(
          Object.entries({
            ...query,
            ...values,
          }).sort((a, b) => {
            if (a[0] < b[0]) {
              return -1
            } else if (a[0] > b[0]) {
              return 1
            } else {
              return 0
            }
          }),
        )
        const search = qs.stringify(merged)
        history.push({
          pathname: window.location.pathname,
          search,
        })
      }, 100)
    },
    [setValues, history],
  )
  return [values, setValuesAndSaveQuery, ready]
}
