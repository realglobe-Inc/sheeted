import { EntityPathParams } from '@sheeted/core/build/web/Paths'
import { useEffect, useCallback } from 'react'

import { useApi } from '../../../hooks/ApiHook'
import { useAsync } from '../../../hooks/utils/AsyncHook'
import { Entity } from '../../../types/Entity.type'

export type EntityValues = {
  busy: boolean
  ready: boolean
  entity: Entity | null
  error: Error | null
}

/**
 * Get current entity.
 */
export const useEntity = ({
  sheetName,
  entityId,
}: EntityPathParams): EntityValues => {
  const api = useApi()
  const fetchEntity = useCallback(() => api.fetchEntity(sheetName, entityId), [
    api,
    sheetName,
    entityId,
  ])
  const { busy, ready, result: entity, error, trigger } = useAsync(fetchEntity)
  useEffect(() => {
    if (sheetName && entityId) {
      trigger()
    }
  }, [sheetName, entityId, trigger])
  return {
    busy,
    ready,
    entity,
    error,
  }
}
