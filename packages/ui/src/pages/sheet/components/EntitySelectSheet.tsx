import React, { FC } from 'react'
import MaterialTable, { Options as TableOptions } from 'material-table'
import { SheetOverview } from '@sheeted/core/build/web/Shared.type'

import { useFetchSheetInfo } from '../hooks/FetchSheetInfoHook'
import { useQueryEntities } from '../hooks/QueryEntitiesHook'
import { convertColumn } from '../converters/ColumnConverter'
import { tableIcons } from '../assets/icons'
import { useTableLocalization } from '../hooks/TableLocalizationHook'

import { SheetContainer } from './SheetContainer'

const tableOptions: TableOptions<any> = {
  pageSize: 10,
  paging: false,
  padding: 'dense',
  debounceInterval: 500,
}

export const EntitySelectSheet: FC<{
  sheet: SheetOverview
  onSelect: (entity: any) => void
}> = ({ sheet, onSelect }) => {
  const { result: info } = useFetchSheetInfo(sheet.sheetName)
  const queryEntities = useQueryEntities(sheet.sheetName)
  const tableLocalization = useTableLocalization({ forbidden: false })
  const columns = info ? info.columns.map(convertColumn).filter(Boolean) : []
  return (
    <MaterialTable
      icons={tableIcons}
      title={sheet.title}
      columns={columns}
      data={queryEntities}
      options={tableOptions}
      onRowClick={(_event, entity) => {
        onSelect(entity)
      }}
      components={{
        Container: SheetContainer,
      }}
      localization={tableLocalization}
    />
  )
}
