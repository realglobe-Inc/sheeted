import React from 'react'
import { Column, EditCellColumnDef } from 'material-table'
import { Column as SColumn } from '@sheeted/core/build/web/Shared.type'

import { Entity } from '../../../types/Entity.type'

import { EditCellFor } from './EditCell'

type FilterCell = (props: {
  columnDef: Column<Entity> & EditCellColumnDef
  onFilterChanged: (rowId: string, value: any) => void
}) => React.ReactElement

export const FilterCellFor = (column: SColumn): FilterCell => {
  const EditCell = EditCellFor(column)
  return function FilterCell({ columnDef, onFilterChanged }) {
    return (
      <EditCell
        rowData={null as any}
        onRowDataChange={() => null}
        columnDef={columnDef}
        value={columnDef.tableData.filterValue}
        onChange={(value) =>
          onFilterChanged(String(columnDef.tableData.id), value)
        }
        error={false}
      />
    )
  }
}
