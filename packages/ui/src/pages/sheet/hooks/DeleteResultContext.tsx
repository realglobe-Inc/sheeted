import React, {
  createContext,
  useContext,
  FC,
  ReactChild,
  useState,
} from 'react'
import { DeleteResult } from '@sheeted/core/build/web/Shared.type'

export type DeleteResultContextValues = {
  result: DeleteResult | null
  setResult(result: DeleteResult | null): void
}

export const DeleteResultContext = createContext<DeleteResultContextValues>(
  null as any,
)

export const useDeleteResultContext = (): DeleteResultContextValues =>
  useContext(DeleteResultContext)

export const DeleteResultContextProvider: FC<{ children: ReactChild }> = (
  props,
) => {
  const [result, setResult] = useState<DeleteResultContextValues['result']>(
    null,
  )
  return (
    <DeleteResultContext.Provider value={{ result, setResult }}>
      {props.children}
    </DeleteResultContext.Provider>
  )
}
