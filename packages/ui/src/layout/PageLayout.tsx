import React, { FC } from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import { DrawerMenu } from './DrawerMenu'
import { Main } from './Main'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
    },
  }),
)

export const PageLayout: FC = ({ children }) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <DrawerMenu />
      <Main>{children}</Main>
    </div>
  )
}
