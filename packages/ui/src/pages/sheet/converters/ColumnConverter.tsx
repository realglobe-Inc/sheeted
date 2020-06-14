import { Column as SColumn } from '@sheeted/core/build/web/Shared.type'
import { Column as MColumn } from 'material-table'

import { EditCellFor } from '../components/EditCell'
import { Entity } from '../../../types/Entity.type'
import { EntityFieldValueHoc } from '../../../hoc/EntityFieldValueHoc'

const lookupLabel = (column: SColumn) =>
  column.custom.enum?.labels
    ? Object.fromEntries(
        column.custom.enum.labels.map(({ label, value }) => [value, label]),
      )
    : undefined

export const convertColumn = (column: SColumn): MColumn<Entity> => {
  const editComponent = EditCellFor(column)
  const { readonly, readonlyOnCreate, readonlyOnUpdate } = column
  const editable = readonly
    ? 'never'
    : readonlyOnCreate && readonlyOnUpdate
    ? 'never'
    : readonlyOnCreate
    ? 'onUpdate'
    : readonlyOnUpdate
    ? 'onAdd'
    : 'always'
  const render = (entity: any) => EntityFieldValueHoc(column)({ entity })
  const lookup = lookupLabel(column)
  return {
    field: column.field,
    title: column.title,
    editable,
    editComponent,
    render,
    lookup,
  }
}
