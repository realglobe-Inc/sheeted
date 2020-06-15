import { renderHook, act } from '@testing-library/react-hooks'

import { useAsync } from '../../src/hooks/utils/AsyncHook'

test('useAsync()', async () => {
  const doAsync = () =>
    new Promise<number>((resolve) => setTimeout(() => resolve(1), 50))
  const { result, waitForNextUpdate } = renderHook(() =>
    useAsync(doAsync, { defaultResult: 0 }),
  )

  expect(result.current).toMatchObject({
    ready: false,
    busy: false,
    result: 0,
    error: null,
  })

  void act(() => {
    result.current.trigger()
  })
  expect(result.current).toMatchObject({
    ready: false,
    busy: true,
    result: 0,
    error: null,
  })

  await waitForNextUpdate()
  expect(result.current).toMatchObject({
    ready: true,
    busy: false,
    result: 1,
    error: null,
  })
})
