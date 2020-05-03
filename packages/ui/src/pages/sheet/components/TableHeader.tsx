import React, { FC } from 'react'
import { MTableHeader } from 'material-table'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  header: {
    wordBreak: 'keep-all',
  },
}))

export const TableHeader: FC<any> = (props: any) => {
  const classes = useStyles()
  return <MTableHeader classes={classes} {...props} />
}
