import React, {
  createContext,
  useContext,
  FC,
  ReactChild,
  useState,
  useCallback,
} from 'react'
import { DeleteResult } from '@sheeted/core/build/web/Shared.type'

export type DeleteResultContextValues = {
  result: DeleteResult | null
  setResult(result: DeleteResult): void
  reset(): void
}

export const DeleteResultContext = createContext<DeleteResultContextValues>(
  null as any,
)

export const useDeleteResultContext = (): DeleteResultContextValues =>
  useContext(DeleteResultContext)

export const DeleteResultContextProvider: FC<{ children: ReactChild }> = (
  props,
) => {
  const [result, set] = useState<DeleteResultContextValues['result']>(null)
  const setResult = useCallback((result: DeleteResult) => set(result), [set])
  const reset = useCallback(() => set(null), [set])
  return (
    <DeleteResultContext.Provider value={{ result, setResult, reset }}>
      {props.children}
    </DeleteResultContext.Provider>
  )
}
