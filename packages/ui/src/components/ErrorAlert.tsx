import React, { FC } from 'react'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import { useLocale } from '../hooks/LocaleContextHook'

const useStyles = makeStyles(() =>
  createStyles({
    alert: {
      padding: '24px 16px',
    },
  }),
)

export const ErrorAlert: FC<{ message: string }> = ({ message }) => {
  const classes = useStyles()
  const l = useLocale()
  return (
    <Alert severity="error" className={classes.alert}>
      <AlertTitle>{l.titles.error}</AlertTitle>
      {message}
    </Alert>
  )
}
