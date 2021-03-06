import React, {
  createContext,
  ReactChild,
  useContext,
  useCallback,
  FC,
} from 'react'

import { usePersistentState } from './utils/PersistentStateHook'

export type MenuContextValues = {
  isOpen: boolean
  openMenu: () => void
  closeMenu: () => void
}

const MenuContext = createContext<MenuContextValues>(null as any)

/**
 * Get menu values from context
 */
export const useMenuContext = (): MenuContextValues => useContext(MenuContext)

const MENU_IS_OPEN_KEY = 'MenuContextValues-isOpen'

export const MenuContextProvider: FC<{ children: ReactChild }> = (props) => {
  const [isOpen, setOpen] = usePersistentState(MENU_IS_OPEN_KEY, true)
  const openMenu = useCallback(() => setOpen(true), [setOpen])
  const closeMenu = useCallback(() => setOpen(false), [setOpen])
  return (
    <MenuContext.Provider
      value={{
        isOpen,
        openMenu,
        closeMenu,
      }}
    >
      {props.children}
    </MenuContext.Provider>
  )
}
