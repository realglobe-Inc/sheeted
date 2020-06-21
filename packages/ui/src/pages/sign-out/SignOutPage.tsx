import React, { FC } from 'react'
import { useSnackbar } from 'notistack'
import { useHistory } from 'react-router-dom'

import { useMountEffect } from '../../hooks/utils/MountEffectHook'
import { useLocale } from '../../hooks/LocaleContextHook'
import { useUserContext } from '../../hooks/UserContextHook'
import { useUIPaths } from '../../hooks/UIPathHook'

export const SignOutPage: FC = () => {
  // TODO: sign out logic
  const l = useLocale()
  const uiPaths = useUIPaths()
  const { enqueueSnackbar } = useSnackbar()
  const { reset: resetUser } = useUserContext()
  const history = useHistory()
  useMountEffect(() => {
    resetUser()
    enqueueSnackbar(l.snackbars.signOutComplete)
    history.push(uiPaths.signInPath())
  })
  return <div></div>
}
