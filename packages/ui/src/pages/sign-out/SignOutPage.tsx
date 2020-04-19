import React, { FC } from 'react'
import { useSnackbar } from 'notistack'
import { useHistory } from 'react-router-dom'

import { useMountEffect } from '../../hooks/utils/MountEffectHook'
import { useLocalStorage } from '../../hooks/LocalStorageHook'
import { useLocale } from '../../hooks/LocaleContextHook'
import { useUserContext } from '../../hooks/UserContextHook'
import { useApi } from '../../hooks/ApiHook'
import { useUIPaths } from '../../hooks/UIPathHook'

export const SignOutPage: FC = () => {
  const storage = useLocalStorage()
  const l = useLocale()
  const uiPaths = useUIPaths()
  const api = useApi()
  const { enqueueSnackbar } = useSnackbar()
  const { reset: resetUser } = useUserContext()
  const history = useHistory()
  useMountEffect(() => {
    storage.removeToken()
    api.token = ''
    resetUser()
    enqueueSnackbar(l.snackbars.signOutComplete)
    history.push(uiPaths.signInPath())
  })
  return <div></div>
}
