import { useState, useCallback } from 'react'

export const useToggle = (): [boolean, () => void] => {
  const [bool, setBool] = useState(false)
  const toggle = useCallback(() => setBool((bool) => !bool), [setBool])
  return [bool, toggle]
}
