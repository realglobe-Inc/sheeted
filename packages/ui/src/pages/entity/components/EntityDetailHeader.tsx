import React, { FC } from 'react'
import { SheetInfo } from '@sheeted/core/build/web/Shared.type'

import { SheetLink } from './SheetLink'

export const EntityDetailHeader: FC<{ sheet: SheetInfo | null }> = ({
  sheet,
}) => {
  const { title, sheetName } = sheet || {}
  return (
    <div>
      {title && sheetName && <SheetLink title={title} sheetName={sheetName} />}
    </div>
  )
}
