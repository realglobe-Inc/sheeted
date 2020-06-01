import React from 'react'
import Dialog from '@material-ui/core/Dialog'

import { ErrorAlert } from './ErrorAlert'

export class TopErrorBoundary extends React.Component<
  any,
  { error: Error | null }
> {
  constructor(props: unknown) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error }
  }

  render(): React.ReactNode {
    if (this.state.error) {
      const { error } = this.state
      return (
        <Dialog open>
          <ErrorAlert message={error.message} />
        </Dialog>
      )
    }

    return this.props.children
  }
}
