import { Query as MQuery } from 'material-table'
import { ListQuery } from '@sheeted/core/build/web/Shared.type'

export const convertQuery = (query: MQuery<any>): ListQuery => {
  const { filters, orderBy, orderDirection, page, pageSize, search } = query
  const sort = orderBy
    ? [
        {
          field: orderBy.field as string,
          order: orderDirection,
        },
      ]
    : []
  const filter = Object.fromEntries(
    filters
      .filter((f) => Boolean(f.column.field))
      .map((f) => [f.column.field, f.value]),
  )
  return {
    page: page + 1,
    limit: pageSize,
    search,
    sort,
    filter,
  }
}
