import { useState, useCallback } from 'react'

export const useToggle = (init?: boolean): [boolean, () => void] => {
  const [bool, setBool] = useState(Boolean(init))
  const toggle = useCallback(() => setBool((bool) => !bool), [setBool])
  return [bool, toggle]
}
