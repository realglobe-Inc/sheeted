import { useEffect, EffectCallback } from 'react'

export const useMountEffect = (effect: EffectCallback) => {
  useEffect(effect, [])
}

export const useUnmountEffect = (effect: () => void) => {
  useEffect(() => {
    return effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
