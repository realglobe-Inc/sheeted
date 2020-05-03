import React, { FC, useEffect } from 'react'
import { SheetOverview } from '@sheeted/core/build/web/Shared.type'
import MaterialTable, { Options as TableOptions } from 'material-table'
import { IAMUserEntity } from '@sheeted/core'
import { HttpStatuses } from '@sheeted/core/build/web/Consts'

import { PageLayout } from '../../layout/PageLayout'
import { useCurrentSheet } from '../../hooks/CurrentSheetHook'
import { useUserContext } from '../../hooks/UserContextHook'

import { InputErrorContextProvider } from './hooks/InputErrorContextHook'
import {
  useSheetInfoContext,
  SheetInfoContextProvider,
} from './hooks/SheetInfoContextHook'
import { Toolbar } from './components/Toolbar'
import { TableHeader } from './components/TableHeader'
import { EditRow } from './components/EditRow'
import { tableIcons } from './assets/icons'
import { convertColumn } from './converters/ColumnConverter'
import { useQueryEntities } from './hooks/QueryEntitiesHook'
import { useSheetReady } from './hooks/SheetReadyHook'
import { useEditEntity } from './hooks/EditEntityHook'
import { EntityDialogContextProvider } from './hooks/EntityDialogContextHook'
import { EntitySelectDialog } from './components/EntitySelectDialog'
import { SheetContainer } from './components/SheetContainer'
import { useTableLocalization } from './hooks/TableLocalizationHook'
import { ActionContextProvider } from './hooks/ActionContextHook'
import { ActionDialog } from './components/ActionDialog'
import { useTableActions } from './hooks/TableActionsHook'

const tableOptions: TableOptions = {
  pageSize: 10,
  pageSizeOptions: [10, 20, 30],
  padding: 'dense',
  debounceInterval: 500,
  selection: true,
}

export const SheetPage: FC = () => {
  const { user } = useUserContext()
  const sheet = useCurrentSheet()
  const ready = useSheetReady(sheet)
  return (
    <SheetInfoContextProvider>
      <ActionContextProvider>
        <InputErrorContextProvider>
          <EntityDialogContextProvider>
            <PageLayout>
              {sheet && user && ready ? (
                <SheetPageTable user={user} sheet={sheet} />
              ) : null}
              <EntitySelectDialog />
              <ActionDialog />
            </PageLayout>
          </EntityDialogContextProvider>
        </InputErrorContextProvider>
      </ActionContextProvider>
    </SheetInfoContextProvider>
  )
}

const SheetPageTable: FC<{ sheet: SheetOverview; user: IAMUserEntity }> = ({
  sheet,
}) => {
  const { result: info, trigger, error } = useSheetInfoContext()
  const queryEntities = useQueryEntities(sheet.sheetName)
  const { isEditable, onRowUpdate, onRowAdd } = useEditEntity(info)
  const { actions, onSelectionChange } = useTableActions(info)
  useEffect(() => {
    trigger(sheet.sheetName)
  }, [sheet.sheetName, trigger])
  const columns = info ? info.columns.map(convertColumn).filter(Boolean) : []
  const forbidden = error?.status === HttpStatuses.FORBIDDEN
  const localization = useTableLocalization({ forbidden })
  return (
    <MaterialTable
      title={sheet.title}
      columns={columns}
      data={queryEntities}
      editable={{
        isEditable,
        onRowAdd,
        onRowUpdate,
      }}
      actions={actions}
      onSelectionChange={onSelectionChange}
      localization={localization}
      components={{
        Toolbar,
        EditRow,
        Container: SheetContainer,
        Header: TableHeader,
      }}
      icons={tableIcons}
      options={tableOptions}
    />
  )
}
