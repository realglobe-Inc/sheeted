import { useMemo, useState } from 'react'
import { Action as TableAction } from 'material-table'
import { SheetInfo } from '@sheeted/core/build/web/Shared.type'
import { useSnackbar } from 'notistack'
import { ENTITY_META_FIELD } from '@sheeted/core/build/web/Consts'

import { Entity } from '../../../types/Entity.type'
import { useLocale } from '../../../hooks/LocaleContextHook'
import { useApi } from '../../../hooks/ApiHook'

import { useActionContext } from './ActionContextHook'

export const useTableActions = (
  sheet: SheetInfo | null,
): {
  actions: TableAction<Entity>[]
  onSelectionChange: (entities: Entity[]) => void
} => {
  const l = useLocale()
  const api = useApi()
  const { startAction } = useActionContext()
  const [entities, setEntities] = useState<Entity[]>([])
  const { enqueueSnackbar } = useSnackbar()
  const deletionAction: TableAction<Entity> = useMemo(() => {
    const ids = entities.map(({ id }) => id)
    const deletable =
      Boolean(sheet?.permissions.deletes) &&
      entities.every((entity) => entity[ENTITY_META_FIELD].permissions.deletes)
    return {
      tooltip: l.actions.delete,
      icon: 'delete',
      disabled: !deletable,
      onClick: () => {
        startAction({
          title: l.actions.delete,
          entities,
          doAction: async () => {
            try {
              await api.deleteEntities(sheet?.sheetName || '', ids)
              enqueueSnackbar(l.snackbars.deleteComplete, {
                variant: 'success',
              })
            } catch (e) {
              console.error(e)
              enqueueSnackbar(l.snackbars.deleteFailed, {
                variant: 'error',
              })
            }
          },
        })
      },
    }
  }, [l, api, sheet, entities, enqueueSnackbar, startAction])
  return {
    actions: [deletionAction],
    onSelectionChange: setEntities,
  }
}
