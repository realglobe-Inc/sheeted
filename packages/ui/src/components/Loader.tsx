import React, { FC } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles, fade } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  loader: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: fade(theme.palette.background.paper, 0.7),
    zIndex: 1,
  },
}))

export const Loader: FC<{ loading: boolean }> = ({ loading }) => {
  const classes = useStyles()
  if (loading) {
    return null
  }
  return (
    <div className={classes.loader}>
      <CircularProgress />
    </div>
  )
}
