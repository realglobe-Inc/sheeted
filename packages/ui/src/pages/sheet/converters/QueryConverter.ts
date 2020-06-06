import { Query as MQuery } from 'material-table'
import { ListQuery } from '@sheeted/core/build/web/Shared.type'

export const convertQuery = (query: MQuery<any>): ListQuery => {
  const {
    // filters,
    orderBy,
    orderDirection,
    page,
    pageSize,
    search,
  } = query
  const sort = orderBy
    ? [
        {
          field: orderBy.field as string,
          order: orderDirection,
        },
      ]
    : []
  return {
    page: page + 1,
    limit: pageSize,
    search,
    sort,
  }
}
