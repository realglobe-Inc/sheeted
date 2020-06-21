import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack'

import { useMountEffect } from '../../hooks/utils/MountEffectHook'
import { useLocale } from '../../hooks/LocaleContextHook'
import { useUIPaths } from '../../hooks/UIPathHook'

export const SignInCallbackPage: FC = () => {
  const history = useHistory()
  const l = useLocale()
  const uiPaths = useUIPaths()
  const { enqueueSnackbar } = useSnackbar()
  useMountEffect(() => {
    enqueueSnackbar(l.snackbars.signInComplete, {
      variant: 'success',
    })
    history.push(uiPaths.sheetHomePath())
  })
  return <></>
}
