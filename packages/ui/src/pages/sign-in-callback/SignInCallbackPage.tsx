import React, { FC } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import qs from 'qs'
import { useSnackbar } from 'notistack'

import { useMountEffect } from '../../hooks/utils/MountEffectHook'
import { useLocalStorage } from '../../hooks/LocalStorageHook'
import { useLocale } from '../../hooks/LocaleContextHook'
import { useUIPaths } from '../../hooks/UIPathHook'

export const SignInCallbackPage: FC = () => {
  const location = useLocation()
  const history = useHistory()
  const storage = useLocalStorage()
  const l = useLocale()
  const uiPaths = useUIPaths()
  const { enqueueSnackbar } = useSnackbar()
  useMountEffect(() => {
    const { token } = qs.parse(location.search.slice(1)) as {
      token: string
    }
    if (!token) {
      console.error('token is required in query string.')
      history.replace(uiPaths.signInPath())
      enqueueSnackbar(l.snackbars.signInFailed, {
        variant: 'error',
      })
      return
    }
    storage.setToken(token)
    enqueueSnackbar(l.snackbars.signInComplete, {
      variant: 'success',
    })
    history.push(uiPaths.sheetHomePath())
  })
  return <></>
}
