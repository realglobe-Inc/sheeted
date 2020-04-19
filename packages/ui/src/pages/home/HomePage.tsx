import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'

import { useMountEffect } from '../../hooks/utils/MountEffectHook'
import { useUIPaths } from '../../hooks/UIPathHook'

export const HomePage: FC = () => {
  const history = useHistory()
  const uiPaths = useUIPaths()
  useMountEffect(() => {
    history.push(uiPaths.signInPath())
  })
  return <div></div>
}
