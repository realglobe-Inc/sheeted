import React, { FC } from 'react'
import { MTableToolbar } from 'material-table'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

import { useMenuContext } from '../../../hooks/MenuContextHook'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'start',
    },
    menuButton: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: 64,
    },
    hide: {
      width: 0,
    },
    toolbar: {
      flexGrow: 1,
    },
  }),
)

export const Toolbar: FC<{ disabled?: boolean } & Record<string, any>> = (
  props,
) => {
  const classes = useStyles()
  const { isOpen, openMenu } = useMenuContext()
  return (
    <div className={classes.root}>
      <div className={clsx(classes.menuButton, isOpen && classes.hide)}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={openMenu}
          edge="start"
        >
          <MenuIcon />
        </IconButton>
      </div>
      <div className={classes.toolbar}>
        {!props.disabled && <MTableToolbar {...props} search />}
      </div>
    </div>
  )
}
