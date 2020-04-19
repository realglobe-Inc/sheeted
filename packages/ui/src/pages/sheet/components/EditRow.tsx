import React, { FC } from 'react'
import { MTableEditRow } from 'material-table'

import { useUnmountEffect } from '../../../hooks/utils/MountEffectHook'
import { useInputErrorContext } from '../hooks/InputErrorContextHook'

export const EditRow: FC<any> = (props) => {
  // I'm waiting for being implemented onRowAddCancelled / onRowUpdateCancelled in material-table
  const { reset } = useInputErrorContext()
  useUnmountEffect(reset)
  return <MTableEditRow {...props} />
}
