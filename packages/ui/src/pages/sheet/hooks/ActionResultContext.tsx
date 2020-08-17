import React, {
  createContext,
  useContext,
  FC,
  ReactChild,
  useState,
  useCallback,
} from 'react'
import { ActionResult } from '@sheeted/core/build/web/Shared.type'

export type ActionResultContextValues = {
  result: ActionResult | null
  setResult(result: ActionResult): void
  reset(): void
}

export const ActionResultContext = createContext<ActionResultContextValues>(
  null as any,
)

export const useActionResultContext = (): ActionResultContextValues =>
  useContext(ActionResultContext)

export const ActionResultContextProvider: FC<{ children: ReactChild }> = (
  props,
) => {
  const [result, set] = useState<ActionResultContextValues['result']>(null)
  const setResult = useCallback((result: ActionResult) => set(result), [set])
  const reset = useCallback(() => set(null), [set])
  return (
    <ActionResultContext.Provider value={{ result, setResult, reset }}>
      {props.children}
    </ActionResultContext.Provider>
  )
}
