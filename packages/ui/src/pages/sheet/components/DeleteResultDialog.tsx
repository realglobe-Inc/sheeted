import React, { FC, useCallback } from 'react'
import { DeleteFailureReason } from '@sheeted/core/build/web/Shared.type'
import {
  DeleteFailureReasons,
  ENTITY_META_FIELD,
} from '@sheeted/core/build/web/Consts'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { makeStyles } from '@material-ui/core/styles'

import { useLocale } from '../../../hooks/LocaleContextHook'
import { useDeleteResultContext } from '../hooks/DeleteResultContext'

const useStyles = makeStyles((theme) => ({
  content: {
    height: '25em',
  },
  success: {
    color: theme.palette.success.main,
  },
  failure: {
    color: theme.palette.error.main,
  },
}))

export const DeleteResultDialog: FC = () => {
  const l = useLocale()
  const classes = useStyles()
  const { result, setResult } = useDeleteResultContext()
  const isOpen = Boolean(result)
  const close = useCallback(() => setResult(null), [setResult])
  const failureMessage = useCallback(
    ({
      reason,
      message,
    }: {
      reason: DeleteFailureReason
      message?: string
    }) => {
      switch (reason) {
        case DeleteFailureReasons.RESTRICT:
          return l.dialogs.DeleteResultDialog.reason.restrict
        case DeleteFailureReasons.PERMISSION_DENIED:
          return l.dialogs.DeleteResultDialog.reason.permissionDenied
        case DeleteFailureReasons.NOT_FOUND:
          return l.dialogs.DeleteResultDialog.reason.notFound
        default:
          return message || ''
      }
    },
    [l],
  )
  return (
    <Dialog
      open={isOpen}
      onClose={close}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{l.dialogs.DeleteResultDialog.title}</DialogTitle>
      <DialogContent className={classes.content}>
        <List dense>
          {result?.success.map((entity) => (
            <ListItem key={entity.id}>
              <ListItemIcon className={classes.success}>
                {l.dialogs.DeleteResultDialog.labels.success}
              </ListItemIcon>
              <ListItemText primary={entity[ENTITY_META_FIELD].displayText} />
            </ListItem>
          ))}
          {result?.failure.map(({ entity, reason, message }) => (
            <ListItem key={entity.id}>
              <ListItemIcon className={classes.failure}>
                {l.dialogs.DeleteResultDialog.labels.failure}
              </ListItemIcon>
              <ListItemText
                primary={entity[ENTITY_META_FIELD].displayText}
                secondary={failureMessage({ reason, message })}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary">
          {l.buttons.ok}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
