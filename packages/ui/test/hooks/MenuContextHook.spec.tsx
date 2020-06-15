import React, { FC, ReactChild } from 'react'
import { renderHook, act } from '@testing-library/react-hooks'

import {
  useMenuContext,
  MenuContextProvider,
} from '../../src/hooks/MenuContextHook'

test('useMenuContext()', () => {
  const wrapper: any = ({ children }: { children: ReactChild }) => (
    <MenuContextProvider>{children}</MenuContextProvider>
  )
  const { result } = renderHook(() => useMenuContext(), { wrapper })

  void act(() => {
    result.current.closeMenu()
  })
  expect(result.current.isOpen).toBe(false)

  void act(() => {
    result.current.openMenu()
  })
  expect(result.current.isOpen).toBe(true)
})
