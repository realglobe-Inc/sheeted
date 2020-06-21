import { SheetInfo } from '@sheeted/core/build/web/Shared.type'
import { Column } from 'material-table'
import { useMemo } from 'react'

import { convertColumn } from '../converters/ColumnConverter'
import { Entity } from '../../../types/Entity.type'

export const useMColumns = (info: SheetInfo | null): Column<Entity>[] => {
  const columns = useMemo(
    () => (info ? info.columns.map(convertColumn).filter(Boolean) : []),
    [info],
  )
  return columns
}
