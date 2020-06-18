import React, { FC } from 'react'
import { MTableHeader } from 'material-table'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  header: {
    wordBreak: 'keep-all',
    background: theme.palette.primary.light,
    fontWeight: 600,
  },
}))

export const TableHeader: FC<any> = (props: any) => {
  const classes = useStyles()
  return <MTableHeader classes={classes} {...props} />
}
