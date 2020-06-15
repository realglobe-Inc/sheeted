import { renderHook } from '@testing-library/react-hooks'

import { useLocalStorage } from '../../src/hooks/LocalStorageHook'

test('useLocalStorage()', () => {
  const {
    result: { current: storage },
  } = renderHook(() => useLocalStorage())

  storage.setToken('token')
  expect(storage.getToken()).toBe('token')

  storage.removeToken()
  expect(storage.getToken()).toBeNull()
})
