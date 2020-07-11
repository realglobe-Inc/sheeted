import React, { FC } from 'react'
import { MTableEditRow } from 'material-table'
import { Prompt } from 'react-router-dom'

import {
  useUnmountEffect,
  useMountEffect,
} from '../../../hooks/utils/MountEffectHook'
import { useInputErrorContext } from '../hooks/InputErrorContextHook'
import { useLocale } from '../../../hooks/LocaleContextHook'
import { useEditingContext } from '../hooks/EditingContextHook'

const alertBeforeUnload = (e: BeforeUnloadEvent) => {
  e.preventDefault()
  e.returnValue = ''
}

export const EditRow: FC<any> = (props) => {
  const l = useLocale()
  const { reset } = useInputErrorContext()
  const { setEditing } = useEditingContext()
  useUnmountEffect(() => {
    reset()
    setEditing(false)
    window.removeEventListener('beforeunload', alertBeforeUnload)
  })
  useMountEffect(() => {
    setEditing(true)
    window.addEventListener('beforeunload', alertBeforeUnload)
  })
  return (
    <>
      <Prompt when={true} message={l.prompts.beforeLeaveOnEdit} />
      <MTableEditRow {...props} />
    </>
  )
}
