import { SortQuery, Sheet } from '@sheeted/core'
import { ListQuery } from '@sheeted/core/build/web/Shared.type'

export class SortBuilder {
  constructor(private sheet: Sheet) {}

  build(sort: ListQuery['sort']): SortQuery<any>[] {
    const { View } = this.sheet
    if (sort.length === 0 && View.defaultSort) {
      return [View.defaultSort]
    } else {
      return this.filterValidSort(sort).concat({
        field: 'updatedAt',
        order: 'desc',
      })
    }
  }

  private filterValidSort(sort: ListQuery['sort']) {
    const fields = Object.keys(this.sheet.Schema).concat([
      'createdAt',
      'updatedAt',
    ])
    const validSort = sort.filter(
      ({ field, order }) =>
        fields.includes(field) && ['asc', 'desc'].includes(order),
    )
    return validSort
  }
}
