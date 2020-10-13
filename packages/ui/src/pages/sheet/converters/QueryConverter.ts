import { Query as MQuery } from 'material-table'
import { ListQuery } from '@sheeted/core/build/web/Shared.type'
import { ENTITY_META_FIELD } from '@sheeted/core/build/web/Consts'

import { Entity } from '../../../types/Entity.type'

const isEntity = (value: unknown): value is Entity =>
  typeof value === 'object' &&
  value != null &&
  Object.prototype.hasOwnProperty.call(value, ENTITY_META_FIELD) // $meta で雑に判断

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
      .map((f) => [f.column.field, f.value] as [string, any])
      .map(([key, value]) => [key, isEntity(value) ? value.id : value]), // API の仕様により entity に対しては id でフィルタする
  )
  return {
    page: page + 1,
    limit: pageSize,
    search,
    sort,
    filter,
  }
}
