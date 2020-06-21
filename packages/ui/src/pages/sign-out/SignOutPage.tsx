import React, { FC } from 'react'
import { useSnackbar } from 'notistack'
import { useHistory } from 'react-router-dom'

import { useMountEffect } from '../../hooks/utils/MountEffectHook'
import { useLocale } from '../../hooks/LocaleContextHook'
import { useUserContext } from '../../hooks/UserContextHook'
import { useUIPaths } from '../../hooks/UIPathHook'
import { useApi } from '../../hooks/ApiHook'

export const SignOutPage: FC = () => {
  const l = useLocale()
  const api = useApi()
  const uiPaths = useUIPaths()
  const { enqueueSnackbar } = useSnackbar()
  const { reset: resetUser } = useUserContext()
  const history = useHistory()
  useMountEffect(() => {
    resetUser()
    void api
      .signOut()
      .then(() => {
        enqueueSnackbar(l.snackbars.signOutComplete)
      })
      .finally(() => {
        history.push(uiPaths.signInPath())
      })
  })
  return <div></div>
}
