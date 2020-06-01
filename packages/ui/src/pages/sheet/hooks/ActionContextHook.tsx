import React, {
  useContext,
  createContext,
  ReactChild,
  useState,
  useCallback,
} from 'react'

import { Entity } from '../../../types/Entity.type'

export type EntitiesAction = {
  title: string
  entities: Entity[]
  doAction: () => Promise<void>
}

export type ActionContextValues = {
  action: EntitiesAction | null
  busy: boolean
  confirming: boolean
  startAction: (action: EntitiesAction) => void
  cancelAction: () => void
  doAction: () => void
}

const ActionContext = createContext<ActionContextValues>(null as any)

export const useActionContext = () => useContext(ActionContext)

export const ActionContextProvider = (props: { children: ReactChild }) => {
  const [action, setAction] = useState<EntitiesAction | null>(null)
  const [busy, setBusy] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const startAction = useCallback(
    (action: EntitiesAction) => {
      setAction(action)
      setConfirming(true)
    },
    [setAction],
  )
  const cancelAction = useCallback(() => {
    setConfirming(false)
    setAction(null)
  }, [setConfirming, setAction])
  const doAction = useCallback(() => {
    if (!action) {
      setConfirming(false)
      return
    }
    setBusy(true)
    void action.doAction().finally(() => {
      setBusy(false)
      setConfirming(false)
    })
  }, [action, setBusy, setConfirming])
  return (
    <ActionContext.Provider
      value={{
        action,
        busy,
        confirming,
        startAction,
        cancelAction,
        doAction,
      }}
    >
      {props.children}
    </ActionContext.Provider>
  )
}
