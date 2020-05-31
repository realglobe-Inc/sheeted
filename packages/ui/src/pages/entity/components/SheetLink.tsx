import React, { FC } from 'react'

import { Link } from '../../../components/Link'
import { useUIPaths } from '../../../hooks/UIPathHook'

export const SheetLink: FC<{ title: string; sheetName: string }> = ({
  sheetName,
  title,
}) => {
  const uiPaths = useUIPaths()
  const path = uiPaths.sheetPath({ sheetName })
  return <Link to={path}>{title}</Link>
}
