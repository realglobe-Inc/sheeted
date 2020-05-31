import React, { FC } from 'react'
import { SheetInfo } from '@sheeted/core/build/web/Shared.type'
import { makeStyles } from '@material-ui/core/styles'

import { SheetLink } from './SheetLink'

const useStyle = makeStyles(() => ({
  header: {
    padding: '8px',
    marginBottom: '12px',
  },
}))

export const EntityDetailHeader: FC<{ sheet: SheetInfo | null }> = ({
  sheet,
}) => {
  const classes = useStyle()
  const { title, sheetName } = sheet || {}
  return (
    <div className={classes.header}>
      {title && sheetName && <SheetLink title={title} sheetName={sheetName} />}
    </div>
  )
}
