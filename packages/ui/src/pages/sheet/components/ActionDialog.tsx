import React, { FC } from 'react'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import { useLocale } from '../../../hooks/LocaleContextHook'
import { useActionContext } from '../hooks/ActionContextHook'
import { Loader } from '../../../components/Loader'

export const ActionDialog: FC = () => {
  const l = useLocale()
  const {
    action,
    confirming,
    busy,
    cancelAction,
    doAction,
  } = useActionContext()
  return (
    <Dialog
      fullWidth
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="sm"
      open={confirming}
    >
      <Loader loading={busy} />
      <DialogTitle>{action?.title}</DialogTitle>
      <DialogContent dividers>
        <List dense>
          {action?.entities.map((entity) => (
            <ListItem key={entity.id}>
              <ListItemText primary={entity.$meta.displayText} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={cancelAction} color="primary">
          {l.buttons.cancel}
        </Button>
        <Button onClick={() => doAction()} color="primary" variant="contained">
          {action?.title || l.buttons.ok}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
