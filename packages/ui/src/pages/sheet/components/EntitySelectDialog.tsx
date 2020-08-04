import React, { FC, useCallback } from 'react'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import { makeStyles } from '@material-ui/core/styles'

import { useLocale } from '../../../hooks/LocaleContextHook'
import { useSheetContext } from '../../../hooks/SheetContextHook'
import { useEntityDialogContext } from '../hooks/EntityDialogContextHook'

import { EntitySelectSheet } from './EntitySelectSheet'

const useStyles = makeStyles({
  content: {
    height: '25em',
  },
})

export const EntitySelectDialog: FC = () => {
  const l = useLocale()
  const classes = useStyles()
  const { isOpen, closeDialog, sheetProp } = useEntityDialogContext()
  const { sheets } = useSheetContext()
  const onSelect = useCallback(
    (entity: any) => {
      sheetProp?.onSelect(entity)
      closeDialog()
    },
    [closeDialog, sheetProp],
  )
  if (!sheetProp) {
    return null
  }
  const sheet = sheets.sheets.find(
    (sheet) => sheet.sheetName === sheetProp.sheetName,
  )
  if (!sheet) {
    return null
  }
  return (
    <Dialog open={isOpen} onClose={closeDialog} scroll="paper">
      <DialogTitle>
        {l.dialogs.EntitySelectDialog.title(sheet.title)}
      </DialogTitle>
      <DialogContent className={classes.content}>
        <EntitySelectSheet sheet={sheet} onSelect={onSelect} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onSelect(null)} color="primary">
          {l.buttons.deselect}
        </Button>
        <Button onClick={closeDialog}>{l.buttons.cancel}</Button>
      </DialogActions>
    </Dialog>
  )
}
