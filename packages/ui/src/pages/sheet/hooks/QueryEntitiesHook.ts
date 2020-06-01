import { useCallback } from 'react'
import { Query as MQuery, QueryResult } from 'material-table'
import { HttpStatuses } from '@sheeted/core/build/web/Consts'

import { convertQuery } from '../converters/QueryConverter'
import { useApi } from '../../../hooks/ApiHook'

export const useQueryEntities = (
  sheetName: string,
): ((query: MQuery<any>) => Promise<QueryResult<any>>) => {
  const api = useApi()
  const queryEntities = useCallback(
    async (query: MQuery<any>): Promise<QueryResult<any>> => {
      const listQuery = convertQuery(query)
      try {
        const list = await api.fetchEntities(sheetName, listQuery)
        return {
          data: list.entities,
          page: list.page - 1,
          totalCount: list.total,
        }
      } catch (error) {
        if (error.status === HttpStatuses.FORBIDDEN) {
          // info でエラーハンドルするのでこっちでは無視
          console.log(error)
          return {
            data: [],
            page: 0,
            totalCount: 0,
          }
        }
        throw error
      }
    },
    [api, sheetName],
  )
  return queryEntities
}
