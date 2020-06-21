import { renderHook } from '@testing-library/react-hooks'

import { useApi } from '../../src/hooks/ApiHook'
import { Sheeted } from '../../src/Sheeted'

test('useApi()', () => {
  Sheeted.config({
    appTitle: 'app',
  })

  const { result: result1 } = renderHook(() => useApi())
  const { result: result2 } = renderHook(() => useApi())

  expect(result1.current).toBe(result2.current)
})
