import React, { FC } from 'react'
import clsx from 'clsx'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import { DRAWER_WIDTH } from '../Constants'
import { useMenuContext } from '../hooks/MenuContextHook'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -DRAWER_WIDTH,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  }),
)

export const Main: FC = ({ children }) => {
  const classes = useStyles()
  const { isOpen } = useMenuContext()

  return (
    <main
      className={clsx(classes.content, {
        [classes.contentShift]: isOpen,
      })}
    >
      {children}
    </main>
  )
}
