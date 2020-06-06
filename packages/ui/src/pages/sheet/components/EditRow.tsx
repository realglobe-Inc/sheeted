import React, { FC } from 'react'
import { MTableEditRow } from 'material-table'

import {
  useUnmountEffect,
  useMountEffect,
} from '../../../hooks/utils/MountEffectHook'
import { useInputErrorContext } from '../hooks/InputErrorContextHook'

const alertBeforeUnload = (e: BeforeUnloadEvent) => {
  e.preventDefault()
  e.returnValue = ''
}

export const EditRow: FC<any> = (props) => {
  // I'm waiting for being implemented onRowAddCancelled / onRowUpdateCancelled in material-table
  const { reset } = useInputErrorContext()
  useUnmountEffect(() => {
    reset()
    window.removeEventListener('beforeunload', alertBeforeUnload)
  })
  useMountEffect(() => {
    window.addEventListener('beforeunload', alertBeforeUnload)
  })
  return <MTableEditRow {...props} />
}
