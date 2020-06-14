import { renderHook } from '@testing-library/react-hooks'

import { useUIPaths } from '../../src/hooks/UIPathHook'

test('useUIPaths()', () => {
  const { result: result1 } = renderHook(() => useUIPaths())
  const { result: result2 } = renderHook(() => useUIPaths())

  expect(result1.current).toBe(result2.current)
})
