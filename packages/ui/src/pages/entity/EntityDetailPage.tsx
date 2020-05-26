import React, { FC } from 'react'
import { useParams } from 'react-router-dom'

import { PageLayout } from '../../layout/PageLayout'

import { useEntity } from './hooks/EntityHook'

export const EntityDetailPage: FC = () => {
  const { sheetName, entityId } = useParams<{
    sheetName: string
    entityId: string
  }>()
  const { busy, ready, entity, error } = useEntity({ sheetName, entityId })
  return (
    <PageLayout>
      <div>{JSON.stringify({ busy, ready, entity, error })}</div>
    </PageLayout>
  )
}
