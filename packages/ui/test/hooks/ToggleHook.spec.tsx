import { renderHook, act } from '@testing-library/react-hooks'

import { useToggle } from '../../src/hooks/utils/ToggleHook'

test('useToggle()', () => {
  const { result } = renderHook(() => useToggle(false))

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
