import React, { FC } from 'react'
import { MTableEditRow } from 'material-table'
import { Prompt } from 'react-router-dom'

import {
  useUnmountEffect,
  useMountEffect,
} from '../../../hooks/utils/MountEffectHook'
import { useInputErrorContext } from '../hooks/InputErrorContextHook'
import { useLocale } from '../../../hooks/LocaleContextHook'

const alertBeforeUnload = (e: BeforeUnloadEvent) => {
  e.preventDefault()
  e.returnValue = ''
}

export const EditRow: FC<any> = (props) => {
  const l = useLocale()
  // I'm waiting for being implemented onRowAddCancelled / onRowUpdateCancelled in material-table
  const { reset } = useInputErrorContext()
  useUnmountEffect(() => {
    reset()
    window.removeEventListener('beforeunload', alertBeforeUnload)
  })
  useMountEffect(() => {
    window.addEventListener('beforeunload', alertBeforeUnload)
  })
  return (
    <>
      <Prompt when={true} message={l.prompts.beforeLeaveOnEdit} />
      <MTableEditRow {...props} />
    </>
  )
}
