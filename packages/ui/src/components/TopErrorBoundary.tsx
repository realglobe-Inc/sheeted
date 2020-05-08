import React, { FC } from 'react'
import Dialog from '@material-ui/core/Dialog'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import { makeStyles, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() =>
  createStyles({
    alert: {
      padding: '24px 16px',
    },
  }),
)

const ErrorDialog: FC<{ message: string }> = ({ message }) => {
  const classes = useStyles()
  return (
    <Dialog open>
      <Alert severity="error" className={classes.alert}>
        <AlertTitle>Error</AlertTitle>
        {message}
      </Alert>
    </Dialog>
  )
}

export class TopErrorBoundary extends React.Component<
  {},
  { error: Error | null }
> {
  constructor(props: {}) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      const { error } = this.state
      return <ErrorDialog message={error.message} />
    }

    return this.props.children
  }
}
