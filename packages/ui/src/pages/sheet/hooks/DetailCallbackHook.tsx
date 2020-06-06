import { useHistory } from 'react-router-dom'
import { useCallback } from 'react'

import { useUIPaths } from '../../../hooks/UIPathHook'
import { Entity } from '../../../types/Entity.type'

export const useDetailCallback = (
  sheetName: string,
): ((event: any, entity: any) => void) => {
  const { entityDetailPath } = useUIPaths()
  const history = useHistory()
  const goToDetail = useCallback(
    (event: any, entity: any) => {
      if (Object.getOwnPropertyDescriptor(entity, 'id')) {
        const path = entityDetailPath({
          sheetName,
          entityId: (entity as Entity).id,
        })
        history.push(path)
      }
    },
    [history, sheetName, entityDetailPath],
  )
  return goToDetail
}
