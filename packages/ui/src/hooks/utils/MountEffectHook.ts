import { useEffect } from 'react'

export const useMountEffect = (effect: () => void): void => {
  useEffect(() => {
    effect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export const useUnmountEffect = (effect: () => void): void => {
  useEffect(() => {
    return effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
