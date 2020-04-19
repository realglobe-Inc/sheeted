import React, { createContext, ReactChild, useContext } from 'react'
import { IAMUserEntity } from '@sheeted/core'

import { useApi } from '../hooks/ApiHook'

import { useAsync } from './utils/AsyncHook'

type UserContextValues = {
  busy: boolean
  ready: boolean
  user: IAMUserEntity | null
  error: Error | null
  trigger: () => void
  reset: () => void
}

const UserContext = createContext<UserContextValues>(null as any)

/**
 * Get login user from context
 */
export const useUserContext = () => useContext(UserContext)

export const UserContextProvider = (props: { children: ReactChild }) => {
  const api = useApi()
  const { busy, ready, result: user, trigger, error, reset } = useAsync(
    api.fetchCurrentUser,
    {
      defaultResult: null,
    },
  )
  return (
    <UserContext.Provider
      value={{
        busy,
        ready,
        user,
        trigger,
        error,
        reset,
      }}
    >
      {props.children}
    </UserContext.Provider>
  )
}
