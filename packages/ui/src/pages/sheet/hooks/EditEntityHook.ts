import {
  SheetInfo,
  InputValidationErrors,
} from '@sheeted/core/build/web/Shared.type'
import { useCallback } from 'react'
import { useSnackbar } from 'notistack'
import { ENTITY_META_FIELD } from '@sheeted/core/build/web/Consts'

import { useLocale } from '../../../hooks/LocaleContextHook'
import { Entity } from '../../../types/Entity.type'
import { useApi } from '../../../hooks/ApiHook'
import { convertInput } from '../converters/InputConverter'

import { useInputErrorContext } from './InputErrorContextHook'

export const useEditEntity = (sheet: SheetInfo | null) => {
  const l = useLocale()
  const api = useApi()
  const { enqueueSnackbar } = useSnackbar()
  const { setErrors, reset: resetErrors } = useInputErrorContext()
  const isEditable = useCallback(
    (entity: Entity) => {
      return (
        Boolean(sheet?.permissions.updates) &&
        entity[ENTITY_META_FIELD].permissions.updates
      )
    },
    [sheet],
  )
  const onRowUpdate = useCallback(
    async (newEntity: Entity, oldEntity?: Entity) => {
      if (!sheet || !oldEntity) {
        return
      }
      const changes = convertInput(newEntity, oldEntity, sheet.columns)
      try {
        await api.updateEntity(sheet.sheetName, oldEntity.id, changes)
        enqueueSnackbar(l.snackbars.editComplete, {
          variant: 'success',
        })
        resetErrors()
      } catch (e) {
        enqueueSnackbar(l.snackbars.editFaield, {
          variant: 'warning',
        })
        if (e.errors) {
          setErrors(e as InputValidationErrors)
        }
        throw e
      }
    },
    [api, sheet, l, enqueueSnackbar, setErrors, resetErrors],
  )
  // material-table provides no prop such as "isAddable".
  const canAdd = Boolean(sheet?.permissions.creates)
  const onRowAdd = useCallback(
    async (newEntityRaw: Entity) => {
      if (!sheet) {
        return
      }
      const newEntity = convertInput(newEntityRaw, null, sheet.columns)
      try {
        await api.createEntity(sheet.sheetName, newEntity)
        enqueueSnackbar(l.snackbars.createComplete, {
          variant: 'success',
        })
        resetErrors()
      } catch (e) {
        enqueueSnackbar(l.snackbars.createFailed, {
          variant: 'error',
        })
        console.log(e)
        if (e.errors) {
          setErrors(e as InputValidationErrors)
        }
        throw e
      }
    },
    [api, sheet, l, enqueueSnackbar, setErrors, resetErrors],
  )
  return {
    isEditable,
    onRowAdd: canAdd ? onRowAdd : undefined,
    onRowUpdate,
  }
}
