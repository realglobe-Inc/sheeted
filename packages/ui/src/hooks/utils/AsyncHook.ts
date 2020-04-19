import { useCallback } from 'react'

import { useValues } from './ValuesHook'
import { useMountEffect } from './MountEffectHook'

export type AsyncHookValues<T> = {
  ready: boolean
  busy: boolean
  result: T
  error: Error | null
}

export type AsyncHookOptions<Default = null> = {
  defaultResult?: Default
  immediate?: boolean
}

export const useAsync = <Result, Default = null>(
  fn: () => Promise<Result>,
  options: AsyncHookOptions<Default> = {},
) => {
  const { immediate } = options
  const defaultResult = (options.defaultResult ?? null) as Default
  const [{ ready, busy, result, error }, set] = useValues<
    AsyncHookValues<Result | Default>
  >({
    ready: false,
    busy: false,
    result: defaultResult,
    error: null,
  })
  const trigger = useCallback(() => {
    set({ busy: true })
    fn()
      .then((success) => {
        set({
          result: success,
          ready: true,
          busy: false,
        })
        return success
      })
      .catch((e) => {
        set({
          result: defaultResult,
          error: e,
          ready: true,
          busy: false,
        })
      })
  }, [fn, set, defaultResult])
  const reset = useCallback(
    () =>
      set({
        ready: false,
        busy: false,
        result: defaultResult,
        error: null,
      }),
    [set, defaultResult],
  )
  useMountEffect(() => {
    if (immediate) {
      trigger()
    }
  })
  return {
    ready,
    busy,
    result,
    error,
    trigger,
    reset,
  }
}
