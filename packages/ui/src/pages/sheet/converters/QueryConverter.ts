import { Query as MQuery } from 'material-table'
import { ListQuery } from '@sheeted/core/build/web/Shared.type'

const orderPrefix = (direction: 'asc' | 'desc') =>
  direction === 'asc' ? '' : '-'

export const convertQuery = (query: MQuery<any>): ListQuery => {
  const {
    // filters,
    orderBy,
    orderDirection,
    page,
    pageSize,
    search,
  } = query
  const sort: string[] = orderBy
    ? [orderPrefix(orderDirection) + (orderBy.field as string)]
    : []
  return {
    page: page + 1,
    limit: pageSize,
    search,
    sort,
  }
}
