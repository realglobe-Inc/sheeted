import React, { FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { PageLayout } from '../../layout/PageLayout'
import { Loader } from '../../components/Loader'
import {
  SheetInfoContextProvider,
  useSheetInfoContext,
} from '../../hooks/SheetInfoContextHook'

import { useEntity } from './hooks/EntityHook'
import { EntityDetailBody } from './components/EntityDetailBody'
import { EntityDetailHeader } from './components/EntityDetailHeader'

export const EntityDetailPage: FC = () => {
  return (
    <SheetInfoContextProvider>
      <EntityDetailPageMain />
    </SheetInfoContextProvider>
  )
}

export const EntityDetailPageMain: FC = () => {
  const { sheetName, entityId } = useParams<{
    sheetName: string
    entityId: string
  }>()
  const { result: sheet, trigger, error: sheetError } = useSheetInfoContext()
  const { busy, entity, error } = useEntity({ sheetName, entityId })
  useEffect(() => {
    trigger(sheetName)
  }, [sheetName, trigger])
  const columns = sheet?.columns || []
  return (
    <PageLayout>
      <Loader loading={busy} />
      <EntityDetailHeader sheet={sheet} />
      <EntityDetailBody entity={entity} columns={columns} />
    </PageLayout>
  )
}
