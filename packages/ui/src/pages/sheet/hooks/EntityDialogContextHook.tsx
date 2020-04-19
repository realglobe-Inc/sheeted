import React, {
  useContext,
  createContext,
  ReactChild,
  useState,
  useCallback,
} from 'react'

type SheetProp = {
  sheetName: string
  onSelect: (entity: any) => void
}

export type EntityDialogContextValues = {
  isOpen: boolean
  openDialog: (sheet: SheetProp) => void
  closeDialog: () => void
  sheetProp: SheetProp | null
}

const EntityDialogContext = createContext<EntityDialogContextValues>(
  null as any,
)

export const useEntityDialogContext = () => useContext(EntityDialogContext)

export const EntityDialogContextProvider = (props: {
  children: ReactChild
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [sheetProp, setSheetProp] = useState<SheetProp | null>(null)
  const openDialog = useCallback(
    (sheet: SheetProp) => {
      setSheetProp(sheet)
      setIsOpen(true)
    },
    [setIsOpen, setSheetProp],
  )
  const closeDialog = useCallback(() => {
    setIsOpen(false)
    setSheetProp(null)
  }, [setIsOpen, setSheetProp])
  return (
    <EntityDialogContext.Provider
      value={{ isOpen, sheetProp, openDialog, closeDialog }}
    >
      {props.children}
    </EntityDialogContext.Provider>
  )
}
