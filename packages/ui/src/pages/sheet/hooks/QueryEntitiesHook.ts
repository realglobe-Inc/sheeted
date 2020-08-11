import { useCallback } from 'react'
import { Query as MQuery, QueryResult } from 'material-table'
import { useSnackbar } from 'notistack'
import { HttpStatuses } from '@sheeted/core/build/web/Consts'
import { HttpError } from '@sheeted/core/build/web/Errors'

import { convertQuery } from '../converters/QueryConverter'
import { useApi } from '../../../hooks/ApiHook'
import { useLocale } from '../../../hooks/LocaleContextHook'

const IgnoreStatuses: number[] = [HttpStatuses.FORBIDDEN]

export const useQueryEntities = (
  sheetName: string,
): ((query: MQuery<any>) => Promise<QueryResult<any>>) => {
  const api = useApi()
  const { enqueueSnackbar } = useSnackbar()
  const l = useLocale()
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
        if (!IgnoreStatuses.includes((error as HttpError).status)) {
          console.error(error)
          enqueueSnackbar(l.errors.unexpectedError, {
            variant: 'error',
          })
        }
        return {
          data: [],
          page: 0,
          totalCount: 0,
        }
      }
    },
    [api, sheetName, l, enqueueSnackbar],
  )
  return queryEntities
}
