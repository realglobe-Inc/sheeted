import React, { FC, useEffect, useRef } from 'react'
import { SheetOverview } from '@sheeted/core/build/web/Shared.type'
import MaterialTable, { Options as TableOptions } from 'material-table'
import { IAMUserEntity } from '@sheeted/core'
import { HttpStatuses } from '@sheeted/core/build/web/Consts'

import { PageLayout } from '../../layout/PageLayout'
import { useCurrentSheet } from '../../hooks/CurrentSheetHook'
import { useUserContext } from '../../hooks/UserContextHook'
import {
  useSheetInfoContext,
  SheetInfoContextProvider,
} from '../../hooks/SheetInfoContextHook'
import { useToggle } from '../../hooks/utils/ToggleHook'

import { InputErrorContextProvider } from './hooks/InputErrorContextHook'
import { Toolbar } from './components/Toolbar'
import { TableHeader } from './components/TableHeader'
import { EditRow } from './components/EditRow'
import { SheetNotFound } from './components/SheetNotFound'
import { tableIcons } from './assets/icons'
import { useQueryEntities } from './hooks/QueryEntitiesHook'
import { useEditEntity } from './hooks/EditEntityHook'
import { EntityDialogContextProvider } from './hooks/EntityDialogContextHook'
import { EntitySelectDialog } from './components/EntitySelectDialog'
import { SheetContainer } from './components/SheetContainer'
import { useTableLocalization } from './hooks/TableLocalizationHook'
import { ActionContextProvider } from './hooks/ActionContextHook'
import { ActionDialog } from './components/ActionDialog'
import { useTableActions } from './hooks/TableActionsHook'
import { useRefreshTable } from './hooks/RefreshTableHook'
import { useDetailCallback } from './hooks/DetailCallbackHook'
import { useMColumns } from './hooks/MColumnsHook'
import { EditingContextProvider } from './hooks/EditingContextHook'

const tableOptions: TableOptions = {
  addRowPosition: 'first',
  pageSize: 10,
  pageSizeOptions: [10, 20, 30],
  padding: 'dense',
  debounceInterval: 500,
  selection: true,
  hideFilterIcons: true,
}

export const SheetPage: FC = () => {
  const { user } = useUserContext()
  const { ready, sheet } = useCurrentSheet()
  return (
    <SheetInfoContextProvider>
      <ActionContextProvider>
        <InputErrorContextProvider>
          <EntityDialogContextProvider>
            <EditingContextProvider>
              <PageLayout>
                {ready && sheet && user && (
                  <SheetPageTable user={user} sheet={sheet} />
                )}
                {ready && !sheet && <SheetNotFound />}
                <EntitySelectDialog />
                <ActionDialog />
              </PageLayout>
            </EditingContextProvider>
          </EntityDialogContextProvider>
        </InputErrorContextProvider>
      </ActionContextProvider>
    </SheetInfoContextProvider>
  )
}

type TableRef = {
  onChangePage: (event: any, page: number) => void
  onQueryChange: () => void
}

const SheetPageTable: FC<{ sheet: SheetOverview; user: IAMUserEntity }> = ({
  sheet,
}) => {
  const { sheetName } = sheet
  const tableRef = useRef<TableRef>()
  const { result: info, trigger, error } = useSheetInfoContext()
  const queryEntities = useQueryEntities(sheetName)
  const { isEditable, onRowUpdate, onRowAdd } = useEditEntity(info)
  const refreshTable = useRefreshTable(tableRef.current)
  const [filtering, toggleFiltering] = useToggle()
  const { actions, onSelectionChange } = useTableActions(
    info,
    refreshTable,
    toggleFiltering,
  )
  const columns = useMColumns(info)
  useEffect(() => {
    trigger(sheetName)
  }, [sheetName, trigger])
  const forbidden = error?.status === HttpStatuses.FORBIDDEN
  const localization = useTableLocalization({ forbidden })
  const goToDetail = useDetailCallback(sheetName)
  const onRowClick = info?.enableDetail ? goToDetail : undefined
  return (
    <MaterialTable
      title={sheet.title}
      tableRef={tableRef}
      columns={columns}
      data={queryEntities}
      editable={{
        isEditable,
        onRowAdd,
        onRowUpdate,
      }}
      actions={actions}
      onRowClick={onRowClick}
      onSelectionChange={onSelectionChange}
      localization={localization}
      components={{
        Toolbar,
        EditRow,
        Container: SheetContainer,
        Header: TableHeader,
      }}
      icons={tableIcons}
      options={{
        ...tableOptions,
        filtering,
      }}
    />
  )
}
