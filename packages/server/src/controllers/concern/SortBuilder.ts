import { SortQuery, Sheet, SortOrder } from '@sheeted/core'
import { ListQuery } from '@sheeted/core/build/web/Shared.type'

export const SortOrders = {
  DESC: 'desc',
  ASC: 'asc',
} as const

const SortFields = {
  UPDATED_AT: 'updatedAt',
  CREATED_AT: 'createdAt',
} as const

const SortByUpdatedAt = {
  field: SortFields.UPDATED_AT,
  order: SortOrders.DESC,
}

export class SortBuilder {
  defaultSort?: SortQuery<any>
  fields: string[]

  constructor(sheet: Sheet) {
    const { Schema, View } = sheet
    this.defaultSort = View.defaultSort
    this.fields = Object.keys(Schema).concat([
      SortFields.CREATED_AT,
      SortFields.UPDATED_AT,
    ])
  }

  /**
   * Build sort query.
   * Sort query will be sort + defaultSort + updatedAt(desc).
   * When the query has duplicated fields, the sort argument overrides.
   */
  build(sort: ListQuery['sort']): SortQuery<any>[] {
    const { defaultSort } = this
    return sort
      .concat([defaultSort!, SortByUpdatedAt])
      .filter(Boolean)
      .filter((query) => this.isValid(query))
      .filter(
        (query, index, arr) =>
          arr.findIndex(({ field }) => field === query.field) === index,
      )
  }

  private isValid({
    field,
    order,
  }: {
    field: string
    order: SortOrder
  }): boolean {
    return (
      this.fields.includes(field) &&
      [SortOrders.ASC, SortOrders.DESC].includes(order)
    )
  }
}
