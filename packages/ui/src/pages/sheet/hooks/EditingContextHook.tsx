import React, {
  createContext,
  useContext,
  FC,
  ReactChild,
  useState,
} from 'react'

export type EditingContextValues = {
  editing: boolean
  setEditing: (editing: boolean) => void
}

export const EditingContext = createContext<EditingContextValues>(null as any)

export const useEditingContext = (): EditingContextValues =>
  useContext(EditingContext)

export const EditingContextProvider: FC<{ children: ReactChild }> = (props) => {
  const [editing, setEditing] = useState(false)
  return (
    <EditingContext.Provider value={{ editing, setEditing }}>
      {props.children}
    </EditingContext.Provider>
  )
}
