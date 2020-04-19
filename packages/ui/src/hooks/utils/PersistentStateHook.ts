import { useCallback, useState } from 'react'

import { useMountEffect } from './MountEffectHook'

export const usePersistentState = <T>(
  storageKey: string,
  initialState: T,
): [T, (state: T) => void] => {
  const [state, setState] = useState(initialState)

  useMountEffect(() => {
    try {
      const restored = window.localStorage.getItem(storageKey)
      if (typeof restored === 'string') {
        setState(JSON.parse(restored))
      }
    } catch (e) {
      console.error(e)
    }
  })

  const setStatePersistently = useCallback(
    (state: T) => {
      setState(state)
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(state))
      } catch (e) {
        console.error(e)
      }
    },
    [storageKey, setState],
  )
  return [state, setStatePersistently]
}
