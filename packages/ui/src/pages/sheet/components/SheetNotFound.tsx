import React, { FC } from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { useLocale } from '../../../hooks/LocaleContextHook'

import { Toolbar } from './Toolbar'

const useStyles = makeStyles((theme) => ({
  body: {
    width: '100%',
    height: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.grey[500],
  },
}))

export const SheetNotFound: FC = () => {
  const l = useLocale()
  const classes = useStyles()
  return (
    <div>
      <Toolbar disabled />
      <div className={classes.body}>
        <Typography variant="h4">{l.titles.sheetNotFound}</Typography>
      </div>
    </div>
  )
}
