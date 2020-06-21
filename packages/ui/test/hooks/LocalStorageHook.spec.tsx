import { renderHook } from '@testing-library/react-hooks'

import { useLocalStorage } from '../../src/hooks/LocalStorageHook'

test('useLocalStorage()', () => {
  const {
    result: { current: storage },
  } = renderHook(() => useLocalStorage())

  expect(storage).toBeTruthy()
})
