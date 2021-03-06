import { SheetInfo, InputError } from '@sheeted/core/build/web/Shared.type'
import { useCallback } from 'react'
import { useSnackbar } from 'notistack'
import { ENTITY_META_FIELD } from '@sheeted/core/build/web/Consts'

import { useLocale } from '../../../hooks/LocaleContextHook'
import { Entity } from '../../../types/Entity.type'
import { useApi } from '../../../hooks/ApiHook'
import { convertInput } from '../converters/InputConverter'

import { useInputErrorContext } from './InputErrorContextHook'

export const useEditEntity = (
  sheet: SheetInfo | null,
): {
  isEditable: (entity: Entity) => boolean
  onRowAdd?: (newEntityRaw: Entity) => Promise<void>
  onRowUpdate: (
    newEntity: Entity,
    oldEntity?: Entity | undefined,
  ) => Promise<void>
} => {
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
    [sheet?.permissions?.updates],
  )
  const handleEdit = useCallback(
    async (edit: () => Promise<unknown>) => {
      try {
        await edit()
        enqueueSnackbar(l.snackbars.createComplete, {
          variant: 'success',
        })
        resetErrors()
      } catch (e) {
        enqueueSnackbar(l.snackbars.createFailed, {
          variant: 'error',
        })
        const inputErrors = Object.getOwnPropertyDescriptor(e, 'inputErrors')
        if (inputErrors) {
          const errors: InputError[] = inputErrors.value
          setErrors(errors)
        }
        throw e
      }
    },
    [
      enqueueSnackbar,
      l.snackbars.createComplete,
      l.snackbars.createFailed,
      resetErrors,
      setErrors,
    ],
  )
  const onRowUpdate = useCallback(
    async (newEntity: Entity, oldEntity?: Entity) => {
      if (!sheet || !oldEntity) {
        return
      }
      const changes = convertInput(newEntity, oldEntity, sheet.columns)
      const update = () =>
        api.updateEntity(sheet.sheetName, oldEntity.id, changes)
      await handleEdit(update)
    },
    [sheet, handleEdit, api],
  )
  // material-table provides no prop such as "isAddable".
  const canAdd = Boolean(sheet?.permissions.creates)
  const onRowAdd = useCallback(
    async (newEntityRaw: Entity) => {
      if (!sheet) {
        return
      }
      const newEntity = convertInput(newEntityRaw, null, sheet.columns)
      const create = () => api.createEntity(sheet.sheetName, newEntity)
      await handleEdit(create)
    },
    [sheet, handleEdit, api],
  )
  return {
    isEditable,
    onRowAdd: canAdd ? onRowAdd : undefined,
    onRowUpdate,
  }
}
