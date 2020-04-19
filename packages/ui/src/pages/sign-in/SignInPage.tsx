import React, { FC } from 'react'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

import { useApi } from '../../hooks/ApiHook'
import { useLocale } from '../../hooks/LocaleContextHook'

const useStyles = makeStyles({
  root: {
    paddingTop: 150,
    textAlign: 'center',
  },
})

export const SignInPage: FC = () => {
  const l = useLocale()
  const classes = useStyles()
  const api = useApi()
  const signInUrl = api.getSignInUrl()
  return (
    <div className={classes.root}>
      <Button href={signInUrl} variant="contained" color="primary" size="large">
        {l.buttons.signIn}
      </Button>
    </div>
  )
}
