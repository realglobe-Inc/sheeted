import React, { FC, useCallback } from 'react'
import { ActionFailureReason } from '@sheeted/core/build/web/Shared.type'
import {
  ActionFailureReasons,
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
import { useActionResultContext } from '../hooks/ActionResultContext'
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
        {l.dialogs.ActionResultDialog.labels.success}
      </ListItemIcon>
      <ListItemText primary={entityName} />
    </ListItem>
  )
}

const FailureListItem: FC<{
  id: string
  reason: ActionFailureReason
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
      reason: ActionFailureReason
      message?: string
    }) => {
      switch (reason) {
        case ActionFailureReasons.PERMISSION_DENIED:
          return l.dialogs.ActionResultDialog.reason.permissionDenied
        case ActionFailureReasons.NOT_FOUND:
          return l.dialogs.ActionResultDialog.reason.notFound
        default:
          return message || ''
      }
    },
    [l],
  )
  return (
    <ListItem key={id}>
      <ListItemIcon className={classes.failure}>
        {l.dialogs.ActionResultDialog.labels.failure}
      </ListItemIcon>
      <ListItemText
        primary={entityName}
        secondary={failureMessage({ reason, message })}
      />
    </ListItem>
  )
}

export const ActionResultDialog: FC = () => {
  const l = useLocale()
  const classes = useStyles()
  const { result, reset } = useActionResultContext()
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
      <DialogTitle>{l.dialogs.ActionResultDialog.title}</DialogTitle>
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
        <Button onClick={reset} color="primary">
          {l.buttons.ok}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
