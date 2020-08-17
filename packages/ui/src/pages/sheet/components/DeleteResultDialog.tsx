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
import { useEntitySelectionContext } from '../hooks/EntitySelectionContextHook'
import { Entity } from '../../../types/Entity.type'

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

const SuccessListItem: FC<{ id: string; entities: Entity[] }> = ({
  id,
  entities,
}) => {
  const l = useLocale()
  const classes = useStyles()
  const entityName =
    entities.find((entity) => entity.id === id)?.[ENTITY_META_FIELD]
      .displayText || 'NOT_FOUND'
  return (
    <ListItem key={id}>
      <ListItemIcon className={classes.success}>
        {l.dialogs.DeleteResultDialog.labels.success}
      </ListItemIcon>
      <ListItemText primary={entityName} />
    </ListItem>
  )
}

const FailureListItem: FC<{
  id: string
  reason: DeleteFailureReason
  message?: string
  entities: Entity[]
}> = ({ id, reason, message, entities }) => {
  const l = useLocale()
  const classes = useStyles()
  const entityName =
    entities.find((entity) => entity.id === id)?.[ENTITY_META_FIELD]
      .displayText || 'NOT_FOUND'
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
    <ListItem key={id}>
      <ListItemIcon className={classes.failure}>
        {l.dialogs.DeleteResultDialog.labels.failure}
      </ListItemIcon>
      <ListItemText
        primary={entityName}
        secondary={failureMessage({ reason, message })}
      />
    </ListItem>
  )
}

export const DeleteResultDialog: FC = () => {
  const l = useLocale()
  const classes = useStyles()
  const { result, reset } = useDeleteResultContext()
  const { entities } = useEntitySelectionContext()
  const isOpen = Boolean(result)
  return (
    <Dialog
      open={isOpen}
      onClose={reset}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{l.dialogs.DeleteResultDialog.title}</DialogTitle>
      <DialogContent className={classes.content}>
        <List dense>
          {result?.success.map(({ id }) => (
            <SuccessListItem key={id} id={id} entities={entities} />
          ))}
          {result?.failure.map(({ id, reason, message }) => (
            <FailureListItem
              key={id}
              id={id}
              reason={reason}
              message={message}
              entities={entities}
            />
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
