import React, { FC } from 'react'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

import { Sheeted } from '../../Sheeted'
import { useApi } from '../../hooks/ApiHook'
import { useLocale } from '../../hooks/LocaleContextHook'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    height: '80vh',
  },
  title: {
    marginBottom: '0.5em',
  },
})

export const SignInPage: FC = () => {
  const l = useLocale()
  const classes = useStyles()
  const api = useApi()
  const signInUrl = api.apiPaths.signInPath()
  return (
    <div className={classes.root}>
      <div>
        <Typography
          variant="h3"
          color="textSecondary"
          className={classes.title}
        >
          {Sheeted.appTitle}
        </Typography>
        <Button
          href={signInUrl}
          variant="contained"
          color="primary"
          size="large"
          endIcon={<ExitToAppIcon />}
        >
          {l.buttons.signIn}
        </Button>
      </div>
    </div>
  )
}
