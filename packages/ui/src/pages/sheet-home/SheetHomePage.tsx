import React, { FC, useEffect } from 'react'
import { IAM_USER_SHEET } from '@sheeted/core'
import { useHistory } from 'react-router-dom'

import {
  useSheetContext,
  useSheetContextSyncOnMount,
} from '../../hooks/SheetContextHook'
import { PageLayout } from '../../layout/PageLayout'
import { useUIPaths } from '../../hooks/UIPathHook'

export const SheetContextSyncAction: FC = () => {
  useSheetContextSyncOnMount()
  return null
}

export const SheetHomePage: FC = () => {
  const {
    sheets: { sheets },
  } = useSheetContext()
  const history = useHistory()
  const uiPaths = useUIPaths()
  useEffect(() => {
    const defaultSheet = sheets
      .filter(({ sheetName }) => sheetName !== IAM_USER_SHEET)
      .shift()
    if (defaultSheet) {
      history.push(uiPaths.sheetPath({ sheetName: defaultSheet.sheetName }))
    }
  }, [sheets, history, uiPaths])
  return (
    <PageLayout>
      <div></div>
    </PageLayout>
  )
}
