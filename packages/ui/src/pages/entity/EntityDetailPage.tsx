import React, { FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

import { PageLayout } from '../../layout/PageLayout'
import { Loader } from '../../components/Loader'
import {
  SheetInfoContextProvider,
  useSheetInfoContext,
} from '../../hooks/SheetInfoContextHook'
import { ErrorAlert } from '../../components/ErrorAlert'

import { useEntity } from './hooks/EntityHook'
import { EntityDetailTable } from './components/EntityDetailTable'
import { EntityDetailHeader } from './components/EntityDetailHeader'

export const EntityDetailPage: FC = () => {
  return (
    <SheetInfoContextProvider>
      <EntityDetailPageMain />
    </SheetInfoContextProvider>
  )
}

const useStyle = makeStyles(() => ({
  table: {
    display: 'flex',
    justifyContent: 'center',
  },
}))

export const EntityDetailPageMain: FC = () => {
  const { sheetName, entityId } = useParams<{
    sheetName: string
    entityId: string
  }>()
  const classes = useStyle()
  const { result: sheet, trigger, error: sheetError } = useSheetInfoContext()
  const { busy, entity, error: entityError } = useEntity({
    sheetName,
    entityId,
  })
  useEffect(() => {
    trigger(sheetName)
  }, [sheetName, trigger])
  const columns = sheet?.columns || []
  return (
    <PageLayout>
      <Loader loading={busy} />
      <EntityDetailHeader sheet={sheet} />
      {sheetError && <ErrorAlert message={sheetError.message} />}
      {entityError && <ErrorAlert message={entityError.message} />}
      <div className={classes.table}>
        <EntityDetailTable entity={entity} columns={columns} />
      </div>
    </PageLayout>
  )
}
