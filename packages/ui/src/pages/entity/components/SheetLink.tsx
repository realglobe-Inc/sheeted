import React, { FC } from 'react'
import Button from '@material-ui/core/Button'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'

import { Link } from '../../../components/Link'
import { useUIPaths } from '../../../hooks/UIPathHook'

export const SheetLink: FC<{ title: string; sheetName: string }> = ({
  sheetName,
  title,
}) => {
  const uiPaths = useUIPaths()
  const path = uiPaths.sheetPath({ sheetName })
  return (
    <Button
      component={Link}
      to={path}
      startIcon={<ArrowBackIosIcon fontSize="small" />}
      color="primary"
    >
      {title}
    </Button>
  )
}
