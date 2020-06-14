import { renderHook, act } from '@testing-library/react-hooks'

import { useToggle } from '../../src/hooks/utils/ToggleHook'

test('should increment counter', () => {
  const { result } = renderHook(() => useToggle())

  void act(() => {
    const [, toggle] = result.current
    toggle()
  })
  expect(result.current[0]).toBe(true)

  void act(() => {
    const [, toggle] = result.current
    toggle()
  })
  expect(result.current[0]).toBe(false)
})
