import React, {
  createContext,
  useContext,
  ReactChild,
  useState,
  FC,
} from 'react'

import { Entity } from '../../../types/Entity.type'

type EntitySelectionContextValues = {
  entities: Entity[]
  setEntities: (entities: Entity[]) => void
}

const EntitySelectionContext = createContext<EntitySelectionContextValues>(
  null as any,
)

export const useEntitySelectionContext = (): EntitySelectionContextValues =>
  useContext(EntitySelectionContext)

export const EntitySelectionContextProvider: FC<{
  children: ReactChild
}> = (props) => {
  const [entities, setEntities] = useState<Entity[]>([])
  return (
    <EntitySelectionContext.Provider value={{ entities, setEntities }}>
      {props.children}
    </EntitySelectionContext.Provider>
  )
}
