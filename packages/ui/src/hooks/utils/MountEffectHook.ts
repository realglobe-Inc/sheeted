import { useEffect } from 'react'

export const useMountEffect = (effect: () => void) => {
  // react-hooks/exhaustive-deps が callback の中までチェックするようになったので、警告が出る
  // こういうユースケースもあるから対応を待つ
  // https://github.com/facebook/react/pull/18435
  useEffect(
    () => {
      effect()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
}

export const useUnmountEffect = (effect: () => void) => {
  useEffect(() => {
    return effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
