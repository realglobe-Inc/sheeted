import React, { useMemo, FC } from 'react'
import { SheetInfo } from '@sheeted/core/build/web/Shared.type'
import { Column } from 'material-table'
import LaunchIcon from '@material-ui/icons/Launch'
import IconButton from '@material-ui/core/IconButton'

import { convertColumn } from '../converters/ColumnConverter'
import { Entity } from '../../../types/Entity.type'
import { InternalLink } from '../../../components/InternalLink'
import { useUIPaths } from '../../../hooks/UIPathHook'
import { useLocale } from '../../../hooks/LocaleContextHook'

const DetailLinkHoc = (info: SheetInfo): FC<Entity> => {
  return function DetailLink({ id }) {
    const { entityDetailPath } = useUIPaths()
    const path = entityDetailPath({ sheetName: info.sheetName, entityId: id })
    return (
      <IconButton
        component={InternalLink}
        to={path}
        size="small"
        color="primary"
      >
        <LaunchIcon />
      </IconButton>
    )
  }
}

const detailColumn = (title: string, info: SheetInfo): Column<Entity> => ({
  title,
  width: '1em',
  headerStyle: { paddingLeft: '4px', paddingRight: 0 },
  cellStyle: { paddingLeft: '4px', paddingRight: 0 },
  sorting: false,
  render: DetailLinkHoc(info),
})

export const useMColumns = (info: SheetInfo | null): Column<Entity>[] => {
  const l = useLocale()
  const columns = useMemo(() => {
    if (!info) {
      return []
    }
    return (info.enableDetail
      ? [detailColumn(l.columns.detail, info)]
      : []
    ).concat(
      info.columns
        .filter((column) => !column.detailPageOnly)
        .map(convertColumn)
        .filter(Boolean),
    )
  }, [info, l.columns.detail])
  return columns
}
